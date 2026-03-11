import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Trophy,
  Award,
  Settings,
  Zap,
  LogOut,
  KeyRound,
} from "lucide-react";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "events", icon: Calendar, label: "Event Management" },
  { id: "participants", icon: Users, label: "Participants & Keys", badge: 3 },
  { id: "results", icon: Trophy, label: "Competition Results" },
  { id: "medals", icon: Award, label: "Medal Standings" },
  { id: "settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
}

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full flex-shrink-0"
      style={{ width: "260px", backgroundColor: "#0F172A" }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}
          >
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 700,
              fontSize: "1.35rem",
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            SportsEMS
          </span>
        </div>
        <p
          style={{
            color: "#334155",
            fontSize: "0.6rem",
            marginTop: "0.4rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Event Management System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <p
          style={{
            color: "#334155",
            fontSize: "0.62rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            paddingLeft: "0.75rem",
            marginBottom: "0.75rem",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Main Menu
        </p>
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                className="w-full flex items-center gap-3 rounded-lg text-left relative transition-all duration-150 group"
                style={{
                  padding: "0.625rem 0.75rem",
                  backgroundColor: isActive
                    ? "rgba(37, 99, 235, 0.14)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "transparent";
                }}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                    style={{
                      width: "3px",
                      height: "22px",
                      backgroundColor: "#2563EB",
                    }}
                  />
                )}
                <Icon
                  className="w-4 h-4 flex-shrink-0"
                  strokeWidth={1.75}
                  style={{ color: isActive ? "#3B82F6" : "#475569" }}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? "#F1F5F9" : "#94A3B8",
                    fontFamily: '"Inter", sans-serif',
                    flex: 1,
                  }}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: "18px",
                      height: "18px",
                      backgroundColor: "#2563EB",
                      color: "#fff",
                      fontSize: "0.6rem",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 500,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div
          className="my-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        />

        {/* System Status Card */}
        <div
          className="rounded-xl p-3 mx-1"
          style={{
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.08))",
            border: "1px solid rgba(37, 99, 235, 0.18)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: "#4ADE80",
                boxShadow: "0 0 6px #4ADE80",
              }}
            />
            <span
              style={{
                color: "#94A3B8",
                fontSize: "0.7rem",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              System Status
            </span>
            <span
              className="ml-auto"
              style={{
                color: "#4ADE80",
                fontSize: "0.65rem",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              LIVE
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span
              style={{
                color: "#475569",
                fontSize: "0.62rem",
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              v2.4.1 — 99.9% uptime
            </span>
          </div>
          <div
            className="mt-2 rounded-full overflow-hidden"
            style={{ height: "3px", backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="rounded-full h-full"
              style={{
                width: "99.9%",
                background: "linear-gradient(90deg, #2563EB, #4ADE80)",
              }}
            />
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div
        className="px-4 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              color: "#fff",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p
              style={{
                color: "#F1F5F9",
                fontSize: "0.875rem",
                fontWeight: 500,
                fontFamily: '"Inter", sans-serif',
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Alex Martinez
            </p>
            <p
              style={{
                color: "#475569",
                fontSize: "0.7rem",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Super Admin
            </p>
          </div>
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#475569" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(255,255,255,0.06)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent")
            }
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}
