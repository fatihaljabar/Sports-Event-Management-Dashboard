"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  Users,
  UserRoundCheck,
  Pencil,
  ArrowRight,
  Shield,
  Trophy,
  ImageIcon,
  X,
  AlertCircle,
  Camera,
} from "lucide-react";
import Link from "next/link";
import type { TeamRecord } from "../types";
import { EVENT_CONFIG, AVATAR_COLORS } from "../constants";

const initialTeams: TeamRecord[] = [
  {
    id: "1",
    name: "Surabaya FC",
    logoColor: "#dc2626",
    logoInitials: "SFC",
    maxAthletes: 25,
    currentAthletes: 25,
    maxCoaches: 5,
    currentCoaches: 5,
    eventType: "Men's Football 11v11",
  },
  {
    id: "2",
    name: "Team Elang",
    logoColor: "#2563eb",
    logoInitials: "TE",
    maxAthletes: 25,
    currentAthletes: 10,
    maxCoaches: 5,
    currentCoaches: 2,
    eventType: "Men's Football 11v11",
  },
  {
    id: "3",
    name: "Bali United U-20",
    logoColor: "#e11d48",
    logoInitials: "BU",
    maxAthletes: 22,
    currentAthletes: 18,
    maxCoaches: 4,
    currentCoaches: 3,
    eventType: "Men's Football 11v11",
  },
  {
    id: "4",
    name: "Bandung Raya",
    logoColor: "#7c3aed",
    logoInitials: "BR",
    maxAthletes: 25,
    currentAthletes: 5,
    maxCoaches: 5,
    currentCoaches: 1,
    eventType: "Men's Football 11v11",
  },
];

function QuotaStepper({
  label,
  value,
  onChange,
  min = 1,
  max = 50,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label
        className="block text-[#475569] mb-1.5"
        style={{ fontSize: "13px", fontWeight: 500, fontFamily: "Inter, sans-serif" }}
      >
        {label}
      </label>
      <div className="flex items-center gap-0">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex items-center justify-center w-9 h-9 rounded-l-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#e2e8f0] transition-colors"
        >
          <Minus size={14} className="text-[#64748b]" />
        </button>
        <div
          className="flex items-center justify-center w-12 h-9 border-y border-[#e2e8f0] bg-white text-[#0f172a]"
          style={{ fontSize: "15px", fontWeight: 600, fontFamily: "Inter, sans-serif" }}
        >
          {value}
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex items-center justify-center w-9 h-9 rounded-r-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#e2e8f0] transition-colors"
        >
          <Plus size={14} className="text-[#64748b]" />
        </button>
      </div>
    </div>
  );
}

