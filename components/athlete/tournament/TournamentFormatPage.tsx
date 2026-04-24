"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  X,
  ArrowRight,
  Swords,
  RefreshCcw,
  Repeat2,
  Layers,
  Network,
  Shuffle,
  Check,
  Trophy,
} from "lucide-react";

type FormatId =
  | "single-elim"
  | "double-elim"
  | "single-rr"
  | "double-rr"
  | "group-knockout"
  | "swiss";

interface FormatCard {
  id: FormatId;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

interface Category {
  label: string;
  accent: string;
  cards: FormatCard[];
}

const CATEGORIES: Category[] = [
  {
    label: "KNOCKOUT SYSTEMS",
    accent: "#dc2626",
    cards: [
      {
        id: "single-elim",
        title: "Single Elimination",
        subtitle: "Quick, winner-takes-all format.",
        icon: Swords,
      },
      {
        id: "double-elim",
        title: "Double Elimination",
        subtitle: "Includes a losers' bracket for a second chance.",
        icon: RefreshCcw,
      },
    ],
  },
  {
    label: "LEAGUE SYSTEMS",
    accent: "#059669",
    cards: [
      {
        id: "single-rr",
        title: "Single Round-Robin",
        subtitle: "Every team plays each other once.",
        icon: Repeat2,
      },
      {
        id: "double-rr",
        title: "Double Round-Robin",
        subtitle: "Home and away league format.",
        icon: Layers,
      },
    ],
  },
  {
    label: "HYBRID & PRO",
    accent: "#7c3aed",
    cards: [
      {
        id: "group-knockout",
        title: "Group Stage + Knockout",
        subtitle: "Groups followed by a final bracket.",
        icon: Network,
      },
      {
        id: "swiss",
        title: "Swiss System",
        subtitle: "Modern skill-based matching, no early elimination.",
        icon: Shuffle,
      },
    ],
  },
];

function FormatCardButton({
  card,
  accent,
  active,
  onSelect,
}: {
  card: FormatCard;
  accent: string;
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = card.icon;
  return (
    <button
      onClick={onSelect}
      className="text-left rounded-xl transition-all flex flex-col gap-3 h-full"
      style={{
        padding: "18px",
        backgroundColor: active ? "#eff6ff" : "#ffffff",
        border: `2px solid ${active ? "#2563eb" : "#e5e7eb"}`,
        boxShadow: active ? "0 0 0 4px rgba(37,99,235,0.08)" : "none",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: "42px",
            height: "42px",
            backgroundColor: `${accent}14`,
            border: `1px solid ${accent}30`,
          }}
        >
          <Icon size={20} strokeWidth={1.75} style={{ color: accent } as React.CSSProperties} />
        </div>
        <div
          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all"
          style={{
            border: `2px solid ${active ? "#2563eb" : "#cbd5e1"}`,
            backgroundColor: active ? "#2563eb" : "transparent",
          }}
        >
          {active && <Check size={11} className="text-white" strokeWidth={3} />}
        </div>
      </div>
      <div>
        <h3
          className="text-[#0f172a] mb-1"
          style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "17px", fontWeight: 700, lineHeight: 1.15 }}
        >
          {card.title}
        </h3>
        <p className="text-[#64748b]" style={{ fontSize: "12.5px", lineHeight: 1.5 }}>
          {card.subtitle}
        </p>
      </div>
    </button>
  );
}

export function TournamentFormatPage() {
  const [selected, setSelected] = useState<FormatId | null>(null);
  const router = useRouter();

  return (
    <div
      className="p-6 lg:p-8 min-h-screen bg-[#f8fafc]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-7 py-6 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#eff6ff]">
              <Trophy size={20} className="text-[#2563eb]" />
            </div>
            <div>
              <h1
                className="text-[#0f172a]"
                style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "26px", fontWeight: 700, lineHeight: 1.15 }}
              >
                Tournament Format Selection
              </h1>
              <p className="text-[#64748b] mt-0.5" style={{ fontSize: "13px" }}>
                Choose the competition structure before generating the draw.
              </p>
            </div>
          </div>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569] transition-colors"
            onClick={() => setSelected(null)}
            aria-label="Reset"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-7">
          {CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-1 h-4 rounded-full"
                  style={{ backgroundColor: cat.accent }}
                />
                <h2
                  className="text-[#0f172a]"
                  style={{
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  {cat.label}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.cards.map((card) => (
                  <FormatCardButton
                    key={card.id}
                    card={card}
                    accent={cat.accent}
                    active={selected === card.id}
                    onSelect={() => setSelected(card.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-7 py-4 border-t border-[#f1f5f9] bg-[#fafbfc]">
          <p className="text-[#94a3b8]" style={{ fontSize: "12px" }}>
            {selected ? "Format selected — ready to continue." : "Select a format to continue."}
          </p>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSelected(null)}
              className="px-5 h-11 rounded-lg border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              Cancel
            </button>
            <button
              disabled={!selected}
              onClick={() => selected && router.push("/tournament-draw")}
              className="inline-flex items-center gap-2 px-5 h-11 rounded-lg text-white transition-all active:scale-[0.98]"
              style={{
                background: selected
                  ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
                  : "linear-gradient(135deg,#cbd5e1,#94a3b8)",
                fontSize: "13.5px",
                fontWeight: 600,
                fontFamily: "Barlow Condensed, sans-serif",
                letterSpacing: "0.04em",
                cursor: selected ? "pointer" : "not-allowed",
                boxShadow: selected ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
              }}
            >
              Continue to Draw <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}