import React from "react";
import { Calendar, Users, Award, KeyRound, TrendingUp, TrendingDown } from "lucide-react";

interface CardData {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
  accentColor: string;
  accentBg: string;
  subLabel: string;
}

const cards: CardData[] = [
  {
    label: "Active Events",
    value: "18",
    trend: "+12.0%",
    trendUp: true,
    icon: Calendar,
    accentColor: "#3B82F6",
    accentBg: "rgba(59, 130, 246, 0.15)",
    subLabel: "vs. last month",
  },
  {
    label: "Athletes",
    value: "4,287",
    trend: "+8.4%",
    trendUp: true,
    icon: Users,
    accentColor: "#4ADE80",
    accentBg: "rgba(74, 222, 128, 0.12)",
    subLabel: "registered total",
  },
  {
    label: "Medals Given",
    value: "342",
    trend: "+24.1%",
    trendUp: true,
    icon: Award,
    accentColor: "#F59E0B",
    accentBg: "rgba(245, 158, 11, 0.15)",
    subLabel: "across all events",
  },
  {
    label: "Pending Keys",
    value: "127",
    trend: "-3.2%",
    trendUp: false,
    icon: KeyRound,
    accentColor: "#A78BFA",
    accentBg: "rgba(167, 139, 250, 0.15)",
    subLabel: "awaiting issue",
  },
];

export function ScoreboardCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const TrendIcon = card.trendUp ? TrendingUp : TrendingDown;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(145deg, #0F172A 0%, #111827 50%, #0F172A 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              minHeight: "150px",
              boxShadow: "0px 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            {/* Background Glow */}
            <div
              className="absolute top-0 right-0 rounded-full pointer-events-none"
              style={{
                width: "100px",
                height: "100px",
                background: `radial-gradient(circle, ${card.accentColor}18, transparent 70%)`,
                transform: "translate(30%, -30%)",
              }}
            />

            {/* Top Row */}
            <div className="flex items-start justify-between">
              <div>
                <p
                  style={{
                    color: "#64748B",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    fontFamily: '"Inter", sans-serif',
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {card.label}
                </p>
              </div>
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  backgroundColor: card.accentBg,
                  width: "36px",
                  height: "36px",
                  border: `1px solid ${card.accentColor}25`,
                }}
              >
                <Icon
                  className="w-4 h-4"
                  strokeWidth={1.75}
                  style={{ color: card.accentColor }}
                />
              </div>
            </div>

            {/* Big Number */}
            <div className="mt-1">
              <span
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: "3rem",
                  color: "#F8FAFC",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  display: "block",
                }}
              >
                {card.value}
              </span>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center gap-1.5 mt-3">
              <div
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5"
                style={{
                  backgroundColor: card.trendUp
                    ? "rgba(74, 222, 128, 0.1)"
                    : "rgba(248, 113, 113, 0.1)",
                }}
              >
                <TrendIcon
                  className="w-3 h-3"
                  strokeWidth={2}
                  style={{ color: card.trendUp ? "#4ADE80" : "#F87171" }}
                />
                <span
                  style={{
                    color: card.trendUp ? "#4ADE80" : "#F87171",
                    fontSize: "0.7rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 500,
                  }}
                >
                  {card.trend}
                </span>
              </div>
              <span
                style={{
                  color: "#475569",
                  fontSize: "0.7rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {card.subLabel}
              </span>
            </div>

            {/* Bottom Accent Line */}
            <div
              className="absolute bottom-0 left-0 right-0 rounded-b-2xl"
              style={{
                height: "2px",
                background: `linear-gradient(90deg, transparent, ${card.accentColor}60, transparent)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
