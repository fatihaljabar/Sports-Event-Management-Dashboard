"use client";

import { Trophy, Layers, CheckCircle2 } from "lucide-react";
import type { EventType } from "@/lib/constants/event-constants";

interface EventTypeSelectorProps {
  value: EventType;
  onChange: (type: EventType) => void;
}

const EVENT_TYPE_OPTIONS = [
  {
    id: "single" as const,
    icon: <Trophy className="w-5 h-5" strokeWidth={1.75} />,
    title: "Single Event",
    desc: "One sport, one competition window",
    badge: "Simple",
    badgeColor: "#059669",
    badgeBg: "#D1FAE5",
  },
  {
    id: "multi" as const,
    icon: <Layers className="w-5 h-5" strokeWidth={1.75} />,
    title: "Multi-Event",
    desc: "Multiple sports across a schedule",
    badge: "Complex",
    badgeColor: "#1D4ED8",
    badgeBg: "#DBEAFE",
  },
];

export function EventTypeSelector({ value, onChange }: EventTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {EVENT_TYPE_OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className="relative flex flex-col gap-2 rounded-xl p-4 text-left transition-all"
            style={{
              border: `2px solid ${active ? "#2563EB" : "#E2E8F0"}`,
              backgroundColor: active ? "#EFF6FF" : "#FAFBFC",
              boxShadow: active
                ? "0 0 0 3px rgba(37,99,235,0.08)"
                : "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FAFBFC";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
              }
            }}
          >
            {/* Checkmark */}
            <div
              className="absolute top-3 right-3 rounded-full flex items-center justify-center"
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: active ? "#2563EB" : "#E2E8F0",
                transition: "background-color 0.15s",
              }}
            >
              {active ? (
                <CheckCircle2
                  className="w-4 h-4 text-white"
                  strokeWidth={2.5}
                />
              ) : (
                <div
                  className="rounded-full"
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#CBD5E1",
                  }}
                />
              )}
            </div>

            {/* Icon */}
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: active ? "#DBEAFE" : "#F1F5F9",
                color: active ? "#2563EB" : "#64748B",
                transition: "all 0.15s",
              }}
            >
              {opt.icon}
            </div>

            <div>
              <p
                style={{
                  color: active ? "#1E40AF" : "#0F172A",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1.2,
                }}
              >
                {opt.title}
              </p>
              <p
                style={{
                  color: active ? "#3B82F6" : "#94A3B8",
                  fontSize: "0.68rem",
                  fontFamily: '"Inter", sans-serif',
                  marginTop: "3px",
                  lineHeight: 1.4,
                }}
              >
                {opt.desc}
              </p>
            </div>

            <span
              className="self-start rounded-md px-1.5 py-0.5"
              style={{
                backgroundColor: opt.badgeBg,
                color: opt.badgeColor,
                fontSize: "0.6rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {opt.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
