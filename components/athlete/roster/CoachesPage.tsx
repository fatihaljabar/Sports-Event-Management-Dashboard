"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";
import { UserRoundCheck } from "lucide-react";
import { AvatarCell } from "./AvatarCell";
import { StatusBadge } from "./StatusBadge";
import { LicenseBadge, getLicenseType } from "./LicenseBadge";
import { AddAthleteModal } from "../modals/AddAthleteModal";
import { COACHES, ALL_TEAMS, ROSTER_CONFIG, EVENT_CONFIG } from "../constants";

function formatNik(nik: string) {
  return nik.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
}

export function CoachesPage() {
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const config = ROSTER_CONFIG.coaches;

  const filtered = COACHES.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nik.includes(search);
    const matchTeam = teamFilter === "all" || c.team === teamFilter;
    return matchSearch && matchTeam;
  });

  return (
    <>
      {showModal && <AddAthleteModal onClose={() => setShowModal(false)} />}

      <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>

        {/* ── Page Title ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ backgroundColor: config.accentBg }}
            >
              <UserRoundCheck size={20} style={{ color: config.accentColor }} />
            </div>
            <div>
              <h1
                className="text-[#0a1628]"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {config.title}
              </h1>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: "12px" }}>
                {EVENT_CONFIG.sportEmoji} {EVENT_CONFIG.sportName} &nbsp;&middot;&nbsp; &#127942; {EVENT_CONFIG.eventName}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
            style={{
              backgroundColor: config.accentColor,
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            {config.addLabel}
          </button>
        </div>

        {/* ── Stats + Filter Bar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm"
            style={{ borderColor: "#f3f4f6" }}
          >
            <span className="text-gray-500" style={{ fontSize: "12px" }}>
              {config.totalLabel}:
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: config.accentColor,
              }}
            >
              {config.total}
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400" style={{ fontSize: "12px" }}>
              {config.capacity}
            </span>
          </div>

          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm"
            style={{ borderColor: "#f3f4f6" }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-gray-500" style={{ fontSize: "12px" }}>
              Verified via NIK:
            </span>
            <span
              style={{ fontSize: "13px", fontWeight: 700, color: "#15803d" }}
            >
              {config.verified}
            </span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by NIK or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 h-9 rounded-xl border bg-white text-gray-700 outline-none transition-all"
              style={{
                fontSize: "13px",
                width: "220px",
                borderColor: "#e5e7eb",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#c4b5fd";
                e.currentTarget.style.boxShadow = "0 0 0 2px #ede9fe";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Team Filter */}
          <div className="relative">
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 h-9 rounded-xl border bg-white text-gray-700 outline-none cursor-pointer transition-all"
              style={{ fontSize: "13px", borderColor: "#e5e7eb" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#c4b5fd";
                e.currentTarget.style.boxShadow = "0 0 0 2px #ede9fe";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <option value="all">Filter by Team</option>
              {ALL_TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* ── Data Table ── */}
        <div
          className="bg-white rounded-2xl border shadow-sm overflow-hidden"
          style={{ borderColor: "#f3f4f6" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    borderColor: "#f3f4f6",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <th
                    className="text-left px-5 py-3 text-gray-400 uppercase tracking-wider"
                    style={{ fontSize: "10px", fontWeight: 600 }}
                  >
                    NIK
                  </th>
                  <th
                    className="text-left px-4 py-3 text-gray-400 uppercase tracking-wider"
                    style={{ fontSize: "10px", fontWeight: 600 }}
                  >
                    Coach
                  </th>
                  <th
                    className="text-left px-4 py-3 text-gray-400 uppercase tracking-wider"
                    style={{ fontSize: "10px", fontWeight: 600 }}
                  >
                    Team / Contingent
                  </th>
                  <th
                    className="text-left px-4 py-3 text-gray-400 uppercase tracking-wider"
                    style={{ fontSize: "10px", fontWeight: 600 }}
                  >
                    License Level
                  </th>
                  <th
                    className="text-left px-4 py-3 text-gray-400 uppercase tracking-wider"
                    style={{ fontSize: "10px", fontWeight: 600 }}
                  >
                    Verification
                  </th>
                  <th
                    className="text-right px-5 py-3 text-gray-400 uppercase tracking-wider"
                    style={{ fontSize: "10px", fontWeight: 600 }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-none group transition-colors"
                    style={{
                      borderColor: "#f9fafb",
                      backgroundColor: i % 2 === 0 ? "white" : "#fafbfc",
                    }}
                  >
                    <td className="px-5 py-3.5">
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "12px",
                          color: "#475569",
                          letterSpacing: "0.05em",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {formatNik(row.nik)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <AvatarCell
                          photo={row.photo}
                          initials={row.initials}
                          color={row.color}
                          name={row.name}
                        />
                        <div>
                          <p
                            className="text-gray-800"
                            style={{ fontSize: "13px", fontWeight: 600 }}
                          >
                            {row.name}
                          </p>
                          <p className="text-gray-400" style={{ fontSize: "11px" }}>
                            {row.age} y.o.
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center"
                          style={{ backgroundColor: "#f5f3ff" }}
                        >
                          <span style={{ fontSize: "10px" }}>&#128737;</span>
                        </div>
                        <span
                          className="text-gray-600"
                          style={{ fontSize: "13px" }}
                        >
                          {row.team}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <LicenseBadge
                        label={row.license}
                        type={getLicenseType(row.license)}
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div
                        className="flex items-center justify-end gap-2 transition-opacity"
                        style={{ opacity: 0.6 }}
                      >
                        <button
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors"
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#4b5563",
                            borderColor: "#e5e7eb",
                          }}
                          onMouseEnter={(e) => {
                            const b = e.currentTarget as HTMLButtonElement;
                            b.style.backgroundColor = "#f9fafb";
                            b.style.borderColor = "#d1d5db";
                          }}
                          onMouseLeave={(e) => {
                            const b = e.currentTarget as HTMLButtonElement;
                            b.style.backgroundColor = "transparent";
                            b.style.borderColor = "#e5e7eb";
                          }}
                        >
                          <Eye size={13} />
                          View
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors"
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#dc2626",
                            borderColor: "#fee2e2",
                          }}
                          onMouseEnter={(e) => {
                            const b = e.currentTarget as HTMLButtonElement;
                            b.style.backgroundColor = "#fef2f2";
                            b.style.borderColor = "#fecaca";
                          }}
                          onMouseLeave={(e) => {
                            const b = e.currentTarget as HTMLButtonElement;
                            b.style.backgroundColor = "transparent";
                            b.style.borderColor = "#fee2e2";
                          }}
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Search
                        size={28}
                        className="mx-auto text-gray-200 mb-3"
                      />
                      <p className="text-gray-400" style={{ fontSize: "13px" }}>
                        No results found for your search.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div
            className="flex items-center justify-between px-5 py-3 border-t"
            style={{
              borderColor: "#f3f4f6",
              backgroundColor: "#f9fafb",
            }}
          >
            <span className="text-gray-400" style={{ fontSize: "12px" }}>
              Showing {filtered.length} entries
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className="w-7 h-7 rounded-lg transition-colors"
                  style={{
                    fontSize: "12px",
                    fontWeight: p === 1 ? 600 : 400,
                    backgroundColor: p === 1 ? config.accentColor : "transparent",
                    color: p === 1 ? "white" : "#9ca3af",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
