export type AthleteStatus = "Verified" | "Pending";

export interface AthleteRecord {
  id: number;
  nik: string;
  name: string;
  age: number;
  team: string;
  photo: string | null;
  initials: string;
  color: string;
  status: AthleteStatus;
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
  status: AthleteStatus;
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
  status: AthleteStatus;
}

export type RosterType = "athletes" | "coaches" | "referees";

export interface RosterConfig {
  title: string;
  totalLabel: string;
  total: number;
  capacity: number;
  verified: number;
}

export interface RecentRegistration {
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
