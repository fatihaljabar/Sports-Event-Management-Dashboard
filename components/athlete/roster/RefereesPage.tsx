"use client";

import { useState } from "react";
import { Search, ShieldCheck, Plus, Eye, Trash2, Flag } from "lucide-react";
import { AvatarCell } from "./AvatarCell";
import { StatusBadge } from "./StatusBadge";
import { AddAthleteModal } from "@/components/athlete/modals/AddAthleteModal";
import { REFEREES } from "@/components/athlete/constants";
import type { RefereeRecord } from "@/components/athlete/types";

function formatNik(nik: string) {
  return nik.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
}

function LicenseBadge({ label, type }: { label: string; type?: "fifa" | "afc" | "pssi" }) {
  const styles = {
    fifa: { bg: "#eff6ff", color: "#1d4ed8" },
    afc: { bg: "#f0fdf4", color: "#15803d" },
    pssi: { bg: "#faf5ff", color: "#7c3aed" },
  };
  const t = type ?? "pssi";
  const s = styles[t];
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full" style={{ backgroundColor: s.bg, color: s.color, fontSize: "11px", fontWeight: 600 }}>
      {label}
    </span>
  );
}

function getLicenseType(badge: string): "fifa" | "afc" | "pssi" {
  if (badge.startsWith("UEFA") || badge === "FIFA Badge") return "fifa";
  if (badge.startsWith("AFC")) return "afc";
  return "pssi";
}

export function RefereesPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = REFEREES.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.nik.includes(search)
  );

  return (
    <>
      {showModal && <AddAthleteModal onClose={() => setShowModal(false)} />}

      <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: "40px", height: "40px", backgroundColor: "#fff7ed" }}
            >
              <Flag size={20} style={{ color: "#ea580c" }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "28px", fontWeight: 700, color: "#0a1628", lineHeight: 1 }}>
                List Referee
              </h1>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                ⚽ Football (Men&apos;s 11v11) &nbsp;·&nbsp; 🏆 Unesa Cup 2026
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl text-white transition-all shadow-md active:scale-95"
            style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "10px", paddingBottom: "10px", backgroundColor: "#ea580c", fontSize: "13px", fontWeight: 600 }}
          >
            <Plus size={15} strokeWidth={2.5} />
            + Add Referee (via NIK)
          </button>
        </div>

        {/* Stats + Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm" style={{ borderColor: "#f3f4f6" }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Total Referees:</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#ea580c" }}>5</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>15</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm" style={{ borderColor: "#f3f4f6" }}>
            <ShieldCheck size={13} style={{ color: "#10b981" }} />
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Verified via NIK:</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#15803d" }}>4</span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search by NIK or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 h-9 rounded-xl border outline-none transition-all"
              style={{ width: "220px", borderColor: "#e5e7eb", backgroundColor: "#FFFFFF", fontSize: "13px", color: "#374151" }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#60a5fa"; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#e5e7eb"; (e.target as HTMLInputElement).style.boxShadow = "none"; }}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f3f4f6" }}>
                  <th className="text-left px-5 py-3 uppercase tracking-wider" style={{ fontSize: "10px", fontWeight: 600, color: "#9ca3af" }}>NIK</th>
                  <th className="text-left px-4 py-3 uppercase tracking-wider" style={{ fontSize: "10px", fontWeight: 600, color: "#9ca3af" }}>Referee</th>
                  <th className="text-left px-4 py-3 uppercase tracking-wider" style={{ fontSize: "10px", fontWeight: 600, color: "#9ca3af" }}>Role</th>
                  <th className="text-left px-4 py-3 uppercase tracking-wider" style={{ fontSize: "10px", fontWeight: 600, color: "#9ca3af" }}>Badge / License</th>
                  <th className="text-left px-4 py-3 uppercase tracking-wider" style={{ fontSize: "10px", fontWeight: 600, color: "#9ca3af" }}>Verification</th>
                  <th className="text-right px-5 py-3 uppercase tracking-wider" style={{ fontSize: "10px", fontWeight: 600, color: "#9ca3af" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row: RefereeRecord, i: number) => (
                  <tr
                    key={row.id}
                    className="transition-colors group"
                    style={{
                      borderBottom: i !== filtered.length - 1 ? "1px solid #f9fafb" : "none",
                      backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#fafbfc",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(234,88,12,0.03)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = i % 2 === 0 ? "#FFFFFF" : "#fafbfc"; }}
                  >
                    <td className="px-5 py-3.5">
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#475569", letterSpacing: "0.05em" }}>{formatNik(row.nik)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <AvatarCell photo={row.photo} initials={row.initials} color={row.color} name={row.name} />
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{row.name}</p>
                          <p style={{ fontSize: "11px", color: "#9ca3af" }}>{row.age} y.o.</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span style={{ fontSize: "13px", color: "#4b5563" }}>{row.role}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <LicenseBadge label={row.badge} type={getLicenseType(row.badge)} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors" style={{ fontSize: "12px", fontWeight: 500, borderColor: "#e5e7eb", color: "#4b5563" }}>
                          <Eye size={13} /> View
                        </button>
                        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors" style={{ fontSize: "12px", fontWeight: 500, borderColor: "#fee2e2", color: "#ef4444" }}>
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Search size={28} className="mx-auto mb-3" style={{ color: "#e5e7eb" }} />
                      <p style={{ fontSize: "13px", color: "#9ca3af" }}>No results found for your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid #f3f4f6", backgroundColor: "#f9fafb" }}>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>Showing {filtered.length} entries</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, "..."].map((p, i) => (
                <button
                  key={i}
                  className="flex items-center justify-center rounded-lg transition-colors"
                  style={{ width: "28px", height: "28px", fontSize: "12px", fontWeight: p === 1 ? 600 : 400, backgroundColor: p === 1 ? "#ea580c" : "transparent", color: p === 1 ? "#FFFFFF" : "#9ca3af" }}
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
