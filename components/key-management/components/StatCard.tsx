import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  accent?: string;
}

export function StatCard({
  icon,
  iconBg,
  label,
  value,
  sub,
  accent,
}: StatCardProps) {
  return (
    <div
      className="rounded-2xl flex items-center gap-4 px-5 py-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #F1F5F9",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        flex: 1,
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{ width: "44px", height: "44px", background: iconBg }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p
          style={{
            color: "#94A3B8",
            fontSize: "0.7rem",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 700,
            fontSize: "1.8rem",
            color: accent ?? "#0F172A",
            lineHeight: 1.1,
            letterSpacing: "0.02em",
          }}
        >
          {value}
        </p>
        <p
          style={{
            color: "#CBD5E1",
            fontSize: "0.7rem",
            fontFamily: '"Inter", sans-serif',
            marginTop: "1px",
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}
