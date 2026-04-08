"use client";

import { Bell, ChevronDown, Settings } from "lucide-react";

export function AthleteTopHeader() {
  return (
    <header
      className="flex items-center justify-between h-16 px-6 bg-white border-b"
      style={{ borderColor: "#f1f5f9", fontFamily: "Inter, sans-serif" }}
    >
      {/* Left: Context Badges */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
          style={{ backgroundColor: "#eff6ff", borderColor: "#dbeafe" }}
        >
          <span style={{ fontSize: "16px" }}>&#9917;</span>
          <span
            style={{ fontSize: "13px", fontWeight: 500, color: "#1e40af" }}
          >
            Football (Men&apos;s 11v11)
          </span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
          style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a" }}
        >
          <span style={{ fontSize: "16px" }}>&#127942;</span>
          <span
            style={{ fontSize: "13px", fontWeight: 500, color: "#92400e" }}
          >
            Unesa Cup 2026
          </span>
        </div>
        <span className="text-gray-300 mx-1">|</span>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>
          Access Key:{" "}
          <span
            className="font-mono"
            style={{ fontSize: "12px", color: "#6b7280" }}
          >
            FK-2026-***
          </span>
        </span>
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#ef4444" }}
          />
        </button>

        {/* Settings */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Settings size={18} />
        </button>

        {/* Divider */}
        <div className="w-px h-8" style={{ backgroundColor: "#e5e7eb" }} />

        {/* Profile */}
        <button className="flex items-center gap-2.5 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(to bottom right, #3b82f6, #6366f1)",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>
              B
            </span>
          </div>
          <div className="text-left">
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#1f2937" }}>
              Budi
            </p>
            <p style={{ fontSize: "10px", color: "#9ca3af" }}>
              Football Committee
            </p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
