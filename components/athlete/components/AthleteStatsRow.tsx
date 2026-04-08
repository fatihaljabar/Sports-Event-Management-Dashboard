"use client";

import { useEffect, useState } from "react";
import { Users, Swords, Clock } from "lucide-react";

const stats = [
  {
    label: "Registered Athletes",
    value: "224",
    capacity: "/ 250",
    percent: 89.6,
    icon: Users,
    color: "#2563eb",
    bgColor: "#eff6ff",
    barColor: "#3b82f6",
  },
  {
    label: "Matches Completed",
    value: "12",
    capacity: "/ 24",
    percent: 50,
    icon: Swords,
    color: "#16a34a",
    bgColor: "#f0fdf4",
    barColor: "#22c55e",
  },
  {
    label: "Pending Approvals",
    value: "3",
    capacity: "",
    percent: null,
    icon: Clock,
    color: "#ea580c",
    bgColor: "#fff7ed",
    barColor: "#f97316",
  },
];

export function AthleteStatsRow() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border transition-shadow cursor-default"
          style={{
            border: "1px solid #f3f4f6",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 4px 12px rgba(0,0,0,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 1px 3px rgba(0,0,0,0.04)";
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#6b7280",
                }}
              >
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span
                  style={{
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontSize: "32px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {stat.value}
                </span>
                {stat.capacity && (
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#9ca3af",
                    }}
                  >
                    {stat.capacity}
                  </span>
                )}
              </div>
            </div>
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: stat.bgColor,
              }}
            >
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
          </div>

          {stat.percent !== null ? (
            <div className="mt-4">
              <div
                className="rounded-full overflow-hidden"
                style={{ height: "6px", backgroundColor: "#f3f4f6" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: mounted ? `${stat.percent}%` : "0%",
                    backgroundColor: stat.barColor,
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  marginTop: "6px",
                }}
              >
                {stat.percent}% capacity filled
              </p>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-1.5">
              <div
                className="rounded-full animate-pulse"
                style={{ width: "8px", height: "8px", backgroundColor: "#fb923c" }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#ea580c",
                }}
              >
                Requires attention
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
