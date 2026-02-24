import React, { useState, useRef, useCallback } from "react";
import {
  X,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Upload,
  ImagePlus,
  Calendar,
  Users,
  Trophy,
  Layers,
  AlertCircle,
  Globe,
  Clock,
} from "lucide-react";

interface CreateEventModalProps {
  onClose: () => void;
}

const SPORT_OPTIONS = [
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

type EventType = "single" | "multi";

interface UploadedFile {
  name: string;
  size: string;
  preview: string | null;
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      style={{
        display: "block",
        color: "#374151",
        fontSize: "0.78rem",
        fontWeight: 600,
        fontFamily: '"Inter", sans-serif',
        letterSpacing: "0.01em",
        marginBottom: "6px",
      }}
    >
      {children}
      {required && (
        <span style={{ color: "#EF4444", marginLeft: "3px" }}>*</span>
      )}
    </label>
  );
}

function StyledInput({
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className="flex items-center relative rounded-xl overflow-hidden"
      style={{
        border: `1.5px solid ${focused ? "#2563EB" : "#E2E8F0"}`,
        backgroundColor: "#FFFFFF",
        boxShadow: focused
          ? "0 0 0 3px rgba(37,99,235,0.08)"
          : "0 1px 2px rgba(0,0,0,0.03)",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      {icon && (
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ paddingLeft: "12px", color: focused ? "#2563EB" : "#94A3B8" }}
        >
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          padding: icon ? "0.625rem 0.75rem" : "0.625rem 0.875rem",
          backgroundColor: "transparent",
          border: "none",
          outline: "none",
          fontSize: "0.85rem",
          fontFamily: '"Inter", sans-serif',
          color: "#1E293B",
        }}
      />
      {suffix && (
        <div
          className="flex items-center flex-shrink-0"
          style={{ paddingRight: "12px", color: "#94A3B8" }}
        >
          {suffix}
        </div>
      )}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3" style={{ margin: "4px 0 2px" }}>
      <span
        style={{
          color: "#94A3B8",
          fontSize: "0.65rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontFamily: '"Inter", sans-serif',
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", backgroundColor: "#F1F5F9" }} />
    </div>
  );
}

function DropZone({
  label,
  sublabel,
  icon,
  uploaded,
  onUpload,
  accentColor = "#2563EB",
}: {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  uploaded: UploadedFile | null;
  onUpload: (file: UploadedFile) => void;
  accentColor?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        onUpload({
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          preview: null,
        });
      }
    },
    [onUpload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        preview: null,
      });
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className="relative rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all"
      style={{
        border: dragging
          ? `2px dashed ${accentColor}`
          : uploaded
          ? `2px solid ${accentColor}30`
          : "2px dashed #CBD5E1",
        backgroundColor: dragging
          ? `${accentColor}06`
          : uploaded
          ? `${accentColor}04`
          : "#FAFBFC",
        minHeight: "110px",
        padding: "16px 12px",
        transition: "all 0.15s",
        boxShadow: dragging ? `0 0 0 3px ${accentColor}12` : "none",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {uploaded ? (
        <div className="flex flex-col items-center gap-1.5 w-full">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${accentColor}12`,
              border: `1.5px solid ${accentColor}25`,
            }}
          >
            <CheckCircle2
              className="w-5 h-5"
              strokeWidth={2}
              style={{ color: accentColor }}
            />
          </div>
          <p
            style={{
              color: "#1E293B",
              fontSize: "0.75rem",
              fontWeight: 600,
              fontFamily: '"Inter", sans-serif',
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {uploaded.name}
          </p>
          <p
            style={{
              color: "#94A3B8",
              fontSize: "0.65rem",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {uploaded.size} · Click to replace
          </p>
          <div
            className="rounded-full px-2 py-0.5 mt-0.5"
            style={{
              backgroundColor: `${accentColor}12`,
              border: `1px solid ${accentColor}25`,
            }}
          >
            <span
              style={{
                color: accentColor,
                fontSize: "0.6rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "0.05em",
              }}
            >
              ✓ UPLOADED
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: dragging ? `${accentColor}15` : "#F1F5F9",
              transition: "background-color 0.15s",
            }}
          >
            <div style={{ color: dragging ? accentColor : "#94A3B8" }}>
              {icon}
            </div>
          </div>
          <div>
            <p
              style={{
                color: "#374151",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                lineHeight: 1.3,
              }}
            >
              {label}
            </p>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.65rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "2px",
              }}
            >
              {sublabel}
            </p>
          </div>
          <p
            style={{
              color: accentColor,
              fontSize: "0.65rem",
              fontWeight: 500,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Browse file
          </p>
        </div>
      )}
    </div>
  );
}

function SportMultiSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    );
  };

  const selectedLabels = SPORT_OPTIONS.filter((o) => selected.includes(o.id));

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center rounded-xl text-left transition-all"
        style={{
          padding: "0.625rem 0.875rem",
          border: `1.5px solid ${open ? "#2563EB" : "#E2E8F0"}`,
          backgroundColor: "#FFFFFF",
          boxShadow: open
            ? "0 0 0 3px rgba(37,99,235,0.08)"
            : "0 1px 2px rgba(0,0,0,0.03)",
          transition: "border-color 0.15s, box-shadow 0.15s",
          minHeight: "40px",
        }}
      >
        <div className="flex-1 flex flex-wrap gap-1.5 min-w-0">
          {selectedLabels.length === 0 ? (
            <span
              style={{
                color: "#94A3B8",
                fontSize: "0.85rem",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Select sports...
            </span>
          ) : (
            selectedLabels.map((opt) => (
              <span
                key={opt.id}
                className="flex items-center gap-1 rounded-lg px-2 py-0.5"
                style={{
                  backgroundColor: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                  color: "#1D4ED8",
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: "0.8rem" }}>{opt.emoji}</span>
                {opt.label}
                <span
                  className="ml-0.5 cursor-pointer rounded-full"
                  style={{ color: "#93C5FD", fontSize: "0.65rem" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(opt.id);
                  }}
                >
                  ×
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 ml-2"
          strokeWidth={2}
          style={{
            color: "#94A3B8",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute z-10 w-full rounded-xl overflow-hidden mt-1"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="grid grid-cols-2 gap-1 p-2"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {SPORT_OPTIONS.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggle(opt.id)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors"
                  style={{
                    backgroundColor: isSelected ? "#EFF6FF" : "transparent",
                    border: `1px solid ${isSelected ? "#BFDBFE" : "transparent"}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "transparent";
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{opt.emoji}</span>
                  <span
                    style={{
                      color: isSelected ? "#1D4ED8" : "#374151",
                      fontSize: "0.78rem",
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: isSelected ? 500 : 400,
                      flex: 1,
                    }}
                  >
                    {opt.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2
                      className="w-3.5 h-3.5"
                      strokeWidth={2}
                      style={{ color: "#2563EB", flexShrink: 0 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function CreateEventModal({ onClose }: CreateEventModalProps) {
  /* ── Pre-filled sample data ── */
  const [eventName, setEventName] = useState("Asian Games 2026");
  const [eventType, setEventType] = useState<EventType>("multi");
  const [selectedSports, setSelectedSports] = useState([
    "athletics",
    "swimming",
    "cycling",
    "gymnastics",
    "boxing",
  ]);
  const [location, setLocation] = useState("Nagoya, Japan");
  const [startDate, setStartDate] = useState("2026-09-19");
  const [endDate, setEndDate] = useState("2026-10-04");
  const [quota, setQuota] = useState("12000");
  const [timezone, setTimezone] = useState("Asia/Tokyo (GMT+9)");
  const [visibility, setVisibility] = useState("public");

  const [eventLogo, setEventLogo] = useState<UploadedFile | null>({
    name: "asian-games-logo.png",
    size: "184 KB",
    preview: null,
  });
  const [sponsorLogo, setSponsorLogo] = useState<UploadedFile | null>({
    name: "olympic-council-sponsor.svg",
    size: "42 KB",
    preview: null,
  });

  /* close on backdrop */
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
          className="flex items-center justify-between px-8 py-5 flex-shrink-0"
          style={{
            borderBottom: "1px solid #F1F5F9",
            background:
              "linear-gradient(to right, #FFFFFF 60%, #F8FAFC 100%)",
          }}
        >
          <div className="flex items-center gap-4">
            {/* Icon badge */}
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

          {/* Step indicator */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              {["Event Details", "Logistics", "Assets"].map((step, i) => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: "22px",
                        height: "22px",
                        backgroundColor: i === 0 ? "#2563EB" : i === 1 ? "#2563EB" : "#E2E8F0",
                        fontSize: "0.65rem",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 600,
                        color: i < 2 ? "#fff" : "#94A3B8",
                      }}
                    >
                      {i < 2 ? "✓" : i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontFamily: '"Inter", sans-serif',
                        color: i < 2 ? "#374151" : "#94A3B8",
                        fontWeight: i === 0 ? 500 : 400,
                      }}
                    >
                      {step}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      style={{
                        width: "20px",
                        height: "1px",
                        backgroundColor: i < 1 ? "#2563EB" : "#E2E8F0",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
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
        </div>

        {/* ══════════════════════  BODY (scrollable)  ══════════════════════ */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            {/* ────────────────  LEFT COLUMN  ──────────────── */}
            <div
              className="flex flex-col gap-5 px-8 py-6"
              style={{ borderRight: "1px solid #F1F5F9" }}
            >
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
                <p
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.68rem",
                    fontFamily: '"Inter", sans-serif',
                    marginTop: "4px",
                  }}
                >
                  This will appear on all official documentation and participant keys.
                </p>
              </div>

              {/* Event Type */}
              <div>
                <FieldLabel required>Event Type</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      {
                        id: "single",
                        icon: <Trophy className="w-5 h-5" strokeWidth={1.75} />,
                        title: "Single Event",
                        desc: "One sport, one competition window",
                        badge: "Simple",
                        badgeColor: "#059669",
                        badgeBg: "#D1FAE5",
                      },
                      {
                        id: "multi",
                        icon: <Layers className="w-5 h-5" strokeWidth={1.75} />,
                        title: "Multi-Event",
                        desc: "Multiple sports across a schedule",
                        badge: "Complex",
                        badgeColor: "#1D4ED8",
                        badgeBg: "#DBEAFE",
                      },
                    ] as const
                  ).map((opt) => {
                    const active = eventType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setEventType(opt.id)}
                        className="relative flex flex-col gap-2 rounded-xl p-4 text-left transition-all"
                        style={{
                          border: `2px solid ${active ? "#2563EB" : "#E2E8F0"}`,
                          backgroundColor: active ? "#EFF6FF" : "#FAFBFC",
                          boxShadow: active
                            ? "0 0 0 3px rgba(37,99,235,0.08)"
                            : "none",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FAFBFC";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                          }
                        }}
                      >
                        {/* Checkmark */}
                        <div
                          className="absolute top-3 right-3 rounded-full flex items-center justify-center"
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: active ? "#2563EB" : "#E2E8F0",
                            transition: "background-color 0.15s",
                          }}
                        >
                          {active ? (
                            <CheckCircle2
                              className="w-4 h-4 text-white"
                              strokeWidth={2.5}
                            />
                          ) : (
                            <div
                              className="rounded-full"
                              style={{
                                width: "8px",
                                height: "8px",
                                backgroundColor: "#CBD5E1",
                              }}
                            />
                          )}
                        </div>

                        {/* Icon */}
                        <div
                          className="flex items-center justify-center rounded-lg"
                          style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: active ? "#DBEAFE" : "#F1F5F9",
                            color: active ? "#2563EB" : "#64748B",
                            transition: "all 0.15s",
                          }}
                        >
                          {opt.icon}
                        </div>

                        <div>
                          <p
                            style={{
                              color: active ? "#1E40AF" : "#0F172A",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              fontFamily: '"Inter", sans-serif',
                              lineHeight: 1.2,
                            }}
                          >
                            {opt.title}
                          </p>
                          <p
                            style={{
                              color: active ? "#3B82F6" : "#94A3B8",
                              fontSize: "0.68rem",
                              fontFamily: '"Inter", sans-serif',
                              marginTop: "3px",
                              lineHeight: 1.4,
                            }}
                          >
                            {opt.desc}
                          </p>
                        </div>

                        <span
                          className="self-start rounded-md px-1.5 py-0.5"
                          style={{
                            backgroundColor: opt.badgeBg,
                            color: opt.badgeColor,
                            fontSize: "0.6rem",
                            fontWeight: 600,
                            fontFamily: '"Inter", sans-serif',
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                          }}
                        >
                          {opt.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sport Category */}
              <div>
                <FieldLabel required>Sport Categories</FieldLabel>
                <SportMultiSelect
                  selected={selectedSports}
                  onChange={setSelectedSports}
                />
                {selectedSports.length > 0 && (
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
                <StyledInput
                  value={location}
                  onChange={setLocation}
                  placeholder="Search city or venue..."
                  icon={<MapPin className="w-4 h-4" strokeWidth={1.75} />}
                  suffix={
                    <span
                      style={{
                        fontSize: "0.62rem",
                        fontFamily: '"Inter", sans-serif',
                        color: "#2563EB",
                        fontWeight: 500,
                        cursor: "pointer",
                        borderLeft: "1px solid #E2E8F0",
                        paddingLeft: "8px",
                      }}
                    >
                      Map
                    </span>
                  }
                />
                {/* Map preview strip */}
                <div
                  className="mt-2 rounded-xl overflow-hidden flex items-center gap-3 px-3 py-2"
                  style={{
                    backgroundColor: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                  }}
                >
                  <Globe
                    className="w-3.5 h-3.5 flex-shrink-0"
                    strokeWidth={1.75}
                    style={{ color: "#16A34A" }}
                  />
                  <p
                    style={{
                      color: "#15803D",
                      fontSize: "0.7rem",
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Nagoya, Japan — Verified location · GMT+9
                  </p>
                  <CheckCircle2
                    className="w-3.5 h-3.5 ml-auto flex-shrink-0"
                    strokeWidth={2}
                    style={{ color: "#16A34A" }}
                  />
                </div>
              </div>

              {/* Visibility */}
              <div>
                <FieldLabel>Event Visibility</FieldLabel>
                <div className="flex gap-2">
                  {[
                    { id: "public", label: "Public", icon: "🌐" },
                    { id: "private", label: "Private", icon: "🔒" },
                    { id: "invite", label: "Invite Only", icon: "✉️" },
                  ].map((v) => {
                    const active = visibility === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVisibility(v.id)}
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

            {/* ────────────────  RIGHT COLUMN  ──────────────── */}
            <div className="flex flex-col gap-5 px-8 py-6">
              <SectionDivider label="Logistics" />

              {/* Date Range */}
              <div>
                <FieldLabel required>Event Duration</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.68rem",
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "4px",
                      }}
                    >
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
                    <p
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.68rem",
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "4px",
                      }}
                    >
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
                {/* Duration pill */}
                {startDate && endDate && (
                  <div
                    className="flex items-center gap-2 mt-2 rounded-lg px-3 py-2"
                    style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}
                  >
                    <Clock
                      className="w-3.5 h-3.5"
                      strokeWidth={1.75}
                      style={{ color: "#2563EB" }}
                    />
                    <span
                      style={{
                        color: "#374151",
                        fontSize: "0.72rem",
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    >
                      16-day event window
                    </span>
                    <span
                      className="ml-auto rounded-md px-2 py-0.5"
                      style={{
                        backgroundColor: "#EFF6FF",
                        color: "#2563EB",
                        fontSize: "0.6rem",
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      Sep 19 – Oct 4, 2026
                    </span>
                  </div>
                )}
              </div>

              {/* Timezone */}
              <div>
                <FieldLabel>Timezone</FieldLabel>
                <StyledInput
                  value={timezone}
                  onChange={setTimezone}
                  icon={<Globe className="w-4 h-4" strokeWidth={1.75} />}
                  suffix={<ChevronDown className="w-4 h-4" strokeWidth={2} />}
                />
              </div>

              {/* Participant Quota */}
              <div>
                <FieldLabel required>Max Participants / Keys</FieldLabel>
                <StyledInput
                  value={quota}
                  onChange={setQuota}
                  placeholder="e.g. 1000 users"
                  icon={<Users className="w-4 h-4" strokeWidth={1.75} />}
                  suffix={
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontFamily: '"Inter", sans-serif',
                        color: "#94A3B8",
                        borderLeft: "1px solid #F1F5F9",
                        paddingLeft: "8px",
                      }}
                    >
                      users
                    </span>
                  }
                />
                {/* Quota visual bar */}
                {quota && Number(quota) > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        style={{
                          color: "#94A3B8",
                          fontSize: "0.65rem",
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        Key allocation capacity
                      </span>
                      <span
                        style={{
                          color: "#0F172A",
                          fontSize: "0.68rem",
                          fontFamily: '"JetBrains Mono", monospace',
                          fontWeight: 500,
                        }}
                      >
                        {Number(quota).toLocaleString()} slots
                      </span>
                    </div>
                    <div
                      className="rounded-full overflow-hidden"
                      style={{ height: "4px", backgroundColor: "#F1F5F9" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "100%",
                          background:
                            "linear-gradient(90deg, #2563EB 0%, #06B6D4 100%)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Alert note */}
              <div
                className="flex items-start gap-2.5 rounded-xl p-3"
                style={{
                  backgroundColor: "#FFFBEB",
                  border: "1px solid #FDE68A",
                }}
              >
                <AlertCircle
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  strokeWidth={1.75}
                  style={{ color: "#D97706" }}
                />
                <p
                  style={{
                    color: "#92400E",
                    fontSize: "0.72rem",
                    fontFamily: '"Inter", sans-serif',
                    lineHeight: 1.5,
                  }}
                >
                  Access keys will be auto-generated upon event creation. Each participant receives a unique{" "}
                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 500,
                    }}
                  >
                    KEY-XXXX
                  </span>{" "}
                  credential tied to this event.
                </p>
              </div>

              <SectionDivider label="Branding Assets" />

              {/* Upload Zones */}
              <div>
                <FieldLabel>Visual Assets</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p
                      style={{
                        color: "#64748B",
                        fontSize: "0.68rem",
                        fontWeight: 500,
                        fontFamily: '"Inter", sans-serif',
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "6px",
                      }}
                    >
                      Event Logo
                    </p>
                    <div className="relative">
                      <DropZone
                        label="Drop logo here"
                        sublabel="PNG, SVG · Max 2 MB"
                        icon={<ImagePlus className="w-4 h-4" strokeWidth={1.75} />}
                        uploaded={eventLogo}
                        onUpload={setEventLogo}
                        accentColor="#2563EB"
                      />
                      {eventLogo && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEventLogo(null);
                          }}
                          className="absolute flex items-center justify-center rounded-full transition-all"
                          style={{
                            top: "8px",
                            right: "8px",
                            width: "22px",
                            height: "22px",
                            backgroundColor: "#FEF2F2",
                            border: "1.5px solid #FECACA",
                            color: "#EF4444",
                            zIndex: 10,
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEE2E2";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#FCA5A5";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEF2F2";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#FECACA";
                          }}
                          title="Remove event logo"
                        >
                          <X className="w-3 h-3" strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#64748B",
                        fontSize: "0.68rem",
                        fontWeight: 500,
                        fontFamily: '"Inter", sans-serif',
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "6px",
                      }}
                    >
                      Sponsor Logo
                    </p>
                    <div className="relative">
                      <DropZone
                        label="Drop sponsor logo"
                        sublabel="PNG, SVG · Max 2 MB"
                        icon={<Upload className="w-4 h-4" strokeWidth={1.75} />}
                        uploaded={sponsorLogo}
                        onUpload={setSponsorLogo}
                        accentColor="#7C3AED"
                      />
                      {sponsorLogo && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSponsorLogo(null);
                          }}
                          className="absolute flex items-center justify-center rounded-full transition-all"
                          style={{
                            top: "8px",
                            right: "8px",
                            width: "22px",
                            height: "22px",
                            backgroundColor: "#FEF2F2",
                            border: "1.5px solid #FECACA",
                            color: "#EF4444",
                            zIndex: 10,
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEE2E2";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#FCA5A5";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEF2F2";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#FECACA";
                          }}
                          title="Remove sponsor logo"
                        >
                          <X className="w-3 h-3" strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.65rem",
                    fontFamily: '"Inter", sans-serif',
                    marginTop: "6px",
                  }}
                >
                  Assets will be displayed on certificates, key cards, and the event portal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════  FOOTER  ══════════════════════ */}
        <div
          className="flex items-center justify-between px-8 py-4 flex-shrink-0"
          style={{
            borderTop: "1px solid #F1F5F9",
            backgroundColor: "#FAFBFC",
          }}
        >
          {/* Left meta */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1"
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#4ADE80",
                  boxShadow: "0 0 4px #4ADE80",
                }}
              />
              <span
                style={{
                  color: "#374151",
                  fontSize: "0.7rem",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 500,
                }}
              >
                Auto-save enabled
              </span>
            </div>
            <span
              style={{
                color: "#CBD5E1",
                fontSize: "0.68rem",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Draft will be saved automatically
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all"
              style={{
                border: "1.5px solid #E2E8F0",
                color: "#64748B",
                fontSize: "0.84rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
              }}
            >
              Cancel
            </button>

            <button
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                color: "#FFFFFF",
                fontSize: "0.84rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                boxShadow: "0px 4px 16px rgba(37,99,235,0.35)",
                border: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(135deg, #1D4ED8, #1E40AF)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0px 6px 20px rgba(37,99,235,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(135deg, #2563EB, #1D4ED8)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0px 4px 16px rgba(37,99,235,0.35)";
              }}
            >
              <Trophy className="w-4 h-4" strokeWidth={2} />
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}