import React from "react";

interface CountBadgeProps {
  count: number;
  active: boolean;
}

export function CountBadge({ count, active }: CountBadgeProps) {
  return (
    <span
      className="flex items-center justify-center rounded-full"
      style={{
        minWidth: "18px",
        height: "18px",
        padding: "0 5px",
        backgroundColor: active ? "var(--em-primary)" : "var(--em-bg-soft)",
        color: active ? "#FFFFFF" : "var(--em-text-muted-light)",
        fontSize: "0.6rem",
        fontFamily: '"JetBrains Mono", monospace',
        fontWeight: 600,
      }}
    >
      {count}
    </span>
  );
}
