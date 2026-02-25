import React, { useState, useMemo } from "react";
import { MapPin, Search, Filter, Edit2, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { useEvents } from "@/lib/stores/event-store";

type EventStatus = "Active" | "Upcoming" | "Scheduled" | "Completed";

interface SportEvent {
  id: string;
  name: string;
  location: string;
  country: string;
  sport: string;
  sportEmoji: string;
  date: string;
  status: EventStatus;
  athletes: number;
}

const statusConfig: Record<EventStatus, { bg: string; color: string; dot: string }> = {
  Active: { bg: "#DCFCE7", color: "#15803D", dot: "#22C55E" },
  Upcoming: { bg: "#DBEAFE", color: "#1D4ED8", dot: "#3B82F6" },
  Scheduled: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  Completed: { bg: "#F1F5F9", color: "#475569", dot: "#94A3B8" },
};

const filterTabs = ["All", "Active", "Upcoming", "Scheduled", "Completed"];

export function EventsTable() {
  const { events } = useEvents();
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Convert events from database to the format expected by this component
  const convertedEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.map((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      // Format date range
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const dateStr = `${months[startDate.getMonth()]} ${startDate.getDate()} – ${endDate.getDate()} ${months[endDate.getMonth()]}, ${endDate.getFullYear()}`;

      // Determine status based on dates
      let status: EventStatus = "Scheduled";
      if (today >= startDate && today <= endDate) {
        status = "Active";
      } else if (today < startDate) {
        status = "Upcoming";
      } else if (today > endDate) {
        status = "Completed";
      }

      // Extract country from location
      const parts = event.location.city.split(", ");
      const country = parts.length > 1 ? parts[parts.length - 1].trim() : "Indonesia";
      const city = parts[0];

      return {
        id: event.id,
        name: event.name,
        location: city,
        country,
        sport: event.sports[0]?.label || "Multi-sport",
        sportEmoji: event.sports[0]?.emoji || "🏆",
        date: dateStr,
        status,
        athletes: event.maxParticipants,
      };
    });
  }, [events]);

  const filtered =
    activeFilter === "All"
      ? convertedEvents
      : convertedEvents.filter((e) => e.status === activeFilter);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col)
      return <ChevronUp className="w-3 h-3 opacity-20" strokeWidth={2} />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" style={{ color: "#2563EB" }} strokeWidth={2} />
    ) : (
      <ChevronDown className="w-3 h-3" style={{ color: "#2563EB" }} strokeWidth={2} />
    );
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid #F1F5F9",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 pt-5 pb-4"
        style={{ borderBottom: "1px solid #F8FAFC" }}
      >
        <div className="flex items-center gap-3">
          <div>
            <h2
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#0F172A",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Active Events
            </h2>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.75rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "1px",
              }}
            >
              Tracking {events.length} events worldwide
            </p>
          </div>
          <span
            className="rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
              fontSize: "0.7rem",
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 500,
              padding: "2px 10px",
              border: "1px solid #BFDBFE",
            }}
          >
            {filtered.length} shown
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
            style={{
              border: "1.5px solid #E2E8F0",
              color: "#64748B",
              fontSize: "0.75rem",
              fontFamily: '"Inter", sans-serif',
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
            }
          >
            <Filter className="w-3.5 h-3.5" strokeWidth={1.75} />
            Filter
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
            style={{
              border: "1.5px solid #E2E8F0",
              color: "#64748B",
              fontSize: "0.75rem",
              fontFamily: '"Inter", sans-serif',
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
            }
          >
            <Search className="w-3.5 h-3.5" strokeWidth={1.75} />
            Search
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex items-center gap-1 px-6 py-2.5"
        style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}
      >
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className="rounded-lg px-3 py-1 transition-all"
            style={{
              fontSize: "0.75rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: activeFilter === tab ? 500 : 400,
              color: activeFilter === tab ? "#2563EB" : "#94A3B8",
              backgroundColor:
                activeFilter === tab ? "#EFF6FF" : "transparent",
              border:
                activeFilter === tab
                  ? "1px solid #BFDBFE"
                  : "1px solid transparent",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#FAFBFC" }}>
              {[
                { key: "name", label: "Event Name" },
                { key: "location", label: "Location" },
                { key: "sport", label: "Sport" },
                { key: "date", label: "Date" },
                { key: "athletes", label: "Athletes" },
                { key: "status", label: "Status" },
                { key: "actions", label: "Actions" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left"
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  {col.key !== "actions" ? (
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort(col.key)}
                    >
                      <span
                        style={{
                          color: "#64748B",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        {col.label}
                      </span>
                      <SortIcon col={col.key} />
                    </button>
                  ) : (
                    <span
                      style={{
                        color: "#64748B",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {col.label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((event, idx) => {
              const st = statusConfig[event.status];
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={event.id}
                  className="transition-colors"
                  style={{
                    backgroundColor: isEven ? "#FFFFFF" : "#FAFBFC",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                      "#F0F7FF")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                      isEven ? "#FFFFFF" : "#FAFBFC")
                  }
                >
                  {/* Event Name */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div>
                      <p
                        style={{
                          color: "#0F172A",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        {event.name}
                      </p>
                      <p
                        style={{
                          color: "#94A3B8",
                          fontSize: "0.7rem",
                          fontFamily: '"JetBrains Mono", monospace',
                          marginTop: "2px",
                        }}
                      >
                        {event.id}
                      </p>
                    </div>
                  </td>

                  {/* Location */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div className="flex items-center gap-1.5">
                      <MapPin
                        className="w-3.5 h-3.5 flex-shrink-0"
                        strokeWidth={1.75}
                        style={{ color: "#94A3B8" }}
                      />
                      <div>
                        <span
                          style={{
                            color: "#374151",
                            fontSize: "0.8rem",
                            fontFamily: '"Inter", sans-serif',
                          }}
                        >
                          {event.location}
                        </span>
                        <span
                          style={{
                            color: "#94A3B8",
                            fontSize: "0.7rem",
                            fontFamily: '"Inter", sans-serif',
                            display: "block",
                          }}
                        >
                          {event.country}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Sport */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "1.1rem" }}>{event.sportEmoji}</span>
                      <span
                        style={{
                          color: "#374151",
                          fontSize: "0.8rem",
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        {event.sport}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span
                      style={{
                        color: "#64748B",
                        fontSize: "0.75rem",
                        fontFamily: '"JetBrains Mono", monospace',
                        whiteSpace: "nowrap",
                      }}
                    >
                      {event.date}
                    </span>
                  </td>

                  {/* Athletes */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span
                      style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#0F172A",
                      }}
                    >
                      {event.athletes.toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span
                      className="flex items-center gap-1.5 rounded-full w-fit"
                      style={{
                        backgroundColor: st.bg,
                        color: st.color,
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        fontFamily: '"Inter", sans-serif',
                        padding: "3px 10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="rounded-full"
                        style={{
                          width: "6px",
                          height: "6px",
                          backgroundColor: st.dot,
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      {event.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all"
                        style={{
                          border: "1.5px solid #E2E8F0",
                          color: "#2563EB",
                          fontSize: "0.72rem",
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 500,
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EFF6FF";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#BFDBFE";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                        }}
                      >
                        <Edit2 className="w-3 h-3" strokeWidth={2} />
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all"
                        style={{
                          border: "1.5px solid #E2E8F0",
                          color: "#64748B",
                          fontSize: "0.72rem",
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 500,
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                        }}
                      >
                        <Eye className="w-3 h-3" strokeWidth={2} />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{ borderTop: "1px solid #F1F5F9" }}
      >
        <p
          style={{
            color: "#94A3B8",
            fontSize: "0.75rem",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Showing {filtered.length} of {events.length} events
        </p>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className="rounded flex items-center justify-center transition-colors"
              style={{
                width: "28px",
                height: "28px",
                fontSize: "0.75rem",
                fontFamily: '"JetBrains Mono", monospace',
                backgroundColor: p === 1 ? "#2563EB" : "transparent",
                color: p === 1 ? "#fff" : "#94A3B8",
                border: p === 1 ? "none" : "1px solid #E2E8F0",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
