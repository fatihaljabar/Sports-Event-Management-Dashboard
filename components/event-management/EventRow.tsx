import React, { useState, useRef, useEffect } from "react";
import {
  Layers,
  Trophy,
  Calendar,
  Clock,
  MoreHorizontal,
  Pencil,
  Archive,
  Trash2,
  KeyRound,
} from "lucide-react";
import { DAYS_CONFIG } from "./constants";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { SportEvent, EventHandlers } from "./types";

// Font constants to avoid quote escaping issues
const FONT_INTER = '"Inter", sans-serif';
const FONT_MONO = '"JetBrains Mono", monospace';

interface EventRowProps {
  event: SportEvent;
  isLast: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  deleteConfirm: string | null;
  setDeleteConfirm: (id: string | null) => void;
  handlers: EventHandlers;
  isDeleting?: boolean;
}

export function EventRow({
  event,
  isLast,
  hovered,
  onHover,
  deleteConfirm,
  setDeleteConfirm,
  handlers,
  isDeleting = false,
}: EventRowProps) {
  const days = DAYS_CONFIG[event.daysVariant];
  const isConfirming = deleteConfirm === event.id;
  const [meatballMenuOpen, setMeatballMenuOpen] = useState(false);
  const [dropDirection, setDropDirection] = useState<"down" | "up">("down");
  const meatballRef = useRef<HTMLDivElement>(null);

  // Close meatball menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (meatballRef.current && !meatballRef.current.contains(e.target as Node)) {
        setMeatballMenuOpen(false);
      }
    };
    if (meatballMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [meatballMenuOpen]);

  // Calculate dropdown direction when menu opens
  useEffect(() => {
    if (meatballMenuOpen && meatballRef.current) {
      const rect = meatballRef.current.getBoundingClientRect();
      const dropdownHeight = 200; // Approximate dropdown height
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Show above if not enough space below (with 20px buffer)
      if (spaceBelow < dropdownHeight + 20 && spaceAbove > spaceBelow) {
        setDropDirection("up");
      } else {
        setDropDirection("down");
      }
    }
  }, [meatballMenuOpen]);

  // Handle meatball menu actions
  const handleMenuAction = async (action: string) => {
    setMeatballMenuOpen(false);
    switch (action) {
      case "view":
        handlers.onEventClick(event.id);
        break;
      case "edit":
        if (handlers.onEdit) handlers.onEdit(event.id);
        break;
      case "duplicate":
        if (handlers.onDuplicate) {
          await handlers.onDuplicate(event.id);
        }
        break;
      case "archive":
        if (handlers.onArchive) {
          await handlers.onArchive(event.id, event.name, event.status === "archived");
        }
        break;
      case "export":
        if (handlers.onExport) {
          await handlers.onExport(event.id, event.name);
        }
        break;
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    await handlers.onDelete(event.id, event.name);
  };

  return (
    <tr
      onMouseEnter={() => onHover(event.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        backgroundColor: isConfirming
          ? "#FFF5F5"
          : hovered
          ? "#F8FAFF"
          : "transparent",
        borderBottom: isLast ? "none" : "1px solid var(--em-border-light)",
        transition: "background-color 0.12s",
        cursor: "default",
      }}
    >
      {/* Event Identity */}
      <td style={{ padding: "14px 20px" }}>
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handlers.onEventClick(event.id)}
          title={`Manage ${event.name}`}
        >
          {/* Logo */}
          <EventLogo logo={event.logo} logoUrl={event.logoUrl} name={event.name} />
          <EventInfo event={event} />
        </div>
      </td>

      {/* Type */}
      <td style={{ padding: "14px 20px" }}>
        <EventTypeDisplay type={event.type} sportsCount={event.sports.length} />
      </td>

      {/* Timeline */}
      <td style={{ padding: "14px 20px" }}>
        <TimelineDisplay startDate={event.startDate} endDate={event.endDate} daysLabel={event.daysLabel} days={days} />
      </td>

      {/* Status */}
      <td style={{ padding: "14px 20px" }}>
        <StatusBadge status={event.status} />
      </td>

      {/* Key Usage */}
      <td style={{ padding: "14px 20px" }}>
        <KeyUsageDisplay usedKeys={event.usedKeys} totalKeys={event.totalKeys} />
      </td>

      {/* Actions */}
      <td style={{ padding: "14px 20px", textAlign: "right" }}>
        <ActionsCell
          isConfirming={isConfirming}
          meatballMenuOpen={meatballMenuOpen}
          setMeatballMenuOpen={setMeatballMenuOpen}
          setDeleteConfirm={setDeleteConfirm}
          handleDeleteConfirm={handleDeleteConfirm}
          handleMenuAction={handleMenuAction}
          event={event}
          isDeleting={isDeleting}
          meatballRef={meatballRef}
          handlers={handlers}
          dropDirection={dropDirection}
        />
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

interface EventLogoProps {
  logo: SportEvent["logo"];
  logoUrl?: string;
  name: string;
}

function EventLogo({ logo, logoUrl, name }: EventLogoProps) {
  return (
    <div
      className="flex items-center justify-center rounded-xl flex-shrink-0 relative overflow-hidden"
      style={{
        width: "44px",
        height: "44px",
        background: logoUrl ? "transparent" : logo.bg,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <span style={{ fontSize: "1.2rem" }}>{logo.emoji}</span>
      )}
    </div>
  );
}

interface EventInfoProps {
  event: SportEvent;
}

function EventInfo({ event }: EventInfoProps) {
  const hasSponsors = event.sponsorLogos && event.sponsorLogos.length > 0;
  const sponsorCount = hasSponsors ? event.sponsorLogos!.length : 0;

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <p
          style={{
            color: "#0F172A",
            fontSize: "0.88rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event.name}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-0.5">
        <span
          style={{
            color: "#94A3B8",
            fontSize: "0.68rem",
            letterSpacing: "0.04em",
          }}
        >
          {event.id}
        </span>
        <span style={{ color: "#E2E8F0", fontSize: "0.6rem" }}>·</span>
        <span
          style={{
            color: "#94A3B8",
            fontSize: "0.68rem",
          }}
        >
          {event.location}
        </span>
      </div>
      {/* Sports and Sponsor avatars */}
      <div className="flex items-center gap-2.5 mt-1.5">
        {/* Sports avatar group */}
        <div className="flex items-center gap-0.5">
          {event.sports.slice(0, 3).map((s, i) => (
            <span
              key={`sport-${i}`}
              className="flex items-center justify-center rounded border"
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#F1F5F9",
                border: "1.5px solid #FFFFFF",
                fontSize: "0.7rem",
              }}
              title={`Sport: ${s}`}
            >
              {s}
            </span>
          ))}
          {event.sports.length > 3 && (
            <span
              className="flex items-center justify-center rounded border font-medium"
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#E2E8F0",
                border: "1.5px solid #FFFFFF",
                color: "#64748B",
                fontSize: "0.6rem",
              }}
              title={`+${event.sports.length - 3} more sports`}
            >
              +{event.sports.length - 3}
            </span>
          )}
        </div>

        {/* Sponsor logos avatar group */}
        {hasSponsors && sponsorCount > 0 && (
          <>
            <span style={{ color: "#E2E8F0", fontSize: "0.5rem" }}>·</span>
            <div className="flex items-center gap-0.5">
              {event.sponsorLogos!.slice(0, 3).map((sponsor, i) => (
                <img
                  key={`sponsor-${i}`}
                  src={sponsor.url}
                  alt={sponsor.name}
                  className="rounded border object-contain"
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#F8FAFC",
                    border: "1.5px solid #FFFFFF",
                  }}
                  title={sponsor.name}
                />
              ))}
              {sponsorCount > 3 && (
                <span
                  className="flex items-center justify-center rounded border font-medium"
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#E2E8F0",
                    border: "1.5px solid #FFFFFF",
                    color: "#64748B",
                    fontSize: "0.6rem",
                  }}
                  title={`+${sponsorCount - 3} more sponsors`}
                >
                  +{sponsorCount - 3}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface EventTypeDisplayProps {
  type: SportEvent["type"];
  sportsCount: number;
}

