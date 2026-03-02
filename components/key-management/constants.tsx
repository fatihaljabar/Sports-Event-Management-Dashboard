/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export type KeyStatus = "available" | "confirmed" | "revoked";

export type EventStatusType = "active" | "inactive" | "upcoming" | "ongoing" | "completed" | "archived";

export interface SportKey {
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
   STATUS CONFIG
───────────────────────────────────────────── */
export const STATUS_CFG: Record<KeyStatus, { label: string; bg: string; color: string; border: string; dot: string }> = {
  available: { label: "Available", bg: "#F1F5F9", color: "#64748B", border: "#E2E8F0", dot: "#94A3B8" },
  confirmed: { label: "Confirmed", bg: "#DCFCE7", color: "#15803D", border: "#BBF7D0", dot: "#22C55E" },
  revoked:   { label: "Revoked",   bg: "#FEE2E2", color: "#DC2626", border: "#FECACA", dot: "#EF4444" },
};

export const SPORT_COLOR: Record<string, string> = {
  Athletics:  "#FEF9C3",
  Swimming:   "#E0F2FE",
  Climbing:   "#ECFCCB",
  Judo:       "#EDE9FE",
  Cycling:    "#FEE2E2",
  Boxing:     "#FFF7ED",
  Gymnastics: "#FCE7F3",
};

export const SPORT_TEXT: Record<string, string> = {
  Athletics:  "#92400E",
  Swimming:   "#0369A1",
  Climbing:   "#365314",
  Judo:       "#5B21B6",
  Cycling:    "#B91C1C",
  Boxing:     "#C2410C",
  Gymnastics: "#9D174D",
};

/* ─────────────────────────────────────────────
   EVENT STATUS CONFIG
───────────────────────────────────────────── */
export const EVENT_STATUS_CFG: Record<EventStatusType, { label: string; bg: string; color: string; border: string; dot: string }> = {
  active:    { label: "Active",     bg: "#DCFCE7", color: "#15803D", border: "#BBF7D0", dot: "#22C55E" },
  upcoming:  { label: "Upcoming",  bg: "#DBEAFE", color: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6" },
  ongoing:   { label: "Ongoing",    bg: "#FEF3C7", color: "#B45309", border: "#FDE68A", dot: "#F59E0B" },
  completed: { label: "Completed", bg: "#F1F5F9", color: "#64748B", border: "#E2E8F0", dot: "#94A3B8" },
  inactive:  { label: "Inactive",  bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA", dot: "#EF4444" },
  archived:  { label: "Archived",   bg: "#F3F4F6", color: "#6B7280", border: "#E5E7EB", dot: "#9CA3AF" },
};

/* ─────────────────────────────────────────────
   PAGINATION CONSTANTS
───────────────────────────────────────────── */
export const ITEMS_PER_PAGE = 8;
