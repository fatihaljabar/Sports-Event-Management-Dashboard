"use client";

import { EVENT_CONFIG } from "../constants";

export function WelcomeBanner() {
  const today = new Date();
  const timeStr = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = today.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="rounded-xl p-6 mb-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(to right, #0a1628, #1e3a5f)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/4"
        style={{ backgroundColor: "rgba(59,130,246,0.1)" }}
      />
      <div
        className="absolute bottom-0 right-32 w-32 h-32 rounded-full translate-y-1/2"
        style={{ backgroundColor: "rgba(96,165,250,0.1)" }}
      />
      <div className="relative flex items-center justify-between">
        <div>
          <h1
            className="text-white mb-1"
            style={{
              fontFamily: "Barlow Condensed, sans-serif",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            {EVENT_CONFIG.eventName}
          </h1>
          <p
            className="text-blue-200/70"
            style={{ fontSize: "14px", color: "rgba(191,219,254,0.7)" }}
          >
            Football Committee Roster Management. Register and manage athletes,
            coaches, and referees for {EVENT_CONFIG.eventName}.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <div className="text-right">
            <p style={{ fontSize: "11px", color: "#93c5fd" }}>Current Time</p>
            <p
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "22px",
                fontWeight: 600,
                color: "white",
              }}
            >
              {timeStr}
            </p>
          </div>
          <div
            className="w-px h-10"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          />
          <div className="text-right">
            <p style={{ fontSize: "11px", color: "#93c5fd" }}>Date</p>
            <p
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "22px",
                fontWeight: 600,
                color: "white",
              }}
            >
              {dateStr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
