import { useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { SPORT_OPTIONS } from "@/lib/constants/event-constants";
import type { EventType } from "@/lib/constants/event-constants";

interface SportMultiSelectProps {
  selected: string[];
  eventType: EventType;
  onToggle: (id: string) => void;
}

export function SportMultiSelect({ selected, eventType, onToggle }: SportMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (id: string) => {
    onToggle(id);
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
                    handleToggle(opt.id);
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
                  onClick={() => handleToggle(opt.id)}
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
