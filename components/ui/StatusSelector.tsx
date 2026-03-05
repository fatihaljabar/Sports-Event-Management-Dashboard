import type { EventStatus } from "@/lib/types/event";

const STATUS_OPTIONS: Array<{ id: EventStatus; label: string; emoji: string }> = [
  { id: "upcoming", label: "Upcoming", emoji: "📅" },
  { id: "active", label: "Active", emoji: "🔥" },
  { id: "completed", label: "Completed", emoji: "✅" },
  { id: "archived", label: "Archived", emoji: "📦" },
];

interface StatusSelectorProps {
  value: EventStatus;
  onChange: (status: EventStatus) => void;
  disabled?: boolean;
}

export function StatusSelector({ value, onChange, disabled = false }: StatusSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            disabled={disabled}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
            style={{
              border: `1.5px solid ${isActive ? "#2563EB" : "#E2E8F0"}`,
              backgroundColor: isActive ? "#EFF6FF" : "transparent",
              color: isActive ? "#1D4ED8" : "#64748B",
              fontSize: "0.75rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: isActive ? 500 : 400,
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>{option.emoji}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
