"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  ShieldCheck,
  Plus,
  Eye,
  Trash2,
  Users,
  UserRoundCheck,
  Flag,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { AddAthleteModal } from "@/components/athlete/components/AddAthleteModal";
import {
  ATHLETES,
  COACHES,
  REFEREES,
  TEAMS,
} from "@/components/athlete/constants";
import type {
  AthleteRecord,
  CoachRecord,
  RefereeRecord,
  RosterType,
} from "@/components/athlete/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatNik(nik: string) {
  return nik.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
}

function AvatarCell({
  photo,
  initials,
  color,
  name,
}: {
  photo: string | null;
  initials: string;
  color: string;
  name: string;
}) {
  if (photo) {
    return (
      <ImageWithFallback
        src={photo}
        alt={name}
        className="w-9 h-9 rounded-full object-cover shrink-0"
        style={{ boxShadow: "0 0 0 2px #f3f4f6" }}
      />
    );
  }
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{
        backgroundColor: color + "22",
        color,
        boxShadow: "0 0 0 2px white",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {initials}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: "Verified" | "Pending" }) {
  if (status === "Verified") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{
          backgroundColor: "#dcfce7",
          color: "#15803d",
          fontSize: "11px",
          fontWeight: 600,
        }}
      >
        <ShieldCheck size={11} strokeWidth={2.5} />
        Verified
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: "#fef9c3",
        color: "#a16207",
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      <span
        className="rounded-full"
        style={{ width: "6px", height: "6px", backgroundColor: "#f59e0b" }}
      />
      Pending
    </span>
  );
}