function ProgressBar({
  current,
  max,
  color,
}: {
  current: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, (current / max) * 100);
  return (
    <div className="w-full h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function TeamCard({
  team,
  onEdit,
  onEditProfile,
}: {
  team: TeamRecord;
  onEdit: () => void;
  onEditProfile: () => void;
}) {
  const router = useRouter();
  const athleteFull = team.currentAthletes >= team.maxAthletes;
  const coachFull = team.currentCoaches >= team.maxCoaches;
  const allFull = athleteFull && coachFull;
  const athletePct = Math.round((team.currentAthletes / team.maxAthletes) * 100);
  const coachPct = Math.round((team.currentCoaches / team.maxCoaches) * 100);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-11 h-11 rounded-lg text-white shrink-0 overflow-hidden"
            style={{
              backgroundColor: team.logoColor,
              fontFamily: "Barlow Condensed, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {team.logoImage ? (
              <img src={team.logoImage} alt={team.name} className="w-full h-full object-cover" />
            ) : (
              team.logoInitials
            )}
          </div>
          <div>
            <h3
              className="text-[#0f172a]"
              style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "18px", fontWeight: 600 }}
            >
              {team.name}
            </h3>
            <span className="text-[#94a3b8]" style={{ fontSize: "12px" }}>
              ID: {team.id.padStart(4, "0")}
              {team.eventType && (
                <>
                  {" "}· <span className="text-[#64748b]">{team.eventType}</span>
                </>
              )}
            </span>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
            allFull ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
          }`}
          style={{ fontSize: "11px", fontWeight: 600 }}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              allFull ? "bg-red-500" : "bg-emerald-500"
            }`}
          />
          {allFull ? "Quota Full" : "Registration Open"}
        </span>
      </div>

      {/* Athlete quota */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="flex items-center gap-1.5 text-[#64748b]"
            style={{ fontSize: "12px", fontWeight: 500 }}
          >
            <Users size={13} /> Athletes
          </span>
          <span
            className={`${athleteFull ? "text-red-500" : "text-[#0f172a]"}`}
            style={{ fontSize: "12px", fontWeight: 600 }}
          >
            {team.currentAthletes} / {team.maxAthletes}
            <span className="text-[#94a3b8] ml-1" style={{ fontWeight: 400 }}>
              ({athletePct}%)
            </span>
          </span>
        </div>
        <ProgressBar
          current={team.currentAthletes}
          max={team.maxAthletes}
          color={athleteFull ? "#dc2626" : "#2563eb"}
        />
      </div>

      {/* Coach quota */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="flex items-center gap-1.5 text-[#64748b]"
            style={{ fontSize: "12px", fontWeight: 500 }}
          >
            <UserRoundCheck size={13} /> Coaches / Officials
          </span>
          <span
            className={`${coachFull ? "text-red-500" : "text-[#0f172a]"}`}
            style={{ fontSize: "12px", fontWeight: 600 }}
          >
            {team.currentCoaches} / {team.maxCoaches}
            <span className="text-[#94a3b8] ml-1" style={{ fontWeight: 400 }}>
              ({coachPct}%)
            </span>
          </span>
        </div>
        <ProgressBar
          current={team.currentCoaches}
          max={team.maxCoaches}
          color={coachFull ? "#dc2626" : "#8b5cf6"}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onEditProfile}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] transition-colors"
          style={{ fontSize: "12px", fontWeight: 500 }}
        >
          <Pencil size={13} /> Edit Team
        </button>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] transition-colors"
          style={{ fontSize: "12px", fontWeight: 500 }}
        >
          <Pencil size={13} /> Edit Quota
        </button>
        <button
          onClick={() => router.push(`/roster/teams/${team.id}`)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0f172a] text-white hover:bg-[#1e293b] transition-colors"
          style={{ fontSize: "12px", fontWeight: 500 }}
        >
          Manage Roster <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function EditQuotaModal({
  team,
  onClose,
  onSave,
}: {
  team: TeamRecord;
  onClose: () => void;
  onSave: (maxAthletes: number, maxCoaches: number) => void;
}) {
  const [editMaxAthletes, setEditMaxAthletes] = useState(team.maxAthletes);
  const [editMaxCoaches, setEditMaxCoaches] = useState(team.maxCoaches);

  const athleteMinError = editMaxAthletes < team.currentAthletes;
  const coachMinError = editMaxCoaches < team.currentCoaches;
  const hasError = athleteMinError || coachMinError;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f172a]/60"
        style={{ backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg text-white shrink-0"
              style={{
                backgroundColor: team.logoColor,
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {team.logoInitials}
            </div>
            <div>
              <h2
                className="text-[#0f172a]"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                Edit Quota
              </h2>
              <p className="text-[#64748b]" style={{ fontSize: "13px" }}>
                {team.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info Box */}
        <div className="mx-6 mb-5">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <AlertCircle size={16} className="text-[#2563eb] shrink-0 mt-0.5" />
            <p className="text-[#475569]" style={{ fontSize: "12.5px", lineHeight: "1.6" }}>
              Currently registered:{" "}
              <span style={{ fontWeight: 600 }}>{team.currentAthletes} Athletes</span> and{" "}
              <span style={{ fontWeight: 600 }}>{team.currentCoaches} Coaches</span>. You cannot set
              the quota lower than these active numbers.
            </p>
          </div>
        </div>

        {/* Quota Inputs */}
        <div className="px-6 pb-6 space-y-5">
          {/* Max Athletes */}
          <div>
            <label
              className="block text-[#475569] mb-2 text-center"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              Max Athletes
            </label>
            <div className="flex items-center justify-center gap-0">
              <button
                onClick={() =>
                  setEditMaxAthletes((v) => Math.max(team.currentAthletes, v - 1))
                }
                disabled={editMaxAthletes <= team.currentAthletes}
                className="flex items-center justify-center w-12 h-12 rounded-l-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#e2e8f0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={16} className="text-[#64748b]" />
              </button>
              <div
                className="flex items-center justify-center w-20 h-12 border-y border-[#e2e8f0] bg-white text-[#0f172a]"
                style={{ fontSize: "20px", fontWeight: 700, fontFamily: "Barlow Condensed, sans-serif" }}
              >
                {editMaxAthletes}
              </div>
              <button
                onClick={() => setEditMaxAthletes((v) => Math.min(50, v + 1))}
                disabled={editMaxAthletes >= 50}
                className="flex items-center justify-center w-12 h-12 rounded-r-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#e2e8f0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} className="text-[#64748b]" />
              </button>
              <span className="ml-3 text-[#94a3b8]" style={{ fontSize: "12px" }}>
                {team.currentAthletes} registered
              </span>
            </div>
          </div>

          {/* Max Coaches */}
          <div>
            <label
              className="block text-[#475569] mb-2 text-center"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              Max Coaches / Officials
            </label>
            <div className="flex items-center justify-center gap-0">
              <button
                onClick={() => setEditMaxCoaches((v) => Math.max(team.currentCoaches, v - 1))}
                disabled={editMaxCoaches <= team.currentCoaches}
                className="flex items-center justify-center w-12 h-12 rounded-l-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#e2e8f0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={16} className="text-[#64748b]" />
              </button>
              <div
                className="flex items-center justify-center w-20 h-12 border-y border-[#e2e8f0] bg-white text-[#0f172a]"
                style={{ fontSize: "20px", fontWeight: 700, fontFamily: "Barlow Condensed, sans-serif" }}
              >
                {editMaxCoaches}
              </div>
              <button
                onClick={() => setEditMaxCoaches((v) => Math.min(20, v + 1))}
                disabled={editMaxCoaches >= 20}
                className="flex items-center justify-center w-12 h-12 rounded-r-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#e2e8f0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} className="text-[#64748b]" />
              </button>
              <span className="ml-3 text-[#94a3b8]" style={{ fontSize: "12px" }}>
                {team.currentCoaches} registered
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#f1f5f9] bg-[#fafbfc]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] transition-colors"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!hasError) onSave(editMaxAthletes, editMaxCoaches);
            }}
            disabled={hasError}
            className="px-5 py-2.5 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function EditTeamProfileModal({
  team,
  onClose,
  onSave,
}: {
  team: TeamRecord;
  onClose: () => void;
  onSave: (name: string, logoPreview: string | null, eventType: string) => void;
}) {
  const [name, setName] = useState(team.name);
  const [eventType, setEventType] = useState(team.eventType ?? "");
  const [logoPreview, setLogoPreview] = useState<string | null>(team.logoImage ?? null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f172a]/60"
        style={{ backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-2">
          <div>
            <h2
              className="text-[#0f172a]"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              Edit Team Profile
            </h2>
            <p className="text-[#64748b] mt-0.5" style={{ fontSize: "13px" }}>
              Update contingent identity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Logo / Flag Edit Area */}
        <div className="flex flex-col items-center px-6 pt-4 pb-5">
          <label className="relative w-24 h-24 rounded-full cursor-pointer group">
            {/* Current logo circle */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white"
              style={{
                backgroundColor: team.logoColor,
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  className="w-full h-full rounded-full object-cover"
                  alt="Team logo"
                />
              ) : (
                team.logoInitials
              )}
            </div>

            {/* Dark overlay on bottom half */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-full flex flex-col items-center justify-center bg-[#0f172a]/50 group-hover:bg-[#0f172a]/65 transition-colors"
            >
              <Camera size={14} className="text-white mb-0.5" />
              <span
                className="text-white"
                style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.02em" }}
              >
                Change Logo
              </span>
            </div>

            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setLogoPreview(URL.createObjectURL(f));
              }}
            />
          </label>
          <p className="text-[#94a3b8] mt-2.5" style={{ fontSize: "11px" }}>
            Recommended size: 256x256px (PNG/JPG)
          </p>
        </div>

        {/* Team Name Input */}
        <div className="px-6 pb-6">
          <label
            className="block text-[#475569] mb-1.5"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            Team / Contingent Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
            style={{ fontSize: "14px", fontWeight: 600 }}
          />

          <label
            className="block text-[#475569] mb-1.5 mt-4"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            Event Type
          </label>
          <input
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            placeholder="e.g. Men's Football 11v11"
            className="w-full h-11 px-3 rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
            style={{ fontSize: "14px" }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#f1f5f9] bg-[#fafbfc]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] transition-colors"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) onSave(name.trim(), logoPreview, eventType.trim());
            }}
            disabled={!name.trim()}
            className="px-5 py-2.5 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeamsPage() {
  const [teams, setTeams] = useState<TeamRecord[]>(initialTeams);
  const [teamName, setTeamName] = useState("Persija U-20");
  const [eventType, setEventType] = useState("Men's Football 11v11");
  const [maxAthletes, setMaxAthletes] = useState(22);
  const [maxCoaches, setMaxCoaches] = useState(4);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editProfileTeamId, setEditProfileTeamId] = useState<string | null>(null);

  const editingTeam = editingTeamId ? teams.find((t) => t.id === editingTeamId) : null;
  const editProfileTeam = editProfileTeamId ? teams.find((t) => t.id === editProfileTeamId) : null;

  const totalAthletes = teams.reduce((s, t) => s + t.currentAthletes, 0);
  const totalCoaches = teams.reduce((s, t) => s + t.currentCoaches, 0);

  const handleRegister = () => {
    if (!teamName.trim()) return;
    const newTeam: TeamRecord = {
      id: String(teams.length + 1),
      name: teamName,
      logoColor: AVATAR_COLORS[teams.length % AVATAR_COLORS.length],
      logoInitials: teamName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 3),
      maxAthletes,
      currentAthletes: 0,
      maxCoaches,
      currentCoaches: 0,
      eventType: eventType.trim() || undefined,
    };
    setTeams((prev) => [...prev, newTeam]);
    setTeamName("");
    setEventType("");
    setMaxAthletes(25);
    setMaxCoaches(5);
    setLogoPreview(null);
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-[#f8fafc]" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h1
            className="text-[#0f172a]"
            style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "28px", fontWeight: 700 }}
          >
            Teams & Quota Management
          </h1>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f172a] text-white"
            style={{ fontSize: "12px", fontWeight: 500 }}
          >
            {EVENT_CONFIG.sportEmoji} {EVENT_CONFIG.sportName} | {EVENT_CONFIG.eventName}
          </span>
        </div>
        <p className="text-[#64748b]" style={{ fontSize: "14px" }}>
          Register contingents and allocate maximum slots for athletes and officials.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Teams", value: teams.length, icon: Shield, color: "#2563eb" },
          { label: "Total Athletes", value: totalAthletes, icon: Users, color: "#059669" },
          { label: "Total Coaches", value: totalCoaches, icon: UserRoundCheck, color: "#7c3aed" },
          {
            label: "Quota Full",
            value: teams.filter(
              (t) => t.currentAthletes >= t.maxAthletes && t.currentCoaches >= t.maxCoaches
            ).length,
            icon: Trophy,
            color: "#dc2626",
          },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 bg-white rounded-xl border border-[#e2e8f0] p-4">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ backgroundColor: `${s.color}15` }}
            >
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-[#94a3b8]" style={{ fontSize: "11px", fontWeight: 500 }}>
                {s.label}
              </p>
              <p
                className="text-[#0f172a]"
                style={{ fontSize: "22px", fontWeight: 700, fontFamily: "Barlow Condensed, sans-serif" }}
              >
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Create form */}
        <div className="w-full lg:w-[340px] shrink-0">
          <div className="sticky top-6 bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2563eb]/10">
                <Plus size={16} className="text-[#2563eb]" />
              </div>
              <h2
                className="text-[#0f172a]"
                style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "20px", fontWeight: 600 }}
              >
                Create New Team
              </h2>
            </div>

            {/* Team Name */}
            <div className="mb-4">
              <label
                className="block text-[#475569] mb-1.5"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                Team / Contingent Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Team Garuda"
                className="w-full h-10 px-3 rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
                style={{ fontSize: "14px" }}
              />
            </div>

            {/* Event Type */}
            <div className="mb-4">
              <label
                className="block text-[#475569] mb-1.5"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                Event Type
              </label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                placeholder="e.g. Men's Football 11v11"
                className="w-full h-10 px-3 rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
                style={{ fontSize: "14px" }}
              />
            </div>

            {/* Logo Upload */}
            <div className="mb-5">
              <label
                className="block text-[#475569] mb-1.5"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                Team Logo / Flag
              </label>
              <label className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc] cursor-pointer hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-all">
                {logoPreview ? (
                  <img src={logoPreview} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <>
                    <ImageIcon size={20} className="text-[#94a3b8] mb-0.5" />
                    <span className="text-[#94a3b8]" style={{ fontSize: "10px" }}>
                      Upload
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setLogoPreview(URL.createObjectURL(f));
                  }}
                />
              </label>
            </div>

            {/* Quota Settings */}
            <div className="mb-5">
              <p
                className="text-[#0f172a] mb-3"
                style={{ fontSize: "14px", fontWeight: 600, fontFamily: "Barlow Condensed, sans-serif" }}
              >
                Quota Settings
              </p>
              <div className="flex gap-4">
                <QuotaStepper
                  label="Max Athletes"
                  value={maxAthletes}
                  onChange={setMaxAthletes}
                />
                <QuotaStepper label="Max Coaches" value={maxCoaches} onChange={setMaxCoaches} />
              </div>
            </div>

            {/* Register button */}
            <button
              onClick={handleRegister}
              disabled={!teamName.trim()}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ fontSize: "14px", fontWeight: 600 }}
            >
              <Plus size={16} /> Register Team
            </button>
          </div>
        </div>

        {/* Right: Teams Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-[#0f172a]"
              style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "20px", fontWeight: 600 }}
            >
              Registered Teams
            </h2>
            <span className="text-[#94a3b8]" style={{ fontSize: "13px" }}>
              {teams.length} team{teams.length !== 1 && "s"} registered
            </span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onEdit={() => setEditingTeamId(team.id)}
                onEditProfile={() => setEditProfileTeamId(team.id)}
              />
            ))}
          </div>

          {teams.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Shield size={48} className="text-[#cbd5e1] mb-3" />
              <p className="text-[#64748b]" style={{ fontSize: "15px", fontWeight: 500 }}>
                No teams registered yet
              </p>
              <p className="text-[#94a3b8]" style={{ fontSize: "13px" }}>
                Create your first team using the form on the left.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Quota Modal */}
      {editingTeam && (
        <EditQuotaModal
          team={editingTeam}
          onClose={() => setEditingTeamId(null)}
          onSave={(newMaxAthletes, newMaxCoaches) => {
            setTeams((prev) =>
              prev.map((t) =>
                t.id === editingTeamId
                  ? { ...t, maxAthletes: newMaxAthletes, maxCoaches: newMaxCoaches }
                  : t
              )
            );
            setEditingTeamId(null);
          }}
        />
      )}

      {/* Edit Team Profile Modal */}
      {editProfileTeam && (
        <EditTeamProfileModal
          team={editProfileTeam}
          onClose={() => setEditProfileTeamId(null)}
          onSave={(newName, newLogo, newEventType) => {
            setTeams((prev) =>
              prev.map((t) =>
                t.id === editProfileTeamId
                  ? { ...t, name: newName, logoImage: newLogo ?? t.logoImage, eventType: newEventType || undefined }
                  : t
              )
            );
            setEditProfileTeamId(null);
          }}
        />
      )}
    </div>
  );
}