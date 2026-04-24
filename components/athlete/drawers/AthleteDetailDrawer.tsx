"use client";

import { X, Pencil, CheckCircle2, Trash2, History } from "lucide-react";

export type ProfileRole = "athlete" | "coach" | "referee";

export interface AthleteDetailData {
  name: string;
  nik: string;
  initials: string;
  avatarColor: string;
  avatarPhoto?: string | null;
  verified?: boolean;
  dob?: string;
  age?: number;
  role?: ProfileRole;
  position?: string;
  jerseyNumber?: number | string;
  licenseLevel?: string;
  coachRole?: string;
  refereeRole?: string;
  badge?: string;
  team?: string;
  placeOfBirth?: string;
  gender?: string;
  religion?: string;
  address?: string;
  maritalStatus?: string;
  occupation?: string;
  citizenship?: string;
}

function DataField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[#94a3b8] mb-1" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
        {label}
      </p>
      <p
        className="text-[#0f172a]"
        style={{
          fontSize: mono ? "13px" : "13.5px",
          fontWeight: 500,
          fontFamily: mono ? "JetBrains Mono, monospace" : "Inter, sans-serif",
          letterSpacing: mono ? "0.06em" : undefined,
          lineHeight: 1.5,
        }}
      >
        {value}
      </p>
    </div>
  );
}

export function AthleteDetailDrawer({
  athlete,
  onClose,
}: {
  athlete: AthleteDetailData;
  onClose: () => void;
}) {
  const {
    placeOfBirth = "Surabaya",
    gender = "Laki-laki",
    religion = "Islam",
    address = "Jl. Raya Mulyosari No.10, Surabaya",
    maritalStatus = "Belum Kawin",
    occupation,
    citizenship = "WNI",
    dob = "21 Nov 2001",
    age = 24,
    position,
    jerseyNumber,
    licenseLevel,
    coachRole,
    refereeRole,
    badge,
    team,
    role = "athlete",
  } = athlete;

  const titleMap: Record<ProfileRole, string> = {
    athlete: "Athlete Profile Detail",
    coach: "Coach Profile Detail",
    referee: "Referee Profile Detail",
  };
  const occupationDefault =
    role === "coach" ? "Coach" : role === "referee" ? "Referee" : "Athlete";
  const effectiveOccupation = occupation ?? occupationDefault;

  const formattedNik = athlete.nik.replace(/\s+/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").trim();

  return (
    <div className="fixed inset-0 z-50" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0f172a]/40" onClick={onClose} />

      {/* Drawer */}
      <aside
        className="absolute top-0 right-0 h-full w-full max-w-[460px] bg-white shadow-2xl flex flex-col"
        style={{ animation: "slideInRight 0.25s ease-out" }}
      >
        <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
          <h2
            className="text-[#0f172a]"
            style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "20px", fontWeight: 700 }}
          >
            {titleMap[role]}
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] transition-colors"
              style={{ fontSize: "12px", fontWeight: 500 }}
            >
              <Pencil size={13} /> Edit Details
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile */}
          <div className="flex flex-col items-center px-6 pt-6 pb-5 border-b border-[#f1f5f9]">
            {athlete.avatarPhoto ? (
              <img
                src={athlete.avatarPhoto}
                alt={athlete.name}
                className="w-24 h-24 rounded-full object-cover mb-3 ring-4 ring-[#eff6ff]"
              />
            ) : (
              <div
                className="flex items-center justify-center w-24 h-24 rounded-full text-white mb-3 shrink-0 ring-4 ring-[#eff6ff]"
                style={{
                  backgroundColor: athlete.avatarColor,
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "32px",
                  fontWeight: 700,
                }}
              >
                {athlete.initials}
              </div>
            )}
            <h3
              className="text-[#0f172a] mb-1"
              style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "22px", fontWeight: 700 }}
            >
              {athlete.name}
            </h3>
            {athlete.verified && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700"
                style={{ fontSize: "11.5px", fontWeight: 600 }}
              >
                <CheckCircle2 size={13} strokeWidth={2.5} /> Verified via NIK
              </span>
            )}
          </div>

          {/* Personal Data */}
          <div className="px-6 py-5 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2 mb-4">
              <h4
                className="text-[#0f172a]"
                style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.02em" }}
              >
                PERSONAL DATA
              </h4>
              <span
                className="px-1.5 py-0.5 rounded text-[#94a3b8]"
                style={{ backgroundColor: "#f1f5f9", fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em" }}
              >
                KTP · OCR VERIFIED
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <div className="col-span-2">
                <DataField label="NIK" value={formattedNik} mono />
              </div>
              <div className="col-span-2">
                <DataField label="FULL NAME" value={athlete.name} />
              </div>
              <DataField label="PLACE OF BIRTH" value={placeOfBirth} />
              <DataField label="DATE OF BIRTH" value={`${dob} (Age ${age})`} />
              <DataField label="GENDER" value={gender} />
              <DataField label="RELIGION" value={religion} />
              <div className="col-span-2">
                <DataField label="FULL ADDRESS" value={address} />
              </div>
              <DataField label="MARITAL STATUS" value={maritalStatus} />
              <DataField label="OCCUPATION" value={effectiveOccupation} />
              <div className="col-span-2">
                <DataField label="CITIZENSHIP" value={citizenship} />
              </div>
            </div>
          </div>

          {/* Roster Info */}
          <div className="px-6 py-5">
            <h4
              className="text-[#0f172a] mb-4"
              style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.02em" }}
            >
              ROSTER INFORMATION
            </h4>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              {role === "athlete" && (
                <>
                  <DataField label="POSITION" value={position ?? "—"} />
                  <DataField label="JERSEY NUMBER" value={jerseyNumber ? String(jerseyNumber) : "—"} />
                </>
              )}
              {role === "coach" && (
                <>
                  <DataField label="COACH ROLE" value={coachRole ?? "—"} />
                  <DataField label="LICENSE LEVEL" value={licenseLevel ?? "—"} />
                  {team && (
                    <div className="col-span-2">
                      <DataField label="TEAM" value={team} />
                    </div>
                  )}
                </>
              )}
              {role === "referee" && (
                <>
                  <DataField label="REFEREE ROLE" value={refereeRole ?? "—"} />
                  <DataField label="BADGE" value={badge ?? "—"} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#f1f5f9] bg-[#fafbfc] flex flex-col gap-2.5">
          <button
            className="w-full h-11 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors flex items-center justify-center gap-2"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            <Pencil size={14} /> Edit Profile details
          </button>
          <button
            className="w-full h-11 rounded-lg border border-[#fecaca] text-[#dc2626] hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            <Trash2 size={14} /> Delete {role === "coach" ? "Coach" : role === "referee" ? "Referee" : "Profile"}
          </button>
          <button
            className="w-full h-9 text-[#64748b] hover:text-[#0f172a] transition-colors flex items-center justify-center gap-1.5"
            style={{ fontSize: "12px", fontWeight: 500 }}
          >
            <History size={12} /> Verification History
          </button>
        </div>
      </aside>
    </div>
  );
}