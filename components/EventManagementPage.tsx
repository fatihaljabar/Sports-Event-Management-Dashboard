import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  KeyRound,
  Pencil,
  Trash2,
  Trophy,
  Calendar,
  Clock,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  Layers,
  CheckCircle2,
  Archive,
  CalendarClock,
  SlidersHorizontal,
} from "lucide-react";
import { useEvents } from "@/lib/stores/event-store";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
type EventStatus = "active" | "inactive" | "upcoming" | "ongoing" | "completed" | "archived";
type EventType = "multi" | "single";

interface SportEvent {
  id: string;
  logo: { bg: string; text: string; emoji: string };
  name: string;
  type: EventType;
  startDate: string;
  endDate: string;
  daysLabel: string;
  daysVariant: "urgent" | "warning" | "upcoming" | "ended" | "far";
  status: EventStatus;
  sports: string[];
  location: string;
  usedKeys: number;
  totalKeys: number;
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
type FilterTab = "all" | EventStatus;

const TABS: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All Events", icon: <Layers className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { id: "active", label: "Active", icon: <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { id: "upcoming", label: "Upcoming", icon: <CalendarClock className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { id: "ongoing", label: "Ongoing", icon: <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { id: "completed", label: "Completed", icon: <Trophy className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { id: "archived", label: "Archived", icon: <Archive className="w-3.5 h-3.5" strokeWidth={1.75} /> },
];

const STATUS_CONFIG: Record<EventStatus, { label: string; bg: string; color: string; dot: string }> = {
  active:    { label: "Active",    bg: "#DCFCE7", color: "#15803D", dot: "#22C55E" },
  inactive:  { label: "Inactive",  bg: "#FEE2E2", color: "#DC2626", dot: "#EF4444" },
  upcoming:  { label: "Upcoming",  bg: "#DBEAFE", color: "#1D4ED8", dot: "#3B82F6" },
  ongoing:   { label: "Ongoing",   bg: "#FEF3C7", color: "#D97706", dot: "#F59E0B" },
  completed: { label: "Completed", bg: "#F3F4F6", color: "#374151", dot: "#9CA3AF" },
  archived:  { label: "Archived",  bg: "#F1F5F9", color: "#64748B", dot: "#94A3B8" },
};

