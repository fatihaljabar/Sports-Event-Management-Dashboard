"use client";

import { useState } from "react";
import { X, Check, ChevronDown, ShieldCheck, UserPlus } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ATHLETE_REGISTRATION_PHOTO, TEAMS } from "../constants";

interface AddAthleteModalProps {
  onClose: () => void;
}

export function AddAthleteModal({ onClose }: AddAthleteModalProps) {
  const [team, setTeam] = useState("Surabaya");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(10, 22, 40, 0.65)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Card */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-lg flex flex-col overflow-hidden"
        style={{
          boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
          fontFamily: "Inter, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="px-6 pt-6 pb-5"
          style={{ borderBottom: "1px solid #f3f4f6" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#0a1628",
                  lineHeight: 1.1,
                }}
              >
                Register Athlete
              </h2>
              <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
                Enter National ID (NIK) to auto-fetch verified data.
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 flex items-center justify-center rounded-lg transition-colors mt-0.5"
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e5e7eb";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f3f4f6";
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div
          className="px-6 py-5 flex flex-col gap-5 overflow-y-auto"
          style={{ maxHeight: "calc(92vh - 200px)" }}
        >
          {/* Input Row */}
          <div>
            <label
              className="block mb-1.5"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#4b5563",
                letterSpacing: "0.04em",
              }}
            >
              NATIONAL ID (NIK)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value="3578012345678901"
                  className="w-full h-11 rounded-xl px-4 text-gray-800 outline-none"
                  style={{
                    border: "2px solid #34d399",
                    backgroundColor: "rgba(52,211,153,0.05)",
                    fontSize: "15px",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                  }}
                />
              </div>
              <button
                className="flex-shrink-0 flex items-center gap-2 h-11 rounded-xl text-white transition-colors"
                style={{
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  backgroundColor: "#16a34a",
                  fontSize: "13px",
                  fontWeight: 600,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Check size={15} strokeWidth={2.5} />
                Data Fetched
              </button>
            </div>
          </div>

          {/* Auto-Filled Result Card */}
          <div
            className="rounded-xl p-4 flex items-center gap-4"
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid #d1fae5",
            }}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <ImageWithFallback
                src={ATHLETE_REGISTRATION_PHOTO}
                alt="Rizky Ridho"
                className="w-20 h-20 rounded-xl object-cover shadow-md"
                style={{ boxShadow: "0 0 0 2px #ffffff" }}
              />
            </div>

            {/* Data */}
            <div className="flex-1 min-w-0">
              {/* Name + badge */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#111827",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Rizky Ridho
                </span>
              </div>

              {/* Verification badge */}
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mb-2.5"
                style={{
                  backgroundColor: "#dcfce7",
                  color: "#15803d",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={12} strokeWidth={2.5} />
                Verified via National Database
              </span>

              {/* Fields */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      letterSpacing: "0.05em",
                    }}
                  >
                    DATE OF BIRTH
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                    21 Nov 2001{" "}
                    <span style={{ fontWeight: 400, color: "#9ca3af" }}>(Age: 24)</span>
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      letterSpacing: "0.05em",
                    }}
                  >
                    GENDER
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                    Male
                  </p>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      letterSpacing: "0.05em",
                      marginTop: "2px",
                    }}
                  >
                    NIK
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      letterSpacing: "0.08em",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    3578 — 0123 — 4567 — 8901
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Assignment */}
          <div>
            <label
              className="block mb-1.5"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#4b5563",
                letterSpacing: "0.04em",
              }}
            >
              TEAM / CONTINGENT
            </label>
            <div className="relative">
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full h-11 rounded-xl border px-4 appearance-none outline-none text-gray-800 transition-all cursor-pointer"
                style={{
                  borderColor: "#e5e7eb",
                  backgroundColor: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 500,
                  paddingRight: "36px",
                }}
                onFocus={(e) => {
                  (e.target as HTMLSelectElement).style.borderColor = "#2563eb";
                  (e.target as HTMLSelectElement).style.boxShadow =
                    "0 0 0 3px rgba(37,99,235,0.1)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLSelectElement).style.borderColor = "#e5e7eb";
                  (e.target as HTMLSelectElement).style.boxShadow = "none";
                }}
              >
                <option value="" disabled>Select Team / Contingent</option>
                {TEAMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#9ca3af" }}
              />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-6 pt-1">
          <button
            className="w-full h-12 rounded-xl text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "Barlow Condensed, sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            <UserPlus size={17} strokeWidth={2.2} />
            Add to Football Roster
          </button>
        </div>
      </div>
    </div>
  );
}
