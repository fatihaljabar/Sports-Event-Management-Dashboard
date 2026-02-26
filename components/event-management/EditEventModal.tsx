"use client";

import { useState, useEffect } from "react";
import { Trophy, X, Calendar, Users, Globe, AlertCircle, ImagePlus } from "lucide-react";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { StyledInput } from "@/components/ui/StyledInput";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { DropZone } from "@/components/ui/DropZone";
import { SportMultiSelect } from "@/components/ui/SportMultiSelect";
import { EventTypeSelector } from "@/components/ui/EventTypeSelector";
import { SponsorLogosUploader } from "@/components/ui/SponsorLogosUploader";
import { EventFormActions } from "@/components/ui/EventFormActions";
import { LocationPicker } from "@/components/ui/LocationPicker";
import { updateEvent } from "@/app/actions/events";
import { toast } from "sonner";
import type { SportEvent as ApiSportEvent, SportCategory } from "@/lib/types/event";

interface EditEventModalProps {
  event: ApiSportEvent;
  onClose: () => void;
  onUpdate?: () => void;
}

const SPORT_OPTIONS: SportCategory[] = [
  { id: "athletics", label: "Athletics", emoji: "🏃" },
  { id: "swimming", label: "Swimming", emoji: "🏊" },
  { id: "cycling", label: "Cycling", emoji: "🚴" },
  { id: "gymnastics", label: "Gymnastics", emoji: "🤸" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "volleyball", label: "Volleyball", emoji: "🏐" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
  { id: "table-tennis", label: "Table Tennis", emoji: "🏓" },
  { id: "boxing", label: "Boxing", emoji: "🥊" },
  { id: "judo", label: "Judo", emoji: "🥋" },
  { id: "karate", label: "Karate", emoji: "🥋" },
  { id: "taekwondo", label: "Taekwondo", emoji: "🥋" },
  { id: "archery", label: "Archery", emoji: "🏹" },
  { id: "shooting", label: "Shooting", emoji: "🔫" },
  { id: "fencing", label: "Fencing", emoji: "🤺" },
  { id: "rowing", label: "Rowing", emoji: "🚣" },
  { id: "canoe", label: "Canoe/Kayak", emoji: "🛶" },
  { id: "sailing", label: "Sailing", emoji: "⛵" },
];

export function EditEventModal({ event, onClose, onUpdate }: EditEventModalProps) {
  // Form state
  const [eventName, setEventName] = useState(event.name);
  const [eventType, setEventType] = useState<"single" | "multi">(event.type);
  const [selectedSports, setSelectedSports] = useState<SportCategory[]>([]);
  const [location, setLocation] = useState(""); // Combined location for LocationPicker
  const [timezone, setTimezone] = useState(event.location.timezone);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quota, setQuota] = useState(event.maxParticipants.toString());
  const [visibility, setVisibility] = useState<"public" | "private">(event.visibility);
  const [eventLogo, setEventLogo] = useState<{ name: string; size: string; preview: string | null } | null>(null);
  const [sponsorLogos, setSponsorLogos] = useState<Array<{ name: string; size: string; preview: string | null }>>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keepExistingLogo, setKeepExistingLogo] = useState(true);
  const [keepExistingSponsors, setKeepExistingSponsors] = useState(true);

  // Initialize form with event data
  useEffect(() => {
    // Parse dates
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);

    // Set sports - event.sports is already SportCategory[]
    setSelectedSports(event.sports);

    // Set location - combine city and venue for LocationPicker
    const locationString = event.location.venue
      ? `${event.location.city}, ${event.location.venue}`
      : event.location.city;
    setLocation(locationString);

    // Set existing logos
    if (event.logoUrl) {
      setEventLogo({
        name: "Current Logo",
        size: "Existing",
        preview: event.logoUrl,
      });
      setKeepExistingLogo(true);
    }

    if (event.sponsorLogos && event.sponsorLogos.length > 0) {
      setSponsorLogos(event.sponsorLogos.map(s => ({
        name: s.name,
        size: "Existing",
        preview: s.url,
      })));
      setKeepExistingSponsors(true);
    }
  }, [event]);

  const handleSportToggle = (sportId: string) => {
    setSelectedSports((prev) =>
      prev.some((s) => s.id === sportId)
        ? prev.filter((s) => s.id !== sportId)
        : [...prev, SPORT_OPTIONS.find((s) => s.id === sportId)!]
    );
  };

  const handleEventTypeChange = (type: "single" | "multi") => {
    setEventType(type);
    if (type === "single" && selectedSports.length > 1) {
      setSelectedSports([selectedSports[0]]);
    }
  };

  const handleLocationChange = (value: string, timezoneValue?: string) => {
    setLocation(value);
    if (timezoneValue) {
      setTimezone(timezoneValue);
    }
  };

  const handleAddSponsorLogo = (file: { name: string; size: string; preview: string | null }) => {
    if (sponsorLogos.length >= 5) return;
    setSponsorLogos((prev) => [...prev, file]);
    setKeepExistingSponsors(false);
  };

  const handleRemoveSponsorLogo = (index: number) => {
    setSponsorLogos((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!eventName.trim()) newErrors.eventName = "Event name is required";
    if (selectedSports.length === 0) newErrors.sports = "At least 1 sport is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!quota || parseInt(quota) < 1) newErrors.quota = "Valid quota is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateEvent = async () => {
    if (!validateForm()) return;

    // Parse location string to extract city and venue
    // Format could be "Jakarta, Indonesia" or "Jakarta, Gelora Bung Karno Stadium"
    const locationParts = location.split(',').map(p => p.trim());
    const locationCity = locationParts[0] || location;
    // If there are more parts, check if the last part is a country or a venue
    let locationVenue = "";
    if (locationParts.length > 1) {
      // Check if last part is a country name (has multiple words or is common country)
      const commonCountries = ["Indonesia", "Malaysia", "Singapore", "Thailand", "Vietnam", "Philippines", "Japan", "South Korea", "China", "India", "Australia", "USA", "UK", "United States", "United Kingdom"];
      const lastPart = locationParts[locationParts.length - 1];
      if (!commonCountries.includes(lastPart)) {
        // Last part is likely a venue, second to last might be city
        locationVenue = locationParts.slice(1).join(', ');
      }
    }

    setIsSubmitting(true);
    try {
      const result = await updateEvent({
        eventId: event.id,
        name: eventName,
        type: eventType,
        sports: selectedSports,
        locationCity: locationCity,
        locationTimezone: timezone,
        startDate,
        endDate,
        maxParticipants: parseInt(quota),
        totalKeys: parseInt(quota) * selectedSports.length,
        visibility,
        logoBase64: eventLogo?.preview && !keepExistingLogo ? eventLogo.preview : undefined,
        logoFileName: eventLogo?.name,
        sponsorLogos: keepExistingSponsors ? [] : sponsorLogos.map((l, i) => ({
          name: l.name,
          base64: l.preview || "",
          fileName: l.name,
        })),
        keepExistingLogo,
        keepExistingSponsors,
      });

      if (result.success) {
        toast.success("Event updated successfully", {
          description: `"${eventName}" has been updated.`,
        });
        onClose();
        onUpdate?.();
      } else {
        setErrors({ ...errors, server: result.error || "Failed to update event" });
      }
    } catch (error) {
      setErrors({ ...errors, server: error instanceof Error ? error.message : "Failed to update event" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const totalKeys = quota ? parseInt(quota) * selectedSports.length : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15,23,42,0.72)",
        backdropFilter: "blur(6px)",
      }}
      onClick={handleBackdrop}
    >
      <div
        className="relative flex flex-col rounded-2xl overflow-hidden w-full"
        style={{
          maxWidth: "860px",
          maxHeight: "92vh",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 24px 80px rgba(0,0,0,0.22), 0px 4px 16px rgba(0,0,0,0.08)",
          border: "1px solid #E2E8F0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-5 flex-shrink-0"
          style={{
            borderBottom: "1px solid #F1F5F9",
            background: "linear-gradient(to right, #FFFFFF 60%, #F8FAFC 100%)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{
                width: "44px",
                height: "44px",
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
                boxShadow: "0px 4px 12px rgba(245,158,11,0.3)",
              }}
            >
              <Trophy className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  color: "#0F172A",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                }}
              >
                Edit Event
              </h2>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.78rem",
                  fontFamily: '"Inter", sans-serif',
                  marginTop: "4px",
                }}
              >
                Modify event details for {event.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-xl transition-all"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#F8FAFC",
              border: "1.5px solid #E2E8F0",
              color: "#64748B",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEF2F2";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#FECACA";
              (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
              (e.currentTarget as HTMLButtonElement).style.color = "#64748B";
            }}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          <div className="grid gap-0" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {/* Left Column */}
            <div className="flex flex-col gap-5 px-8 py-6" style={{ borderRight: "1px solid #F1F5F9" }}>
              <SectionDivider label="Event Identity" />

              {/* Event Name */}
              <div>
                <FieldLabel required>Event Name</FieldLabel>
                <StyledInput
                  value={eventName}
                  onChange={setEventName}
                  placeholder="e.g. World Athletics Championship"
                  icon={<Trophy className="w-4 h-4" strokeWidth={1.75} />}
                />
                {errors.eventName && (
                  <p style={{ color: "#EF4444", fontSize: "0.7rem", marginTop: "4px" }}>{errors.eventName}</p>
                )}
              </div>

              {/* Event Type */}
              <div>
                <FieldLabel required>Event Type</FieldLabel>
                <EventTypeSelector value={eventType} onChange={handleEventTypeChange} />
              </div>

              {/* Sport Categories */}
              <div>
                <FieldLabel required>Sport Categories</FieldLabel>
                <SportMultiSelect
                  selected={selectedSports.map((s) => s.id)}
                  eventType={eventType}
                  onToggle={handleSportToggle}
                />
                {errors.sports && (
                  <p style={{ color: "#EF4444", fontSize: "0.7rem", marginTop: "4px" }}>{errors.sports}</p>
                )}
                {selectedSports.length > 0 && !errors.sports && (
                  <p
                    style={{
                      color: "#2563EB",
                      fontSize: "0.68rem",
                      fontFamily: '"JetBrains Mono", monospace',
                      marginTop: "4px",
                    }}
                  >
                    {selectedSports.length} sport{selectedSports.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <FieldLabel required>Host City / Venue</FieldLabel>
                <LocationPicker value={location} onChange={handleLocationChange} />
                {errors.location && (
                  <p style={{ color: "#EF4444", fontSize: "0.7rem", marginTop: "4px" }}>{errors.location}</p>
                )}
              </div>

              {/* Visibility */}
              <div>
                <FieldLabel>Event Visibility</FieldLabel>
                <div className="flex gap-2">
                  {[
                    { id: "public", label: "Public", icon: "🌐" },
                    { id: "private", label: "Private", icon: "🔒" },
                  ].map((v) => {
                    const active = visibility === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVisibility(v.id as "public" | "private")}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                        style={{
                          border: `1.5px solid ${active ? "#2563EB" : "#E2E8F0"}`,
                          backgroundColor: active ? "#EFF6FF" : "transparent",
                          color: active ? "#1D4ED8" : "#64748B",
                          fontSize: "0.75rem",
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: active ? 500 : 400,
                        }}
                      >
                        <span style={{ fontSize: "0.85rem" }}>{v.icon}</span>
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-5 px-8 py-6">
              <SectionDivider label="Logistics" />

              {/* Date Range */}
              <div>
                <FieldLabel required>Event Duration</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p style={{ color: "#94A3B8", fontSize: "0.68rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                      Start Date
                    </p>
                    <StyledInput
                      value={startDate}
                      onChange={setStartDate}
                      type="date"
                      icon={<Calendar className="w-4 h-4" strokeWidth={1.75} />}
                    />
                  </div>
                  <div>
                    <p style={{ color: "#94A3B8", fontSize: "0.68rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                      End Date
                    </p>
                    <StyledInput
                      value={endDate}
                      onChange={setEndDate}
                      type="date"
                      icon={<Calendar className="w-4 h-4" strokeWidth={1.75} />}
                    />
                  </div>
                </div>
                {(errors.startDate || errors.endDate) && (
                  <p style={{ color: "#EF4444", fontSize: "0.7rem", marginTop: "4px" }}>
                    {errors.startDate || errors.endDate}
                  </p>
                )}
              </div>

              {/* Timezone */}
              <div>
                <FieldLabel>Timezone</FieldLabel>
                <StyledInput
                  value={timezone}
                  onChange={() => {}}
                  icon={<Globe className="w-4 h-4" strokeWidth={1.75} />}
                  placeholder="Auto-detected from location"
                  disabled
                />
              </div>

              {/* Participant Quota */}
              <div>
                <FieldLabel required>Max Participants / Keys</FieldLabel>
                <StyledInput
                  value={quota}
                  onChange={setQuota}
                  placeholder="e.g. 1000"
                  icon={<Users className="w-4 h-4" strokeWidth={1.75} />}
                />
                {errors.quota && (
                  <p style={{ color: "#EF4444", fontSize: "0.7rem", marginTop: "4px" }}>{errors.quota}</p>
                )}
                {quota && selectedSports.length > 0 && (
                  <div
                    className="flex items-center gap-2 mt-2 rounded-lg px-3 py-2"
                    style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}
                  >
                    <Users className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#2563EB" }} />
                    <span
                      style={{
                        color: "#1E40AF",
                        fontSize: "0.7rem",
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Total keys: {totalKeys.toLocaleString()} keys
                    </span>
                    <span
                      style={{
                        color: "#64748B",
                        fontSize: "0.65rem",
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      ({quota} participants × {selectedSports.length} sport{selectedSports.length > 1 ? "s" : ""})
                    </span>
                  </div>
                )}
              </div>

              <SectionDivider label="Branding Assets" />

              {/* Upload Zones */}
              <div className="space-y-4">
                {/* Event Logo */}
                <div>
                  <FieldLabel>Event Logo</FieldLabel>
                  <div className="relative">
                    <DropZone
                      label="Drop new logo here"
                      sublabel="PNG, JPG, WEBP · Max 2 MB"
                      icon={<ImagePlus className="w-4 h-4" strokeWidth={1.75} />}
                      uploaded={eventLogo}
                      onUpload={setEventLogo}
                      accentColor="#F59E0B"
                    />
                    {eventLogo && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setEventLogo(null); setKeepExistingLogo(false); }}
                        className="absolute flex items-center justify-center rounded-full transition-all"
                        style={{ top: "8px", right: "8px", width: "22px", height: "22px", backgroundColor: "#FEF2F2", border: "1.5px solid #FECACA", color: "#EF4444", zIndex: 10 }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEE2E2"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEF2F2"; }}
                        title="Remove event logo"
                      >
                        <X className="w-3 h-3" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                  {errors.logo && (
                    <p style={{ color: "#EF4444", fontSize: "0.7rem", marginTop: "4px" }}>{errors.logo}</p>
                  )}
                </div>

                {/* Sponsor Logos */}
                <div>
                  <FieldLabel>Sponsor Logos</FieldLabel>
                  <SponsorLogosUploader
                    logos={sponsorLogos}
                    onAdd={handleAddSponsorLogo}
                    onRemove={handleRemoveSponsorLogo}
                    accentColor="#7C3AED"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Server Error */}
        {errors.server && (
          <div
            className="mx-8 mt-4 p-3 rounded-lg"
            style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}
          >
            <p style={{ color: "#DC2626", fontSize: "0.75rem", fontFamily: "Inter, sans-serif" }}>
              {errors.server}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <EventFormActions
          onCancel={onClose}
          onSubmit={handleUpdateEvent}
          isSubmitting={isSubmitting}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
