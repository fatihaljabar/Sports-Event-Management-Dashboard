"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  X,
  MapPin,
  CheckCircle2,
  Upload,
  ImagePlus,
  Trophy,
  AlertCircle,
  Globe,
  Clock,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useEvents } from "@/lib/stores/event-store";
import { MapPicker } from "@/components/MapPicker";
import type { EventLocation, SponsorLogo, EventType, SportCategory } from "@/lib/types/event";

interface CreateEventModalProps {
  onClose: () => void;
}

const SPORT_OPTIONS: SportCategory[] = [
  { id: "athletics", label: "Athletics", emoji: "🏃" },
  { id: "swimming", label: "Swimming", emoji: "🏊" },
  { id: "cycling", label: "Cycling", emoji: "🚴" },
  { id: "gymnastics", label: "Gymnastics", emoji: "🤸" },
  { id: "boxing", label: "Boxing", emoji: "🥊" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "volleyball", label: "Volleyball", emoji: "🏐" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "weightlifting", label: "Weightlifting", emoji: "🏋️" },
  { id: "wrestling", label: "Wrestling", emoji: "🤼" },
  { id: "archery", label: "Archery", emoji: "🏹" },
];

// Helper components
function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function StyledInput({
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`flex items-center rounded-lg border transition-all ${
        focused ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-300"
      }`}
    >
      {icon && (
        <div className="pl-3 text-gray-400">{icon}</div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-gray-900"
      />
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

export function CreateEventModal({ onClose }: CreateEventModalProps) {
  const { addEvent, events } = useEvents();

  // Form state
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<EventType>("single");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState<EventLocation>({
    city: "",
    venue: "",
    coordinates: null,
    timezone: "",
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  // File uploads
  const [eventLogo, setEventLogo] = useState<File | null>(null);
  const [sponsorLogos, setSponsorLogos] = useState<SponsorLogo[]>([]);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sponsorInputRef = useRef<HTMLInputElement>(null);

  // UI state
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation helper
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!eventName.trim()) {
      newErrors.eventName = "Event name is required";
    }

    if (eventType === "single" && selectedSports.length > 1) {
      newErrors.sports = "Single event can only have 1 sport category";
    }
    if (eventType === "multi" && selectedSports.length < 1) {
      newErrors.sports = "Multi event must have at least 1 sport category";
    }

    if (!city.trim()) {
      newErrors.city = "Host city is required";
    }
    if (!venue.trim()) {
      newErrors.venue = "Venue is required";
    }
    if (!location.coordinates) {
      newErrors.location = "Please select location on map";
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!endDate) {
      newErrors.endDate = "End date is required";
    }
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!maxParticipants || parseInt(maxParticipants) < 1) {
      newErrors.maxParticipants = "Max participants must be at least 1";
    }

    if (!eventLogo) {
      newErrors.logo = "Event logo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [eventName, eventType, selectedSports, city, venue, location, startDate, endDate, maxParticipants, eventLogo]);

  // Handle sport selection with type validation
  const handleSportToggle = (sportId: string) => {
    setSelectedSports((prev) => {
      const isSelected = prev.includes(sportId);

      // Single event: only allow 1 sport
      if (eventType === "single") {
        if (isSelected) {
          return [];
        }
        return [sportId];
      }

      // Multi event: allow multiple
      if (isSelected) {
        return prev.filter((s) => s !== sportId);
      }
      return [...prev, sportId];
    });

    // Clear error when user fixes it
    if (errors.sports) {
      setErrors((prev) => {
        const { sports, ...rest } = prev;
        return rest;
      });
    }
  };

  // Handle event type change
  const handleEventTypeChange = (newType: EventType) => {
    setEventType(newType);

    // Reset sports based on new type
    if (newType === "single") {
      setSelectedSports((prev) => (prev.length > 0 ? [prev[0]] : []));
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventLogo(file);
      if (errors.logo) {
        setErrors((prev) => {
          const { logo, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  // Handle sponsor logo upload
  const handleSponsorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSponsor: SponsorLogo = {
        id: `sponsor-${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        file,
      };
      setSponsorLogos((prev) => [...prev, newSponsor]);
    }
  };

  // Remove sponsor logo
  const removeSponsor = (id: string) => {
    setSponsorLogos((prev) => prev.filter((s) => s.id !== id));
  };

  // Handle location from map picker
  const handleLocationChange = (newLocation: EventLocation) => {
    setLocation(newLocation);
    setCity(newLocation.city);
    setVenue(newLocation.venue);
    if (errors.location) {
      setErrors((prev) => {
        const { location, ...rest } = prev;
        return rest;
      });
    }
  };

  // Open map picker
  const openMapPicker = () => {
    setLocation({
      city: city || "",
      venue: venue || "",
      coordinates: location.coordinates,
      timezone: location.timezone,
    });
    setShowMapPicker(true);
  };

  // Generate event ID
  const generateEventId = (): string => {
    const maxId = events.reduce((max, event) => {
      const num = parseInt(event.id.split("-")[1]);
      return num > max ? num : max;
    }, 0);
    return `EVT-${String(maxId + 1).padStart(3, "0")}`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new event
      const newEvent = {
        id: generateEventId(),
        name: eventName,
        type: eventType,
        status: "upcoming" as const,
        sports: selectedSports.map((id) => SPORT_OPTIONS.find((s) => s.id === id)!),
        location: {
          city,
          venue,
          coordinates: location.coordinates,
          timezone: location.timezone,
        },
        startDate,
        endDate,
        maxParticipants: parseInt(maxParticipants),
        usedKeys: 0,
        totalKeys: parseInt(maxParticipants) * selectedSports.length,
        visibility,
      };

      addEvent(newEvent);
      onClose();
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative flex flex-col rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide font-display">
                  Create New Event
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details below to register a new sporting event
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-0">
              {/* Left Column */}
              <div className="p-8 border-r border-gray-200">
                <SectionDivider label="Event Identity" />

                {/* Event Name */}
                <div className="mb-5">
                  <FieldLabel required>Event Name</FieldLabel>
                  <StyledInput
                    value={eventName}
                    onChange={setEventName}
                    placeholder="e.g. World Athletics Championship"
                    icon={<Trophy className="w-4 h-4" />}
                  />
                  {errors.eventName && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.eventName}
                    </p>
                  )}
                </div>

                {/* Event Type */}
                <div className="mb-5">
                  <FieldLabel required>Event Type</FieldLabel>
                  <div className="flex gap-3">
                    {(["single", "multi"] as EventType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleEventTypeChange(type)}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
                          eventType === type
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <span className="capitalize">{type}</span>
                        <span className="text-xs block font-normal opacity-75 mt-0.5">
                          {type === "single"
                            ? "1 sport category max"
                            : "1+ sport categories"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sport Categories */}
                <div className="mb-5">
                  <FieldLabel required>
                    Sport Categories
                    <span className="font-normal text-gray-400 ml-2">
                      {eventType === "single" && "(Max 1)"}
                      {eventType === "multi" && "(Min 1)"}
                    </span>
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px]">
                    {SPORT_OPTIONS.map((sport) => {
                      const isSelected = selectedSports.includes(sport.id);
                      const isDisabled = eventType === "single" && !isSelected && selectedSports.length >= 1;

                      return (
                        <button
                          key={sport.id}
                          type="button"
                          onClick={() => handleSportToggle(sport.id)}
                          disabled={isDisabled}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-blue-500 text-white shadow-sm"
                              : isDisabled
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          <span className="mr-1">{sport.emoji}</span>
                          {sport.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.sports && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.sports}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {selectedSports.length} {selectedSports.length === 1 ? "sport" : "sports"}
                  </p>
                </div>

                {/* Max Participants */}
                <div className="mb-5">
                  <FieldLabel required>Max Participants / Keys</FieldLabel>
                  <StyledInput
                    value={maxParticipants}
                    onChange={setMaxParticipants}
                    placeholder="Enter maximum number of participants"
                    type="number"
                    icon={<Users className="w-4 h-4" />}
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Each sport category will have {maxParticipants || "0"} keys.
                    Total keys:{" "}
                    <span className="font-semibold text-blue-600">
                      {(parseInt(maxParticipants) || 0) * selectedSports.length || 0}
                    </span>
                  </p>
                  {errors.maxParticipants && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.maxParticipants}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="p-8">
                <SectionDivider label="Location & Schedule" />

                {/* Host City */}
                <div className="mb-4">
                  <FieldLabel required>Host City</FieldLabel>
                  <StyledInput
                    value={city}
                    onChange={setCity}
                    placeholder="e.g. Tokyo, Japan"
                    icon={<Globe className="w-4 h-4" />}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.city}</p>
                  )}
                </div>

                {/* Venue */}
                <div className="mb-4">
                  <FieldLabel required>Venue</FieldLabel>
                  <StyledInput
                    value={venue}
                    onChange={setVenue}
                    placeholder="e.g. National Stadium"
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  {errors.venue && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.venue}</p>
                  )}
                </div>

                {/* Map Picker Button */}
                <div className="mb-5">
                  <button
                    type="button"
                    onClick={openMapPicker}
                    className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
                  >
                    <MapPin className="w-4 h-4" />
                    {location.coordinates
                      ? `Selected: ${location.coordinates.lat.toFixed(4)}, ${location.coordinates.lng.toFixed(4)}`
                      : "Click to pin location on map"}
                  </button>
                  {location.timezone && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Timezone: {location.timezone}
                    </p>
                  )}
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.location}</p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <FieldLabel required>Start Date</FieldLabel>
                    <StyledInput
                      value={startDate}
                      onChange={setStartDate}
                      type="date"
                      placeholder=""
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-xs mt-1.5">{errors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <FieldLabel required>End Date</FieldLabel>
                    <StyledInput
                      value={endDate}
                      onChange={setEndDate}
                      type="date"
                      placeholder=""
                    />
                    {errors.endDate && (
                      <p className="text-red-500 text-xs mt-1.5">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                <SectionDivider label="Visual Assets" />

                {/* Event Logo (Required) */}
                <div className="mb-5">
                  <FieldLabel required>Event Logo</FieldLabel>
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className={`relative rounded-xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      eventLogo
                        ? "border-blue-500 bg-blue-50"
                        : "border-dashed border-gray-300 hover:border-blue-400 bg-gray-50"
                    }`}
                    style={{ minHeight: "100px", padding: "16px" }}
                  >
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    {eventLogo ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-8 h-8 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">{eventLogo.name}</span>
                        <span className="text-xs text-gray-500">
                          {(eventLogo.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          Click to upload logo
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG, JPG up to 2MB
                        </span>
                      </div>
                    )}
                  </div>
                  {errors.logo && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.logo}</p>
                  )}
                </div>

                {/* Sponsor Logos (Optional) */}
                <div className="mb-5">
                  <FieldLabel>Sponsor Logos (Optional)</FieldLabel>
                  <div
                    onClick={() => sponsorInputRef.current?.click()}
                    className="relative rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                    style={{ minHeight: "80px", padding: "12px" }}
                  >
                    <input
                      ref={sponsorInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleSponsorUpload}
                    />
                    <div className="flex items-center gap-2">
                      <ImagePlus className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        Add sponsor logo
                      </span>
                      <span className="text-xs text-gray-400">(multiple allowed)</span>
                    </div>
                  </div>

                  {/* Sponsor List */}
                  {sponsorLogos.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {sponsorLogos.map((sponsor) => (
                        <div
                          key={sponsor.id}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                            <ImagePlus className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {sponsor.name}
                            </p>
                            <p className="text-xs text-gray-400">{sponsor.size}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSponsor(sponsor.id)}
                            className="p-1.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Visibility */}
                <div className="mb-5">
                  <FieldLabel>Visibility</FieldLabel>
                  <div className="flex gap-3">
                    {(["public", "private"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVisibility(v)}
                        className={`flex-1 py-2.5 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
                          visibility === v
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <span className="capitalize">{v}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-8 py-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map Picker Modal */}
      {showMapPicker && (
        <MapPicker
          location={location}
          onLocationChange={handleLocationChange}
          onClose={() => setShowMapPicker(false)}
        />
      )}
    </>
  );
}
