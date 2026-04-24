"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Search,
  Plus,
  Eye,
  Trash2,
  Users,
  UserRoundCheck,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import type { TeamPerson } from "../types";

interface TeamData {
  name: string;
  logoColor: string;
  logoInitials: string;
  maxAthletes: number;
  currentAthletes: number;
  maxCoaches: number;
  currentCoaches: number;
  athletes: TeamPerson[];
  coaches: TeamPerson[];
}

const teamData: Record<string, TeamData> = {
  "1": {
    name: "Surabaya FC",
    logoColor: "#dc2626",
    logoInitials: "SFC",
    maxAthletes: 25,
    currentAthletes: 25,
    maxCoaches: 5,
    currentCoaches: 5,
    athletes: [
      { id: "a1", name: "Rizky Ridho", nik: "3578 0412 1101 0001", dob: "21 Nov 2001", age: 24, position: "Center Back", jerseyNumber: 4, verified: true, avatarColor: "#2563eb", initials: "RR" },
      { id: "a2", name: "Marselino Ferdinan", nik: "3172 0506 0503 0002", dob: "06 May 2003", age: 21, position: "Attacking Mid", jerseyNumber: 7, verified: true, avatarColor: "#7c3aed", initials: "MF" },
      { id: "a3", name: "Pratama Arhan", nik: "3374 1409 9900 0003", dob: "14 Sep 1999", age: 26, position: "Left Back", jerseyNumber: 3, verified: true, avatarColor: "#059669", initials: "PA" },
      { id: "a4", name: "Witan Sulaeman", nik: "7371 0210 9900 0004", dob: "02 Oct 1999", age: 26, position: "Right Wing", jerseyNumber: 11, verified: true, avatarColor: "#ea580c", initials: "WS" },
      { id: "a5", name: "Nadeo Argawinata", nik: "3273 0607 9600 0005", dob: "06 Jul 1996", age: 29, position: "Goalkeeper", jerseyNumber: 1, verified: true, avatarColor: "#0891b2", initials: "NA" },
      { id: "a6", name: "Asnawi Mangkualam", nik: "7371 1010 9900 0006", dob: "10 Oct 1999", age: 26, position: "Right Back", jerseyNumber: 2, verified: true, avatarColor: "#dc2626", initials: "AM" },
      { id: "a7", name: "Egy Maulana Vikri", nik: "3578 0407 0000 0007", dob: "04 Jul 2000", age: 25, position: "Central Mid", jerseyNumber: 10, verified: true, avatarColor: "#4f46e5", initials: "EM" },
      { id: "a8", name: "Rachmat Irianto", nik: "3578 0301 9300 0008", dob: "03 Jan 1993", age: 33, position: "Defensive Mid", jerseyNumber: 5, verified: true, avatarColor: "#b45309", initials: "RI" },
      { id: "a9", name: "Irfan Jaya", nik: "7308 0105 9300 0009", dob: "01 May 1993", age: 32, position: "Left Wing", jerseyNumber: 9, verified: true, avatarColor: "#9333ea", initials: "IJ" },
      { id: "a10", name: "Hansamu Yama", nik: "3578 1206 9100 0010", dob: "12 Jun 1991", age: 34, position: "Center Back", jerseyNumber: 6, verified: true, avatarColor: "#0d9488", initials: "HY" },
    ],
    coaches: [
      { id: "c1", name: "Shin Tae-yong", nik: "— (Foreign)", dob: "11 Apr 1970", age: 56, licenseLevel: "AFC Pro", coachRole: "Head Coach", verified: true, avatarColor: "#0f172a", initials: "ST" },
      { id: "c2", name: "Nova Arianto", nik: "3578 1105 7500 0011", dob: "11 May 1975", age: 50, licenseLevel: "AFC A", coachRole: "Assistant Coach", verified: true, avatarColor: "#475569", initials: "NA" },
      { id: "c3", name: "Kurniawan D. Yulianto", nik: "3578 0207 7600 0012", dob: "02 Jul 1976", age: 49, licenseLevel: "AFC A", coachRole: "Attacking Coach", verified: true, avatarColor: "#64748b", initials: "KD" },
      { id: "c4", name: "Hendro Kartiko", nik: "3578 1503 8000 0013", dob: "15 Mar 1980", age: 46, licenseLevel: "AFC B", coachRole: "GK Coach", verified: true, avatarColor: "#334155", initials: "HK" },
      { id: "c5", name: "Dr. Syarif Alwi", nik: "3578 2008 8200 0014", dob: "20 Aug 1982", age: 43, licenseLevel: "Sports Med", coachRole: "Team Doctor", verified: true, avatarColor: "#1e40af", initials: "SA" },
    ],
  },
};

