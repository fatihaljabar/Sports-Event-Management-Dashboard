import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useEvents } from "@/lib/stores/event-store";
import { calculateTotalKeys, getTimezoneByLocation, getSportsByIds } from "@/lib/utils/create-event-helpers";
import { validateCreateEventData, clearError } from "@/lib/utils/create-event-validation";
import { createEvent } from "@/app/actions/events";
import type { UploadedFile } from "@/components/ui/SponsorLogosUploader";

export type EventType = "single" | "multi";

export interface UseCreateEventFormProps {
  onClose: () => void;
}

export function useCreateEventForm({ onClose }: UseCreateEventFormProps) {
  const { addEvent } = useEvents();

  // Form state
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<EventType>("single");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quota, setQuota] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [eventLogo, setEventLogo] = useState<UploadedFile | null>(null);
  const [sponsorLogos, setSponsorLogos] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear specific error
  const clearSpecificError = useCallback((key: string) => {
    setErrors((prev) => clearError(prev, key));
  }, []);

  // Handle sport selection with type validation
  const handleSportToggle = useCallback((sportId: string) => {
    setSelectedSports((prev) => {
      const isSelected = prev.includes(sportId);

      // Single event: only allow 1 sport
      if (eventType === "single") {
        clearSpecificError("sports");
        if (isSelected) {
          return [];
        }
        return [sportId];
      }

      // Multi event: allow multiple
      if (isSelected) {
        const updated = prev.filter((s) => s !== sportId);
        // Clear error if still has at least 1
        if (updated.length >= 1) {
          clearSpecificError("sports");
        }
        return updated;
      }

      clearSpecificError("sports");
      return [...prev, sportId];
    });
  }, [eventType, clearSpecificError]);

  // Handle event type change
  const handleEventTypeChange = useCallback((newType: EventType) => {
    setEventType(newType);

    // Reset sports based on new type
    if (newType === "single") {
      setSelectedSports((prev) => (prev.length > 0 ? [prev[0]] : []));
    }

    clearSpecificError("sports");
  }, [clearSpecificError]);

  // Handle location change with timezone detection (from LocationPicker)
  const handleLocationChange = useCallback((
    value: string,
    timezoneFromPicker?: string,
    coordinates?: { lat: number; lng: number }
  ) => {
    console.log("[useCreateEventForm] handleLocationChange called:", { value, timezoneFromPicker, coordinates });
    setLocation(value);
    // Use timezone from picker if provided, otherwise fallback to detection
    if (timezoneFromPicker) {
      console.log("[useCreateEventForm] Setting timezone from picker:", timezoneFromPicker);
      setTimezone(timezoneFromPicker);
    } else {
      const detectedTimezone = getTimezoneByLocation(value);
      console.log("[useCreateEventForm] Setting timezone from detection:", detectedTimezone);
      setTimezone(detectedTimezone);
    }
    // Coordinates could be stored for future map features
    if (coordinates) {
      console.log("[useCreateEventForm] Location coordinates:", coordinates);
    }
  }, []);

  // Handle sponsor logo add
  const handleAddSponsorLogo = useCallback((logo: UploadedFile) => {
    setSponsorLogos((prev) => [...prev, logo]);
  }, []);

  // Handle sponsor logo remove
  const handleRemoveSponsorLogo = useCallback((index: number) => {
    setSponsorLogos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Validate form
  const validateForm = useCallback((): boolean => {
    // Convert UploadedFile to File for validation (eventLogo is required)
    const eventLogoFile = eventLogo ? { name: eventLogo.name, size: 1 } as File : null;

    const result = validateCreateEventData({
      eventName,
      eventType,
      selectedSports,
      location,
      startDate,
      endDate,
      quota,
      eventLogo: eventLogoFile,
    });

    setErrors(result.errors);
    return result.isValid;
  }, [eventName, eventType, selectedSports, location, startDate, endDate, quota, eventLogo]);

  // Handle form submission with Server Action
  const handleCreateEvent = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert logo to base64 if exists
      let logoBase64: string | undefined;
      let logoFileName: string | undefined;

      if (eventLogo && eventLogo.preview) {
        logoBase64 = eventLogo.preview;
        logoFileName = eventLogo.name;
      }

      // Convert sponsor logos to base64
      const sponsorLogosData = sponsorLogos
        .filter((logo) => logo.preview !== null)
        .map((logo) => ({
          name: logo.name,
          base64: logo.preview as string,
          fileName: logo.name,
        }));

      const result = await createEvent({
        name: eventName,
        type: eventType,
        sports: getSportsByIds(selectedSports),
        locationCity: location,
        locationTimezone: timezone || "Asia/Bangkok (GMT+7)",
        startDate,
        endDate,
        maxParticipants: parseInt(quota),
        totalKeys: calculateTotalKeys(parseInt(quota), selectedSports.length),
        visibility,
        logoBase64,
        logoFileName,
        sponsorLogos: sponsorLogosData.length > 0 ? sponsorLogosData : undefined,
      });

      if (result.success && result.event) {
        // Update local store
        addEvent(result.event);
        toast.success("Event created successfully", {
          description: `"${eventName}" has been added to your events.`,
        });
        onClose();
      } else {
        // Show server error
        setErrors({ server: result.error || "Failed to create event" });
        toast.error("Failed to create event", {
          description: result.error || "Please check your input and try again.",
        });
      }
    } catch (error) {
      setErrors({ server: error instanceof Error ? error.message : "An unexpected error occurred" });
      toast.error("An unexpected error occurred", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [eventName, eventType, selectedSports, location, timezone, startDate, endDate, quota, visibility, eventLogo, sponsorLogos, addEvent, onClose, validateForm]);

  // Reset form
  const resetForm = useCallback(() => {
    setEventName("");
    setEventType("single");
    setSelectedSports([]);
    setLocation("");
    setTimezone("");
    setStartDate("");
    setEndDate("");
    setQuota("");
    setVisibility("public");
    setEventLogo(null);
    setSponsorLogos([]);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    // Form state
    eventName,
    setEventName,
    eventType,
    selectedSports,
    location,
    timezone,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    quota,
    setQuota,
    visibility,
    setVisibility,
    eventLogo,
    setEventLogo,
    sponsorLogos,
    setSponsorLogos,
    errors,
    isSubmitting,

    // Actions
    handleSportToggle,
    handleEventTypeChange,
    handleLocationChange,
    handleAddSponsorLogo,
    handleRemoveSponsorLogo,
    handleCreateEvent,
    resetForm,
    setLocation,
    setTimezone,
  };
}
