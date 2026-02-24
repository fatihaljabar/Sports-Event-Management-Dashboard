import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Download,
  Plus,
  Search,
  Copy,
  Check,
  MoreVertical,
  Mail,
  ShieldOff,
  Trash2,
  Users,
  KeyRound,
  UserCheck,
  ChevronRight,
  Layers,
  X,
  Hash,
  RefreshCw,
  Zap,
  Filter,
  AlertCircle,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type KeyStatus = "available" | "confirmed" | "revoked";

interface SportKey {
  id: string;
  code: string;
  sport: string;
  sportEmoji: string;
  status: KeyStatus;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
  createdAt: string;
}

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */
const SPORTS = [
  { name: "Athletics", emoji: "🏃", color: "#F59E0B" },
  { name: "Swimming", emoji: "🏊", color: "#0EA5E9" },
  { name: "Climbing", emoji: "🧗", color: "#84CC16" },
  { name: "Judo", emoji: "🥋", color: "#7C3AED" },
  { name: "Cycling", emoji: "🚴", color: "#EF4444" },
  { name: "Boxing", emoji: "🥊", color: "#F97316" },
  { name: "Gymnastics", emoji: "🤸", color: "#EC4899" },
];

function avatarInitials(email: string): string {
  const parts = email.split("@")[0].split(/[._-]/);
  return (parts[0]?.[0] ?? "?").toUpperCase() + (parts[1]?.[0] ?? parts[0]?.[1] ?? "").toUpperCase();
}

const AVATAR_BG = [
  "linear-gradient(135deg,#2563EB,#7C3AED)",
  "linear-gradient(135deg,#059669,#0D9488)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#EC4899,#8B5CF6)",
];

const MOCK_KEYS: SportKey[] = [
  {
    id: "1",
    code: "AG26-12345-ASD",
    sport: "Athletics",
    sportEmoji: "🏃",
    status: "available",
    createdAt: "24 Feb 2026",
  },
  {
    id: "2",
    code: "AG26-8823-BKT",
    sport: "Swimming",
    sportEmoji: "🏊",
    status: "confirmed",
    userEmail: "ahmad.reza@gmail.com",
    userName: "Ahmad Reza",
    userAvatar: AVATAR_BG[0],
    createdAt: "22 Feb 2026",
  },
  {
    id: "3",
    code: "AG26-21424-DBF",
    sport: "Climbing",
    sportEmoji: "🧗",
    status: "confirmed",
    userEmail: "uvwx@gmail.com",
    userName: "U. Vwx",
    userAvatar: AVATAR_BG[1],
    createdAt: "21 Feb 2026",
  },
  {
    id: "4",
    code: "AG26-5571-GQR",
    sport: "Athletics",
    sportEmoji: "🏃",
    status: "revoked",
    userEmail: "banned.user@email.com",
    userName: "Banned User",
    userAvatar: AVATAR_BG[2],
    createdAt: "18 Feb 2026",
  },
  {
    id: "5",
    code: "AG26-3301-KPM",
    sport: "Judo",
    sportEmoji: "🥋",
    status: "available",
    createdAt: "24 Feb 2026",
  },
  {
    id: "6",
    code: "AG26-7744-NXZ",
    sport: "Swimming",
    sportEmoji: "🏊",
    status: "confirmed",
    userEmail: "yuki.tanaka@yahoo.jp",
    userName: "Yuki Tanaka",
    userAvatar: AVATAR_BG[3],
    createdAt: "20 Feb 2026",
  },
  {
    id: "7",
    code: "AG26-9182-HFW",
    sport: "Cycling",
    sportEmoji: "🚴",
    status: "available",
    createdAt: "23 Feb 2026",
  },
  {
    id: "8",
    code: "AG26-4423-VSP",
    sport: "Boxing",
    sportEmoji: "🥊",
    status: "confirmed",
    userEmail: "carlos.m@sport.id",
    userName: "Carlos M.",
    userAvatar: AVATAR_BG[4],
    createdAt: "19 Feb 2026",
  },
  {
    id: "9",
    code: "AG26-6601-RTN",
    sport: "Gymnastics",
    sportEmoji: "🤸",
    status: "available",
    createdAt: "24 Feb 2026",
  },
  {
    id: "10",
    code: "AG26-0019-QWE",
    sport: "Judo",
    sportEmoji: "🥋",
    status: "revoked",
    userEmail: "prev.user@sport.org",
    userName: "Prev User",
    userAvatar: AVATAR_BG[1],
    createdAt: "15 Feb 2026",
  },
];

