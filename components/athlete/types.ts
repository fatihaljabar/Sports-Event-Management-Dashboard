// ─── Team Types ───────────────────────────────────────────────────────────────

export interface TeamRecord {
  id: string;
  name: string;
  logoColor: string;
  logoInitials: string;
  maxAthletes: number;
  currentAthletes: number;
  maxCoaches: number;
  currentCoaches: number;
  logoImage?: string | null;
  eventType?: string;
}

export interface TeamPerson {
  id: string;
  name: string;
  nik: string;
  dob: string;
  age: number;
  position?: string;
  jerseyNumber?: number;
  licenseLevel?: string;
  coachRole?: string;
  verified: boolean;
  avatarColor: string;
  initials: string;
}

// ─── Athlete Record Types ────────────────────────────────────────────────────

export interface AthleteRecord {
  id: number;
  nik: string;
  name: string;
  age: number;
  team: string;
  photo: string | null;
  initials: string;
  color: string;
  status: "Verified" | "Pending";
}

export interface CoachRecord {
  id: number;
  nik: string;
  name: string;
  age: number;
  team: string;
  license: string;
  photo: string | null;
  initials: string;
  color: string;
  status: "Verified" | "Pending";
}

export interface RefereeRecord {
  id: number;
  nik: string;
  name: string;
  age: number;
  role: string;
  badge: string;
  photo: string | null;
  initials: string;
  color: string;
  status: "Verified" | "Pending";
}

// ─── Recent Registration Types ────────────────────────────────────────────────

export interface RecentAthlete {
  id: number;
  name: string;
  team: string;
  status: "Verified" | "Pending";
  photo: string;
  time: string;
}

export interface RecentCoach {
  id: number;
  name: string;
  team: string;
  status: "Verified" | "Pending";
  photo: string;
  time: string;
}

export interface RecentReferee {
  id: number;
  name: string;
  badge: string;
  status: "Verified" | "Pending";
  photo: string;
  time: string;
}

// ─── Roster Config Types ──────────────────────────────────────────────────────
import type { LucideIcon } from "lucide-react";

export interface RosterConfig {
  title: string;
  icon: LucideIcon;
  accentColor: string;
  accentBg: string;
  addLabel: string;
  totalLabel: string;
  total: number;
  capacity: number;
  verified: number;
}

// ─── License Badge Types ──────────────────────────────────────────────────────

export type LicenseType = "fifa" | "afc" | "pssi";

export interface LicenseBadgeProps {
  label: string;
  type?: LicenseType;
}