function EventTypeDisplay({ type, sportsCount }: EventTypeDisplayProps) {
  if (type === "multi") {
    return (
      <div className="flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.75} style={{ color: "#7C3AED" }} />
        <div>
          <p
            style={{
              color: "#374151",
              fontSize: "0.78rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            Multi-Event
          </p>
          <p
            style={{
              color: "#CBD5E1",
              fontSize: "0.62rem",
            }}
          >
            {sportsCount} sports
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Trophy className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.75} style={{ color: "#F59E0B" }} />
      <div>
        <p
          style={{
            color: "#374151",
            fontSize: "0.78rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Single Event
        </p>
        <p
          style={{
            color: "#CBD5E1",
            fontSize: "0.62rem",
          }}
        >
          1 sport
        </p>
      </div>
    </div>
  );
}

interface TimelineDisplayProps {
  startDate: string;
  endDate: string;
  daysLabel: string;
  days: typeof DAYS_CONFIG[keyof typeof DAYS_CONFIG];
}

function TimelineDisplay({ startDate, endDate, daysLabel, days }: TimelineDisplayProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3 h-3 flex-shrink-0" strokeWidth={1.75} style={{ color: "#94A3B8" }} />
        <span
          style={{
            color: "#374151",
            fontSize: "0.78rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {startDate} – {endDate}
        </span>
      </div>
      {/* Countdown badge */}
      <div
        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 self-start"
        style={{
          backgroundColor: days.bg,
          border: `1px solid ${days.border}`,
        }}
      >
        <Clock className="w-2.5 h-2.5" strokeWidth={2} style={{ color: days.color }} />
        <span
          style={{
            color: days.color,
            fontSize: "0.68rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {daysLabel}
        </span>
      </div>
    </div>
  );
}

interface KeyUsageDisplayProps {
  usedKeys: number;
  totalKeys: number;
}

function KeyUsageDisplay({ usedKeys, totalKeys }: KeyUsageDisplayProps) {
  const pct = Math.round((usedKeys / totalKeys) * 100);
  const barColor = pct >= 90 ? "#EF4444" : pct >= 75 ? "#F59E0B" : "#2563EB";
  const barBg = pct >= 90 ? "#FEE2E2" : pct >= 75 ? "#FEF3C7" : "#DBEAFE";

  return (
    <div>
      {/* Numbers row */}
      <div className="flex items-baseline gap-1">
        <span
          style={{
            color: "#0F172A",
            fontSize: "0.88rem",
            fontWeight: 700,
          }}
        >
          {usedKeys.toLocaleString()}
        </span>
        <span
          style={{
            color: "#94A3B8",
            fontSize: "0.72rem",
          }}
        >
          / {totalKeys.toLocaleString()}
        </span>
        <span
          style={{
            color: "#CBD5E1",
            fontSize: "0.65rem",
          }}
        >
          users
        </span>
      </div>
      {/* Progress bar */}
      <div
        className="rounded-full overflow-hidden mt-1.5"
        style={{ height: "4px", backgroundColor: barBg }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(pct, 100)}%`,
            backgroundColor: barColor,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      {/* Percentage label */}
      <p
        style={{
          color: barColor,
          fontSize: "0.62rem",
          fontWeight: 600,
          marginTop: "3px",
        }}
      >
        {pct}% used
      </p>
    </div>
  );
}

interface ActionsCellProps {
  isConfirming: boolean;
  meatballMenuOpen: boolean;
  setMeatballMenuOpen: (open: boolean) => void;
  setDeleteConfirm: (id: string | null) => void;
  handleDeleteConfirm: () => void;
  handleMenuAction: (action: string) => void;
  event: SportEvent;
  isDeleting: boolean;
  meatballRef: React.RefObject<HTMLDivElement>;
  handlers: EventHandlers;
  dropDirection: "down" | "up";
}

function ActionsCell({
  isConfirming,
  meatballMenuOpen,
  setMeatballMenuOpen,
  setDeleteConfirm,
  handleDeleteConfirm,
  handleMenuAction,
  event,
  isDeleting,
  meatballRef,
  handlers,
  dropDirection,
}: ActionsCellProps) {
  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 justify-end">
        <span
          style={{
            color: "#DC2626",
            fontSize: "0.72rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Delete event?
        </span>
        <button
          onClick={() => setDeleteConfirm(null)}
          disabled={isDeleting}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors"
          style={{
            border: "1.5px solid #E2E8F0",
            color: "#64748B",
            fontSize: "0.72rem",
            backgroundColor: "#FFFFFF",
            opacity: isDeleting ? 0.6 : 1,
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteConfirm}
          disabled={isDeleting}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors"
          style={{
            backgroundColor: "#EF4444",
            color: "#FFFFFF",
            fontSize: "0.72rem",
            fontWeight: 500,
            border: "none",
            opacity: isDeleting ? 0.7 : 1,
          }}
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-3 h-3" strokeWidth={2} />
              Confirm
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 justify-end">
      {/* Manage Keys */}
      <ActionButton
        icon={<KeyRound className="w-3.5 h-3.5" strokeWidth={1.75} />}
        label="Keys"
        color="#2563EB"
        bgHover="#EFF6FF"
        borderHover="#BFDBFE"
        onClick={() => handlers.onEventClick(event.id)}
      />

      {/* Edit */}
      <ActionButton
        icon={<Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />}
        label="Edit"
        color="#64748B"
        bgHover="#F8FAFC"
        borderHover="#E2E8F0"
        onClick={() => (handlers.onEdit ? handlers.onEdit(event.id) : handlers.onEventClick(event.id))}
      />

      {/* More (Meatball Menu) */}
      <div ref={meatballRef} className="relative">
        <ActionButton
          icon={<MoreHorizontal className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label=""
          color="#64748B"
          bgHover={meatballMenuOpen ? "#F1F5F9" : "#F8FAFC"}
          borderHover="#E2E8F0"
          onClick={() => setMeatballMenuOpen(!meatballMenuOpen)}
        />

        {/* Meatball Dropdown */}
        {meatballMenuOpen && (
          <div
            className={`absolute right-0 rounded-lg shadow-xl z-50 ${
              dropDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"
            }`}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              minWidth: "160px",
              padding: "4px",
            }}
          >
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => handleMenuAction("view")}
                className="flex items-center gap-2 rounded px-3 py-2 transition-all text-left"
                style={{
                  color: "#374151",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <Trophy
                  className="w-3.5 h-3.5"
                  strokeWidth={1.75}
                  style={{ color: "#64748B" }}
                />
                View Details
              </button>

              <button
                onClick={() => handleMenuAction("edit")}
                disabled={event.status === "completed"}
                className="flex items-center gap-2 rounded px-3 py-2 transition-all text-left"
                style={{
                  color: event.status === "completed" ? "#CBD5E1" : "#374151",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                  cursor: event.status === "completed" ? "not-allowed" : "pointer",
                  opacity: event.status === "completed" ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (event.status !== "completed") {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <Pencil
                  className="w-3.5 h-3.5"
                  strokeWidth={1.75}
                  style={{ color: event.status === "completed" ? "#CBD5E1" : "#64748B" }}
                />
                Edit Event
                {event.status === "completed" && (
                  <span
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.6rem",
                      marginLeft: "auto",
                    }}
                  >
                    (Completed)
                  </span>
                )}
              </button>

              <button
                onClick={() => handleMenuAction("duplicate")}
                disabled={event.status === "completed"}
                className="flex items-center gap-2 rounded px-3 py-2 transition-all text-left"
                style={{
                  color: event.status === "completed" ? "#CBD5E1" : "#374151",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                  cursor: event.status === "completed" ? "not-allowed" : "pointer",
                  opacity: event.status === "completed" ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (event.status !== "completed") {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <Layers
                  className="w-3.5 h-3.5"
                  strokeWidth={1.75}
                  style={{ color: event.status === "completed" ? "#CBD5E1" : "#64748B" }}
                />
                Duplicate
              </button>

              <div
                style={{
                  borderTop: "1px solid #F1F5F9",
                  margin: "4px 0",
                }}
              ></div>

              <button
                onClick={() => handleMenuAction("archive")}
                className="flex items-center gap-2 rounded px-3 py-2 transition-all text-left"
                style={{
                  color: event.status === "archived" ? "#2563EB" : "#94A3B8",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <Archive className="w-3.5 h-3.5" strokeWidth={1.75} />
                {event.status === "archived" ? "Unarchive" : "Archive"}
              </button>

              <button
                onClick={() => handleMenuAction("export")}
                className="flex items-center gap-2 rounded px-3 py-2 transition-all text-left"
                style={{
                  color: "#94A3B8",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
                Export Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => setDeleteConfirm(event.id)}
        className="flex items-center justify-center rounded-lg transition-all"
        title="Delete event"
        style={{
          width: "32px",
          height: "32px",
          border: "1.5px solid #FEE2E2",
          backgroundColor: "#FFF5F5",
          color: "#EF4444",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEE2E2";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#FCA5A5";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFF5F5";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#FEE2E2";
        }}
      >
        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ACTION BUTTON
───────────────────────────────────────────── */
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgHover: string;
  borderHover: string;
  onClick?: () => void;
}

function ActionButton({ icon, label, color, bgHover, borderHover, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg transition-all"
      title={label}
      style={{
        height: "32px",
        padding: label ? "0 10px" : "0",
        minWidth: "32px",
        border: "1.5px solid #F1F5F9",
        backgroundColor: "transparent",
        color,
        fontSize: "0.72rem",
        fontFamily: '"Inter", sans-serif',
        fontWeight: 500,
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = bgHover;
        (e.currentTarget as HTMLButtonElement).style.borderColor = borderHover;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#F1F5F9";
      }}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}
