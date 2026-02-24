import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  KeyRound,
  Users,
  ShieldAlert,
  ChevronDown,
  Copy,
  Check,
  MoreVertical,
  Pencil,
  ShieldOff,
  RotateCcw,
  Clock,
  Filter,
  X,
  UserCog,
  Activity,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type OrgStatus = "active" | "revoked" | "suspended";

interface Organizer {
  id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  event: string;
  eventEmoji: string;
  division: string;
  divisionEmoji: string;
  accessKey: string;
  lastLogin: string;
  lastLoginRelative: string;
  status: OrgStatus;
  permissions: string[];
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const ORGANIZERS: Organizer[] = [
  {
    id: "ORG-001",
    name: "Sarah Jenkins",
    email: "s.jenkins@asiangames2026.org",
    photo: "https://images.unsplash.com/photo-1771240730126-594a8ab66be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    role: "Swimming Coordinator",
    event: "Asian Games 2026",
    eventEmoji: "🏆",
    division: "Swimming",
    divisionEmoji: "🏊",
    accessKey: "AG26-COORD-SWIM",
    lastLogin: "Feb 24, 2026 · 14:03",
    lastLoginRelative: "2 mins ago",
    status: "active",
    permissions: ["View Results", "Edit Schedule", "Manage Roster"],
  },
  {
    id: "ORG-002",
    name: "Ahmad Dani",
    email: "ahmad.dani@unesacup.id",
    photo: "https://images.unsplash.com/photo-1648448942225-7aa06c7e8f79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    role: "Venue Manager",
    event: "Unesa Cup",
    eventEmoji: "⚽",
    division: "Futsal",
    divisionEmoji: "🥅",
    accessKey: "UNESA-MGR-FTSL",
    lastLogin: "Feb 24, 2026 · 13:51",
    lastLoginRelative: "14 mins ago",
    status: "active",
    permissions: ["View Results", "Manage Venue", "Edit Schedule"],
  },
  {
    id: "ORG-003",
    name: "Marcus Reid",
    email: "m.reid@asiangames2026.org",
    photo: "https://images.unsplash.com/photo-1622169804256-0eb6873ff441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    role: "Head Referee",
    event: "Asian Games 2026",
    eventEmoji: "🏆",
    division: "Basketball — Men",
    divisionEmoji: "🏀",
    accessKey: "AG26-REF-BSKT",
    lastLogin: "Feb 24, 2026 · 13:05",
    lastLoginRelative: "1 hr ago",
    status: "active",
    permissions: ["View Results", "Publish Scores"],
  },
  {
    id: "ORG-004",
    name: "Linda Hartono",
    email: "l.hartono@asiangames2026.org",
    photo: "https://images.unsplash.com/photo-1659353220612-2f4adc1d6d42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    role: "Event Coordinator",
    event: "Asian Games 2026",
    eventEmoji: "🏆",
    division: "Athletics",
    divisionEmoji: "🏃",
    accessKey: "AG26-COORD-ATL",
    lastLogin: "Feb 24, 2026 · 11:10",
    lastLoginRelative: "3 hrs ago",
    status: "active",
    permissions: ["View Results", "Edit Schedule", "Manage Roster", "Publish Scores"],
  },
  {
    id: "ORG-005",
    name: "Mei Lin Chen",
    email: "mei.chen@owinter2026.org",
    photo: "https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    role: "Operations Analyst",
    event: "Olympic Winter",
    eventEmoji: "⛷️",
    division: "Alpine Skiing",
    divisionEmoji: "🎿",
    accessKey: "OW26-OPS-SKI",
    lastLogin: "Feb 23, 2026 · 20:44",
    lastLoginRelative: "Yesterday",
    status: "active",
    permissions: ["View Results", "Analytics Read"],
  },
  {
    id: "ORG-006",
    name: "Roberto Alves",
    email: "r.alves@unesacup.id",
    photo: "https://images.unsplash.com/photo-1747994723854-a77c99997656?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    role: "Field Supervisor",
    event: "Unesa Cup",
    eventEmoji: "⚽",
    division: "Football",
    divisionEmoji: "⚽",
    accessKey: "UNESA-SUP-FTBL",
    lastLogin: "Feb 21, 2026 · 09:14",
    lastLoginRelative: "3 days ago",
    status: "revoked",
    permissions: ["View Results"],
  },
  {
    id: "ORG-007",
    name: "Priya Sharma",
    email: "p.sharma@asiangames2026.org",
    photo: "https://images.unsplash.com/photo-1770627000564-3feb36aecbcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    role: "Technical Director",
    event: "Asian Games 2026",
    eventEmoji: "🏆",
    division: "Gymnastics",
    divisionEmoji: "🤸",
    accessKey: "AG26-DIR-GYM",
    lastLogin: "Feb 24, 2026 · 14:00",
    lastLoginRelative: "5 mins ago",
    status: "active",
    permissions: ["View Results", "Edit Schedule", "Manage Roster", "Publish Scores", "Admin Panel"],
  },
  {
    id: "ORG-008",
    name: "David Torres",
    email: "d.torres@unesacup.id",
    photo: "https://images.unsplash.com/photo-1622169804256-0eb6873ff441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    role: "Logistics Manager",
    event: "Unesa Cup",
    eventEmoji: "⚽",
    division: "Basketball",
    divisionEmoji: "🏀",
    accessKey: "UNESA-LOG-BSKT",
    lastLogin: "Feb 24, 2026 · 13:23",
    lastLoginRelative: "42 mins ago",
    status: "active",
    permissions: ["View Results", "Manage Venue"],
  },
];

const EVENTS = ["All Events", "Asian Games 2026", "Unesa Cup", "Olympic Winter"];
const DIVISIONS = ["All Divisions", "Swimming", "Athletics", "Basketball — Men", "Basketball", "Gymnastics", "Futsal", "Football", "Alpine Skiing"];

const STATUS_CFG: Record<OrgStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  active:    { label: "Active",    dot: "#22C55E", bg: "#DCFCE7", text: "#15803D", border: "#BBF7D0" },
  revoked:   { label: "Revoked",   dot: "#EF4444", bg: "#FEE2E2", text: "#DC2626", border: "#FECACA" },
  suspended: { label: "Suspended", dot: "#F59E0B", bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
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
   COPY KEY BUTTON
──────────────────────────────────���────────── */
function CopyKey({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="flex items-center gap-2">
      <span
        className="rounded-lg px-2.5 py-1.5 select-all"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: 500,
          fontSize: "0.75rem",
          color: "#475569",
          backgroundColor: "#F1F5F9",
          border: "1.5px solid #E2E8F0",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
      <button
        onClick={handle}
        title="Copy key"
        className="flex items-center justify-center rounded-md transition-all flex-shrink-0"
        style={{
          width: "24px", height: "24px",
          backgroundColor: copied ? "#DCFCE7" : "#F8FAFC",
          border: `1.5px solid ${copied ? "#BBF7D0" : "#E2E8F0"}`,
          color: copied ? "#15803D" : "#94A3B8",
        }}
        onMouseEnter={(e) => { if (!copied) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1"; } }}
        onMouseLeave={(e) => { if (!copied) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0"; } }}
      >
        {copied
          ? <Check className="w-3 h-3" strokeWidth={2.5} />
          : <Copy className="w-3 h-3" strokeWidth={1.75} />}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILTER DROPDOWN
───────────────────────────────────────────── */
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
          fontSize: "0.8rem",
          fontFamily: '"Inter", sans-serif',
          fontWeight: isFiltered ? 600 : 400,
          whiteSpace: "nowrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <Filter className="w-3.5 h-3.5" strokeWidth={1.75} style={{ opacity: 0.7 }} />
        <span>{isFiltered ? value : label}</span>
        <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", opacity: 0.6 }} />
      </button>
      {open && (
        <div
          className="absolute left-0 z-50 rounded-xl overflow-hidden py-1 mt-1"
          style={{ minWidth: "200px", backgroundColor: "#FFFFFF", boxShadow: "0 8px 28px rgba(0,0,0,0.11)", border: "1px solid #E2E8F0" }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-3.5 py-2.5 flex items-center gap-2 transition-colors"
              style={{
                backgroundColor: value === opt ? "#EFF6FF" : "transparent",
                color: value === opt ? "#1D4ED8" : "#374151",
                fontSize: "0.8rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: value === opt ? 600 : 400,
                border: "none",
              }}
              onMouseEnter={(e) => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
              onMouseLeave={(e) => { if (value !== opt) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              {value === opt
                ? <Check className="w-3 h-3 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                : <span style={{ width: "12px", display: "inline-block" }} />}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   3-DOT ACTION MENU
───────────────────────────────────────────── */
function ActionMenu({ org }: { org: Organizer }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  const items = [
    { icon: <Pencil className="w-3.5 h-3.5" />, label: "Edit Access", color: "#374151" },
    { icon: <RotateCcw className="w-3.5 h-3.5" />, label: "Reset Password", color: "#374151" },
    { icon: <ShieldOff className="w-3.5 h-3.5" />, label: org.status === "revoked" ? "Reinstate Key" : "Revoke Key", color: org.status === "revoked" ? "#059669" : "#EF4444" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex items-center justify-center rounded-lg transition-all"
        style={{
          width: "28px", height: "28px",
          color: "#94A3B8",
          border: `1.5px solid ${open ? "#E2E8F0" : "transparent"}`,
          backgroundColor: open ? "#F1F5F9" : "transparent",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0"; }}
        onMouseLeave={(e) => { if (!open) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent"; } }}
      >
        <MoreVertical className="w-3.5 h-3.5" strokeWidth={1.75} />
      </button>
      {open && (
        <div
          className="absolute right-0 z-50 rounded-xl overflow-hidden py-1"
          style={{ top: "34px", minWidth: "172px", backgroundColor: "#FFFFFF", boxShadow: "0 8px 28px rgba(0,0,0,0.12)", border: "1px solid #E2E8F0" }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-colors text-left"
              style={{ color: item.color, fontSize: "0.8rem", fontFamily: '"Inter", sans-serif', backgroundColor: "transparent", border: "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
            >
              <span style={{ color: item.color, opacity: 0.7 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PERMISSION CHIPS
───────────────────────────────────────────── */
function PermissionChips({ perms }: { perms: string[] }) {
  const visible = perms.slice(0, 2);
  const overflow = perms.length - 2;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((p) => (
        <span
          key={p}
          className="rounded-md px-1.5 py-0.5"
          style={{ backgroundColor: "#F1F5F9", color: "#475569", fontSize: "0.6rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, whiteSpace: "nowrap", border: "1px solid #E2E8F0" }}
        >
          {p}
        </span>
      ))}
      {overflow > 0 && (
        <span className="rounded-md px-1.5 py-0.5" style={{ backgroundColor: "#F8FAFC", color: "#94A3B8", fontSize: "0.6rem", fontFamily: '"Inter", sans-serif', border: "1px solid #E2E8F0" }}>
          +{overflow}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TABLE ROW
───────────────────────────────────────────── */
function OrgRow({ org, idx, isLast }: { org: Organizer; idx: number; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isZebra = idx % 2 !== 0;
  const status = STATUS_CFG[org.status];
  const evColor = EVENT_COLOR[org.event] ?? { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" };
  const isRevoked = org.status === "revoked";

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#F5F9FF" : isZebra ? "#FAFBFC" : "#FFFFFF",
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
        transition: "background-color 0.1s",
        opacity: isRevoked ? 0.65 : 1,
      }}
    >
      {/* Organizer Identity */}
      <td style={{ padding: "14px 20px" }}>
        <div className="flex items-center gap-3">
          {/* Avatar + online dot */}
          <div className="relative flex-shrink-0">
            <div
              className="rounded-xl overflow-hidden"
              style={{ width: "40px", height: "40px", border: "2px solid #F1F5F9", filter: isRevoked ? "grayscale(100%)" : "none" }}
            >
              <ImageWithFallback
                src={org.photo}
                alt={org.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {!isRevoked && (
              <div
                className="absolute -bottom-0.5 -right-0.5 rounded-full"
                style={{ width: "10px", height: "10px", backgroundColor: "#22C55E", border: "2px solid #FFFFFF", boxShadow: "0 0 4px #22C55E66" }}
              />
            )}
          </div>
          <div className="min-w-0">
            <p style={{ color: "#0F172A", fontSize: "0.86rem", fontWeight: 600, fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap" }}>
              {org.name}
            </p>
            <p style={{ color: "#94A3B8", fontSize: "0.71rem", fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {org.email}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <UserCog className="w-2.5 h-2.5" strokeWidth={1.75} style={{ color: "#CBD5E1", flexShrink: 0 }} />
              <span style={{ color: "#64748B", fontSize: "0.68rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, whiteSpace: "nowrap" }}>
                {org.role}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Assigned Scope */}
      <td style={{ padding: "14px 20px" }}>
        <div className="flex flex-col gap-1.5">
          {/* Event badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 self-start"
            style={{ backgroundColor: evColor.bg, border: `1px solid ${evColor.border}` }}
          >
            <span style={{ fontSize: "0.78rem" }}>{org.eventEmoji}</span>
            <span style={{ color: evColor.text, fontSize: "0.71rem", fontWeight: 600, fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap" }}>
              {org.event}
            </span>
          </div>
          {/* Division pill */}
          <div
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 self-start"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
          >
            <span style={{ fontSize: "0.75rem" }}>{org.divisionEmoji}</span>
            <span style={{ color: "#374151", fontSize: "0.68rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, whiteSpace: "nowrap" }}>
              {org.division}
            </span>
          </div>
        </div>
      </td>

      {/* Permissions */}
      <td style={{ padding: "14px 20px" }}>
        <PermissionChips perms={org.permissions} />
      </td>

      {/* Access Key */}
      <td style={{ padding: "14px 20px" }}>
        <CopyKey value={org.accessKey} />
      </td>

      {/* Last Login */}
      <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
        <div className="flex items-start gap-1.5">
          <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" strokeWidth={1.75} style={{ color: "#CBD5E1" }} />
          <div>
            <p style={{ color: "#374151", fontSize: "0.76rem", fontWeight: 500, fontFamily: '"Inter", sans-serif' }}>
              {org.lastLoginRelative}
            </p>
            <p style={{ color: "#CBD5E1", fontSize: "0.62rem", fontFamily: '"JetBrains Mono", monospace' }}>
              {org.lastLogin}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td style={{ padding: "14px 20px" }}>
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{ backgroundColor: status.bg, border: `1px solid ${status.border}` }}
        >
          <div
            className="rounded-full flex-shrink-0"
            style={{ width: "6px", height: "6px", backgroundColor: status.dot, boxShadow: org.status === "active" ? `0 0 4px ${status.dot}` : "none" }}
          />
          <span style={{ color: status.text, fontSize: "0.72rem", fontWeight: 600, fontFamily: '"Inter", sans-serif', whiteSpace: "nowrap" }}>
            {status.label}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td style={{ padding: "14px 20px" }}>
        <div className="flex items-center gap-1.5 justify-end">
          <button
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all"
            style={{ border: "1.5px solid #BFDBFE", backgroundColor: "#EFF6FF", color: "#1D4ED8", fontSize: "0.74rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#DBEAFE"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EFF6FF"; }}
          >
            <Pencil className="w-3 h-3" strokeWidth={1.75} />
            Edit Access
          </button>
          <ActionMenu org={org} />
        </div>
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ icon, iconBg, label, value, sub, accentColor, trend }: {
  icon: React.ReactNode; iconBg: string; label: string; value: string; sub: string; accentColor?: string; trend?: string;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-5 py-4"
      style={{ backgroundColor: "#FFFFFF", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", flex: 1 }}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{ width: "42px", height: "42px", background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ color: "#94A3B8", fontSize: "0.67rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <p style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: "1.9rem", color: accentColor ?? "#0F172A", lineHeight: 1.1 }}>
            {value}
          </p>
          {trend && (
            <span style={{ color: "#94A3B8", fontSize: "0.68rem", fontFamily: '"Inter", sans-serif' }}>{trend}</span>
          )}
        </div>
        <p style={{ color: "#CBD5E1", fontSize: "0.67rem", fontFamily: '"Inter", sans-serif', marginTop: "1px" }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export function ParticipantsPage() {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState(EVENTS[0]);
  const [divFilter, setDivFilter] = useState(DIVISIONS[0]);

  const filtered = ORGANIZERS.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.name.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.accessKey.toLowerCase().includes(q) ||
      o.role.toLowerCase().includes(q);
    const matchEvent = eventFilter === EVENTS[0] || o.event === eventFilter;
    const matchDiv = divFilter === DIVISIONS[0] || o.division.startsWith(divFilter.replace(" — Men", ""));
    return matchSearch && matchEvent && matchDiv;
  });

  const activeFilters = [eventFilter !== EVENTS[0], divFilter !== DIVISIONS[0]].filter(Boolean).length;
  const activeCount = ORGANIZERS.filter((o) => o.status === "active").length;
  const revokedCount = ORGANIZERS.filter((o) => o.status === "revoked").length;

  return (
    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="px-6 py-6" style={{ maxWidth: "1600px" }}>

        {/* ══════  HEADER  ══════ */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: "#94A3B8", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif' }}>Dashboard</span>
              <span style={{ color: "#CBD5E1" }}>/</span>
              <span style={{ color: "#2563EB", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>Organizer Keys & Access</span>
            </div>
            <h1 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: "2.25rem", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1 }}>
              Organizer Keys &amp; Access
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "0.82rem", fontFamily: '"Inter", sans-serif', marginTop: "0.4rem" }}>
              Identity &amp; Access Management — who manages what, and which key belongs to whom.
            </p>
          </div>

          {/* Invite button */}
          <button
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg,#0F172A,#1E293B)",
              color: "#FFFFFF",
              fontSize: "0.84rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              boxShadow: "0 4px 16px rgba(15,23,42,0.22)",
              border: "none",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#1E293B,#334155)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#0F172A,#1E293B)"; }}
          >
            <UserCog className="w-4 h-4" strokeWidth={2} />
            Add Organizer
          </button>
        </div>

        {/* ══════  STAT CARDS  ══════ */}
        <div className="flex gap-4 mb-6">
          <StatCard
            icon={<Users className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
            iconBg="linear-gradient(135deg,#0F172A,#334155)"
            label="Total Organizers"
            value="150"
            sub="Across all events"
          />
          <StatCard
            icon={<Activity className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
            iconBg="linear-gradient(135deg,#059669,#0D9488)"
            label="Active Keys"
            value="142"
            sub={`${activeCount} currently online`}
            accentColor="#059669"
            trend="94.7%"
          />
          <StatCard
            icon={<KeyRound className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
            iconBg="linear-gradient(135deg,#94A3B8,#64748B)"
            label="Unassigned Keys"
            value="8"
            sub="Awaiting assignment"
            accentColor="#64748B"
          />
          <StatCard
            icon={<ShieldAlert className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
            iconBg="linear-gradient(135deg,#EF4444,#DC2626)"
            label="Revoked"
            value={String(revokedCount)}
            sub="Keys deactivated"
            accentColor="#DC2626"
          />
        </div>

        {/* ══════  TABLE CARD  ══════ */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "#FFFFFF", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}
        >
          {/* ── Toolbar ── */}
          <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
            {/* Search */}
            <div className="relative" style={{ width: "320px", flexShrink: 0 }}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#94A3B8" }} />
              <input
                type="text"
                placeholder="Search manager name, email, or key…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg outline-none transition-all"
                style={{
                  paddingLeft: "2.25rem",
                  paddingRight: search ? "2.25rem" : "0.875rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  backgroundColor: "#F8FAFC",
                  border: "1.5px solid #E2E8F0",
                  fontSize: "0.8rem",
                  fontFamily: '"Inter", sans-serif',
                  color: "#1E293B",
                }}
                onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#2563EB")}
                onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }}>
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              )}
            </div>

            {/* Filters */}
            <FilterDropdown label="Filter by Event" options={EVENTS} value={eventFilter} onChange={setEventFilter} />
            <FilterDropdown label="Filter by Division" options={DIVISIONS} value={divFilter} onChange={setDivFilter} />

            {activeFilters > 0 && (
              <button
                onClick={() => { setEventFilter(EVENTS[0]); setDivFilter(DIVISIONS[0]); }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all"
                style={{ border: "1.5px solid #FECACA", backgroundColor: "#FFF5F5", color: "#DC2626", fontSize: "0.78rem", fontFamily: '"Inter", sans-serif', fontWeight: 500, whiteSpace: "nowrap" }}
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
                Clear {activeFilters}
              </button>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Result count */}
            <span style={{ color: "#94A3B8", fontSize: "0.75rem", fontFamily: '"Inter", sans-serif', flexShrink: 0 }}>
              <strong style={{ color: "#374151" }}>{filtered.length}</strong> of <strong style={{ color: "#374151" }}>{ORGANIZERS.length}</strong> organizers
            </span>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#FAFBFC" }}>
                  {[
                    { label: "Organizer", w: "22%" },
                    { label: "Assigned Scope", w: "18%" },
                    { label: "Permissions", w: "16%" },
                    { label: "Access Key", w: "17%" },
                    { label: "Last Login", w: "13%" },
                    { label: "Status", w: "8%" },
                    { label: "", w: "6%", align: "right" as const },
                  ].map((col) => (
                    <th
                      key={col.label}
                      style={{
                        width: col.w,
                        padding: "9px 20px",
                        textAlign: col.align ?? "left",
                        borderBottom: "1.5px solid #F1F5F9",
                        color: "#94A3B8",
                        fontSize: "0.64rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontFamily: '"Inter", sans-serif',
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="flex items-center justify-center rounded-2xl mb-4" style={{ width: "64px", height: "64px", backgroundColor: "#F1F5F9", border: "2px dashed #E2E8F0" }}>
                          <Users className="w-7 h-7" strokeWidth={1.5} style={{ color: "#CBD5E1" }} />
                        </div>
                        <p style={{ color: "#374151", fontSize: "0.9rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>No organizers found</p>
                        <p style={{ color: "#94A3B8", fontSize: "0.78rem", fontFamily: '"Inter", sans-serif', marginTop: "4px" }}>Adjust your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((org, idx) => (
                    <OrgRow key={org.id} org={org} idx={idx} isLast={idx === filtered.length - 1} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Footer ── */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}
          >
            <div className="flex items-center gap-4">
              <span style={{ color: "#94A3B8", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif' }}>
                Page <strong style={{ color: "#374151" }}>1</strong> of <strong style={{ color: "#374151" }}>19</strong>
              </span>
              {/* Status legend */}
              <div className="flex items-center gap-3">
                {(Object.entries(STATUS_CFG) as [OrgStatus, typeof STATUS_CFG[OrgStatus]][]).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="rounded-full" style={{ width: "6px", height: "6px", backgroundColor: cfg.dot }} />
                    <span style={{ color: "#94A3B8", fontSize: "0.67rem", fontFamily: '"Inter", sans-serif' }}>
                      {cfg.label}: <strong style={{ color: "#374151" }}>
                        {key === "active" ? 142 : key === "revoked" ? 6 : 2}
                      </strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, "…", 19].map((p, i) => (
                <button
                  key={i}
                  className="flex items-center justify-center rounded-md transition-colors"
                  style={{
                    minWidth: "28px", height: "28px", padding: "0 4px",
                    backgroundColor: p === 1 ? "#0F172A" : "transparent",
                    color: p === 1 ? "#FFFFFF" : p === "…" ? "#CBD5E1" : "#64748B",
                    fontSize: "0.75rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    border: `1.5px solid ${p === 1 ? "#0F172A" : p === "…" ? "transparent" : "#E2E8F0"}`,
                    cursor: p === "…" ? "default" : "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: "32px" }} />
      </div>
    </main>
  );
}
