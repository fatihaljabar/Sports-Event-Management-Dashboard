import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Search,
  Download,
  Eye,
  Flag,
  Check,
  X,
  Filter,
  Clock,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Hourglass,
  RefreshCw,
  Calendar,
  ChevronRight,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type ResultStatus = "official" | "provisional" | "disputed";

interface PodiumAthlete { name: string; flag: string; country: string }
interface ResultRow {
  id: string;
  timestamp: string;
  timeRelative: string;
  event: string;
  eventEmoji: string;
  sport: string;
  sportEmoji: string;
  matchId: string;
  gold: PodiumAthlete;
  silver: PodiumAthlete | null;
  bronze: PodiumAthlete | null;
  recordedBy: string;
  refKey: string;
  status: ResultStatus;
  note?: string;
}

/* ─────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────── */
const RESULTS: ResultRow[] = [
  {
    id: "RES-1042",
    timestamp: "10:45 AM",
    timeRelative: "2 mins ago",
    event: "Asian Games 2026",
    eventEmoji: "🏆",
    sport: "Swimming — Men's 100m Freestyle",
    sportEmoji: "🏊",
    matchId: "AG26-SW-M100F",
    gold:   { name: "Leon Marchand",      flag: "🇫🇷", country: "FRA" },
    silver: { name: "Caeleb Dressel",     flag: "🇺🇸", country: "USA" },
    bronze: { name: "Florian Wellbrock",  flag: "🇩🇪", country: "GER" },
    recordedBy: "Sarah Jenkins",
    refKey: "AG26-COORD-SWIM",
    status: "official",
  },
  {
    id: "RES-1041",
    timestamp: "10:32 AM",
    timeRelative: "15 mins ago",
    event: "Asian Games 2026",
    eventEmoji: "🏆",
    sport: "Athletics — Men's 100m Sprint",
    sportEmoji: "🏃",
    matchId: "AG26-ATH-M100",
    gold:   { name: "Noah Lyles",         flag: "🇺🇸", country: "USA" },
    silver: { name: "Lalu M. Zohri",      flag: "🇮🇩", country: "IDN" },
    bronze: { name: "Marcell Jacobs",     flag: "🇮🇹", country: "ITA" },
    recordedBy: "Linda Hartono",
    refKey: "AG26-COORD-ATL",
    status: "official",
  },
  {
    id: "RES-1040",
    timestamp: "10:18 AM",
    timeRelative: "29 mins ago",
    event: "Unesa Cup",
    eventEmoji: "⚽",
    sport: "Futsal — Men's Group A",
    sportEmoji: "🥅",
    matchId: "UNESA-FS-GA01",
    gold:   { name: "Indonesia",          flag: "🇮🇩", country: "IDN" },
    silver: { name: "Malaysia",           flag: "🇲🇾", country: "MYS" },
    bronze: { name: "Thailand",           flag: "🇹🇭", country: "THA" },
    recordedBy: "Ahmad Dani",
    refKey: "UNESA-MGR-FTSL",
    status: "provisional",
    note: "Awaiting head referee signature",
  },
  {
    id: "RES-1039",
    timestamp: "09:55 AM",
    timeRelative: "52 mins ago",
    event: "Asian Games 2026",
    eventEmoji: "🏆",
    sport: "Gymnastics — Women's Floor",
    sportEmoji: "🤸",
    matchId: "AG26-GYM-WF",
    gold:   { name: "Simone Biles",       flag: "🇺🇸", country: "USA" },
    silver: { name: "Rebeca Andrade",     flag: "🇧🇷", country: "BRA" },
    bronze: { name: "Sunisa Lee",         flag: "🇺🇸", country: "USA" },
    recordedBy: "Priya Sharma",
    refKey: "AG26-DIR-GYM",
    status: "official",
  },
  {
    id: "RES-1038",
    timestamp: "09:40 AM",
    timeRelative: "1 hr ago",
    event: "Asian Games 2026",
    eventEmoji: "🏆",
    sport: "Swimming — Women's 200m Butterfly",
    sportEmoji: "🏊",
    matchId: "AG26-SW-W200B",
    gold:   { name: "Zhang Yufei",        flag: "🇨🇳", country: "CHN" },
    silver: { name: "Emma McKeon",        flag: "🇦🇺", country: "AUS" },
    bronze: { name: "Regan Smith",        flag: "🇺🇸", country: "USA" },
    recordedBy: "Sarah Jenkins",
    refKey: "AG26-COORD-SWIM",
    status: "official",
  },
  {
    id: "RES-1037",
    timestamp: "09:22 AM",
    timeRelative: "1 hr 25 mins ago",
    event: "Unesa Cup",
    eventEmoji: "⚽",
    sport: "Football — Men's Semifinal",
    sportEmoji: "⚽",
    matchId: "UNESA-FTB-SF1",
    gold:   { name: "Indonesia",          flag: "🇮🇩", country: "IDN" },
    silver: { name: "Vietnam",            flag: "🇻🇳", country: "VNM" },
    bronze: null,
    recordedBy: "Ahmad Dani",
    refKey: "UNESA-MGR-FTSL",
    status: "provisional",
    note: "Semi-final — bronze TBD",
  },
  {
    id: "RES-1036",
    timestamp: "08:55 AM",
    timeRelative: "1 hr 52 mins ago",
    event: "Asian Games 2026",
    eventEmoji: "🏆",
    sport: "Weightlifting — Women's +87kg",
    sportEmoji: "🏋️",
    matchId: "AG26-WL-W87",
    gold:   { name: "Li Wenwen",          flag: "🇨🇳", country: "CHN" },
    silver: { name: "Luo Shifang",        flag: "🇨🇳", country: "CHN" },
    bronze: { name: "Sarah Robles",       flag: "🇺🇸", country: "USA" },
    recordedBy: "Marcus Reid",
    refKey: "AG26-REF-BSKT",
    status: "official",
  },
  {
    id: "RES-1035",
    timestamp: "08:30 AM",
    timeRelative: "2 hrs ago",
    event: "Asian Games 2026",
    eventEmoji: "🏆",
    sport: "Athletics — Men's Long Jump",
    sportEmoji: "🏃",
    matchId: "AG26-ATH-MLJ",
    gold:   { name: "Miltiadis Tentoglou",flag: "🇬🇷", country: "GRE" },
    silver: { name: "Tajay Gayle",        flag: "🇯🇲", country: "JAM" },
    bronze: { name: "Juan M. Echevarría", flag: "🇨🇺", country: "CUB" },
    recordedBy: "Linda Hartono",
    refKey: "AG26-COORD-ATL",
    status: "official",
  },
  {
    id: "RES-1034",
    timestamp: "08:10 AM",
    timeRelative: "2 hrs 37 mins ago",
    event: "Olympic Winter",
    eventEmoji: "⛷️",
    sport: "Alpine Skiing — Men's Downhill",
    sportEmoji: "🎿",
    matchId: "OW26-SKI-MD",
    gold:   { name: "Aleksander Kilde",   flag: "🇳🇴", country: "NOR" },
    silver: { name: "Marco Odermatt",     flag: "🇨🇭", country: "SUI" },
    bronze: { name: "Vincent Kriechmayr", flag: "🇦🇹", country: "AUT" },
    recordedBy: "Mei Lin Chen",
    refKey: "OW26-OPS-SKI",
    status: "provisional",
    note: "Photo finish review pending",
  },
  {
    id: "RES-1033",
    timestamp: "07:48 AM",
    timeRelative: "2 hrs 59 mins ago",
    event: "Asian Games 2026",
    eventEmoji: "🏆",
    sport: "Badminton — Men's Singles",
    sportEmoji: "🏸",
    matchId: "AG26-BD-MS",
    gold:   { name: "Viktor Axelsen",     flag: "🇩🇰", country: "DEN" },
    silver: { name: "Shi Yuqi",           flag: "🇨🇳", country: "CHN" },
    bronze: { name: "Kevin Sanjaya",      flag: "🇮🇩", country: "IDN" },
    recordedBy: "Marcus Reid",
    refKey: "AG26-REF-BSKT",
    status: "official",
  },
];

