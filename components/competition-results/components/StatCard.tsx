"use client";

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  accentColor?: string;
}

export function StatCard({ icon, iconBg, label, value, sub, accentColor }: StatCardProps) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-5 py-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #F1F5F9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        flex: 1,
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{ width: "42px", height: "42px", background: iconBg }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            color: "#94A3B8",
            fontSize: "0.67rem",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 700,
            fontSize: "1.9rem",
            color: accentColor ?? "#0F172A",
            lineHeight: 1.1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            color: "#CBD5E1",
            fontSize: "0.67rem",
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
