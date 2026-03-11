import React from "react";
import { UserPlus, Award, Calendar, Key, Flag, Edit3 } from "lucide-react";

interface Activity {
  id: string;
  type: "registration" | "medal" | "event" | "key" | "result" | "update";
  title: string;
  description: string;
  timestamp: string;
  key?: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "medal",
    title: "Gold Medal Awarded",
    description: "Michael Chen — 200m Freestyle Swimming",
    timestamp: "02:14:33",
    key: "KEY-8821",
  },
  {
    id: "2",
    type: "registration",
    title: "Athlete Registered",
    description: "Sarah Johnson — Athletics, Germany",
    timestamp: "01:52:07",
    key: "KEY-4432",
  },
  {
    id: "3",
    type: "result",
    title: "Score Recorded",
    description: "9.87s — 100m Sprint Final, Berlin",
    timestamp: "01:30:45",
  },
  {
    id: "4",
    type: "key",
    title: "Access Key Generated",
    description: "Participant batch — EVT-003",
    timestamp: "01:10:22",
    key: "KEY-7751",
  },
  {
    id: "5",
    type: "update",
    title: "Event Updated",
    description: "World Athletics Championship — venue confirmed",
    timestamp: "00:48:11",
  },
  {
    id: "6",
    type: "event",
    title: "New Event Created",
    description: "Tennis Grand Slam Open — Melbourne 2026",
    timestamp: "00:15:08",
  },
];

const typeConfig = {
  medal: {
    Icon: Award,
    bg: "rgba(245,158,11,0.12)",
    color: "#F59E0B",
    border: "rgba(245,158,11,0.2)",
  },
  registration: {
    Icon: UserPlus,
    bg: "rgba(74,222,128,0.1)",
    color: "#22C55E",
    border: "rgba(74,222,128,0.2)",
  },
  result: {
    Icon: Flag,
    bg: "rgba(59,130,246,0.1)",
    color: "#3B82F6",
    border: "rgba(59,130,246,0.2)",
  },
  key: {
    Icon: Key,
    bg: "rgba(167,139,250,0.1)",
    color: "#A78BFA",
    border: "rgba(167,139,250,0.2)",
  },
  update: {
    Icon: Edit3,
    bg: "rgba(148,163,184,0.1)",
    color: "#64748B",
    border: "rgba(148,163,184,0.2)",
  },
  event: {
    Icon: Calendar,
    bg: "rgba(244,114,182,0.1)",
    color: "#EC4899",
    border: "rgba(244,114,182,0.2)",
  },
};

export function ActivityFeed() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid #F1F5F9",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid #F8FAFC" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#0F172A",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Recent Activity
            </h2>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.7rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "1px",
              }}
            >
              Live feed · Updated now
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="rounded-full"
              style={{
                width: "7px",
                height: "7px",
                backgroundColor: "#4ADE80",
                boxShadow: "0 0 6px #4ADE80",
              }}
            />
            <span
              style={{
                color: "#4ADE80",
                fontSize: "0.65rem",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 500,
              }}
            >
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          {activities.map((activity, idx) => {
            const conf = typeConfig[activity.type];
            const Icon = conf.Icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-xl p-3 transition-colors"
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.backgroundColor = "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent")
                }
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: conf.bg,
                    border: `1px solid ${conf.border}`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: conf.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      color: "#0F172A",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      fontFamily: '"Inter", sans-serif',
                      lineHeight: 1.3,
                    }}
                  >
                    {activity.title}
                  </p>
                  <p
                    style={{
                      color: "#64748B",
                      fontSize: "0.72rem",
                      fontFamily: '"Inter", sans-serif',
                      marginTop: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {activity.description}
                  </p>
                  {activity.key && (
                    <span
                      className="inline-flex items-center rounded-md mt-1"
                      style={{
                        backgroundColor: "rgba(167,139,250,0.08)",
                        color: "#7C3AED",
                        fontSize: "0.62rem",
                        fontFamily: '"JetBrains Mono", monospace',
                        padding: "1px 6px",
                        border: "1px solid rgba(167,139,250,0.15)",
                      }}
                    >
                      {activity.key}
                    </span>
                  )}
                </div>

                {/* Timestamp */}
                <span
                  style={{
                    color: "#CBD5E1",
                    fontSize: "0.65rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  {activity.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 text-center"
        style={{ borderTop: "1px solid #F8FAFC" }}
      >
        <button
          style={{
            color: "#2563EB",
            fontSize: "0.75rem",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            backgroundColor: "transparent",
            border: "none",
          }}
        >
          View all activity →
        </button>
      </div>
    </div>
  );
}