const EVENTS   = ["All Events", "Asian Games 2026", "Unesa Cup", "Olympic Winter"];
const SPORTS   = ["All Sports", "Swimming", "Athletics", "Gymnastics", "Weightlifting", "Badminton", "Futsal", "Football", "Alpine Skiing"];
const STATUSES = ["All Status", "Official", "Provisional", "Disputed"];

const STATUS_CFG: Record<ResultStatus, {
  label: string; icon: React.ReactNode;
  bg: string; text: string; border: string; dot: string;
}> = {
  official:    { label: "Official",    icon: <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />, bg: "#DCFCE7", text: "#15803D", border: "#BBF7D0", dot: "#22C55E" },
  provisional: { label: "Provisional", icon: <Hourglass   className="w-3 h-3" strokeWidth={2}   />, bg: "#FEF9C3", text: "#92400E", border: "#FDE68A", dot: "#F59E0B" },
  disputed:    { label: "Disputed",    icon: <AlertTriangle className="w-3 h-3" strokeWidth={2}  />, bg: "#FEE2E2", text: "#DC2626", border: "#FECACA", dot: "#EF4444" },
};

const EVENT_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  "Asian Games 2026": { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Unesa Cup":        { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  "Olympic Winter":   { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" },
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function useOutsideClick(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) cb(); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, cb]);
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ icon, iconBg, label, value, sub, accentColor }: {
  icon: React.ReactNode; iconBg: string; label: string; value: string; sub: string; accentColor?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl px-5 py-4"
      style={{ backgroundColor: "#FFFFFF", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", flex: 1 }}>
      <div className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{ width: "42px", height: "42px", background: iconBg }}>
        {icon}
      </div>
      <div>
        <p style={{ color: "#94A3B8", fontSize: "0.67rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </p>
        <p style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: "1.9rem", color: accentColor ?? "#0F172A", lineHeight: 1.1 }}>
          {value}
        </p>
        <p style={{ color: "#CBD5E1", fontSize: "0.67rem", fontFamily: '"Inter", sans-serif', marginTop: "1px" }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILTER DROPDOWN
───────────────────────────────────────────── */
function FilterDropdown({ label, options, value, onChange, icon }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));
  const isFiltered = value !== options[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all"
        style={{
          border: `1.5px solid ${isFiltered ? "#BFDBFE" : "#E2E8F0"}`,
          backgroundColor: isFiltered ? "#EFF6FF" : "#FFFFFF",
          color: isFiltered ? "#1D4ED8" : "#374151",
          fontSize: "0.8rem", fontFamily: '"Inter", sans-serif',
          fontWeight: isFiltered ? 600 : 400,
          whiteSpace: "nowrap", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {icon && <span style={{ opacity: 0.6 }}>{icon}</span>}
        {isFiltered ? value : label}
        <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", opacity: 0.5 }} />
      </button>
      {open && (
        <div className="absolute left-0 z-50 rounded-xl overflow-hidden py-1 mt-1"
          style={{ minWidth: "200px", backgroundColor: "#FFFFFF", boxShadow: "0 8px 28px rgba(0,0,0,0.12)", border: "1px solid #E2E8F0" }}>
          {options.map((opt) => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-3.5 py-2.5 flex items-center gap-2 transition-colors"
              style={{ backgroundColor: value === opt ? "#EFF6FF" : "transparent", color: value === opt ? "#1D4ED8" : "#374151", fontSize: "0.8rem", fontFamily: '"Inter", sans-serif', fontWeight: value === opt ? 600 : 400, border: "none" }}
              onMouseEnter={(e) => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
              onMouseLeave={(e) => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              {value === opt ? <Check className="w-3 h-3 text-blue-600 flex-shrink-0" strokeWidth={2.5} /> : <span style={{ width: "12px", display: "inline-block" }} />}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PODIUM CELL
───────────────────────────────────────────── */
function PodiumCell({ rank, athlete, emoji }: { rank: "gold" | "silver" | "bronze"; athlete: PodiumAthlete | null; emoji: string }) {
  if (!athlete) {
    return <span style={{ color: "#CBD5E1", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif' }}>—</span>;
  }
  const isgold = rank === "gold";
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ fontSize: "0.9rem", lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
      <span style={{ fontSize: "1.05rem", lineHeight: 1, flexShrink: 0 }}>{athlete.flag}</span>
      <div>
        <p style={{
          color: isgold ? "#0F172A" : "#374151",
          fontSize: "0.78rem",
          fontWeight: isgold ? 700 : 500,
          fontFamily: '"Inter", sans-serif',
          whiteSpace: "nowrap",
        }}>
          {athlete.name}
        </p>
        <p style={{ color: "#CBD5E1", fontSize: "0.62rem", fontFamily: '"JetBrains Mono", monospace', letterSpacing: "0.03em" }}>
          {athlete.country}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DETAIL MODAL
───────────────────────────────────────────── */
function DetailModal({ result, onClose }: { result: ResultRow; onClose: () => void }) {
  const status = STATUS_CFG[result.status];
  const evColor = EVENT_COLOR[result.event] ?? { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" };

  useEffect(() => {
    function h(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{ width: "520px", backgroundColor: "#FFFFFF", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", border: "1px solid #F1F5F9" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,#0F172A,#1E293B)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p style={{ color: "#94A3B8", fontSize: "0.65rem", fontFamily: '"JetBrains Mono", monospace', letterSpacing: "0.08em" }}>
              RESULT DETAIL — {result.matchId}
            </p>
            <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: "1.3rem", color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.1, marginTop: "4px" }}>
              {result.sportEmoji} {result.sport}
            </h3>
          </div>
          <button onClick={onClose}
            className="flex items-center justify-center rounded-xl transition-all"
            style={{ width: "32px", height: "32px", backgroundColor: "rgba(255,255,255,0.08)", color: "#94A3B8", border: "none" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.15)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.08)"}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5"
              style={{ backgroundColor: evColor.bg, border: `1px solid ${evColor.border}` }}>
              <span style={{ fontSize: "0.9rem" }}>{result.eventEmoji}</span>
              <span style={{ color: evColor.text, fontSize: "0.78rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>{result.event}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ backgroundColor: status.bg, border: `1px solid ${status.border}` }}>
              <div className="rounded-full" style={{ width: "6px", height: "6px", backgroundColor: status.dot }} />
              <span style={{ color: status.text, fontSize: "0.72rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>{status.label}</span>
            </div>
            {result.note && (
              <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1"
                style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                <AlertTriangle className="w-3 h-3" strokeWidth={2} style={{ color: "#D97706" }} />
                <span style={{ color: "#92400E", fontSize: "0.7rem", fontFamily: '"Inter", sans-serif' }}>{result.note}</span>
              </div>
            )}
          </div>

          {/* Podium */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #F1F5F9" }}>
            {[
              { rank: "gold" as const, emoji: "🥇", label: "1st Place — Gold Medal", athlete: result.gold },
              { rank: "silver" as const, emoji: "🥈", label: "2nd Place — Silver Medal", athlete: result.silver },
              { rank: "bronze" as const, emoji: "🥉", label: "3rd Place — Bronze Medal", athlete: result.bronze },
            ].map((row, i) => (
              <div key={row.rank}
                className="flex items-center gap-4 px-4 py-3.5"
                style={{ backgroundColor: i === 0 ? "#FFFBEB" : i % 2 !== 0 ? "#FAFBFC" : "#FFFFFF", borderTop: i > 0 ? "1px solid #F1F5F9" : "none" }}>
                <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{row.emoji}</span>
                {row.athlete ? (
                  <div className="flex items-center gap-3 flex-1">
                    <span style={{ fontSize: "1.4rem" }}>{row.athlete.flag}</span>
                    <div>
                      <p style={{ color: "#0F172A", fontSize: "0.9rem", fontWeight: i === 0 ? 700 : 600, fontFamily: '"Inter", sans-serif' }}>{row.athlete.name}</p>
                      <p style={{ color: "#94A3B8", fontSize: "0.7rem", fontFamily: '"JetBrains Mono", monospace' }}>{row.athlete.country}</p>
                    </div>
                  </div>
                ) : (
                  <span style={{ color: "#CBD5E1", fontSize: "0.8rem", fontFamily: '"Inter", sans-serif', flex: 1 }}>Not recorded</span>
                )}
                <span style={{ color: "#94A3B8", fontSize: "0.68rem", fontFamily: '"Inter", sans-serif' }}>{row.label.split("—")[0].trim()}</span>
              </div>
            ))}
          </div>

          {/* Recorded by */}
          <div className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
            <div>
              <p style={{ color: "#94A3B8", fontSize: "0.65rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Recorded By</p>
              <p style={{ color: "#0F172A", fontSize: "0.86rem", fontWeight: 600, fontFamily: '"Inter", sans-serif', marginTop: "2px" }}>{result.recordedBy}</p>
            </div>
            <div className="text-right">
              <p style={{ color: "#94A3B8", fontSize: "0.65rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ref Key</p>
              <span className="rounded-md px-2 py-1 mt-1 inline-block"
                style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.72rem", color: "#475569", backgroundColor: "#F1F5F9", border: "1.5px solid #E2E8F0" }}>
                {result.refKey}
              </span>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2" style={{ borderTop: "1px solid #F1F5F9", paddingTop: "12px" }}>
            <Clock className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#CBD5E1" }} />
            <span style={{ color: "#94A3B8", fontSize: "0.74rem", fontFamily: '"Inter", sans-serif' }}>
              Published <strong style={{ color: "#374151" }}>{result.timeRelative}</strong> · {result.timestamp}
            </span>
            <span style={{ color: "#CBD5E1", fontSize: "0.68rem", fontFamily: '"JetBrains Mono", monospace', marginLeft: "auto" }}>{result.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TABLE ROW
───────────────────────────────────────────── */
function ResultTableRow({ result, idx, isLast, onView }: {
  result: ResultRow; idx: number; isLast: boolean; onView: (r: ResultRow) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const isZebra = idx % 2 !== 0;
  const status = STATUS_CFG[result.status];
  const evColor = EVENT_COLOR[result.event] ?? { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" };

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#F5F9FF" : flagged ? "#FFF5F5" : isZebra ? "#FAFBFC" : "#FFFFFF",
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
        transition: "background-color 0.1s",
      }}
    >
      {/* Time */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap", width: "1%" }}>
        <div>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: "0.8rem", color: "#374151" }}>
            {result.timestamp}
          </p>
          <p style={{ color: "#CBD5E1", fontSize: "0.62rem", fontFamily: '"Inter", sans-serif' }}>
            {result.timeRelative}
          </p>
        </div>
      </td>

      {/* Match Context */}
      <td style={{ padding: "13px 16px", minWidth: "200px" }}>
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 self-start"
            style={{ backgroundColor: evColor.bg, border: `1px solid ${evColor.border}` }}>
            <span style={{ fontSize: "0.75rem" }}>{result.eventEmoji}</span>
            <span style={{ color: evColor.text, fontSize: "0.68rem", fontWeight: 600, fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap" }}>
              {result.event}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: "0.8rem" }}>{result.sportEmoji}</span>
            <span style={{ color: "#374151", fontSize: "0.75rem", fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
              {result.sport}
            </span>
          </div>
          <span style={{ color: "#CBD5E1", fontSize: "0.6rem", fontFamily: '"JetBrains Mono", monospace', letterSpacing: "0.04em" }}>
            {result.matchId}
          </span>
        </div>
      </td>

      {/* Gold */}
      <td style={{ padding: "13px 16px" }}>
        <PodiumCell rank="gold" athlete={result.gold} emoji="🥇" />
      </td>

      {/* Silver */}
      <td style={{ padding: "13px 16px" }}>
        <PodiumCell rank="silver" athlete={result.silver} emoji="🥈" />
      </td>

      {/* Bronze */}
      <td style={{ padding: "13px 16px" }}>
        <PodiumCell rank="bronze" athlete={result.bronze} emoji="🥉" />
      </td>

      {/* Recorded By */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
        <p style={{ color: "#374151", fontSize: "0.76rem", fontWeight: 500, fontFamily: '"Inter", sans-serif' }}>
          {result.recordedBy}
        </p>
        <span className="rounded-md px-1.5 py-0.5 mt-0.5 inline-block"
          style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6rem", color: "#64748B", backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0", letterSpacing: "0.02em" }}>
          {result.refKey}
        </span>
      </td>

      {/* Status */}
      <td style={{ padding: "13px 16px" }}>
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ backgroundColor: status.bg, border: `1px solid ${status.border}` }}>
            <div className="rounded-full flex-shrink-0"
              style={{ width: "6px", height: "6px", backgroundColor: status.dot, boxShadow: result.status === "official" ? `0 0 4px ${status.dot}` : "none" }} />
            <span style={{ color: status.text, fontSize: "0.7rem", fontWeight: 600, fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap" }}>
              {status.label}
            </span>
          </div>
          {result.note && (
            <div className="flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" strokeWidth={2} style={{ color: "#F59E0B" }} />
              <p style={{ color: "#92400E", fontSize: "0.6rem", fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis" }}>
                {result.note}
              </p>
            </div>
          )}
        </div>
      </td>

      {/* Actions */}
      <td style={{ padding: "13px 16px" }}>
        <div className="flex items-center gap-1.5 justify-end">
          {/* View Details */}
          <button
            onClick={() => onView(result)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all"
            style={{ border: "1.5px solid #BFDBFE", backgroundColor: "#EFF6FF", color: "#1D4ED8", fontSize: "0.74rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, whiteSpace: "nowrap" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#DBEAFE"}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EFF6FF"}
          >
            <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
            Details
          </button>

          {/* Flag Dispute */}
          <button
            onClick={() => setFlagged((f) => !f)}
            title={flagged ? "Remove flag" : "Flag dispute"}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: "30px", height: "30px",
              border: `1.5px solid ${flagged ? "#FCA5A5" : "#E2E8F0"}`,
              backgroundColor: flagged ? "#FEE2E2" : "transparent",
              color: flagged ? "#DC2626" : "#94A3B8",
            }}
            onMouseEnter={(e) => { if (!flagged) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEF2F2"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#FECACA"; (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"; } }}
            onMouseLeave={(e) => { if (!flagged) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0"; (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8"; } }}
          >
            <Flag className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export function CompetitionResultsPage() {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState(EVENTS[0]);
  const [sportFilter, setSportFilter] = useState(SPORTS[0]);
  const [statusFilter, setStatusFilter] = useState(STATUSES[0]);
  const [detailResult, setDetailResult] = useState<ResultRow | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const activeFilters = [eventFilter !== EVENTS[0], sportFilter !== SPORTS[0], statusFilter !== STATUSES[0]].filter(Boolean).length;

  const filtered = RESULTS.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.gold.name.toLowerCase().includes(q) ||
      (r.silver?.name.toLowerCase().includes(q) ?? false) ||
      (r.bronze?.name.toLowerCase().includes(q) ?? false) ||
      r.matchId.toLowerCase().includes(q) ||
      r.sport.toLowerCase().includes(q) ||
      r.recordedBy.toLowerCase().includes(q);
    const matchEvent  = eventFilter  === EVENTS[0]   || r.event === eventFilter;
    const matchSport  = sportFilter  === SPORTS[0]   || r.sport.toLowerCase().includes(sportFilter.toLowerCase());
    const matchStatus = statusFilter === STATUSES[0]  || r.status === statusFilter.toLowerCase();
    return matchSearch && matchEvent && matchSport && matchStatus;
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const officialCount    = RESULTS.filter((r) => r.status === "official").length;
  const provisionalCount = RESULTS.filter((r) => r.status === "provisional").length;
  const disputedCount    = RESULTS.filter((r) => r.status === "disputed").length;

  return (
    <>
      <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="px-6 py-6" style={{ maxWidth: "1600px" }}>

          {/* ══════  HEADER  ══════ */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: "#94A3B8", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif' }}>Dashboard</span>
                <ChevronRight className="w-3 h-3" strokeWidth={2} style={{ color: "#CBD5E1" }} />
                <span style={{ color: "#2563EB", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>Competition Results</span>
              </div>
              <h1 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: "2.25rem", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1 }}>
                Live Results Monitor
              </h1>
              <p style={{ color: "#94A3B8", fontSize: "0.82rem", fontFamily: '"Inter", sans-serif', marginTop: "0.4rem" }}>
                Read-only live stream of all submitted podium results — monitor, verify, and flag disputes.
              </p>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Live badge */}
              <div className="flex items-center gap-2 rounded-xl px-3.5 py-2"
                style={{ backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="rounded-full" style={{ width: "7px", height: "7px", backgroundColor: "#4ADE80", boxShadow: "0 0 8px #4ADE80", animation: "pulse 2s infinite" }} />
                <span style={{ color: "#4ADE80", fontSize: "0.72rem", fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, letterSpacing: "0.08em" }}>
                  LIVE
                </span>
                <span style={{ color: "#475569", fontSize: "0.65rem", fontFamily: '"JetBrains Mono", monospace' }}>
                  Feb 24, 2026
                </span>
              </div>

              {/* Refresh */}
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all"
                style={{ border: "1.5px solid #E2E8F0", backgroundColor: "#FFFFFF", color: "#64748B", fontSize: "0.8rem", fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"}
                onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFFFFF"}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.75} />
                Refresh
              </button>

              {/* Export */}
              <button
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#0F172A,#1E293B)",
                  color: "#FFFFFF", fontSize: "0.84rem", fontFamily: '"Inter", sans-serif', fontWeight: 600,
                  boxShadow: "0 4px 16px rgba(15,23,42,0.22)", border: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#1E293B,#334155)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#0F172A,#1E293B)"}
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                Export Report
              </button>
            </div>
          </div>

          {/* ══════  STAT CARDS  ══════ */}
          <div className="flex gap-4 mb-6">
            <StatCard
              icon={<Activity className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
              iconBg="linear-gradient(135deg,#0F172A,#334155)"
              label="Results Published"
              value="342"
              sub="Across all events today"
            />
            <StatCard
              icon={<Hourglass className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
              iconBg="linear-gradient(135deg,#D97706,#F59E0B)"
              label="Pending Validation"
              value={String(provisionalCount)}
              sub="Awaiting head referee sign-off"
              accentColor="#D97706"
            />
            <StatCard
              icon={<Flag className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
              iconBg="linear-gradient(135deg,#DC2626,#EF4444)"
              label="Disputes"
              value={String(disputedCount)}
              sub="Flagged for review"
              accentColor={disputedCount > 0 ? "#DC2626" : "#94A3B8"}
            />
            <StatCard
              icon={<ShieldCheck className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
              iconBg="linear-gradient(135deg,#059669,#0D9488)"
              label="Official Results"
              value={String(officialCount)}
              sub={`${((officialCount / RESULTS.length) * 100).toFixed(0)}% of today's total`}
              accentColor="#059669"
            />
          </div>

          {/* ══════  TABLE CARD  ══════ */}
          <div className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>

            {/* ── Toolbar ── */}
            <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
              {/* Search */}
              <div className="relative" style={{ width: "300px", flexShrink: 0 }}>
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#94A3B8" }} />
                <input
                  type="text"
                  placeholder="Search athlete or match ID…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg outline-none transition-all"
                  style={{ paddingLeft: "2.2rem", paddingRight: search ? "2.2rem" : "0.875rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", backgroundColor: "#F8FAFC", border: "1.5px solid #E2E8F0", fontSize: "0.8rem", fontFamily: '"Inter", sans-serif', color: "#1E293B" }}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#2563EB")}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")}
                />
                {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }}><X className="w-3.5 h-3.5" strokeWidth={2} /></button>}
              </div>

              <FilterDropdown label="All Events" options={EVENTS} value={eventFilter} onChange={setEventFilter} icon={<Filter className="w-3.5 h-3.5" />} />
              <FilterDropdown label="All Sports" options={SPORTS} value={sportFilter} onChange={setSportFilter} icon={<Filter className="w-3.5 h-3.5" />} />
              <FilterDropdown label="All Status" options={STATUSES} value={statusFilter} onChange={setStatusFilter} icon={<ShieldCheck className="w-3.5 h-3.5" />} />
              <FilterDropdown label="Date Range" options={["All Dates", "Today", "This Week", "This Month"]} value={"All Dates"} onChange={() => {}} icon={<Calendar className="w-3.5 h-3.5" />} />

              {activeFilters > 0 && (
                <button onClick={() => { setEventFilter(EVENTS[0]); setSportFilter(SPORTS[0]); setStatusFilter(STATUSES[0]); }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all"
                  style={{ border: "1.5px solid #FECACA", backgroundColor: "#FFF5F5", color: "#DC2626", fontSize: "0.78rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, whiteSpace: "nowrap" }}>
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                  Clear {activeFilters}
                </button>
              )}

              <div className="flex-1" />
              <span style={{ color: "#94A3B8", fontSize: "0.75rem", fontFamily: '"Inter", sans-serif', flexShrink: 0 }}>
                <strong style={{ color: "#374151" }}>{filtered.length}</strong> of <strong style={{ color: "#374151" }}>{RESULTS.length}</strong> results
              </span>
            </div>

            {/* ── Table ── */}
            <div className="overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FAFBFC" }}>
                    {[
                      { label: "Time",         align: "left"  as const, w: "8%" },
                      { label: "Match Context",align: "left"  as const, w: "20%" },
                      { label: "🥇 Gold",      align: "left"  as const, w: "14%" },
                      { label: "🥈 Silver",    align: "left"  as const, w: "14%" },
                      { label: "🥉 Bronze",    align: "left"  as const, w: "14%" },
                      { label: "Recorded By",  align: "left"  as const, w: "13%" },
                      { label: "Status",       align: "left"  as const, w: "10%" },
                      { label: "",             align: "right" as const, w: "7%" },
                    ].map((col) => (
                      <th key={col.label}
                        style={{ width: col.w, padding: "9px 16px", textAlign: col.align, borderBottom: "1.5px solid #F1F5F9", color: "#94A3B8", fontSize: "0.64rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap" }}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="flex flex-col items-center justify-center py-16">
                          <div className="flex items-center justify-center rounded-2xl mb-4" style={{ width: "64px", height: "64px", backgroundColor: "#F1F5F9", border: "2px dashed #E2E8F0" }}>
                            <Activity className="w-7 h-7" strokeWidth={1.5} style={{ color: "#CBD5E1" }} />
                          </div>
                          <p style={{ color: "#374151", fontSize: "0.9rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>No results found</p>
                          <p style={{ color: "#94A3B8", fontSize: "0.78rem", fontFamily: '"Inter", sans-serif', marginTop: "4px" }}>Try adjusting your search or filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((result, idx) => (
                      <ResultTableRow
                        key={result.id}
                        result={result}
                        idx={idx}
                        isLast={idx === filtered.length - 1}
                        onView={setDetailResult}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}>
              <div className="flex items-center gap-4">
                <span style={{ color: "#94A3B8", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif' }}>
                  Page <strong style={{ color: "#374151" }}>1</strong> of <strong style={{ color: "#374151" }}>35</strong>
                </span>
                <div className="flex items-center gap-3">
                  {(Object.entries(STATUS_CFG) as [ResultStatus, typeof STATUS_CFG[ResultStatus]][]).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className="rounded-full" style={{ width: "6px", height: "6px", backgroundColor: cfg.dot }} />
                      <span style={{ color: "#94A3B8", fontSize: "0.67rem", fontFamily: '"Inter", sans-serif' }}>
                        {cfg.label}: <strong style={{ color: "#374151" }}>{key === "official" ? officialCount : key === "provisional" ? provisionalCount : disputedCount}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, "…", 35].map((p, i) => (
                  <button key={i}
                    className="flex items-center justify-center rounded-md transition-colors"
                    style={{ minWidth: "28px", height: "28px", padding: "0 4px", backgroundColor: p === 1 ? "#0F172A" : "transparent", color: p === 1 ? "#FFFFFF" : p === "…" ? "#CBD5E1" : "#64748B", fontSize: "0.75rem", fontFamily: '"JetBrains Mono", monospace', border: `1.5px solid ${p === 1 ? "#0F172A" : p === "…" ? "transparent" : "#E2E8F0"}`, cursor: p === "…" ? "default" : "pointer" }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ height: "32px" }} />
        </div>
      </main>

      {/* ── Detail Modal ── */}
      {detailResult && <DetailModal result={detailResult} onClose={() => setDetailResult(null)} />}
    </>
  );
}
