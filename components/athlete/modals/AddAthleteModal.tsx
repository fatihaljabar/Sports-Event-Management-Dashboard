"use client";

import { X, Check, ChevronDown, ShieldCheck, UserPlus } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ALL_TEAMS, ATHLETE_PHOTO } from "../constants";

interface AddAthleteModalProps {
  onClose: () => void;
}

export function AddAthleteModal({ onClose }: AddAthleteModalProps) {
  return (
    /* Backdrop */
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
        className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-5 border-b" style={{ borderColor: "#f3f4f6" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="text-[#0a1628]"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "26px",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                Register Athlete
              </h2>
              <p className="text-gray-400 mt-1" style={{ fontSize: "13px" }}>
                Enter National ID (NIK) to auto-fetch verified data.
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors mt-0.5"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">

          {/* Input Row */}
          <div>
            <label
              className="block text-gray-600 mb-1.5"
              style={{
                fontSize: "12px",
                fontWeight: 600,
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
                  className="w-full h-11 rounded-xl border-2 px-4 text-gray-800 outline-none"
                  style={{
                    borderColor: "#6ee7b7",
                    backgroundColor: "#f0fdf4",
                    fontSize: "15px",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                  }}
                />
              </div>
              {/* Success Button */}
              <button
                className="flex-shrink-0 flex items-center gap-2 px-4 h-11 rounded-xl text-white transition-colors shadow-sm"
                style={{
                  backgroundColor: "#16a34a",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                <Check size={15} strokeWidth={2.5} />
                Data Fetched
              </button>
            </div>
          </div>

          {/* Auto-Filled Result Card */}
          <div
            className="rounded-xl p-4 flex items-center gap-4 border"
            style={{
              backgroundColor: "#F8FAFC",
              borderColor: "#d1fae5",
            }}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <ImageWithFallback
                src={ATHLETE_PHOTO}
                alt="Rizky Ridho"
                className="w-20 h-20 rounded-xl object-cover shadow-md"
                style={{}}
              />
            </div>

            {/* Data */}
            <div className="flex-1 min-w-0">
              {/* Name + badge */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="text-gray-900"
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
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
                    className="text-gray-400"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    DATE OF BIRTH
                  </p>
                  <p className="text-gray-700" style={{ fontSize: "13px", fontWeight: 500 }}>
                    21 Nov 2001{" "}
                    <span className="text-gray-400" style={{ fontWeight: 400 }}>
                      (Age: 24)
                    </span>
                  </p>
                </div>
                <div>
                  <p
                    className="text-gray-400"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    GENDER
                  </p>
                  <p className="text-gray-700" style={{ fontSize: "13px", fontWeight: 500 }}>
                    Male
                  </p>
                </div>
                <div className="col-span-2 mt-0.5">
                  <p
                    className="text-gray-400"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    NIK
                  </p>
                  <p
                    className="text-gray-500"
                    style={{ fontSize: "12px", letterSpacing: "0.08em" }}
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
              className="block text-gray-600 mb-1.5"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              TEAM / CONTINGENT
            </label>
            <div className="relative">
              <select
                defaultValue="Surabaya"
                className="w-full h-11 rounded-xl border bg-white px-4 pr-9 text-gray-800 appearance-none outline-none transition-all cursor-pointer"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  borderColor: "#e5e7eb",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.boxShadow = "0 0 0 2px rgba(37,99,235,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="" disabled>
                  Select Team / Contingent
                </option>
                {ALL_TEAMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-6 pt-1">
          <button
            className="w-full h-12 rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
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
