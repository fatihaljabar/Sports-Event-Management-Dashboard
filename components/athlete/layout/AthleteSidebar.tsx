"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ATHLETE_NAV_ITEMS } from "../constants";

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
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#2563eb] shrink-0 overflow-hidden"
        >
          <img
            src="/isdn-logo/logo-sidebar.png"
            alt="ISDN"
            className="w-7 h-7 object-contain"
          />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span
              className="text-white tracking-wide"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              ISDN
            </span>
            <span
              className="text-[#64748b]"
              style={{ fontSize: "11px" }}
            >
              Entry Management
            </span>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 flex items-center justify-center w-6 h-6 rounded-full border text-white/60 hover:text-white hover:bg-[#2563eb] transition-colors"
        style={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)" }}
      >
        {collapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {!collapsed && (
          <p
            className="px-3 mb-3 uppercase tracking-widest"
            style={{ fontSize: "10px", fontWeight: 600, color: "#64748b" }}
          >
            Navigation
          </p>
        )}
        {ATHLETE_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/roster"
              ? pathname === "/roster" || pathname === "/roster/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 w-full rounded-lg transition-all duration-200 ${
                collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
              } ${
                isActive
                  ? "text-white shadow-lg"
                  : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: "#2563eb",
                      boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
                    }
                  : undefined
              }
            >
              <item.icon
                size={20}
                className="shrink-0"
                style={isActive ? { color: "white" } : undefined}
              />
              {!collapsed && (
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
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
            className="rounded-lg p-3 border"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <p style={{ fontSize: "11px", color: "#94a3b8" }}>Access Level</p>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "white", marginTop: "2px" }}>
              Sport Organizer
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "#4ade80" }}
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
