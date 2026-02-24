"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Users,
  Globe,
  Clock,
  Trophy,
  Layers,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useCreateEventForm } from "@/hooks/useCreateEventForm";
import { LOCATION_OPTIONS, VISIBILITY_OPTIONS } from "@/lib/constants/event-constants";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { StyledInput } from "@/components/ui/StyledInput";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { DropZone, type UploadedFile } from "@/components/ui/DropZone";
import { SportMultiSelect } from "@/components/SportMultiSelect";
import type { SponsorLogoData } from "@/hooks/useCreateEventForm";

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
    eventLogoPreview,
    setEventLogo,
    setEventLogoPreview,
    sponsorLogos,
    setSponsorLogos,
    errors,
    handleSportToggle,
    handleEventTypeChange,
    handleLocationChange,
    handleCreateEvent,
  } = useCreateEventForm({ onClose });

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [sponsorInput, setSponsorInput] = useState({ name: "", size: "" });

  const handleLogoUpload = (file: UploadedFile) => {
    setEventLogoPreview(file);
    // Create a File object from the uploaded data (in real app, this would be the actual file)
    const mockFile = new File([], file.name, { type: "image/png" });
    setEventLogo(mockFile);
  };

  const handleAddSponsor = () => {
    if (!sponsorInput.name.trim()) return;
    const newLogo: SponsorLogoData = {
      id: `sponsor-${Date.now()}`,
      name: sponsorInput.name,
      size: sponsorInput.size || "medium",
      file: null,
    };
    setSponsorLogos([...sponsorLogos, newLogo]);
    setSponsorInput({ name: "", size: "" });
  };

  const handleRemoveSponsor = (id: string) => {
    setSponsorLogos(sponsorLogos.filter((s) => s.id !== id));
  };

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
          boxShadow:
            "0px 24px 80px rgba(0,0,0,0.22), 0px 4px 16px rgba(0,0,0,0.08)",
          border: "1px solid #E2E8F0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══════════════════════  HEADER  ══════════════════════ */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #F1F5F9" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
              }}
            >
              <Trophy className="w-5.5 h-5.5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2
                style={{
                  color: "#0F172A",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  fontFamily: '"Barlow Condensed", sans-serif',
                  letterSpacing: "0.02em",
                }}
              >
                Create New Event
              </h2>
              <p
                style={{
                  color: "#64748B",
                  fontSize: "0.78rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                Set up your sports event details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all hover:bg-gray-50"
            style={{ color: "#94A3B8" }}
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* ══════════════════════  CONTENT  ══════════════════════ */}
        <div
          className="flex-1 overflow-y-auto px-6 py-5"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Event Name & Type */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            style={{ marginBottom: "20px" }}
          >
            <div>
              <FieldLabel required>Event Name</FieldLabel>
              <StyledInput
                value={eventName}
                onChange={(v) => {
                  setEventName(v);
                  if (errors.eventName) {
                    errors.eventName = "";
                  }
                }}
                placeholder="e.g. World Championship 2026"
                icon={<Layers className="w-4 h-4" />}
              />
              {errors.eventName && (
                <p
                  style={{
                    color: "#EF4444",
                    fontSize: "0.7rem",
                    marginTop: "4px",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {errors.eventName}
                </p>
              )}
            </div>

            <div>
              <FieldLabel required>Event Type</FieldLabel>
              <div className="flex gap-2">
                {(
                  [
                    { value: "single", label: "Single Sport" },
                    { value: "multi", label: "Multi Sport" },
                  ] as const
                ).map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleEventTypeChange(type.value)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      backgroundColor:
                        eventType === type.value ? "#EFF6FF" : "#F8FAFC",
                      color:
                        eventType === type.value ? "#2563EB" : "#64748B",
                      border:
                        eventType === type.value
                          ? "1.5px solid #BFDBFE"
                          : "1px solid #E2E8F0",
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SectionDivider label="SPORTS & LOCATION" />

          {/* Sport Category */}
          <div style={{ marginBottom: "18px" }}>
            <FieldLabel required>Sport Category</FieldLabel>
            <SportMultiSelect
              selected={selectedSports}
              eventType={eventType}
              onToggle={handleSportToggle}
            />
            {errors.sports && (
              <p
                style={{
                  color: "#EF4444",
                  fontSize: "0.7rem",
                  marginTop: "4px",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {errors.sports}
              </p>
            )}
          </div>

          {/* Location */}
          <div style={{ marginBottom: "18px" }}>
            <FieldLabel required>Location / City</FieldLabel>
            <div className="relative">
              <StyledInput
                value={location}
                onChange={(v) => {
                  handleLocationChange(v);
                  if (errors.location) {
                    errors.location = "";
                  }
                }}
                placeholder="Search or select location"
                icon={<MapPin className="w-4 h-4" />}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowLocationDropdown((p) => !p)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <AlertCircle className="w-4 h-4" style={{ color: "#94A3B8" }} />
                  </button>
                }
              />
              {showLocationDropdown && (
                <div
                  className="absolute z-10 w-full mt-1 rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #E2E8F0",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  }}
                >
                  {LOCATION_OPTIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        handleLocationChange(loc);
                        setShowLocationDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors"
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: "0.85rem",
                        color: "#374151",
                        borderBottom:
                          loc !== LOCATION_OPTIONS[LOCATION_OPTIONS.length - 1]
                            ? "1px solid #F1F5F9"
                            : "none",
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.location && (
              <p
                style={{
                  color: "#EF4444",
                  fontSize: "0.7rem",
                  marginTop: "4px",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {errors.location}
              </p>
            )}
          </div>

          {/* Timezone Display */}
          {timezone && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
              style={{
                backgroundColor: "#F0F9FF",
                border: "1px solid #BAE6FD",
              }}
            >
              <Clock className="w-4 h-4" style={{ color: "#0284C7" }} />
              <span
                style={{
                  fontSize: "0.78rem",
                  fontFamily: '"Inter", sans-serif',
                  color: "#0369A1",
                }}
              >
                Timezone: {timezone}
              </span>
            </div>
          )}

          <SectionDivider label="DATE & PARTICIPANTS" />

          {/* Dates & Quota */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            style={{ marginBottom: "18px" }}
          >
            <div>
              <FieldLabel required>Start Date</FieldLabel>
              <StyledInput
                type="date"
                value={startDate}
                onChange={(v) => {
                  setStartDate(v);
                  if (errors.startDate) {
                    errors.startDate = "";
                  }
                }}
                icon={<Calendar className="w-4 h-4" />}
              />
              {errors.startDate && (
                <p
                  style={{
                    color: "#EF4444",
                    fontSize: "0.7rem",
                    marginTop: "4px",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <FieldLabel required>End Date</FieldLabel>
              <StyledInput
                type="date"
                value={endDate}
                onChange={(v) => {
                  setEndDate(v);
                  if (errors.endDate) {
                    errors.endDate = "";
                  }
                }}
                icon={<Calendar className="w-4 h-4" />}
              />
              {errors.endDate && (
                <p
                  style={{
                    color: "#EF4444",
                    fontSize: "0.7rem",
                    marginTop: "4px",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {errors.endDate}
                </p>
              )}
            </div>

            <div>
              <FieldLabel required>Max Participants</FieldLabel>
              <StyledInput
                type="number"
                value={quota}
                onChange={(v) => {
                  setQuota(v);
                  if (errors.quota) {
                    errors.quota = "";
                  }
                }}
                placeholder="0"
                icon={<Users className="w-4 h-4" />}
              />
              {errors.quota && (
                <p
                  style={{
                    color: "#EF4444",
                    fontSize: "0.7rem",
                    marginTop: "4px",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {errors.quota}
                </p>
              )}
            </div>
          </div>

          <SectionDivider label="VISUAL ASSETS" />

          {/* Event Logo */}
          <div style={{ marginBottom: "18px" }}>
            <FieldLabel required>Event Logo</FieldLabel>
            <DropZone
              label="Upload Event Logo"
              sublabel="PNG, JPG up to 2MB"
              icon={<Trophy className="w-5 h-5" />}
              uploaded={eventLogoPreview}
              onUpload={handleLogoUpload}
              accentColor="#3B82F6"
            />
            {errors.logo && (
              <p
                style={{
                  color: "#EF4444",
                  fontSize: "0.7rem",
                  marginTop: "4px",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {errors.logo}
              </p>
            )}
          </div>

          {/* Sponsor Logos */}
          <div style={{ marginBottom: "18px" }}>
            <FieldLabel>Sponsor Logos (Optional)</FieldLabel>
            <div className="flex gap-2 mb-3">
              <StyledInput
                value={sponsorInput.name}
                onChange={(v) => setSponsorInput({ ...sponsorInput, name: v })}
                placeholder="Sponsor name"
              />
              <select
                value={sponsorInput.size}
                onChange={(v) => setSponsorInput({ ...sponsorInput, size: v.target.value })}
                className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
              <button
                type="button"
                onClick={handleAddSponsor}
                className="px-4 py-2 rounded-lg font-medium text-white transition-all"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  backgroundColor: "#3B82F6",
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {sponsorLogos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sponsorLogos.map((logo) => (
                  <div
                    key={logo.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontFamily: '"Inter", sans-serif',
                        color: "#374151",
                      }}
                    >
                      {logo.name} ({logo.size})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSponsor(logo.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <SectionDivider label="SETTINGS" />

          {/* Visibility */}
          <div style={{ marginBottom: "18px" }}>
            <FieldLabel>Visibility</FieldLabel>
            <div className="flex gap-2">
              {VISIBILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setVisibility(opt.value as "public" | "private")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    backgroundColor:
                      visibility === opt.value ? "#EFF6FF" : "#F8FAFC",
                    border:
                      visibility === opt.value
                        ? "1.5px solid #BFDBFE"
                        : "1px solid #E2E8F0",
                  }}
                >
                  <opt.icon
                    className="w-4 h-4"
                    style={{ color: visibility === opt.value ? "#2563EB" : "#94A3B8" }}
                  />
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: visibility === opt.value ? "#2563EB" : "#64748B",
                    }}
                  >
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════  FOOTER  ══════════════════════ */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            borderTop: "1px solid #F1F5F9",
            backgroundColor: "#FAFBFC",
          }}
        >
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "#64748B", fontFamily: '"Inter", sans-serif' }}
          >
            <Globe className="w-4 h-4" />
            <span>
              {eventType === "single" ? "Single" : "Multi"} Sport Event
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-medium transition-all"
              style={{
                fontFamily: '"Inter", sans-serif',
                backgroundColor: "#F1F5F9",
                color: "#64748B",
                border: "1px solid #E2E8F0",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateEvent}
              className="px-6 py-2.5 rounded-lg font-medium text-white transition-all"
              style={{
                fontFamily: '"Inter", sans-serif',
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
              }}
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