const DAYS_CONFIG: Record<SportEvent["daysVariant"], { bg: string; color: string; border: string }> = {
  urgent:   { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  warning:  { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  upcoming: { bg: "#DBEAFE", color: "#1D4ED8", border: "#BFDBFE" },
  far:      { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
  ended:    { bg: "#F8FAFC", color: "#94A3B8", border: "#E2E8F0" },
};

function CountBadge({ count, active }: { count: number; active: boolean }) {
  return (
    <span
      className="flex items-center justify-center rounded-full"
      style={{
        minWidth: "18px",
        height: "18px",
        padding: "0 5px",
        backgroundColor: active ? "#2563EB" : "#F1F5F9",
        color: active ? "#FFFFFF" : "#94A3B8",
        fontSize: "0.6rem",
        fontFamily: '"JetBrains Mono", monospace',
        fontWeight: 600,
      }}
    >
      {count}
    </span>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
interface EventManagementPageProps {
  onCreateEvent: () => void;
  onEventClick: (eventId: string) => void;
}

export function EventManagementPage({ onCreateEvent, onEventClick }: EventManagementPageProps) {
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Convert events from store to the format expected by the component
  const convertedEvents: SportEvent[] = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.map((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const daysUntil = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let daysVariant: "urgent" | "warning" | "upcoming" | "ended" | "far" = "far";
      if (today > endDate) daysVariant = "ended";
      else if (daysUntil <= 7 && daysUntil >= 0) daysVariant = "urgent";
      else if (daysUntil <= 14 && daysUntil > 7) daysVariant = "warning";
      else if (daysUntil <= 30 && daysUntil > 14) daysVariant = "upcoming";

      // Calculate days remaining until event ends
      const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      let daysLabel: string;
      if (today > endDate) {
        daysLabel = "Ended";
      } else {
        daysLabel = `${daysUntilEnd} Days Left`;
      }

      // Format dates for display (e.g., "Mar 09")
      const formatDisplayDate = (date: Date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}`;
      };

      // Calculate dynamic status based on dates
      let calculatedStatus: EventStatus = "upcoming";
      if (today > endDate) {
        calculatedStatus = "completed";
      } else if (today >= startDate && today <= endDate) {
        calculatedStatus = "ongoing";
      } else if (today < startDate) {
        calculatedStatus = "upcoming";
      }

      // Generate logo from event name
      const initials = event.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
      const emoji = event.sports[0]?.emoji || "🏆";

      return {
        id: event.id,
        logo: { bg: "linear-gradient(135deg,#2563EB,#7C3AED)", text: initials, emoji },
        name: event.name,
        type: event.type,
        startDate: formatDisplayDate(startDate),
        endDate: formatDisplayDate(endDate),
        daysLabel,
        daysVariant,
        status: calculatedStatus, // Use dynamically calculated status
        sports: event.sports.map((s) => s.emoji),
        location: `${event.location.city}${event.location.venue ? `, ${event.location.venue}` : ""}`,
        usedKeys: event.usedKeys,
        totalKeys: event.totalKeys,
      };
    });
  }, [events]);

  const tabCounts: Record<FilterTab, number> = {
    all: convertedEvents.length,
    active: convertedEvents.filter((e) => e.status === "active").length,
    inactive: convertedEvents.filter((e) => e.status === "inactive").length,
    upcoming: convertedEvents.filter((e) => e.status === "upcoming").length,
    ongoing: convertedEvents.filter((e) => e.status === "ongoing").length,
    completed: convertedEvents.filter((e) => e.status === "completed").length,
    archived: convertedEvents.filter((e) => e.status === "archived").length,
  };

  const filtered = convertedEvents.filter((e) => {
    const matchTab = activeTab === "all" || e.status === activeTab;
    const matchSearch =
      search === "" ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <main
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <div className="px-6 py-6" style={{ maxWidth: "1600px" }}>

        {/* ══════  PAGE HEADER  ══════ */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {/* Breadcrumb micro */}
              <span
                style={{
                  color: "#94A3B8",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                Dashboard
              </span>
              <span style={{ color: "#CBD5E1", fontSize: "0.72rem" }}>/</span>
              <span
                style={{
                  color: "#2563EB",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                }}
              >
                Event Management
              </span>
            </div>
            <h1
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 700,
                fontSize: "2.25rem",
                color: "#0F172A",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              Events Directory
            </h1>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.82rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "0.4rem",
              }}
            >
              {convertedEvents.length} total events &nbsp;·&nbsp;
              <span style={{ color: "#22C55E", fontWeight: 500 }}>
                {tabCounts.active} active
              </span>
              &nbsp;·&nbsp;
              <span style={{ color: "#3B82F6" }}>
                {tabCounts.upcoming} upcoming
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Export button */}
            <button
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all"
              style={{
                border: "1.5px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                color: "#64748B",
                fontSize: "0.82rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFFFFF";
              }}
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
              Filters
            </button>

            {/* Create Event */}
            <button
              onClick={onCreateEvent}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                color: "#FFFFFF",
                fontSize: "0.84rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                boxShadow: "0px 4px 16px rgba(37,99,235,0.32)",
                border: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(135deg,#1D4ED8,#1E40AF)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0px 6px 20px rgba(37,99,235,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(135deg,#2563EB,#1D4ED8)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0px 4px 16px rgba(37,99,235,0.32)";
              }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Create Event
            </button>
          </div>
        </div>

        {/* ══════  MAIN CARD  ══════ */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 24px rgba(0,0,0,0.06)",
            border: "1px solid #F1F5F9",
          }}
        >
          {/* ── Toolbar Row ── */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            {/* Filter Tabs */}
            <div className="flex items-center gap-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                    style={{
                      backgroundColor: isActive ? "#EFF6FF" : "transparent",
                      border: `1.5px solid ${isActive ? "#BFDBFE" : "transparent"}`,
                      color: isActive ? "#1D4ED8" : "#64748B",
                      fontSize: "0.8rem",
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: isActive ? 600 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    }}
                  >
                    <span style={{ color: isActive ? "#2563EB" : "#94A3B8" }}>
                      {tab.icon}
                    </span>
                    {tab.label}
                    <CountBadge count={tab.id === "all" ? tabCounts.all : (tabCounts[tab.id as EventStatus] ?? 0)} active={isActive} />
                  </button>
                );
              })}
            </div>

            {/* Right: Search + sort */}
            <div className="flex items-center gap-3">
              <div
                className="relative flex items-center"
                style={{ width: "240px" }}
              >
                <Search
                  className="absolute left-3 w-3.5 h-3.5"
                  strokeWidth={1.75}
                  style={{ color: "#94A3B8" }}
                />
                <input
                  type="text"
                  placeholder="Search events…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg outline-none transition-all"
                  style={{
                    paddingLeft: "2rem",
                    paddingRight: "0.75rem",
                    paddingTop: "0.45rem",
                    paddingBottom: "0.45rem",
                    backgroundColor: "#F8FAFC",
                    border: "1.5px solid #E2E8F0",
                    fontSize: "0.78rem",
                    fontFamily: '"Inter", sans-serif',
                    color: "#1E293B",
                  }}
                  onFocus={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = "#2563EB")
                  }
                  onBlur={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")
                  }
                />
              </div>

              <button
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                style={{
                  border: "1.5px solid #E2E8F0",
                  backgroundColor: "#F8FAFC",
                  color: "#64748B",
                  fontSize: "0.78rem",
                  fontFamily: '"Inter", sans-serif',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                }}
              >
                <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.75} />
                Sort
                <ChevronDown className="w-3 h-3" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              {/* Head */}
              <thead>
                <tr style={{ backgroundColor: "#FAFBFC" }}>
                  {[
                    { label: "Event Identity", width: "30%" },
                    { label: "Type", width: "12%" },
                    { label: "Timeline", width: "18%" },
                    { label: "Status", width: "11%" },
                    { label: "Key Usage", width: "13%" },
                    { label: "Actions", width: "16%", align: "right" as const },
                  ].map((col) => (
                    <th
                      key={col.label}
                      style={{
                        width: col.width,
                        padding: "10px 20px",
                        textAlign: col.align ?? "left",
                        borderBottom: "1.5px solid #F1F5F9",
                        color: "#94A3B8",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontFamily: '"Inter", sans-serif',
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  filtered.map((event, idx) => (
                    <EventRow
                      key={event.id}
                      event={event}
                      isLast={idx === filtered.length - 1}
                      hovered={hoveredRow === event.id}
                      onHover={setHoveredRow}
                      deleteConfirm={deleteConfirm}
                      setDeleteConfirm={setDeleteConfirm}
                      onEventClick={onEventClick}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Footer ── */}
          <div
            className="flex items-center justify-between px-6 py-3"
            style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}
          >
            <span
              style={{
                color: "#94A3B8",
                fontSize: "0.75rem",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Showing{" "}
              <span style={{ color: "#374151", fontWeight: 500 }}>
                {filtered.length}
              </span>{" "}
              of{" "}
              <span style={{ color: "#374151", fontWeight: 500 }}>
                {convertedEvents.length}
              </span>{" "}
              events
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className="flex items-center justify-center rounded-lg transition-colors"
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: p === 1 ? "#2563EB" : "transparent",
                    color: p === 1 ? "#FFFFFF" : "#64748B",
                    fontSize: "0.78rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    border: `1.5px solid ${p === 1 ? "#2563EB" : "#E2E8F0"}`,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: "32px" }} />
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   ROW COMPONENT
───────────────────────────────────────────── */
function EventRow({
  event,
  isLast,
  hovered,
  onHover,
  deleteConfirm,
  setDeleteConfirm,
  onEventClick,
}: {
  event: SportEvent;
  isLast: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  deleteConfirm: string | null;
  setDeleteConfirm: (id: string | null) => void;
  onEventClick: (eventId: string) => void;
}) {
  const status = STATUS_CONFIG[event.status];
  const days = DAYS_CONFIG[event.daysVariant];

  const isDeleting = deleteConfirm === event.id;

  return (
    <tr
      onMouseEnter={() => onHover(event.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        backgroundColor: isDeleting
          ? "#FFF5F5"
          : hovered
          ? "#F8FAFF"
          : "transparent",
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
        transition: "background-color 0.12s",
        cursor: "default",
      }}
    >
      {/* ── Event Identity ── */}
      <td style={{ padding: "14px 20px" }}>
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onEventClick(event.id)}
          title={`Manage ${event.name}`}
        >
          {/* Logo */}
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0 relative"
            style={{
              width: "44px",
              height: "44px",
              background: event.logo.bg,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>{event.logo.emoji}</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p
                style={{
                  color: "#0F172A",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  fontFamily: '"Inter", sans-serif',
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
                  fontFamily: '"JetBrains Mono", monospace',
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
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {event.location}
              </span>
            </div>
            {/* Sport pills */}
            <div className="flex items-center gap-1 mt-1.5">
              {event.sports.slice(0, 4).map((s, i) => (
                <span
                  key={i}
                  className="flex items-center justify-center rounded"
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#F1F5F9",
                    fontSize: "0.7rem",
                  }}
                >
                  {s}
                </span>
              ))}
              {event.sports.length > 4 && (
                <span
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.62rem",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  +{event.sports.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* ── Type ── */}
      <td style={{ padding: "14px 20px" }}>
        {event.type === "multi" ? (
          <div className="flex items-center gap-1.5">
            <Layers
              className="w-3.5 h-3.5 flex-shrink-0"
              strokeWidth={1.75}
              style={{ color: "#7C3AED" }}
            />
            <div>
              <p
                style={{
                  color: "#374151",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  fontFamily: '"Inter", sans-serif',
                  whiteSpace: "nowrap",
                }}
              >
                Multi-Event
              </p>
              <p
                style={{
                  color: "#CBD5E1",
                  fontSize: "0.62rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {event.sports.length} sports
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Trophy
              className="w-3.5 h-3.5 flex-shrink-0"
              strokeWidth={1.75}
              style={{ color: "#F59E0B" }}
            />
            <div>
              <p
                style={{
                  color: "#374151",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  fontFamily: '"Inter", sans-serif',
                  whiteSpace: "nowrap",
                }}
              >
                Single Event
              </p>
              <p
                style={{
                  color: "#CBD5E1",
                  fontSize: "0.62rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                1 sport
              </p>
            </div>
          </div>
        )}
      </td>

      {/* ── Timeline ── */}
      <td style={{ padding: "14px 20px" }}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Calendar
              className="w-3 h-3 flex-shrink-0"
              strokeWidth={1.75}
              style={{ color: "#94A3B8" }}
            />
            <span
              style={{
                color: "#374151",
                fontSize: "0.78rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              {event.startDate} – {event.endDate}
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
            <Clock
              className="w-2.5 h-2.5"
              strokeWidth={2}
              style={{ color: days.color }}
            />
            <span
              style={{
                color: days.color,
                fontSize: "0.68rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                whiteSpace: "nowrap",
              }}
            >
              {event.daysLabel}
            </span>
          </div>
        </div>
      </td>

      {/* ── Status ── */}
      <td style={{ padding: "14px 20px" }}>
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{
            backgroundColor: status.bg,
            border: `1px solid ${status.dot}22`,
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: status.dot,
              boxShadow: event.status === "active" ? `0 0 4px ${status.dot}` : "none",
            }}
          />
          <span
            style={{
              color: status.color,
              fontSize: "0.72rem",
              fontWeight: 600,
              fontFamily: '"Inter", sans-serif',
              whiteSpace: "nowrap",
            }}
          >
            {status.label}
          </span>
        </div>
      </td>

      {/* ── Key Usage ── */}
      <td style={{ padding: "14px 20px" }}>
        {(() => {
          const pct = Math.round((event.usedKeys / event.totalKeys) * 100);
          const barColor =
            pct >= 90 ? "#EF4444" : pct >= 75 ? "#F59E0B" : "#2563EB";
          const barBg =
            pct >= 90 ? "#FEE2E2" : pct >= 75 ? "#FEF3C7" : "#DBEAFE";
          return (
            <div>
              {/* Numbers row */}
              <div className="flex items-baseline gap-1">
                <span
                  style={{
                    color: "#0F172A",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {event.usedKeys.toLocaleString()}
                </span>
                <span
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.72rem",
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  / {event.totalKeys.toLocaleString()}
                </span>
                <span
                  style={{
                    color: "#CBD5E1",
                    fontSize: "0.65rem",
                    fontFamily: '"Inter", sans-serif',
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
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  marginTop: "3px",
                }}
              >
                {pct}% used
              </p>
            </div>
          );
        })()}
      </td>

      {/* ── Actions ── */}
      <td style={{ padding: "14px 20px" }}>
        {isDeleting ? (
          /* Delete confirmation inline */
          <div className="flex items-center gap-2 justify-end">
            <span
              style={{
                color: "#DC2626",
                fontSize: "0.72rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Delete event?
            </span>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors"
              style={{
                border: "1.5px solid #E2E8F0",
                color: "#64748B",
                fontSize: "0.72rem",
                fontFamily: '"Inter", sans-serif',
                backgroundColor: "#FFFFFF",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors"
              style={{
                backgroundColor: "#EF4444",
                color: "#FFFFFF",
                fontSize: "0.72rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                border: "none",
              }}
            >
              <Trash2 className="w-3 h-3" strokeWidth={2} />
              Confirm
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 justify-end">
            {/* Manage Keys */}
            <ActionButton
              icon={<KeyRound className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Keys"
              color="#2563EB"
              bgHover="#EFF6FF"
              borderHover="#BFDBFE"
            />

            {/* Edit */}
            <ActionButton
              icon={<Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Edit"
              color="#64748B"
              bgHover="#F8FAFC"
              borderHover="#E2E8F0"
            />

            {/* More */}
            <ActionButton
              icon={<MoreHorizontal className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label=""
              color="#64748B"
              bgHover="#F8FAFC"
              borderHover="#E2E8F0"
            />

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
        )}
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────────
   ACTION BUTTON
───────────────────────────────────────────── */
function ActionButton({
  icon,
  label,
  color,
  bgHover,
  borderHover,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgHover: string;
  borderHover: string;
}) {
  return (
    <button
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

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16"
      style={{ backgroundColor: "#FAFBFC" }}
    >
      <div
        className="flex items-center justify-center rounded-2xl mb-4"
        style={{
          width: "72px",
          height: "72px",
          backgroundColor: "#F1F5F9",
          border: "2px dashed #E2E8F0",
        }}
      >
        <Trophy className="w-8 h-8" strokeWidth={1.5} style={{ color: "#CBD5E1" }} />
      </div>
      <p
        style={{
          color: "#374151",
          fontSize: "1rem",
          fontWeight: 600,
          fontFamily: '"Inter", sans-serif',
        }}
      >
        No events found
      </p>
      <p
        style={{
          color: "#94A3B8",
          fontSize: "0.82rem",
          fontFamily: '"Inter", sans-serif',
          marginTop: "4px",
        }}
      >
        Try adjusting your filters or create a new event.
      </p>
    </div>
  );
}