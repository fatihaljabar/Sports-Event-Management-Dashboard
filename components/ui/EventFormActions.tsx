"use client";

import { Trophy } from "lucide-react";

interface EventFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function EventFormActions({
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Create Event",
}: EventFormActionsProps) {
  return (
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
          onClick={onCancel}
          type="button"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all"
          style={{
            border: "1.5px solid #E2E8F0",
            color: "#64748B",
            fontSize: "0.84rem",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            backgroundColor: "transparent",
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
          }}
        >
          Cancel
        </button>

        <button
          onClick={onSubmit}
          type="button"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            color: "#FFFFFF",
            fontSize: "0.84rem",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            boxShadow: "0px 4px 16px rgba(37,99,235,0.35)",
            border: "none",
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              (e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg, #1D4ED8, #1E40AF)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0px 6px 20px rgba(37,99,235,0.45)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "linear-gradient(135deg, #2563EB, #1D4ED8)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0px 4px 16px rgba(37,99,235,0.35)";
          }}
        >
          <Trophy className="w-4 h-4" strokeWidth={2} />
          {isSubmitting ? "Creating..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
