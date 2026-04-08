"use client";

interface MedalBadgeProps {
  count: number;
  type: "gold" | "silver" | "bronze";
}

const cfg = {
  gold:   { emoji: "🥇", bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
  silver: { emoji: "🥈", bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" },
  bronze: { emoji: "🥉", bg: "#FFF7ED", text: "#78350F", border: "#FED7AA" },
};

export function MedalBadge({ count, type }: MedalBadgeProps) {
  const c = cfg[type];
  return (
    <div className="flex items-center gap-1.5 justify-center">
      <div
        className="flex items-center justify-center rounded-xl px-3 py-1.5"
        style={{
          backgroundColor: c.bg,
          border: `1.5px solid ${c.border}`,
          minWidth: "48px",
        }}
      >
        <span
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 700,
            fontSize: "1.25rem",
            color: count === 0 ? "#CBD5E1" : c.text,
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          {count}
        </span>
      </div>
    </div>
  );
}
