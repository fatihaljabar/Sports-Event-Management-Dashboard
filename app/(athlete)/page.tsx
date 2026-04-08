"use client";

import { Zap } from "lucide-react";
import { AthleteStatsRow } from "@/components/athlete/components/AthleteStatsRow";
import { AthleteRecentRegistrations } from "@/components/athlete/components/AthleteRecentRegistrations";

export default function AthleteDashboardPage() {
  return (
    <div className="p-6">
      {/* Welcome Banner */}
      <div
        className="rounded-xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute rounded-full"
          style={{
            top: "0",
            right: "0",
            width: "256px",
            height: "256px",
            backgroundColor: "rgba(59,130,246,0.1)",
            transform: "translateY(-50%) translateX(25%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "0",
            right: "128px",
            width: "128px",
            height: "128px",
            backgroundColor: "rgba(96,165,250,0.1)",
            transform: "translateY(50%)",
          }}
        />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} style={{ color: "#fbbf24" }} />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#93c5fd",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Command Center
              </span>
            </div>
            <h1
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "28px",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: "4px",
                lineHeight: 1,
              }}
            >
              Welcome, Football Committee.
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(147,197,253,0.7)",
              }}
            >
              Your command center is ready. Manage athletes, update scores, and
              track results in real-time.
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
                  color: "#FFFFFF",
                }}
              >
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
            <div
              style={{ width: "1px", height: "40px", backgroundColor: "rgba(255,255,255,0.1)" }}
            />
            <div className="text-right">
              <p style={{ fontSize: "11px", color: "#93c5fd" }}>Date</p>
              <p
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                }}
              >
                06 Apr 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      <AthleteStatsRow />

      <div className="mt-4">
        <AthleteRecentRegistrations />
      </div>
    </div>
  );
}
