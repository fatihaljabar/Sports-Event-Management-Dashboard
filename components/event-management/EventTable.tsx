import { Trophy } from "lucide-react";
import { EventRow } from "./EventRow";
import type { SportEvent, EventHandlers } from "./types";

interface EventTableProps {
  events: SportEvent[];
  hoveredRow: string | null;
  deleteConfirm: string | null;
  onHover: (id: string | null) => void;
  setDeleteConfirm: (id: string | null) => void;
  handlers: EventHandlers;
  isDeleting: boolean;
}

export function EventTable({
  events,
  hoveredRow,
  deleteConfirm,
  onHover,
  setDeleteConfirm,
  handlers,
  isDeleting,
}: EventTableProps) {
  const columns = [
    { label: "Event Identity", width: "32%" },
    { label: "Type", width: "13%" },
    { label: "Timeline", width: "18%" },
    { label: "Status", width: "11%" },
    { label: "Key Usage", width: "13%" },
    { label: "Actions", width: "13%", align: "right" as const },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ borderCollapse: "collapse" }}>
        {/* Head */}
        <thead>
          <tr style={{ backgroundColor: "var(--em-bg-soft)" }}>
            {columns.map((col) => (
              <th
                key={col.label}
                style={{
                  width: col.width,
                  padding: "10px 20px",
                  textAlign: col.align ?? "left",
                  borderBottom: "1.5px solid var(--em-border-light)",
                  color: "var(--em-text-muted-light)",
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
          {events.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <EmptyState />
              </td>
            </tr>
          ) : (
            events.map((event, idx) => (
              <EventRow
                key={event.id}
                event={event}
                isLast={idx === events.length - 1}
                hovered={hoveredRow === event.id}
                onHover={onHover}
                deleteConfirm={deleteConfirm}
                setDeleteConfirm={setDeleteConfirm}
                handlers={handlers}
                isDeleting={isDeleting}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

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
        <Trophy className="w-8 h-8" style={{ color: "#CBD5E1" }} strokeWidth={1.5} />
      </div>
      <p
        style={{
          color: "#374151",
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        No events found
      </p>
      <p
        style={{
          color: "#94A3B8",
          fontSize: "0.82rem",
          marginTop: "4px",
        }}
      >
        Try adjusting your filters or create a new event.
      </p>
    </div>
  );
}
