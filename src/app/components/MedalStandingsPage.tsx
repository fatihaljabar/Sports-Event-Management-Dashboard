import React, { useState, useRef, useEffect } from "react";
import {
  Trophy,
  Download,
  ChevronDown,
  Check,
  Filter,
  X,
  Users,
  Globe,
  Medal,
  ArrowUpDown,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type ViewMode = "athlete" | "country";
type GenderFilter = "All" | "Men" | "Women" | "Mixed";

interface AthleteRecord {
  id: string;
  name: string;
  shortName: string;
  photo: string;
  country: string;
  countryFull: string;
  flag: string;
  sport: string;
  sportEmoji: string;
  gender: "Men" | "Women" | "Mixed";
  event: string;
  gold: number;
  silver: number;
  bronze: number;
}

interface CountryRecord {
  country: string;
  countryFull: string;
  flag: string;
  gold: number;
  silver: number;
  bronze: number;
}

/* ─────────────────────────────────────────────
   ATHLETE DATA
───────────────────────────────────────────── */
const ATHLETES: AthleteRecord[] = [
  {
    id: "A01", name: "Leon Marchand", shortName: "L. Marchand",
    photo: "https://images.unsplash.com/photo-1677170274581-b85e8469846c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "FRA", countryFull: "France", flag: "🇫🇷",
    sport: "Swimming", sportEmoji: "🏊", gender: "Men",
    event: "Asian Games 2026", gold: 4, silver: 0, bronze: 1,
  },
  {
    id: "A02", name: "Simone Biles", shortName: "S. Biles",
    photo: "https://images.unsplash.com/photo-1669627960958-b4a809aa76ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "USA", countryFull: "United States", flag: "🇺🇸",
    sport: "Gymnastics", sportEmoji: "🤸", gender: "Women",
    event: "Asian Games 2026", gold: 3, silver: 1, bronze: 0,
  },
  {
    id: "A03", name: "Zhang Yufei", shortName: "Z. Yufei",
    photo: "https://images.unsplash.com/photo-1609753606721-0fb89e91e44c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "CHN", countryFull: "China", flag: "🇨🇳",
    sport: "Swimming", sportEmoji: "🏊", gender: "Women",
    event: "Asian Games 2026", gold: 2, silver: 2, bronze: 2,
  },
  {
    id: "A04", name: "Caeleb Dressel", shortName: "C. Dressel",
    photo: "https://images.unsplash.com/photo-1530907016641-244f1ee66465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "USA", countryFull: "United States", flag: "🇺🇸",
    sport: "Swimming", sportEmoji: "🏊", gender: "Men",
    event: "Asian Games 2026", gold: 2, silver: 1, bronze: 0,
  },
  {
    id: "A05", name: "Noah Lyles", shortName: "N. Lyles",
    photo: "https://images.unsplash.com/photo-1766970096346-937852c7d350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "USA", countryFull: "United States", flag: "🇺🇸",
    sport: "Athletics", sportEmoji: "🏃", gender: "Men",
    event: "Asian Games 2026", gold: 2, silver: 0, bronze: 1,
  },
  {
    id: "A06", name: "Li Wenwen", shortName: "L. Wenwen",
    photo: "https://images.unsplash.com/photo-1756699490187-86e370baa3a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "CHN", countryFull: "China", flag: "🇨🇳",
    sport: "Weightlifting", sportEmoji: "🏋️", gender: "Women",
    event: "Asian Games 2026", gold: 1, silver: 2, bronze: 1,
  },
  {
    id: "A07", name: "Miltiadis Tentoglou", shortName: "M. Tentoglou",
    photo: "https://images.unsplash.com/photo-1622169804256-0eb6873ff441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "GRE", countryFull: "Greece", flag: "🇬🇷",
    sport: "Athletics", sportEmoji: "🏃", gender: "Men",
    event: "Asian Games 2026", gold: 1, silver: 1, bronze: 0,
  },
  {
    id: "A08", name: "Viktor Axelsen", shortName: "V. Axelsen",
    photo: "https://images.unsplash.com/photo-1545175928-65a104e66691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "DEN", countryFull: "Denmark", flag: "🇩🇰",
    sport: "Badminton", sportEmoji: "🏸", gender: "Men",
    event: "Asian Games 2026", gold: 1, silver: 0, bronze: 1,
  },
  {
    id: "A09", name: "Lalu Muhammad Zohri", shortName: "L. Zohri",
    photo: "https://images.unsplash.com/photo-1770564585770-90f5b235d28d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "IDN", countryFull: "Indonesia", flag: "🇮🇩",
    sport: "Athletics", sportEmoji: "🏃", gender: "Men",
    event: "Asian Games 2026", gold: 1, silver: 0, bronze: 0,
  },
  {
    id: "A10", name: "Elaine Thompson-Herah", shortName: "E. Thompson",
    photo: "https://images.unsplash.com/photo-1628970857977-3291ad0290b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "JAM", countryFull: "Jamaica", flag: "🇯🇲",
    sport: "Athletics", sportEmoji: "🏃", gender: "Women",
    event: "Unesa Cup", gold: 1, silver: 0, bronze: 0,
  },
  {
    id: "A11", name: "Kevin Sanjaya Sukamuljo", shortName: "K. Sanjaya",
    photo: "https://images.unsplash.com/photo-1609834265293-462cb479a028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "IDN", countryFull: "Indonesia", flag: "🇮🇩",
    sport: "Badminton", sportEmoji: "🏸", gender: "Men",
    event: "Asian Games 2026", gold: 0, silver: 1, bronze: 1,
  },
  {
    id: "A12", name: "Rebeca Andrade", shortName: "R. Andrade",
    photo: "https://images.unsplash.com/photo-1659303387945-227f9901ada4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    country: "BRA", countryFull: "Brazil", flag: "🇧🇷",
    sport: "Gymnastics", sportEmoji: "🤸", gender: "Women",
    event: "Asian Games 2026", gold: 0, silver: 1, bronze: 0,
  },
];

/* ─────────────────────────────────────────────
   COUNTRY DATA
───────────────────────────────────────────── */
const COUNTRIES: CountryRecord[] = [
  { country: "USA", countryFull: "United States", flag: "🇺🇸", gold: 7, silver: 2, bronze: 1 },
  { country: "FRA", countryFull: "France",         flag: "🇫🇷", gold: 4, silver: 0, bronze: 1 },
  { country: "CHN", countryFull: "China",           flag: "🇨🇳", gold: 3, silver: 4, bronze: 3 },
  { country: "GRE", countryFull: "Greece",          flag: "🇬🇷", gold: 1, silver: 1, bronze: 0 },
  { country: "DEN", countryFull: "Denmark",         flag: "🇩🇰", gold: 1, silver: 0, bronze: 1 },
  { country: "IDN", countryFull: "Indonesia",       flag: "🇮🇩", gold: 1, silver: 1, bronze: 1 },
  { country: "JAM", countryFull: "Jamaica",         flag: "🇯🇲", gold: 1, silver: 0, bronze: 0 },
  { country: "AUS", countryFull: "Australia",       flag: "🇦🇺", gold: 0, silver: 1, bronze: 1 },
  { country: "GER", countryFull: "Germany",         flag: "🇩🇪", gold: 0, silver: 1, bronze: 0 },
  { country: "BRA", countryFull: "Brazil",          flag: "🇧🇷", gold: 0, silver: 1, bronze: 0 },
];

const EVENTS   = ["All Events", "Asian Games 2026", "Unesa Cup", "Olympic Winter"];
const TEAMS    = ["All Teams", "United States", "France", "China", "Indonesia", "Greece", "Denmark", "Jamaica", "Australia", "Germany", "Brazil"];
const SPORTS   = ["All Sports", "Swimming", "Athletics", "Gymnastics", "Weightlifting", "Badminton"];
const GENDERS: GenderFilter[] = ["All", "Men", "Women", "Mixed"];

/* ─────────────────────────────────────────────
   RANK CONFIG
───────────────────────────────────────────── */
const RANK_STYLE: Record<number, { bg: string; numColor: string; border: string; glow: string; rowBg: string; borderLeft: string }> = {
  1: { bg: "linear-gradient(135deg,#FEF9C3,#FEF3C7)", numColor: "#D97706", border: "#FDE68A", glow: "rgba(245,158,11,0.15)", rowBg: "#FFFDF0", borderLeft: "#F59E0B" },
  2: { bg: "linear-gradient(135deg,#F8FAFC,#F1F5F9)", numColor: "#64748B", border: "#E2E8F0", glow: "rgba(100,116,139,0.08)", rowBg: "#FAFBFC", borderLeft: "#94A3B8" },
  3: { bg: "linear-gradient(135deg,#FFF7ED,#FEF3C7)", numColor: "#B45309", border: "#FDE68A", glow: "rgba(180,83,9,0.1)",  rowBg: "#FFFAF5", borderLeft: "#D97706" },
};

/* ─────────────────────────────────────────────
   MEDAL BADGE
───────────────────────────────────────────── */
function MedalBadge({ count, type }: { count: number; type: "gold" | "silver" | "bronze" }) {
  const cfg = {
    gold:   { emoji: "🥇", bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
    silver: { emoji: "🥈", bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" },
    bronze: { emoji: "🥉", bg: "#FFF7ED", text: "#78350F", border: "#FED7AA" },
  }[type];

  return (
    <div className="flex items-center gap-1.5 justify-center">
      <div
        className="flex items-center justify-center rounded-xl px-3 py-1.5"
        style={{ backgroundColor: cfg.bg, border: `1.5px solid ${cfg.border}`, minWidth: "48px" }}
      >
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontWeight: 700,
          fontSize: "1.25rem",
          color: count === 0 ? "#CBD5E1" : cfg.text,
          lineHeight: 1,
          letterSpacing: "0.02em",
        }}>
          {count}
        </span>
      </div>
    </div>
  );
}

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

function FilterDropdown({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
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
        <Filter className="w-3.5 h-3.5" strokeWidth={1.75} style={{ opacity: 0.6 }} />
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
   ATHLETE ROW
───────────────────────────────────────────── */
function AthleteRow({ athlete, rank, isLast }: { athlete: AthleteRecord; rank: number; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  const rankStyle = RANK_STYLE[rank];
  const total = athlete.gold + athlete.silver + athlete.bronze;
  const isTopThree = rank <= 3;

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? (isTopThree ? rankStyle?.rowBg : "#F5F9FF") : isTopThree ? rankStyle?.rowBg : rank % 2 === 0 ? "#FAFBFC" : "#FFFFFF",
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
        borderLeft: isTopThree ? `3px solid ${rankStyle?.borderLeft}` : "3px solid transparent",
        transition: "background-color 0.1s",
      }}
    >
      {/* Rank */}
      <td style={{ padding: "14px 16px 14px 20px", width: "72px" }}>
        <div className="flex items-center justify-center">
          {rank <= 3 ? (
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "44px", height: "44px",
                background: rankStyle.bg,
                border: `2px solid ${rankStyle.border}`,
                boxShadow: `0 4px 16px ${rankStyle.glow}`,
              }}
            >
              {rank === 1 ? (
                <Trophy className="w-5 h-5" strokeWidth={2} style={{ color: rankStyle.numColor }} />
              ) : (
                <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: "1.5rem", color: rankStyle.numColor, lineHeight: 1 }}>
                  {rank}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center" style={{ width: "44px", height: "44px" }}>
              <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: "1.35rem", color: "#CBD5E1", lineHeight: 1 }}>
                {rank}
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Athlete */}
      <td style={{ padding: "14px 16px" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 rounded-full overflow-hidden"
            style={{
              width: "44px", height: "44px",
              border: isTopThree ? `2.5px solid ${rankStyle?.border}` : "2px solid #F1F5F9",
              boxShadow: isTopThree ? `0 0 0 2px ${rankStyle?.rowBg}, 0 4px 12px ${rankStyle?.glow}` : "none",
            }}
          >
            <ImageWithFallback
              src={athlete.photo}
              alt={athlete.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="min-w-0">
            <p style={{ color: "#0F172A", fontSize: "0.88rem", fontWeight: 700, fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap" }}>
              {athlete.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span style={{ fontSize: "0.8rem" }}>{athlete.sportEmoji}</span>
              <span style={{ color: "#64748B", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                {athlete.sport}
              </span>
              <span style={{ color: "#E2E8F0", fontSize: "0.7rem" }}>·</span>
              <span style={{
                fontSize: "0.62rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, padding: "1px 6px", borderRadius: "4px",
                backgroundColor: athlete.gender === "Women" ? "#FCE7F3" : athlete.gender === "Men" ? "#EFF6FF" : "#F0FDF4",
                color: athlete.gender === "Women" ? "#9D174D" : athlete.gender === "Men" ? "#1D4ED8" : "#15803D",
                border: `1px solid ${athlete.gender === "Women" ? "#FBCFE8" : athlete.gender === "Men" ? "#BFDBFE" : "#BBF7D0"}`,
              }}>
                {athlete.gender}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Team */}
      <td style={{ padding: "14px 16px" }}>
        <div className="flex items-center gap-2.5">
          <span style={{ fontSize: "1.35rem", lineHeight: 1, flexShrink: 0 }}>{athlete.flag}</span>
          <div>
            <p style={{ color: "#374151", fontSize: "0.82rem", fontWeight: 600, fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap" }}>
              {athlete.countryFull}
            </p>
            <p style={{ color: "#CBD5E1", fontSize: "0.65rem", fontFamily: '"JetBrains Mono", monospace', letterSpacing: "0.04em" }}>
              {athlete.country}
            </p>
          </div>
        </div>
      </td>

      {/* Gold */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={athlete.gold} type="gold" />
      </td>

      {/* Silver */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={athlete.silver} type="silver" />
      </td>

      {/* Bronze */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={athlete.bronze} type="bronze" />
      </td>

      {/* Total */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <div className="flex items-center justify-center">
          <span style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 800,
            fontSize: "1.55rem",
            color: isTopThree ? rankStyle?.numColor : "#374151",
            lineHeight: 1,
          }}>
            {total}
          </span>
        </div>
        <p style={{ color: "#CBD5E1", fontSize: "0.6rem", fontFamily: '"Inter", sans-serif', textAlign: "center", marginTop: "2px" }}>medals</p>
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────────
   COUNTRY ROW
───────────────────────────────────────────── */
function CountryRow({ record, rank, isLast }: { record: CountryRecord; rank: number; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  const rankStyle = RANK_STYLE[rank];
  const isTopThree = rank <= 3;
  const total = record.gold + record.silver + record.bronze;

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? (isTopThree ? rankStyle?.rowBg : "#F5F9FF") : isTopThree ? rankStyle?.rowBg : rank % 2 === 0 ? "#FAFBFC" : "#FFFFFF",
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
        borderLeft: isTopThree ? `3px solid ${rankStyle?.borderLeft}` : "3px solid transparent",
        transition: "background-color 0.1s",
      }}
    >
      {/* Rank */}
      <td style={{ padding: "14px 16px 14px 20px", width: "72px" }}>
        <div className="flex justify-center">
          {isTopThree ? (
            <div className="flex items-center justify-center rounded-xl" style={{ width: "44px", height: "44px", background: rankStyle.bg, border: `2px solid ${rankStyle.border}`, boxShadow: `0 4px 16px ${rankStyle.glow}` }}>
              {rank === 1
                ? <Trophy className="w-5 h-5" strokeWidth={2} style={{ color: rankStyle.numColor }} />
                : <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: "1.5rem", color: rankStyle.numColor, lineHeight: 1 }}>{rank}</span>
              }
            </div>
          ) : (
            <div className="flex items-center justify-center" style={{ width: "44px", height: "44px" }}>
              <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: "1.35rem", color: "#CBD5E1", lineHeight: 1 }}>{rank}</span>
            </div>
          )}
        </div>
      </td>

      {/* Country */}
      <td style={{ padding: "14px 16px" }}>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "2rem", lineHeight: 1, flexShrink: 0 }}>{record.flag}</span>
          <div>
            <p style={{ color: "#0F172A", fontSize: "0.92rem", fontWeight: 700, fontFamily: '"Inter", sans-serif' }}>{record.countryFull}</p>
            <p style={{ color: "#CBD5E1", fontSize: "0.65rem", fontFamily: '"JetBrains Mono", monospace', letterSpacing: "0.05em" }}>{record.country}</p>
          </div>
        </div>
      </td>

      {/* Medal bars visual */}
      <td style={{ padding: "14px 16px", width: "140px" }}>
        {total > 0 && (
          <div>
            <div className="flex rounded-full overflow-hidden" style={{ height: "6px", gap: "1px" }}>
              {record.gold > 0 && <div style={{ flex: record.gold, backgroundColor: "#F59E0B", borderRadius: "3px 0 0 3px" }} />}
              {record.silver > 0 && <div style={{ flex: record.silver, backgroundColor: "#94A3B8" }} />}
              {record.bronze > 0 && <div style={{ flex: record.bronze, backgroundColor: "#D97706", borderRadius: "0 3px 3px 0" }} />}
            </div>
            <p style={{ color: "#CBD5E1", fontSize: "0.6rem", fontFamily: '"Inter", sans-serif', marginTop: "3px" }}>{total} total medals</p>
          </div>
        )}
      </td>

      {/* Gold */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={record.gold} type="gold" />
      </td>
      {/* Silver */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={record.silver} type="silver" />
      </td>
      {/* Bronze */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={record.bronze} type="bronze" />
      </td>
      {/* Total */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: "1.55rem", color: isTopThree ? rankStyle?.numColor : "#374151", lineHeight: 1 }}>{total}</span>
        <p style={{ color: "#CBD5E1", fontSize: "0.6rem", fontFamily: '"Inter", sans-serif', marginTop: "2px" }}>medals</p>
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────────
   PODIUM HERO (Top 3 visual)
───────────────────────────────────────────── */
function PodiumHero({ athletes, countries, view }: {
  athletes: AthleteRecord[]; countries: CountryRecord[]; view: ViewMode;
}) {
  if (view === "athlete") {
    const top3 = athletes.slice(0, 3);
    if (top3.length < 3) return null;
    const order = [top3[1], top3[0], top3[2]]; // Silver, Gold, Bronze display order
    const heights = ["h-24", "h-32", "h-20"];
    const rankLabels = ["2nd", "1st", "3rd"];
    const rankColors = ["#94A3B8", "#F59E0B", "#D97706"];
    const rankEmojis = ["🥈", "🥇", "🥉"];
    const podiumColors = ["#F8FAFC", "#FFFBEB", "#FFF7ED"];
    const podiumBorders = ["#E2E8F0", "#FDE68A", "#FED7AA"];

    return (
      <div
        className="rounded-2xl p-6 mb-5"
        style={{ background: "linear-gradient(135deg,#0F172A 0%,#1E293B 60%,#0F172A 100%)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center rounded-xl" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#F59E0B,#EF4444)", boxShadow: "0 4px 16px rgba(245,158,11,0.3)" }}>
            <Trophy className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: "1.25rem", color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1 }}>
              Podium — Top 3 Athletes
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.7rem", fontFamily: '"Inter", sans-serif' }}>Based on gold medal count (Olympic standard)</p>
          </div>
        </div>

        {/* Podium visual */}
        <div className="flex items-end justify-center gap-4">
          {order.map((athlete, i) => {
            const origRank = i === 1 ? 1 : i === 0 ? 2 : 3;
            const total = athlete.gold + athlete.silver + athlete.bronze;
            return (
              <div key={athlete.id} className="flex flex-col items-center gap-3" style={{ width: "160px" }}>
                {/* Athlete info above podium */}
                <div className="flex flex-col items-center gap-2">
                  {/* Rank emoji */}
                  <span style={{ fontSize: "1.5rem" }}>{rankEmojis[i]}</span>
                  {/* Avatar */}
                  <div className="rounded-full overflow-hidden" style={{ width: "56px", height: "56px", border: `3px solid ${rankColors[i]}`, boxShadow: `0 0 0 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.4)` }}>
                    <ImageWithFallback src={athlete.photo} alt={athlete.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div className="text-center">
                    <p style={{ color: "#FFFFFF", fontSize: "0.82rem", fontWeight: 700, fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap" }}>{athlete.shortName}</p>
                    <div className="flex items-center gap-1 justify-center mt-0.5">
                      <span style={{ fontSize: "0.9rem" }}>{athlete.flag}</span>
                      <span style={{ color: "#94A3B8", fontSize: "0.65rem", fontFamily: '"Inter", sans-serif' }}>{athlete.country}</span>
                    </div>
                    <p style={{ color: "#64748B", fontSize: "0.65rem", fontFamily: '"Inter", sans-serif', marginTop: "1px" }}>
                      {athlete.sportEmoji} {athlete.sport}
                    </p>
                  </div>
                  {/* Medal pills */}
                  <div className="flex items-center gap-1">
                    <span style={{ fontSize: "0.75rem" }}>🥇{athlete.gold}</span>
                    <span style={{ fontSize: "0.75rem" }}>🥈{athlete.silver}</span>
                    <span style={{ fontSize: "0.75rem" }}>🥉{athlete.bronze}</span>
                  </div>
                </div>
                {/* Podium block */}
                <div
                  className={`w-full flex items-center justify-center rounded-t-xl ${heights[i]}`}
                  style={{ backgroundColor: podiumColors[i], border: `2px solid ${podiumBorders[i]}`, borderBottom: "none", position: "relative" }}
                >
                  <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: "2.5rem", color: rankColors[i], opacity: 0.3, position: "absolute" }}>
                    {rankLabels[i]}
                  </span>
                  <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: "1rem", color: rankColors[i], position: "relative", letterSpacing: "0.04em" }}>
                    {rankLabels[i]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Country podium
  const top3c = countries.slice(0, 3);
  if (top3c.length < 3) return null;
  const orderC = [top3c[1], top3c[0], top3c[2]];
  const heights = ["h-24", "h-32", "h-20"];
  const rankLabels = ["2nd", "1st", "3rd"];
  const rankColors = ["#94A3B8", "#F59E0B", "#D97706"];
  const rankEmojis = ["🥈", "🥇", "🥉"];
  const podiumColors = ["#F8FAFC", "#FFFBEB", "#FFF7ED"];
  const podiumBorders = ["#E2E8F0", "#FDE68A", "#FED7AA"];

  return (
    <div className="rounded-2xl p-6 mb-5" style={{ background: "linear-gradient(135deg,#0F172A 0%,#1E293B 60%,#0F172A 100%)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center rounded-xl" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#F59E0B,#EF4444)", boxShadow: "0 4px 16px rgba(245,158,11,0.3)" }}>
          <Globe className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: "1.25rem", color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1 }}>
            Podium — Top 3 Nations
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.7rem", fontFamily: '"Inter", sans-serif' }}>Ranked by gold medal count</p>
        </div>
      </div>
      <div className="flex items-end justify-center gap-4">
        {orderC.map((c, i) => (
          <div key={c.country} className="flex flex-col items-center gap-3" style={{ width: "160px" }}>
            <div className="flex flex-col items-center gap-2">
              <span style={{ fontSize: "1.5rem" }}>{rankEmojis[i]}</span>
              <span style={{ fontSize: "2.8rem", lineHeight: 1 }}>{c.flag}</span>
              <div className="text-center">
                <p style={{ color: "#FFFFFF", fontSize: "0.85rem", fontWeight: 700, fontFamily: '"Inter", sans-serif' }}>{c.countryFull}</p>
                <p style={{ color: "#64748B", fontSize: "0.65rem", fontFamily: '"JetBrains Mono", monospace', marginTop: "2px" }}>{c.country}</p>
              </div>
              <div className="flex items-center gap-1">
                <span style={{ fontSize: "0.75rem" }}>🥇{c.gold}</span>
                <span style={{ fontSize: "0.75rem" }}>🥈{c.silver}</span>
                <span style={{ fontSize: "0.75rem" }}>🥉{c.bronze}</span>
              </div>
            </div>
            <div className={`w-full flex items-center justify-center rounded-t-xl ${heights[i]}`}
              style={{ backgroundColor: podiumColors[i], border: `2px solid ${podiumBorders[i]}`, borderBottom: "none", position: "relative" }}>
              <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: "2.5rem", color: rankColors[i], opacity: 0.2, position: "absolute" }}>{rankLabels[i]}</span>
              <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: "1rem", color: rankColors[i], position: "relative", letterSpacing: "0.04em" }}>{rankLabels[i]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export function MedalStandingsPage() {
  const [view, setView] = useState<ViewMode>("athlete");
  const [eventFilter, setEventFilter] = useState(EVENTS[0]);
  const [teamFilter, setTeamFilter] = useState(TEAMS[0]);
  const [sportFilter, setSportFilter] = useState(SPORTS[0]);
  const [gender, setGender] = useState<GenderFilter>("All");
  const [search, setSearch] = useState("");

  /* Sort: gold desc → silver desc → bronze desc */
  const sortedAthletes = [...ATHLETES]
    .filter((a) => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.country.toLowerCase().includes(q) || a.countryFull.toLowerCase().includes(q);
      const matchEvent  = eventFilter === EVENTS[0] || a.event === eventFilter;
      const matchTeam   = teamFilter  === TEAMS[0]  || a.countryFull === teamFilter;
      const matchSport  = sportFilter === SPORTS[0] || a.sport === sportFilter;
      const matchGender = gender === "All" || a.gender === gender;
      return matchSearch && matchEvent && matchTeam && matchSport && matchGender;
    })
    .sort((a, b) => b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze);

  const sortedCountries = [...COUNTRIES].sort((a, b) => b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze);

  const activeFilters = [eventFilter !== EVENTS[0], teamFilter !== TEAMS[0], sportFilter !== SPORTS[0], gender !== "All"].filter(Boolean).length;

  const totalMedals = ATHLETES.reduce((acc, a) => acc + a.gold + a.silver + a.bronze, 0);

  return (
    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="px-6 py-6" style={{ maxWidth: "1400px" }}>

        {/* ══════  HEADER  ══════ */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: "#94A3B8", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif' }}>Dashboard</span>
              <span style={{ color: "#CBD5E1" }}>/</span>
              <span style={{ color: "#2563EB", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>Medal Standings</span>
            </div>
            <h1 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: "2.25rem", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1 }}>
              Medal Standings
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "0.82rem", fontFamily: '"Inter", sans-serif', marginTop: "0.4rem" }}>
              Individual athlete and national medal leaderboards — ranked by gold count.
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg,#0F172A,#1E293B)", color: "#FFFFFF", fontSize: "0.84rem", fontFamily: '"Inter", sans-serif', fontWeight: 600, boxShadow: "0 4px 16px rgba(15,23,42,0.22)", border: "none" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#1E293B,#334155)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#0F172A,#1E293B)"}
          >
            <Download className="w-4 h-4" strokeWidth={2} />
            Export Report
          </button>
        </div>

        {/* ══════  VIEW TOGGLE + FILTERS  ══════ */}
        <div
          className="rounded-2xl px-5 py-4 mb-5 flex items-center gap-4 flex-wrap"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          {/* Toggle tabs */}
          <div className="flex items-center rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1.5px solid #E2E8F0", backgroundColor: "#F8FAFC" }}>
            {([
              { id: "athlete", icon: <Users className="w-3.5 h-3.5" strokeWidth={1.75} />, label: "By Athlete" },
              { id: "country", icon: <Globe className="w-3.5 h-3.5"  strokeWidth={1.75} />, label: "By Country" },
            ] as { id: ViewMode; icon: React.ReactNode; label: string }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2 transition-all"
                style={{
                  backgroundColor: view === tab.id ? "#0F172A" : "transparent",
                  color: view === tab.id ? "#FFFFFF" : "#64748B",
                  fontSize: "0.8rem", fontFamily: '"Inter", sans-serif',
                  fontWeight: view === tab.id ? 600 : 400,
                  border: "none", whiteSpace: "nowrap",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "28px", backgroundColor: "#F1F5F9", flexShrink: 0 }} />

          {/* Filters */}
          <FilterDropdown label="Filter Event"   options={EVENTS}  value={eventFilter} onChange={setEventFilter} />
          {view === "athlete" && (
            <>
              <FilterDropdown label="Filter Team / Country" options={TEAMS}  value={teamFilter}  onChange={setTeamFilter} />
              <FilterDropdown label="Filter Sport" options={SPORTS} value={sportFilter} onChange={setSportFilter} />

              {/* Gender toggle pills */}
              <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ backgroundColor: "#F8FAFC", border: "1.5px solid #E2E8F0" }}>
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className="rounded-md px-3 py-1.5 transition-all"
                    style={{
                      backgroundColor: gender === g ? "#FFFFFF" : "transparent",
                      color: gender === g ? "#0F172A" : "#94A3B8",
                      fontSize: "0.76rem", fontFamily: '"Inter", sans-serif',
                      fontWeight: gender === g ? 600 : 400,
                      border: `1.5px solid ${gender === g ? "#E2E8F0" : "transparent"}`,
                      boxShadow: gender === g ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </>
          )}

          {activeFilters > 0 && (
            <button
              onClick={() => { setEventFilter(EVENTS[0]); setTeamFilter(TEAMS[0]); setSportFilter(SPORTS[0]); setGender("All"); }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all"
              style={{ border: "1.5px solid #FECACA", backgroundColor: "#FFF5F5", color: "#DC2626", fontSize: "0.78rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, whiteSpace: "nowrap" }}
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
              Clear {activeFilters}
            </button>
          )}

          <div className="flex-1" />

          {/* Search */}
          <div className="relative flex-shrink-0" style={{ width: "220px" }}>
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#CBD5E1" }} />
            <input
              type="text"
              placeholder={view === "athlete" ? "Search athlete…" : "Search country…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg outline-none"
              style={{ paddingLeft: "2.1rem", paddingRight: "0.75rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", backgroundColor: "#F8FAFC", border: "1.5px solid #E2E8F0", fontSize: "0.8rem", fontFamily: '"Inter", sans-serif', color: "#1E293B" }}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#2563EB")}
              onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")}
            />
          </div>
        </div>

        {/* ══════  PODIUM HERO  ══════ */}
        <PodiumHero athletes={sortedAthletes} countries={sortedCountries} view={view} />

        {/* ══════  TABLE CARD  ══════ */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>

          {/* Table header row */}
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}>
            <div className="flex items-center gap-2">
              <Medal className="w-4 h-4" strokeWidth={1.75} style={{ color: "#F59E0B" }} />
              <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: "1rem", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {view === "athlete" ? "Athlete Rankings" : "National Medal Tally"}
              </span>
              <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: "#F1F5F9", color: "#64748B", fontSize: "0.7rem", fontFamily: '"Inter", sans-serif' }}>
                {view === "athlete" ? `${sortedAthletes.length} athletes` : `${sortedCountries.length} nations`}
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif' }}>
              {totalMedals} total medals · Ranked by 🥇 gold
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#FAFBFC" }}>
                  {view === "athlete" ? (
                    <>
                      {[
                        { label: "Rank",       w: "72px",  align: "center" as const },
                        { label: "Athlete",    w: "260px", align: "left"   as const },
                        { label: "Team",       w: "160px", align: "left"   as const },
                        { label: "🥇 Gold",   w: "96px",  align: "center" as const },
                        { label: "🥈 Silver", w: "96px",  align: "center" as const },
                        { label: "🥉 Bronze", w: "96px",  align: "center" as const },
                        { label: "Total",      w: "80px",  align: "center" as const },
                      ].map((col) => (
                        <th key={col.label} style={{ width: col.w, padding: "9px 16px", textAlign: col.align, borderBottom: "1.5px solid #F1F5F9", color: "#94A3B8", fontSize: "0.64rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap" }}>
                          {col.label}
                        </th>
                      ))}
                    </>
                  ) : (
                    <>
                      {[
                        { label: "Rank",       w: "72px",  align: "center" as const },
                        { label: "Nation",     w: "200px", align: "left"   as const },
                        { label: "Distribution",w:"140px", align: "left"   as const },
                        { label: "🥇 Gold",   w: "96px",  align: "center" as const },
                        { label: "🥈 Silver", w: "96px",  align: "center" as const },
                        { label: "🥉 Bronze", w: "96px",  align: "center" as const },
                        { label: "Total",      w: "80px",  align: "center" as const },
                      ].map((col) => (
                        <th key={col.label} style={{ width: col.w, padding: "9px 16px", textAlign: col.align, borderBottom: "1.5px solid #F1F5F9", color: "#94A3B8", fontSize: "0.64rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap" }}>
                          {col.label}
                        </th>
                      ))}
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {view === "athlete" ? (
                  sortedAthletes.length === 0 ? (
                    <tr><td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-14">
                        <Medal className="w-10 h-10 mb-3" strokeWidth={1.25} style={{ color: "#E2E8F0" }} />
                        <p style={{ color: "#374151", fontSize: "0.9rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>No athletes found</p>
                        <p style={{ color: "#94A3B8", fontSize: "0.78rem", fontFamily: '"Inter", sans-serif', marginTop: "4px" }}>Adjust your filters above.</p>
                      </div>
                    </td></tr>
                  ) : (
                    sortedAthletes.map((athlete, idx) => (
                      <AthleteRow key={athlete.id} athlete={athlete} rank={idx + 1} isLast={idx === sortedAthletes.length - 1} />
                    ))
                  )
                ) : (
                  sortedCountries.map((c, idx) => (
                    <CountryRow key={c.country} record={c} rank={idx + 1} isLast={idx === sortedCountries.length - 1} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full" style={{ width: "6px", height: "6px", backgroundColor: "#F59E0B" }} />
                <span style={{ color: "#94A3B8", fontSize: "0.67rem", fontFamily: '"Inter", sans-serif' }}>Top 3 rows highlighted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 rounded-full" style={{ background: "linear-gradient(90deg,#F59E0B,#94A3B8,#D97706)" }} />
                <span style={{ color: "#94A3B8", fontSize: "0.67rem", fontFamily: '"Inter", sans-serif' }}>Medal bar (G/S/B)</span>
              </div>
            </div>
            <p style={{ color: "#CBD5E1", fontSize: "0.67rem", fontFamily: '"Inter", sans-serif' }}>
              Last updated: Feb 24, 2026 · <span style={{ fontFamily: '"JetBrains Mono", monospace' }}>14:05 UTC</span>
            </p>
          </div>
        </div>

        <div style={{ height: "32px" }} />
      </div>
    </main>
  );
}
