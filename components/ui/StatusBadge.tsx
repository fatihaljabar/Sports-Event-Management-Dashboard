import React from "react";

export type EventStatus = "active" | "upcoming" | "completed" | "archived";

const STATUS_CONFIG: Record<
  EventStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  active: {
    label: "Active",
    bg: "var(--em-status-active-bg)",
    color: "var(--em-status-active-color)",
    dot: "var(--em-status-active-dot)",
  },
  upcoming: {
    label: "Upcoming",
    bg: "var(--em-status-upcoming-bg)",
    color: "var(--em-status-upcoming-color)",
    dot: "var(--em-status-upcoming-dot)",
  },
  completed: {
    label: "Completed",
    bg: "var(--em-status-completed-bg)",
    color: "var(--em-status-completed-color)",
    dot: "var(--em-status-completed-dot)",
  },
  archived: {
    label: "Archived",
    bg: "var(--em-status-archived-bg)",
    color: "var(--em-status-archived-color)",
    dot: "var(--em-status-archived-dot)",
  },
};

interface StatusBadgeProps {
  status: string; // Accept any string to handle database uppercase values
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Convert database status (uppercase) to lowercase for config lookup
  const statusKey = (status?.toLowerCase() || "upcoming") as EventStatus;
  const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.upcoming;

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.dot}22`,
      }}
    >
      <div
        className="rounded-full"
        style={{
          width: "6px",
          height: "6px",
          backgroundColor: config.dot,
          boxShadow: statusKey === "active" ? `0 0 4px ${config.dot}` : "none",
        }}
      />
      <span
        style={{
          color: config.color,
          fontSize: "0.72rem",
          fontWeight: 600,
          fontFamily: '"Inter", sans-serif',
          whiteSpace: "nowrap",
        }}
      >
        {config.label}
      </span>
    </div>
  );
}

export { STATUS_CONFIG };