const fallbackTeam: TeamData = {
  name: "Unknown Team",
  logoColor: "#94a3b8",
  logoInitials: "??",
  maxAthletes: 25,
  currentAthletes: 0,
  maxCoaches: 5,
  currentCoaches: 0,
  athletes: [],
  coaches: [],
};

export function TeamRosterPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = typeof params.id === "string" ? params.id : "";
  const team = teamData[teamId] || fallbackTeam;

  const [activeTab, setActiveTab] = useState<"athletes" | "coaches">("athletes");
  const [search, setSearch] = useState("");
  const [viewedAthlete, setViewedAthlete] = useState<TeamPerson | null>(null);
  const [viewedCoach, setViewedCoach] = useState<TeamPerson | null>(null);

  const athleteFull = team.currentAthletes >= team.maxAthletes;
  const coachFull = team.currentCoaches >= team.maxCoaches;

  const filteredAthletes = team.athletes.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.nik.includes(search)
  );

  const filteredCoaches = team.coaches.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nik.includes(search)
  );

  const tabs = [
    { key: "athletes" as const, label: "Athletes", count: team.athletes.length },
    { key: "coaches" as const, label: "Coaches & Officials", count: team.coaches.length },
  ];

  return (
    <div
      className="p-6 lg:p-8 min-h-screen bg-[#f8fafc]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-5" style={{ fontSize: "13px" }}>
        <Link
          href="/roster/teams"
          className="text-[#2563eb] hover:underline"
          style={{ fontWeight: 500 }}
        >
          Teams & Quota
        </Link>
        <ChevronRight size={14} className="text-[#94a3b8]" />
        <span className="text-[#64748b]">{team.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/roster/teams")}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div
            className="flex items-center justify-center w-14 h-14 rounded-xl text-white shrink-0"
            style={{
              backgroundColor: team.logoColor,
              fontFamily: "Barlow Condensed, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            {team.logoInitials}
          </div>
          <div>
            <h1
              className="text-[#0f172a]"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              {team.name} Roster
            </h1>
            <p className="text-[#64748b]" style={{ fontSize: "14px" }}>
              Manage registered athletes and officials for this contingent.
            </p>
          </div>
        </div>

        {/* Quota pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
              athleteFull
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-blue-50 text-blue-600 border border-blue-200"
            }`}
            style={{ fontSize: "12px", fontWeight: 600 }}
          >
            <Users size={13} />
            Athletes: {team.currentAthletes}/{team.maxAthletes}
            {athleteFull && " (Full)"}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
              coachFull
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-violet-50 text-violet-600 border border-violet-200"
            }`}
            style={{ fontSize: "12px", fontWeight: 600 }}
          >
            <UserRoundCheck size={13} />
            Coaches: {team.currentCoaches}/{team.maxCoaches}
            {coachFull && " (Full)"}
          </span>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-0 border-b border-[#e2e8f0] mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSearch("");
            }}
            className={`relative px-5 py-3 transition-colors ${
              activeTab === tab.key
                ? "text-[#2563eb]"
                : "text-[#94a3b8] hover:text-[#64748b]"
            }`}
            style={{ fontSize: "14px", fontWeight: activeTab === tab.key ? 600 : 400 }}
          >
            {tab.label}
            <span
              className={`ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? "bg-[#2563eb] text-white"
                  : "bg-[#f1f5f9] text-[#94a3b8]"
              }`}
              style={{ fontSize: "11px", fontWeight: 600, minWidth: "22px" }}
            >
              {tab.count}
            </span>
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563eb] rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "athletes"
                ? "Search athlete by name or NIK..."
                : "Search coach by name or NIK..."
            }
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
            style={{ fontSize: "13px" }}
          />
        </div>
        <button
          disabled={activeTab === "athletes" ? athleteFull : coachFull}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
            (activeTab === "athletes" ? athleteFull : coachFull)
              ? "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
              : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
          }`}
          style={{ fontSize: "13px", fontWeight: 600 }}
        >
          <Plus size={15} />
          {activeTab === "athletes" ? "+ Add Athlete" : "+ Add Coach"}
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f1f5f9]">
                <th
                  className="text-left px-5 py-3 text-[#94a3b8]"
                  style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}
                >
                  IDENTITY
                </th>
                {activeTab === "athletes" ? (
                  <>
                    <th className="text-left px-5 py-3 text-[#94a3b8]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
                      POSITION
                    </th>
                    <th className="text-left px-5 py-3 text-[#94a3b8]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
                      NO.
                    </th>
                  </>
                ) : (
                  <>
                    <th className="text-left px-5 py-3 text-[#94a3b8]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
                      ROLE
                    </th>
                    <th className="text-left px-5 py-3 text-[#94a3b8]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
                      LICENSE
                    </th>
                  </>
                )}
                <th className="text-left px-5 py-3 text-[#94a3b8]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
                  DOB / AGE
                </th>
                <th className="text-left px-5 py-3 text-[#94a3b8]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
                  VERIFICATION
                </th>
                <th className="text-right px-5 py-3 text-[#94a3b8]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {activeTab === "athletes" &&
                filteredAthletes.map((person) => (
                  <tr
                    key={person.id}
                    onClick={() => setViewedAthlete(person)}
                    className="border-b border-[#f8fafc] hover:bg-[#fafbfd] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center w-9 h-9 rounded-full text-white shrink-0"
                          style={{
                            backgroundColor: person.avatarColor,
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {person.initials}
                        </div>
                        <div>
                          <p className="text-[#0f172a]" style={{ fontSize: "14px", fontWeight: 500 }}>
                            {person.name}
                          </p>
                          <p
                            className="text-[#94a3b8]"
                            style={{
                              fontSize: "12px",
                              fontFamily: "JetBrains Mono, monospace",
                            }}
                          >
                            {person.nik}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[#475569]" style={{ fontSize: "13px" }}>
                        {person.position}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#f1f5f9] text-[#0f172a]"
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          fontFamily: "Barlow Condensed, sans-serif",
                        }}
                      >
                        {person.jerseyNumber}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-[#475569]" style={{ fontSize: "13px" }}>
                          {person.dob}
                        </p>
                        <p className="text-[#94a3b8]" style={{ fontSize: "12px" }}>
                          {person.age} years old
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {person.verified ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600" style={{ fontSize: "12px", fontWeight: 500 }}>
                          <ShieldCheck size={14} /> Verified via NIK
                        </span>
                      ) : (
                        <span className="text-amber-500" style={{ fontSize: "12px", fontWeight: 500 }}>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewedAthlete(person)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-[#2563eb] hover:bg-blue-50 transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-[#dc2626] hover:bg-red-50 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {activeTab === "coaches" &&
                filteredCoaches.map((person) => (
                  <tr
                    key={person.id}
                    onClick={() => setViewedCoach(person)}
                    className="border-b border-[#f8fafc] hover:bg-[#fafbfd] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center w-9 h-9 rounded-full text-white shrink-0"
                          style={{
                            backgroundColor: person.avatarColor,
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {person.initials}
                        </div>
                        <div>
                          <p className="text-[#0f172a]" style={{ fontSize: "14px", fontWeight: 500 }}>
                            {person.name}
                          </p>
                          <p
                            className="text-[#94a3b8]"
                            style={{
                              fontSize: "12px",
                              fontFamily: "JetBrains Mono, monospace",
                            }}
                          >
                            {person.nik}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[#475569]" style={{ fontSize: "13px" }}>
                        {person.coachRole}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full bg-violet-50 text-violet-600"
                        style={{ fontSize: "11px", fontWeight: 600 }}
                      >
                        {person.licenseLevel}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-[#475569]" style={{ fontSize: "13px" }}>
                          {person.dob}
                        </p>
                        <p className="text-[#94a3b8]" style={{ fontSize: "12px" }}>
                          {person.age} years old
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {person.verified ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600" style={{ fontSize: "12px", fontWeight: 500 }}>
                          <ShieldCheck size={14} /> Verified via NIK
                        </span>
                      ) : (
                        <span className="text-amber-500" style={{ fontSize: "12px", fontWeight: 500 }}>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewedCoach(person)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-[#2563eb] hover:bg-blue-50 transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-[#dc2626] hover:bg-red-50 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {((activeTab === "athletes" && filteredAthletes.length === 0) ||
          (activeTab === "coaches" && filteredCoaches.length === 0)) && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search size={40} className="text-[#cbd5e1] mb-3" />
            <p className="text-[#64748b]" style={{ fontSize: "14px", fontWeight: 500 }}>
              {search ? "No results found" : "No members yet"}
            </p>
            <p className="text-[#94a3b8]" style={{ fontSize: "13px" }}>
              {search
                ? "Try adjusting your search terms."
                : "Add members using the button above."}
            </p>
          </div>
        )}

        {/* Footer */}
        {((activeTab === "athletes" && filteredAthletes.length > 0) ||
          (activeTab === "coaches" && filteredCoaches.length > 0)) && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#f1f5f9]">
            <span className="text-[#94a3b8]" style={{ fontSize: "12px" }}>
              Showing{" "}
              {activeTab === "athletes" ? filteredAthletes.length : filteredCoaches.length} of{" "}
              {activeTab === "athletes" ? team.athletes.length : team.coaches.length}{" "}
              {activeTab === "athletes" ? "athletes" : "coaches"}
            </span>
            <span className="text-[#94a3b8]" style={{ fontSize: "12px" }}>
              Football (Men&apos;s 11v11) | Unesa Cup 2026
            </span>
          </div>
        )}
      </div>

      {/* View Drawer - simplified inline version since we don't have the full AthleteDetailDrawer */}
      {(viewedAthlete || viewedCoach) && (
        <div
          className="fixed inset-0 z-50 flex"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <div className="absolute inset-0 bg-[#0f172a]/40" onClick={() => { setViewedAthlete(null); setViewedCoach(null); }} />
          <div
            className="relative ml-auto w-full max-w-md bg-white h-full overflow-y-auto"
            style={{ animation: "slideInRight 300ms ease-out" }}
          >
            <div className="sticky top-0 bg-white border-b border-[#f1f5f9] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-[#0f172a]" style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "20px", fontWeight: 700 }}>
                Profile Detail
              </h2>
              <button
                onClick={() => { setViewedAthlete(null); setViewedCoach(null); }}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {(viewedAthlete || viewedCoach) && (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div
                      className="flex items-center justify-center w-20 h-20 rounded-full text-white mb-3"
                      style={{
                        backgroundColor: (viewedAthlete || viewedCoach)!.avatarColor,
                        fontSize: "24px",
                        fontWeight: 600,
                      }}
                    >
                      {(viewedAthlete || viewedCoach)!.initials}
                    </div>
                    <h3 className="text-[#0f172a] text-xl font-semibold">{(viewedAthlete || viewedCoach)!.name}</h3>
                    <p className="text-[#94a3b8]" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px" }}>
                      {(viewedAthlete || viewedCoach)!.nik}
                    </p>
                    <div className="mt-2">
                      {(viewedAthlete || viewedCoach)!.verified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600" style={{ fontSize: "12px", fontWeight: 500 }}>
                          <ShieldCheck size={14} /> Verified via NIK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-500" style={{ fontSize: "12px", fontWeight: 500 }}>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-[#f8fafc] p-4 border border-[#e2e8f0]">
                      <p className="text-[#94a3b8] mb-1" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>DATE OF BIRTH / AGE</p>
                      <p className="text-[#0f172a]" style={{ fontSize: "14px", fontWeight: 500 }}>
                        {(viewedAthlete || viewedCoach)!.dob} ({(viewedAthlete || viewedCoach)!.age} years old)
                      </p>
                    </div>
                    {viewedAthlete && (
                      <>
                        <div className="rounded-lg bg-[#f8fafc] p-4 border border-[#e2e8f0]">
                          <p className="text-[#94a3b8] mb-1" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>POSITION</p>
                          <p className="text-[#0f172a]" style={{ fontSize: "14px", fontWeight: 500 }}>{viewedAthlete.position}</p>
                        </div>
                        <div className="rounded-lg bg-[#f8fafc] p-4 border border-[#e2e8f0]">
                          <p className="text-[#94a3b8] mb-1" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>JERSEY NUMBER</p>
                          <p className="text-[#0f172a] text-2xl font-bold" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>#{viewedAthlete.jerseyNumber}</p>
                        </div>
                      </>
                    )}
                    {viewedCoach && (
                      <>
                        <div className="rounded-lg bg-[#f8fafc] p-4 border border-[#e2e8f0]">
                          <p className="text-[#94a3b8] mb-1" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>ROLE</p>
                          <p className="text-[#0f172a]" style={{ fontSize: "14px", fontWeight: 500 }}>{viewedCoach.coachRole}</p>
                        </div>
                        <div className="rounded-lg bg-[#f8fafc] p-4 border border-[#e2e8f0]">
                          <p className="text-[#94a3b8] mb-1" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>LICENSE</p>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-violet-50 text-violet-600" style={{ fontSize: "11px", fontWeight: 600 }}>
                            {viewedCoach.licenseLevel}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}