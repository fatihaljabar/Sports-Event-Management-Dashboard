"use client";

import { useState } from "react";
import { Minus, Plus, Radio, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

export function QuickMatchInput() {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const handleUpdate = () => {
    toast.success(`Score updated: Team Garuda ${homeScore} - ${awayScore} Team Elang`, {
      duration: 3000,
    });
  };

  return (
    <div
      className="bg-white rounded-xl border flex flex-col"
      style={{
        border: "1px solid #f3f4f6",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid #f9fafb" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="rounded-full animate-pulse"
            style={{ width: "8px", height: "8px", backgroundColor: "#ef4444" }}
          />
          <h3
            style={{
              fontFamily: "Barlow Condensed, sans-serif",
              fontSize: "18px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Quick Match Input
          </h3>
        </div>
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          <Radio size={12} /> LIVE
        </span>
      </div>

      {/* Match Details */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-3" style={{ fontSize: "12px", color: "#9ca3af" }}>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Group A - Match Day 3
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            Main Stadium
          </span>
        </div>
      </div>

      {/* Score Input Area */}
      <div className="flex-1 px-5 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <div
              className="mx-auto rounded-xl flex items-center justify-center mb-2"
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                boxShadow: "0 8px 24px rgba(239,68,68,0.25)",
              }}
            >
              <span style={{ fontSize: "24px" }}>&#129413;</span>
            </div>
            <p
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Team Garuda
            </p>
            <p style={{ fontSize: "11px", color: "#9ca3af" }}>Home</p>

            {/* Score Stepper */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                className="flex items-center justify-center rounded-lg transition-colors active:scale-95"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#f3f4f6",
                  color: "#4b5563",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e5e7eb";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f3f4f6";
                }}
              >
                <Minus size={16} />
              </button>
              <div
                className="flex items-center justify-center rounded-xl text-white"
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "#0a1628",
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "36px",
                  fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
              >
                {homeScore}
              </div>
              <button
                onClick={() => setHomeScore(homeScore + 1)}
                className="flex items-center justify-center rounded-lg transition-colors active:scale-95"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#dbeafe";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#eff6ff";
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center gap-1" style={{ paddingTop: "24px" }}>
            <span
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "24px",
                fontWeight: 700,
                color: "#d1d5db",
              }}
            >
              VS
            </span>
            <span style={{ fontSize: "11px", color: "#d1d5db" }}>65&apos;</span>
          </div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <div
              className="mx-auto rounded-xl flex items-center justify-center mb-2"
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #f59e0b, #b45309)",
                boxShadow: "0 8px 24px rgba(245,158,11,0.25)",
              }}
            >
              <span style={{ fontSize: "24px" }}>&#129413;</span>
            </div>
            <p
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Team Elang
            </p>
            <p style={{ fontSize: "11px", color: "#9ca3af" }}>Away</p>

            {/* Score Stepper */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                className="flex items-center justify-center rounded-lg transition-colors active:scale-95"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#f3f4f6",
                  color: "#4b5563",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e5e7eb";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f3f4f6";
                }}
              >
                <Minus size={16} />
              </button>
              <div
                className="flex items-center justify-center rounded-xl text-white"
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "#0a1628",
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "36px",
                  fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
              >
                {awayScore}
              </div>
              <button
                onClick={() => setAwayScore(awayScore + 1)}
                className="flex items-center justify-center rounded-lg transition-colors active:scale-95"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#dbeafe";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#eff6ff";
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 pb-5 pt-2">
        <button
          onClick={handleUpdate}
          className="w-full rounded-xl text-white transition-colors shadow-lg active:scale-[0.98]"
          style={{
            paddingTop: "14px",
            paddingBottom: "14px",
            backgroundColor: "#2563eb",
            fontSize: "15px",
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(37,99,235,0.2)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2563eb";
          }}
        >
          Update Live Score
        </button>
      </div>
    </div>
  );
}