/* ─────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────── */
const STATUS_CFG: Record<KeyStatus, { label: string; bg: string; color: string; border: string; dot: string }> = {
  available: { label: "Available", bg: "#F1F5F9", color: "#64748B", border: "#E2E8F0", dot: "#94A3B8" },
  confirmed: { label: "Confirmed", bg: "#DCFCE7", color: "#15803D", border: "#BBF7D0", dot: "#22C55E" },
  revoked:   { label: "Revoked",   bg: "#FEE2E2", color: "#DC2626", border: "#FECACA", dot: "#EF4444" },
};

const SPORT_COLOR: Record<string, string> = {
  Athletics:  "#FEF9C3",
  Swimming:   "#E0F2FE",
  Climbing:   "#ECFCCB",
  Judo:       "#EDE9FE",
  Cycling:    "#FEE2E2",
  Boxing:     "#FFF7ED",
  Gymnastics: "#FCE7F3",
};
const SPORT_TEXT: Record<string, string> = {
  Athletics:  "#92400E",
  Swimming:   "#0369A1",
  Climbing:   "#365314",
  Judo:       "#5B21B6",
  Cycling:    "#B91C1C",
  Boxing:     "#C2410C",
  Gymnastics: "#9D174D",
};

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({
  icon,
  iconBg,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div
      className="rounded-2xl flex items-center gap-4 px-5 py-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #F1F5F9",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        flex: 1,
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{ width: "44px", height: "44px", background: iconBg }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p
          style={{
            color: "#94A3B8",
            fontSize: "0.7rem",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 700,
            fontSize: "1.8rem",
            color: accent ?? "#0F172A",
            lineHeight: 1.1,
            letterSpacing: "0.02em",
          }}
        >
          {value}
        </p>
        <p
          style={{
            color: "#CBD5E1",
            fontSize: "0.7rem",
            fontFamily: '"Inter", sans-serif',
            marginTop: "1px",
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COPY BUTTON
───────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy key"
      className="flex items-center justify-center rounded-md transition-all flex-shrink-0"
      style={{
        width: "24px",
        height: "24px",
        backgroundColor: copied ? "#DCFCE7" : "transparent",
        border: `1px solid ${copied ? "#BBF7D0" : "#E2E8F0"}`,
        color: copied ? "#15803D" : "#94A3B8",
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9";
          (e.currentTarget as HTMLButtonElement).style.color = "#475569";
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
        }
      }}
    >
      {copied ? <Check className="w-3 h-3" strokeWidth={2.5} /> : <Copy className="w-3 h-3" strokeWidth={1.75} />}
    </button>
  );
}

/* ─────────────────────────────────────────────
   THREE-DOT MENU
───────────────────────────────────────────── */
function ActionMenu({ keyItem, onRevoke }: { keyItem: SportKey; onRevoke: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = [
    ...(keyItem.status === "confirmed"
      ? [{ icon: <Mail className="w-3.5 h-3.5" />, label: "Resend Email", color: "#374151" }]
      : []),
    ...(keyItem.status !== "revoked"
      ? [{ icon: <ShieldOff className="w-3.5 h-3.5" />, label: "Revoke Key", color: "#EF4444", action: () => onRevoke(keyItem.id) }]
      : []),
    { icon: <Trash2 className="w-3.5 h-3.5" />, label: "Delete Key", color: "#EF4444" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex items-center justify-center rounded-lg transition-all"
        style={{
          width: "28px",
          height: "28px",
          color: "#94A3B8",
          border: "1.5px solid transparent",
          backgroundColor: open ? "#F1F5F9" : "transparent",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
          }
        }}
      >
        <MoreVertical className="w-3.5 h-3.5" strokeWidth={1.75} />
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 rounded-xl overflow-hidden"
          style={{
            top: "34px",
            minWidth: "160px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            border: "1px solid #E2E8F0",
          }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={(e) => {
                e.stopPropagation();
                item.action?.();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-colors text-left"
              style={{
                color: item.color,
                fontSize: "0.8rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                backgroundColor: "transparent",
                border: "none",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
              }
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
   GENERATE KEYS MODAL
───────────────────────────────────────────── */
function GenerateKeysModal({ onClose }: { onClose: () => void }) {
  const [qty, setQty] = useState("10");
  const [selectedSport, setSelectedSport] = useState(SPORTS[0].name);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
      setTimeout(() => onClose(), 1200);
    }, 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          width: "460px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          border: "1px solid #E2E8F0",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #F1F5F9" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg,#2563EB,#7C3AED)",
              }}
            >
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "#0F172A",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Generate Access Keys
              </h3>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                Asian Games 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: "30px", height: "30px", color: "#94A3B8", border: "1.5px solid #E2E8F0" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
              (e.currentTarget as HTMLButtonElement).style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
            }}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Sport select */}
          <div>
            <label
              style={{
                color: "#374151",
                fontSize: "0.78rem",
                fontWeight: 500,
                fontFamily: '"Inter", sans-serif',
                display: "block",
                marginBottom: "8px",
              }}
            >
              Assigned Sport
            </label>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSelectedSport(s.name)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                  style={{
                    border: `1.5px solid ${selectedSport === s.name ? "#2563EB" : "#E2E8F0"}`,
                    backgroundColor: selectedSport === s.name ? "#EFF6FF" : "#FAFBFC",
                    color: selectedSport === s.name ? "#1D4ED8" : "#64748B",
                    fontSize: "0.78rem",
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: selectedSport === s.name ? 600 : 400,
                  }}
                >
                  <span>{s.emoji}</span>
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label
              style={{
                color: "#374151",
                fontSize: "0.78rem",
                fontWeight: 500,
                fontFamily: '"Inter", sans-serif',
                display: "block",
                marginBottom: "8px",
              }}
            >
              Number of Keys
            </label>
            <div className="flex items-center gap-3">
              {["5", "10", "25", "50", "100"].map((n) => (
                <button
                  key={n}
                  onClick={() => setQty(n)}
                  className="flex items-center justify-center rounded-lg transition-all"
                  style={{
                    width: "50px",
                    height: "36px",
                    border: `1.5px solid ${qty === n ? "#2563EB" : "#E2E8F0"}`,
                    backgroundColor: qty === n ? "#EFF6FF" : "transparent",
                    color: qty === n ? "#1D4ED8" : "#64748B",
                    fontSize: "0.82rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: qty === n ? 700 : 400,
                  }}
                >
                  {n}
                </button>
              ))}
              <input
                type="number"
                placeholder="Custom"
                value={!["5","10","25","50","100"].includes(qty) ? qty : ""}
                onChange={(e) => setQty(e.target.value)}
                className="flex-1 rounded-lg outline-none transition-all"
                style={{
                  padding: "8px 12px",
                  border: "1.5px solid #E2E8F0",
                  backgroundColor: "#FAFBFC",
                  fontSize: "0.82rem",
                  fontFamily: '"JetBrains Mono", monospace',
                  color: "#374151",
                  height: "36px",
                }}
                onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#2563EB")}
                onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")}
              />
            </div>
          </div>

          {/* Key prefix preview */}
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: "#F8FAFC", border: "1.5px dashed #E2E8F0" }}
          >
            <Hash className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} style={{ color: "#94A3B8" }} />
            <div>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.68rem",
                  fontFamily: '"Inter", sans-serif',
                  marginBottom: "2px",
                }}
              >
                Preview format
              </p>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.88rem",
                  color: "#7C3AED",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}
              >
                AG26-XXXX-XXX
              </span>
            </div>
            <div
              className="ml-auto rounded-md px-2 py-1"
              style={{ backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE" }}
            >
              <span
                style={{
                  color: "#5B21B6",
                  fontSize: "0.65rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                }}
              >
                Auto-generated
              </span>
            </div>
          </div>

          {/* Warning */}
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-2.5"
            style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" strokeWidth={1.75} style={{ color: "#D97706" }} />
            <p
              style={{
                color: "#92400E",
                fontSize: "0.72rem",
                fontFamily: '"Inter", sans-serif',
                lineHeight: 1.5,
              }}
            >
              Generating{" "}
              <strong>{qty || 0}</strong> keys will consume{" "}
              <strong>{qty || 0}</strong> from your remaining quota. Current available:{" "}
              <strong>550 slots</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid #F1F5F9" }}
        >
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 transition-all"
            style={{
              border: "1.5px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
              color: "#64748B",
              fontSize: "0.82rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating || done}
            className="flex items-center gap-2 rounded-xl px-5 py-2 transition-all"
            style={{
              background: done
                ? "linear-gradient(135deg,#059669,#0D9488)"
                : "linear-gradient(135deg,#2563EB,#1D4ED8)",
              color: "#FFFFFF",
              fontSize: "0.82rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(37,99,235,0.28)",
              border: "none",
              opacity: generating ? 0.85 : 1,
              transition: "all 0.3s",
            }}
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2} />
                Generating…
              </>
            ) : done ? (
              <>
                <Check className="w-4 h-4" strokeWidth={2.5} />
                Generated!
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" strokeWidth={2} />
                Generate {qty || 0} Keys
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
interface KeyManagementPageProps {
  onBack: () => void;
}

export function KeyManagementPage({ onBack }: KeyManagementPageProps) {
  const [keys, setKeys] = useState<SportKey[]>(MOCK_KEYS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | KeyStatus>("all");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const handleRevoke = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "revoked" as KeyStatus } : k))
    );
  };

  const filtered = keys.filter((k) => {
    const matchStatus = statusFilter === "all" || k.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      k.code.toLowerCase().includes(q) ||
      k.sport.toLowerCase().includes(q) ||
      k.userEmail?.toLowerCase().includes(q) ||
      k.userName?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const total = 1000;
  const generated = keys.length;
  const confirmed = keys.filter((k) => k.status === "confirmed").length;

  const STATUS_TABS: { id: "all" | KeyStatus; label: string; count: number }[] = [
    { id: "all", label: "All Keys", count: keys.length },
    { id: "available", label: "Available", count: keys.filter((k) => k.status === "available").length },
    { id: "confirmed", label: "Confirmed", count: keys.filter((k) => k.status === "confirmed").length },
    { id: "revoked", label: "Revoked", count: keys.filter((k) => k.status === "revoked").length },
  ];

  return (
    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="px-6 py-6" style={{ maxWidth: "1600px" }}>

        {/* ══════  PAGE HEADER  ══════ */}
        <div className="mb-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all"
              style={{
                color: "#64748B",
                fontSize: "0.72rem",
                fontFamily: '"Inter", sans-serif',
                border: "1.5px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                (e.currentTarget as HTMLButtonElement).style.color = "#374151";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFFFFF";
                (e.currentTarget as HTMLButtonElement).style.color = "#64748B";
              }}
            >
              <ArrowLeft className="w-3 h-3" strokeWidth={2} />
              Back
            </button>

            <span style={{ color: "#CBD5E1", fontSize: "0.65rem" }}>·</span>

            <div className="flex items-center gap-1" style={{ fontSize: "0.72rem", fontFamily: '"Inter", sans-serif' }}>
              <span
                className="cursor-pointer transition-colors"
                style={{ color: "#94A3B8" }}
                onClick={onBack}
                onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#2563EB")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#94A3B8")}
              >
                Event Management
              </span>
              <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} strokeWidth={2} />
              <span
                className="cursor-pointer transition-colors"
                style={{ color: "#94A3B8" }}
                onClick={onBack}
                onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#2563EB")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#94A3B8")}
              >
                Asian Games 2026
              </span>
              <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} strokeWidth={2} />
              <span style={{ color: "#2563EB", fontWeight: 500 }}>Participants & Keys</span>
            </div>
          </div>

          {/* Title row */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                {/* Event logo */}
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg,#2563EB,#7C3AED)",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>🏆</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1
                      style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 700,
                        fontSize: "2.25rem",
                        color: "#0F172A",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                      }}
                    >
                      Asian Games 2026
                    </h1>
                    {/* Status badge */}
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 flex-shrink-0"
                      style={{ backgroundColor: "#DCFCE7", border: "1px solid #BBF7D0" }}
                    >
                      <div
                        className="rounded-full"
                        style={{ width: "6px", height: "6px", backgroundColor: "#22C55E", boxShadow: "0 0 5px #22C55E" }}
                      />
                      <span style={{ color: "#15803D", fontSize: "0.7rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                        Active
                      </span>
                    </div>
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 flex-shrink-0"
                      style={{ backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE" }}
                    >
                      <Layers className="w-3 h-3" strokeWidth={1.75} style={{ color: "#7C3AED" }} />
                      <span style={{ color: "#5B21B6", fontSize: "0.7rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                        Multi-Event
                      </span>
                    </div>
                  </div>
                  {/* Meta */}
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#94A3B8" }} />
                      <span style={{ color: "#64748B", fontSize: "0.78rem", fontFamily: '"Inter", sans-serif' }}>
                        Mar 09 – Mar 22, 2026
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#94A3B8" }} />
                      <span style={{ color: "#64748B", fontSize: "0.78rem", fontFamily: '"Inter", sans-serif' }}>
                        Nagoya, Japan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all"
                style={{
                  border: "1.5px solid #E2E8F0",
                  backgroundColor: "#FFFFFF",
                  color: "#64748B",
                  fontSize: "0.82rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFFFFF";
                }}
              >
                <Download className="w-4 h-4" strokeWidth={1.75} />
                Export CSV
              </button>

              <button
                onClick={() => setShowGenerateModal(true)}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
                  color: "#FFFFFF",
                  fontSize: "0.84rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  boxShadow: "0 4px 16px rgba(37,99,235,0.32)",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#1D4ED8,#1E40AF)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(37,99,235,0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#2563EB,#1D4ED8)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(37,99,235,0.32)";
                }}
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Generate Keys
              </button>
            </div>
          </div>
        </div>

        {/* ══════  STAT CARDS  ══════ */}
        <div className="flex gap-4 mb-6">
          <StatCard
            icon={<Users className="w-5 h-5 text-white" strokeWidth={1.75} />}
            iconBg="linear-gradient(135deg,#0F172A,#1E293B)"
            label="Total Quota"
            value={total.toLocaleString()}
            sub="Max registered users"
          />
          <StatCard
            icon={<KeyRound className="w-5 h-5 text-white" strokeWidth={1.75} />}
            iconBg="linear-gradient(135deg,#2563EB,#7C3AED)"
            label="Keys Generated"
            value={generated.toLocaleString()}
            sub={`${total - generated} slots remaining`}
            accent="#2563EB"
          />
          <StatCard
            icon={<UserCheck className="w-5 h-5 text-white" strokeWidth={1.75} />}
            iconBg="linear-gradient(135deg,#059669,#0D9488)"
            label="Confirmed Users"
            value={confirmed.toLocaleString()}
            sub={`${Math.round((confirmed / generated) * 100)}% key activation rate`}
            accent="#059669"
          />
        </div>

        {/* ══════  MAIN TABLE CARD  ══════ */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            border: "1px solid #F1F5F9",
          }}
        >
          {/* Toolbar */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            {/* Status filter tabs */}
            <div className="flex items-center gap-1">
              {STATUS_TABS.map((tab) => {
                const isActive = statusFilter === tab.id;
                const cfg = tab.id !== "all" ? STATUS_CFG[tab.id as KeyStatus] : null;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id as "all" | KeyStatus)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                    style={{
                      backgroundColor: isActive ? "#EFF6FF" : "transparent",
                      border: `1.5px solid ${isActive ? "#BFDBFE" : "transparent"}`,
                      color: isActive ? "#1D4ED8" : "#64748B",
                      fontSize: "0.8rem",
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: isActive ? 600 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    }}
                  >
                    {cfg && (
                      <div
                        className="rounded-full flex-shrink-0"
                        style={{ width: "6px", height: "6px", backgroundColor: cfg.dot }}
                      />
                    )}
                    {tab.label}
                    <span
                      className="flex items-center justify-center rounded-full"
                      style={{
                        minWidth: "18px",
                        height: "18px",
                        padding: "0 5px",
                        backgroundColor: isActive ? "#2563EB" : "#F1F5F9",
                        color: isActive ? "#FFFFFF" : "#94A3B8",
                        fontSize: "0.6rem",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 600,
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative flex items-center" style={{ width: "280px" }}>
              <Search className="absolute left-3 w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#94A3B8" }} />
              <input
                type="text"
                placeholder="Search email, username, or key…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg outline-none transition-all"
                style={{
                  paddingLeft: "2rem",
                  paddingRight: search ? "2rem" : "0.75rem",
                  paddingTop: "0.45rem",
                  paddingBottom: "0.45rem",
                  backgroundColor: "#F8FAFC",
                  border: "1.5px solid #E2E8F0",
                  fontSize: "0.78rem",
                  fontFamily: '"Inter", sans-serif',
                  color: "#1E293B",
                }}
                onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#2563EB")}
                onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3"
                  style={{ color: "#94A3B8" }}
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#FAFBFC" }}>
                  {[
                    { label: "No.", width: "5%", align: "center" as const },
                    { label: "Access Key", width: "22%" },
                    { label: "Assigned Sport", width: "16%" },
                    { label: "User Status", width: "20%" },
                    { label: "Registered User", width: "27%" },
                    { label: "Actions", width: "10%", align: "center" as const },
                  ].map((col) => (
                    <th
                      key={col.label}
                      style={{
                        width: col.width,
                        padding: "10px 20px",
                        textAlign: col.align ?? "left",
                        borderBottom: "1.5px solid #F1F5F9",
                        color: "#94A3B8",
                        fontSize: "0.65rem",
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
                    <td colSpan={6}>
                      <EmptyState onGenerate={() => setShowGenerateModal(true)} />
                    </td>
                  </tr>
                ) : (
                  filtered.map((key, idx) => (
                    <KeyRow
                      key={key.id}
                      idx={idx}
                      keyItem={key}
                      isLast={idx === filtered.length - 1}
                      hovered={hoveredRow === key.id}
                      onHover={setHoveredRow}
                      onRevoke={handleRevoke}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-6 py-3"
            style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}
          >
            <span style={{ color: "#94A3B8", fontSize: "0.75rem", fontFamily: '"Inter", sans-serif' }}>
              Showing{" "}
              <span style={{ color: "#374151", fontWeight: 500 }}>{filtered.length}</span>{" "}
              of{" "}
              <span style={{ color: "#374151", fontWeight: 500 }}>{keys.length}</span>{" "}
              keys
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  className="flex items-center justify-center rounded-lg transition-colors"
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: p === 1 ? "#2563EB" : "transparent",
                    color: p === 1 ? "#FFFFFF" : "#64748B",
                    fontSize: "0.78rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    border: `1.5px solid ${p === 1 ? "#2563EB" : "#E2E8F0"}`,
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

      {/* Generate Modal */}
      {showGenerateModal && (
        <GenerateKeysModal onClose={() => setShowGenerateModal(false)} />
      )}
    </main>
  );
}

/* ─────────────────────────────────────────────
   KEY ROW
───────────────────────────────────────────── */
function KeyRow({
  idx,
  keyItem,
  isLast,
  hovered,
  onHover,
  onRevoke,
}: {
  idx: number;
  keyItem: SportKey;
  isLast: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onRevoke: (id: string) => void;
}) {
  const isZebra = idx % 2 !== 0;
  const status = STATUS_CFG[keyItem.status];

  const rowBg = hovered
    ? "#F0F6FF"
    : isZebra
    ? "#FAFBFC"
    : "#FFFFFF";

  return (
    <tr
      onMouseEnter={() => onHover(keyItem.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        backgroundColor: rowBg,
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
        transition: "background-color 0.1s",
        opacity: keyItem.status === "revoked" ? 0.65 : 1,
      }}
    >
      {/* No. */}
      <td style={{ padding: "14px 20px", textAlign: "center" }}>
        <span
          style={{
            color: "#CBD5E1",
            fontSize: "0.72rem",
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 500,
          }}
        >
          {String(idx + 1).padStart(2, "0")}
        </span>
      </td>

      {/* Access Key */}
      <td style={{ padding: "14px 20px" }}>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
            style={{
              backgroundColor: keyItem.status === "revoked" ? "#FEF2F2" : "#F1F5F9",
              border: `1px solid ${keyItem.status === "revoked" ? "#FECACA" : "#E2E8F0"}`,
              maxWidth: "fit-content",
            }}
          >
            <KeyRound
              className="w-3 h-3 flex-shrink-0"
              strokeWidth={1.75}
              style={{ color: keyItem.status === "revoked" ? "#EF4444" : "#7C3AED" }}
            />
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.82rem",
                fontWeight: 600,
                color: keyItem.status === "revoked" ? "#DC2626" : "#5B21B6",
                letterSpacing: "0.06em",
                textDecoration: keyItem.status === "revoked" ? "line-through" : "none",
                whiteSpace: "nowrap",
              }}
            >
              {keyItem.code}
            </span>
          </div>
          {keyItem.status !== "revoked" && <CopyButton text={keyItem.code} />}
        </div>
        <p
          style={{
            color: "#CBD5E1",
            fontSize: "0.62rem",
            fontFamily: '"JetBrains Mono", monospace',
            marginTop: "3px",
          }}
        >
          Created {keyItem.createdAt}
        </p>
      </td>

      {/* Assigned Sport */}
      <td style={{ padding: "14px 20px" }}>
        <div
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1"
          style={{
            backgroundColor: SPORT_COLOR[keyItem.sport] ?? "#F1F5F9",
            border: `1px solid ${SPORT_COLOR[keyItem.sport] ?? "#E2E8F0"}`,
          }}
        >
          <span style={{ fontSize: "0.88rem" }}>{keyItem.sportEmoji}</span>
          <span
            style={{
              color: SPORT_TEXT[keyItem.sport] ?? "#374151",
              fontSize: "0.78rem",
              fontWeight: 600,
              fontFamily: '"Inter", sans-serif',
              whiteSpace: "nowrap",
            }}
          >
            {keyItem.sport}
          </span>
        </div>
      </td>

      {/* User Status */}
      <td style={{ padding: "14px 20px" }}>
        <div>
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{
              backgroundColor: status.bg,
              border: `1px solid ${status.border}`,
            }}
          >
            <div
              className="rounded-full flex-shrink-0"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: status.dot,
                boxShadow: keyItem.status === "confirmed" ? `0 0 4px ${status.dot}` : "none",
              }}
            />
            <span
              style={{
                color: status.color,
                fontSize: "0.72rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                whiteSpace: "nowrap",
              }}
            >
              {status.label}
            </span>
          </div>
          {keyItem.status === "available" && (
            <p
              style={{
                color: "#CBD5E1",
                fontSize: "0.65rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "4px",
                paddingLeft: "2px",
              }}
            >
              Waiting for registration
            </p>
          )}
          {keyItem.status === "revoked" && (
            <p
              style={{
                color: "#FCA5A5",
                fontSize: "0.65rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "4px",
                paddingLeft: "2px",
              }}
            >
              Access terminated
            </p>
          )}
        </div>
      </td>

      {/* Registered User */}
      <td style={{ padding: "14px 20px" }}>
        {keyItem.userEmail ? (
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{
                width: "30px",
                height: "30px",
                background: keyItem.userAvatar ?? "linear-gradient(135deg,#94A3B8,#64748B)",
                opacity: keyItem.status === "revoked" ? 0.6 : 1,
              }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  fontSize: "0.62rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                }}
              >
                {avatarInitials(keyItem.userEmail)}
              </span>
            </div>
            <div className="min-w-0">
              {keyItem.userName && (
                <p
                  style={{
                    color: "#374151",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    fontFamily: '"Inter", sans-serif',
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {keyItem.userName}
                </p>
              )}
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {keyItem.userEmail}
              </p>
            </div>
          </div>
        ) : (
          <span
            style={{
              color: "#CBD5E1",
              fontSize: "0.82rem",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            —
          </span>
        )}
      </td>

      {/* Actions */}
      <td style={{ padding: "14px 20px", textAlign: "center" }}>
        <ActionMenu keyItem={keyItem} onRevoke={onRevoke} />
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div
        className="flex items-center justify-center rounded-2xl mb-4"
        style={{
          width: "72px",
          height: "72px",
          backgroundColor: "#F1F5F9",
          border: "2px dashed #E2E8F0",
        }}
      >
        <KeyRound className="w-8 h-8" strokeWidth={1.5} style={{ color: "#CBD5E1" }} />
      </div>
      <p style={{ color: "#374151", fontSize: "1rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
        No access keys yet
      </p>
      <p style={{ color: "#94A3B8", fontSize: "0.82rem", fontFamily: '"Inter", sans-serif', marginTop: "4px", marginBottom: "16px" }}>
        Generate your first batch of keys to get started.
      </p>
      <button
        onClick={onGenerate}
        className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all"
        style={{
          background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
          color: "#FFFFFF",
          fontSize: "0.84rem",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          boxShadow: "0 4px 14px rgba(37,99,235,0.28)",
          border: "none",
        }}
      >
        <Zap className="w-4 h-4" strokeWidth={2} />
        Generate your first batch of keys
      </button>
    </div>
  );
}
