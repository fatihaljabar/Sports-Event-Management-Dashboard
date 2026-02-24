import { useState, useCallback } from "react";
import { useEvents } from "@/lib/stores/event-store";
import type { SportEvent } from "@/lib/types/event";
import { generateEventId, calculateTotalKeys, getTimezoneByLocation, getSportsByIds } from "@/lib/utils/create-event-helpers";
import { validateCreateEventData, clearError } from "@/lib/utils/create-event-validation";
import type { UploadedFile } from "@/components/ui/DropZone";

export type EventType = "single" | "multi";

export interface SponsorLogoData {
  id: string;
  name: string;
  size: string;
  file: File | null;
}

export interface UseCreateEventFormProps {
  onClose: () => void;
}

export function useCreateEventForm({ onClose }: UseCreateEventFormProps) {
  const { events, addEvent } = useEvents();

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
  const [eventLogo, setEventLogo] = useState<File | null>(null);
  const [eventLogoPreview, setEventLogoPreview] = useState<UploadedFile | null>(null);
  const [sponsorLogos, setSponsorLogos] = useState<SponsorLogoData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Handle location change with timezone detection
  const handleLocationChange = useCallback((value: string) => {
    setLocation(value);
    const detectedTimezone = getTimezoneByLocation(value);
    setTimezone(detectedTimezone);
  }, []);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const result = validateCreateEventData({
      eventName,
      eventType,
      selectedSports,
      location,
      startDate,
      endDate,
      quota,
      eventLogo,
    });

    setErrors(result.errors);
    return result.isValid;
  }, [eventName, eventType, selectedSports, location, startDate, endDate, quota, eventLogo]);

  // Handle form submission
  const handleCreateEvent = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    const newEvent: SportEvent = {
      id: generateEventId(events),
      name: eventName,
      type: eventType,
      status: "upcoming",
      sports: getSportsByIds(selectedSports),
      location: {
        city: location,
        venue: "",
        coordinates: null,
        timezone: timezone || "Asia/Bangkok (GMT+7)",
      },
      startDate,
      endDate,
      maxParticipants: parseInt(quota),
      usedKeys: 0,
      totalKeys: calculateTotalKeys(parseInt(quota), selectedSports.length),
      visibility,
    };

    addEvent(newEvent);
    onClose();
  }, [eventName, eventType, selectedSports, location, timezone, startDate, endDate, quota, visibility, events, addEvent, onClose, validateForm]);

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
    setEventLogoPreview(null);
    setSponsorLogos([]);
    setErrors({});
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
    eventLogoPreview,
    setEventLogoPreview,
    sponsorLogos,
    setSponsorLogos,
    errors,

    // Actions
    handleSportToggle,
    handleEventTypeChange,
    handleLocationChange,
    handleCreateEvent,
    resetForm,
    setLocation,
    setTimezone,
  };
}
