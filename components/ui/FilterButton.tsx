import React from "react";

interface FilterButtonProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export function FilterButton({ id, label, icon, count, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
      style={{
        backgroundColor: isActive ? "var(--em-primary-soft)" : "transparent",
        border: `1.5px solid ${isActive ? "var(--em-primary-border)" : "transparent"}`,
        color: isActive ? "var(--em-text-blue)" : "var(--em-text-muted)",
        fontSize: "0.8rem",
        fontFamily: '"Inter", sans-serif',
        fontWeight: isActive ? 600 : 400,
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--em-bg-soft)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        }
      }}
    >
      <span style={{ color: isActive ? "var(--em-primary)" : "var(--em-text-muted-light)" }}>
        {icon}
      </span>
      {label}
      <span
        style={{
          minWidth: "18px",
          height: "18px",
          padding: "0 5px",
          backgroundColor: isActive ? "var(--em-primary)" : "var(--em-bg-soft)",
          color: isActive ? "#FFFFFF" : "var(--em-text-muted-light)",
          fontSize: "0.6rem",
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "9999px",
        }}
      >
        {count}
      </span>
    </button>
  );
}
