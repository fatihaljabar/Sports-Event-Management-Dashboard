"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserRoundCheck,
  Flag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard",     href: "/roster" },
  { icon: Users,            label: "Athlete Roster", href: "/roster/athletes" },
  { icon: UserRoundCheck,   label: "List Coach",     href: "/roster/coaches" },
  { icon: Flag,             label: "List Referee",   href: "/roster/referees" },
];

export function AthleteSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`relative flex flex-col h-screen transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
      style={{ backgroundColor: "#0a1628", fontFamily: "Inter, sans-serif" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <img
          src="/isdn-logo/logo-sidebar.png"
          alt="ISDN Logo"
          className="shrink-0 object-contain"
          style={{ width: "36px", height: "36px" }}
        />
        {!collapsed && (
          <div className="flex flex-col">
            <span
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "0.02em",
              }}
            >
              ISDN
            </span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Entry Management
            </span>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 flex items-center justify-center rounded-full transition-all"
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: "#1e293b",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.color = "#FFFFFF";
          el.style.backgroundColor = "#2563eb";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.color = "rgba(255,255,255,0.4)";
          el.style.backgroundColor = "#1e293b";
        }}
      >
        {collapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        {!collapsed && (
          <p
            className="mb-3 px-3"
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#64748b",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Navigation
          </p>
        )}
        {menuItems.map((item) => {
          const isActive =
            item.href === "/roster"
              ? pathname === "/roster" || pathname === ""
              : pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 w-full rounded-lg transition-all duration-200 mb-1 ${
                collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: "#2563eb",
                      color: "#FFFFFF",
                      boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
                    }
                  : {
                      color: "#94a3b8",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "rgba(255,255,255,0.05)";
                  el.style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "transparent";
                  el.style.color = "#94a3b8";
                }
              }}
            >
              <item.icon size={20} className="shrink-0" />
              {!collapsed && (
                <span style={{ fontSize: "14px", fontWeight: isActive ? 500 : 400 }}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Info */}
      {!collapsed && (
        <div className="px-4 pb-5">
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p style={{ fontSize: "11px", color: "#94a3b8" }}>Access Level</p>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#FFFFFF", marginTop: "2px" }}>
              Sport Organizer
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <div
                className="rounded-full animate-pulse"
                style={{ width: "6px", height: "6px", backgroundColor: "#4ade80" }}
              />
              <span style={{ fontSize: "11px", color: "#4ade80" }}>
                Session Active
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
