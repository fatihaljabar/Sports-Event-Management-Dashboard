"use client";

import type { PodiumAthlete } from "../types";

interface PodiumCellProps {
  rank: "gold" | "silver" | "bronze";
  athlete: PodiumAthlete | null;
  emoji: string;
}

export function PodiumCell({ rank, athlete, emoji }: PodiumCellProps) {
  if (!athlete) {
    return (
      <span
        style={{
          color: "#CBD5E1",
          fontSize: "0.72rem",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        —
      </span>
    );
  }
  const isGold = rank === "gold";
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ fontSize: "0.9rem", lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
      <span style={{ fontSize: "1.05rem", lineHeight: 1, flexShrink: 0 }}>{athlete.flag}</span>
      <div>
        <p
          style={{
            color: isGold ? "#0F172A" : "#374151",
            fontSize: "0.78rem",
            fontWeight: isGold ? 700 : 500,
            fontFamily: '"Inter", sans-serif',
            whiteSpace: "nowrap",
          }}
        >
          {athlete.name}
        </p>
        <p
          style={{
            color: "#CBD5E1",
            fontSize: "0.62rem",
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: "0.03em",
          }}
        >
          {athlete.country}
        </p>
      </div>
    </div>
  );
}