function LicenseBadge({
  label,
  type,
}: {
  label: string;
  type?: "fifa" | "afc" | "pssi";
}) {
  const styles = {
    fifa: { bg: "#eff6ff", color: "#1d4ed8" },
    afc: { bg: "#f0fdf4", color: "#15803d" },
    pssi: { bg: "#faf5ff", color: "#7c3aed" },
  };
  const t = type ?? "pssi";
  const s = styles[t];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: s.bg,
        color: s.color,
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

function getLicenseType(license: string): "fifa" | "afc" | "pssi" {
  if (license.startsWith("UEFA") || license === "FIFA Badge") return "fifa";
  if (license.startsWith("AFC")) return "afc";
  return "pssi";
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const rosterConfig = {
  athletes: {
    title: "Athlete Roster",
    icon: Users,
    accentColor: "#2563eb",
    accentBg: "#eff6ff",
    addLabel: "+ Add Athlete (via NIK)",
    totalLabel: "Total Athletes",
    total: 224,
    capacity: 250,
    verified: 218,
  },
  coaches: {
    title: "Coach Roster",
    icon: UserRoundCheck,
    accentColor: "#7c3aed",
    accentBg: "#faf5ff",
    addLabel: "+ Add Coach (via NIK)",
    totalLabel: "Total Coaches",
    total: 6,
    capacity: 20,
    verified: 5,
  },
  referees: {
    title: "Referee Roster",
    icon: Flag,
    accentColor: "#ea580c",
    accentBg: "#fff7ed",
    addLabel: "+ Add Referee (via NIK)",
    totalLabel: "Total Referees",
    total: 5,
    capacity: 15,
    verified: 4,
  },
};

export default function RosterPage() {
  const params = useParams();
  const type = (params.type as string) ?? "athletes";
  const rosterType: RosterType = ["athletes", "coaches", "referees"].includes(type)
    ? (type as RosterType)
    : "athletes";
  const config = rosterConfig[rosterType];

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const filteredAthletes = useMemo(
    () =>
      ATHLETES.filter((a) => {
        const matchSearch =
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.nik.includes(search);
        const matchTeam = teamFilter === "all" || a.team === teamFilter;
        return matchSearch && matchTeam;
      }),
    [search, teamFilter]
  );

  const filteredCoaches = useMemo(
    () =>
      COACHES.filter((c) => {
        const matchSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.nik.includes(search);
        const matchTeam = teamFilter === "all" || c.team === teamFilter;
        return matchSearch && matchTeam;
      }),
    [search, teamFilter]
  );

  const filteredReferees = useMemo(
    () =>
      REFEREES.filter((r) => {
        const matchSearch =
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.nik.includes(search);
        return matchSearch;
      }),
    [search]
  );

  const IconComponent = config.icon;

  return (
    <>
      {showModal && <AddAthleteModal onClose={() => setShowModal(false)} />}

      <div
        className="p-6"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* ── Page Title ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: config.accentBg,
              }}
            >
              <IconComponent
                size={20}
                style={{ color: config.accentColor }}
              />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#0a1628",
                  lineHeight: 1,
                }}
              >
                {config.title}
              </h1>
              <p
                style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}
              >
                ⚽ Football (Men&apos;s 11v11) &nbsp;·&nbsp; 🏆 Unesa Cup 2026
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl text-white transition-all shadow-md active:scale-95"
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              paddingTop: "10px",
              paddingBottom: "10px",
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
          {/* Stat Pills */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm"
            style={{ borderColor: "#f3f4f6" }}
          >
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
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
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
              {config.capacity}
            </span>
          </div>

          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm"
            style={{ borderColor: "#f3f4f6" }}
          >
            <ShieldCheck size={13} style={{ color: "#10b981" }} />
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Verified via NIK:
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#15803d",
              }}
            >
              {config.verified}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#9ca3af" }}
            />
            <input
              type="text"
              placeholder="Search by NIK or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 h-9 rounded-xl border outline-none transition-all"
              style={{
                width: "220px",
                borderColor: "#e5e7eb",
                backgroundColor: "#FFFFFF",
                fontSize: "13px",
                color: "#374151",
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#60a5fa";
                (e.target as HTMLInputElement).style.boxShadow =
                  "0 0 0 3px rgba(37,99,235,0.1)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#e5e7eb";
                (e.target as HTMLInputElement).style.boxShadow = "none";
              }}
            />
          </div>

          {/* Team Filter (not shown for referees) */}
          {rosterType !== "referees" && (
            <div className="relative">
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="appearance-none h-9 rounded-xl border px-3 outline-none transition-all cursor-pointer"
                style={{
                  borderColor: "#e5e7eb",
                  backgroundColor: "#FFFFFF",
                  fontSize: "13px",
                  color: "#374151",
                  paddingRight: "32px",
                }}
                onFocus={(e) => {
                  (e.target as HTMLSelectElement).style.borderColor = "#60a5fa";
                  (e.target as HTMLSelectElement).style.boxShadow =
                    "0 0 0 3px rgba(37,99,235,0.1)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLSelectElement).style.borderColor = "#e5e7eb";
                  (e.target as HTMLSelectElement).style.boxShadow = "none";
                }}
              >
                <option value="all">Filter by Team</option>
                {TEAMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#9ca3af" }}
              />
            </div>
          )}
        </div>

        {/* ── Data Table ── */}
        <div
          className="bg-white rounded-2xl border overflow-hidden"
          style={{
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f3f4f6" }}
                >
                  <th
                    className="text-left px-5 py-3 uppercase tracking-wider"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#9ca3af",
                    }}
                  >
                    NIK
                  </th>
                  <th
                    className="text-left px-4 py-3 uppercase tracking-wider"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#9ca3af",
                    }}
                  >
                    {rosterType === "athletes"
                      ? "Athlete"
                      : rosterType === "coaches"
                      ? "Coach"
                      : "Referee"}
                  </th>
                  {rosterType !== "referees" && (
                    <th
                      className="text-left px-4 py-3 uppercase tracking-wider"
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#9ca3af",
                      }}
                    >
                      Team / Contingent
                    </th>
                  )}
                  {rosterType === "coaches" && (
                    <th
                      className="text-left px-4 py-3 uppercase tracking-wider"
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#9ca3af",
                      }}
                    >
                      License Level
                    </th>
                  )}
                  {rosterType === "referees" && (
                    <>
                      <th
                        className="text-left px-4 py-3 uppercase tracking-wider"
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "#9ca3af",
                        }}
                      >
                        Role
                      </th>
                      <th
                        className="text-left px-4 py-3 uppercase tracking-wider"
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "#9ca3af",
                        }}
                      >
                        Badge / License
                      </th>
                    </>
                  )}
                  <th
                    className="text-left px-4 py-3 uppercase tracking-wider"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#9ca3af",
                    }}
                  >
                    Verification
                  </th>
                  <th
                    className="text-right px-5 py-3 uppercase tracking-wider"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#9ca3af",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Athletes */}
                {rosterType === "athletes" &&
                  filteredAthletes.map((row: AthleteRecord, i: number) => (
                    <tr
                      key={row.id}
                      className="transition-colors group"
                      style={{
                        borderBottom:
                          i !== filteredAthletes.length - 1
                            ? "1px solid #f9fafb"
                            : "none",
                        backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#fafbfc",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          "rgba(37,99,235,0.03)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          i % 2 === 0 ? "#FFFFFF" : "#fafbfc";
                      }}
                    >
                      <td className="px-5 py-3.5">
                        <span
                          style={{
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "12px",
                            color: "#475569",
                            letterSpacing: "0.05em",
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
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#374151",
                              }}
                            >
                              {row.name}
                            </p>
                            <p style={{ fontSize: "11px", color: "#9ca3af" }}>
                              {row.age} y.o.
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center justify-center rounded"
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "#eff6ff",
                            }}
                          >
                            <span style={{ fontSize: "10px" }}>🛡️</span>
                          </div>
                          <span
                            style={{ fontSize: "13px", color: "#4b5563" }}
                          >
                            {row.team}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div
                          className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                          <button
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors"
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              borderColor: "#e5e7eb",
                              color: "#4b5563",
                            }}
                            onMouseEnter={(e) => {
                              const el =
                                e.currentTarget as HTMLButtonElement;
                              el.style.backgroundColor = "#f9fafb";
                              el.style.borderColor = "#d1d5db";
                            }}
                            onMouseLeave={(e) => {
                              const el =
                                e.currentTarget as HTMLButtonElement;
                              el.style.backgroundColor = "transparent";
                              el.style.borderColor = "#e5e7eb";
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
                              borderColor: "#fee2e2",
                              color: "#ef4444",
                            }}
                            onMouseEnter={(e) => {
                              const el =
                                e.currentTarget as HTMLButtonElement;
                              el.style.backgroundColor = "#fef2f2";
                              el.style.borderColor = "#fecaca";
                            }}
                            onMouseLeave={(e) => {
                              const el =
                                e.currentTarget as HTMLButtonElement;
                              el.style.backgroundColor = "transparent";
                              el.style.borderColor = "#fee2e2";
                            }}
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* Coaches */}
                {rosterType === "coaches" &&
                  filteredCoaches.map((row: CoachRecord, i: number) => (
                    <tr
                      key={row.id}
                      className="transition-colors group"
                      style={{
                        borderBottom:
                          i !== filteredCoaches.length - 1
                            ? "1px solid #f9fafb"
                            : "none",
                        backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#fafbfc",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          "rgba(124,58,237,0.03)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          i % 2 === 0 ? "#FFFFFF" : "#fafbfc";
                      }}
                    >
                      <td className="px-5 py-3.5">
                        <span
                          style={{
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "12px",
                            color: "#475569",
                            letterSpacing: "0.05em",
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
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#374151",
                              }}
                            >
                              {row.name}
                            </p>
                            <p style={{ fontSize: "11px", color: "#9ca3af" }}>
                              {row.age} y.o.
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center justify-center rounded"
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "#f5f3ff",
                            }}
                          >
                            <span style={{ fontSize: "10px" }}>🛡️</span>
                          </div>
                          <span
                            style={{ fontSize: "13px", color: "#4b5563" }}
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
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors"
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              borderColor: "#e5e7eb",
                              color: "#4b5563",
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
                              borderColor: "#fee2e2",
                              color: "#ef4444",
                            }}
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* Referees */}
                {rosterType === "referees" &&
                  filteredReferees.map((row: RefereeRecord, i: number) => (
                    <tr
                      key={row.id}
                      className="transition-colors group"
                      style={{
                        borderBottom:
                          i !== filteredReferees.length - 1
                            ? "1px solid #f9fafb"
                            : "none",
                        backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#fafbfc",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          "rgba(234,88,12,0.03)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          i % 2 === 0 ? "#FFFFFF" : "#fafbfc";
                      }}
                    >
                      <td className="px-5 py-3.5">
                        <span
                          style={{
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "12px",
                            color: "#475569",
                            letterSpacing: "0.05em",
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
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#374151",
                              }}
                            >
                              {row.name}
                            </p>
                            <p style={{ fontSize: "11px", color: "#9ca3af" }}>
                              {row.age} y.o.
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span style={{ fontSize: "13px", color: "#4b5563" }}>
                          {row.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <LicenseBadge
                          label={row.badge}
                          type={getLicenseType(row.badge)}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors"
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              borderColor: "#e5e7eb",
                              color: "#4b5563",
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
                              borderColor: "#fee2e2",
                              color: "#ef4444",
                            }}
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* Empty state */}
                {((rosterType === "athletes" && filteredAthletes.length === 0) ||
                  (rosterType === "coaches" && filteredCoaches.length === 0) ||
                  (rosterType === "referees" && filteredReferees.length === 0)) && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center"
                    >
                      <Search
                        size={28}
                        className="mx-auto mb-3"
                        style={{ color: "#e5e7eb" }}
                      />
                      <p style={{ fontSize: "13px", color: "#9ca3af" }}>
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
            className="flex items-center justify-between px-5 py-3"
            style={{
              borderTop: "1px solid #f3f4f6",
              backgroundColor: "#f9fafb",
            }}
          >
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
              Showing{" "}
              {rosterType === "athletes"
                ? filteredAthletes.length
                : rosterType === "coaches"
                ? filteredCoaches.length
                : filteredReferees.length}{" "}
              entries
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, "..."].map((p, i) => (
                <button
                  key={i}
                  className="flex items-center justify-center rounded-lg transition-colors"
                  style={{
                    width: "28px",
                    height: "28px",
                    fontSize: "12px",
                    fontWeight: p === 1 ? 600 : 400,
                    backgroundColor:
                      p === 1 ? config.accentColor : "transparent",
                    color: p === 1 ? "#FFFFFF" : "#9ca3af",
                  }}
                  onMouseEnter={(e) => {
                    if (p !== 1) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "#f3f4f6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (p !== 1) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "transparent";
                    }
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
