"use client";

import { Trophy, X, Calendar, Users, Globe, AlertCircle, ImagePlus } from "lucide-react";
import { useCreateEventForm } from "@/hooks/useCreateEventForm";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { StyledInput } from "@/components/ui/StyledInput";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { DropZone } from "@/components/ui/DropZone";
import { SportMultiSelect } from "@/components/ui/SportMultiSelect";
import { EventTypeSelector } from "@/components/ui/EventTypeSelector";
import { SponsorLogosUploader } from "@/components/ui/SponsorLogosUploader";
import { EventFormActions } from "@/components/ui/EventFormActions";
import { TimezoneAlert } from "@/components/ui/TimezoneAlert";
import { CreateEventStepper } from "@/components/ui/CreateEventStepper";
import { LocationPicker } from "@/components/ui/location-picker/LocationPicker";

interface CreateEventModalProps {
  onClose: () => void;
}

export function CreateEventModal({ onClose }: CreateEventModalProps) {
  const {
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
    errors,
    isSubmitting,
    handleSportToggle,
    handleEventTypeChange,
    handleLocationChange,
    handleAddSponsorLogo,
    handleRemoveSponsorLogo,
    handleCreateEvent,
  } = useCreateEventForm({ onClose });

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

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
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                boxShadow: "0px 4px 12px rgba(37,99,235,0.3)",
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
                Create New Event
              </h2>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.78rem",
                  fontFamily: '"Inter", sans-serif',
                  marginTop: "4px",
                }}
              >
                Fill in the details below to register a new sporting event
              </p>
            </div>
          </div>

          {/* Step indicator & close */}
          <div className="flex items-center gap-4">
            <CreateEventStepper
              eventName={eventName}
              eventType={eventType}
              selectedSports={selectedSports}
              location={location}
              startDate={startDate}
              endDate={endDate}
              quota={quota}
              eventLogo={eventLogo}
            />

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
                  selected={selectedSports}
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
                {/* Dynamic timezone alert */}
                {timezone && <TimezoneAlert timezone={timezone} />}
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
                {/* Key calculation info */}
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
                      Total keys: {parseInt(quota) * selectedSports.length} keys
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

              {/* Alert note */}
              <div
                className="flex items-start gap-2.5 rounded-xl p-3"
                style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.75} style={{ color: "#D97706" }} />
                <p style={{ color: "#92400E", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif', lineHeight: 1.5 }}>
                  Access keys will be auto-generated upon event creation. Each participant receives a unique{" "}
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 500 }}>KEY-XXXX</span>{" "}
                  credential tied to this event.
                </p>
              </div>

              <SectionDivider label="Branding Assets" />

              {/* Upload Zones */}
              <div className="space-y-4">
                {/* Event Logo */}
                <div>
                  <FieldLabel required>Event Logo</FieldLabel>
                  <div className="relative">
                    <DropZone
                      label="Drop logo here"
                      sublabel="PNG, JPG, WEBP · Max 5 MB"
                      icon={<ImagePlus className="w-4 h-4" strokeWidth={1.75} />}
                      uploaded={eventLogo}
                      onUpload={setEventLogo}
                      accentColor="#2563EB"
                    />
                    {eventLogo && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setEventLogo(null); }}
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
                  <FieldLabel>Sponsor Logos (Optional)</FieldLabel>
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
          onSubmit={handleCreateEvent}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
