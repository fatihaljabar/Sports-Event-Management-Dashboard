"use client";

import { Bell, ChevronDown, Settings } from "lucide-react";

export function AthleteTopHeader() {
  return (
    <header
      className="flex items-center justify-between h-16 px-6 bg-white border-b"
      style={{ borderColor: "#f3f4f6", fontFamily: "Inter, sans-serif" }}
    >
      {/* Left: Context Badges */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "#eff6ff", border: "1px solid #dbeafe" }}
        >
          <span style={{ fontSize: "16px" }}>&#9917;</span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#1e40af",
            }}
          >
            Football (Men&apos;s 11v11)
          </span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}
        >
          <span style={{ fontSize: "16px" }}>&#127942;</span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#92400e",
            }}
          >
            Unesa Cup 2026
          </span>
        </div>
        <span style={{ color: "#d1d5db", marginLeft: "4px", marginRight: "4px" }}>
          |
        </span>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>
          Access Key:{" "}
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              color: "#6b7280",
            }}
          >
            FK-2026-***
          </span>
        </span>
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{ width: "36px", height: "36px", color: "#9ca3af" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "#f9fafb";
            el.style.color = "#374151";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "transparent";
            el.style.color = "#9ca3af";
          }}
        >
          <Bell size={18} />
          <span
            className="absolute rounded-full"
            style={{
              top: "6px",
              right: "6px",
              width: "8px",
              height: "8px",
              backgroundColor: "#ef4444",
              boxShadow: "0 0 0 2px white",
            }}
          />
        </button>

        {/* Settings */}
        <button
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{ width: "36px", height: "36px", color: "#9ca3af" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "#f9fafb";
            el.style.color = "#374151";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "transparent";
            el.style.color = "#9ca3af";
          }}
        >
          <Settings size={18} />
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "32px", backgroundColor: "#e5e7eb" }} />

        {/* Profile */}
        <button
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>
              B
            </span>
          </div>
          <div className="text-left">
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#1f2937" }}>
              Budi
            </p>
            <p style={{ fontSize: "10px", color: "#9ca3af" }}>Football Committee</p>
          </div>
          <ChevronDown size={14} style={{ color: "#9ca3af" }} />
        </button>
      </div>
    </header>
  );
}
