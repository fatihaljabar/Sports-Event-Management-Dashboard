import { Users, Swords, Clock, UserRoundCheck, Flag, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  AthleteRecord,
  CoachRecord,
  RefereeRecord,
  RecentAthlete,
  RecentCoach,
  RecentReferee,
  RosterConfig,
} from "./types";

// ─── Avatar URLs ──────────────────────────────────────────────────────────────

export const AVATAR_1 = "https://images.unsplash.com/photo-1533659077289-a4760896bfe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbGUlMjBmb290YmFsbCUyMHBsYXllciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTQ3OTcwMHww&ixlib=rb-4.1.0&q=80&w=400";
export const AVATAR_2 = "https://images.unsplash.com/photo-1627987714631-456651553f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbGUlMjBhdGhsZXRlJTIwaGVhZHNob3QlMjBzcG9ydHxlbnwxfHx8fDE3NzU0Nzk3MDB8MA&ixlib=rb-4.1.0&q=80&w=400";
export const AVATAR_3 = "https://images.unsplash.com/photo-1612153110544-072aa892ba48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGluZG9uZXNpYW4lMjBtYWxlJTIwYXRobGV0ZSUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzc1NDc4MzA3fDA&ixlib=rb-4.1.0&q=80&w=400";
export const AVATAR_COACH = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwY29hY2glMjBzcG9ydHMlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzU0NzgzMDd8MA&ixlib=rb-4.1.0&q=80&w=400";
export const ATHLETE_PHOTO = "https://images.unsplash.com/photo-1612153110544-072aa892ba48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGluZG9uZXNpYW4lMjBtYWxlJTIwYXRobGV0ZSUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzc1NDc4MzA3fDA&ixlib=rb-4.1.0&q=80&w=1080";

// ─── Avatar Colors ────────────────────────────────────────────────────────────

export const AVATAR_COLORS = [
  "#2563eb","#7c3aed","#db2777","#ea580c","#16a34a","#0891b2","#d97706","#dc2626",
];

// ─── Teams ───────────────────────────────────────────────────────────────────

export const ALL_TEAMS = [
  "Surabaya", "Malang", "Sidoarjo", "Gresik", "Mojokerto",
  "Pasuruan", "Banyuwangi", "Jember",
];

// ─── Athletes ─────────────────────────────────────────────────────────────────

export const ATHLETES: AthleteRecord[] = [
  { id: 1,  nik: "3578012345678901", name: "Rizky Ridho",       age: 24, team: "Surabaya",   photo: AVATAR_3,    initials: "RR", color: "#2563eb", status: "Verified" },
  { id: 2,  nik: "3578019876543210", name: "Andi Setiawan",     age: 22, team: "Malang",     photo: AVATAR_1,    initials: "AS", color: "#7c3aed", status: "Verified" },
  { id: 3,  nik: "3578023456789012", name: "Dimas Arya",        age: 21, team: "Surabaya",   photo: AVATAR_2,    initials: "DA", color: "#16a34a", status: "Pending"  },
  { id: 4,  nik: "3578034567890123", name: "Fajar Hidayat",      age: 25, team: "Gresik",     photo: null,        initials: "FH", color: "#ea580c", status: "Verified" },
  { id: 5,  nik: "3578045678901234", name: "Bayu Saputra",       age: 23, team: "Sidoarjo",   photo: null,        initials: "BS", color: "#0891b2", status: "Verified" },
  { id: 6,  nik: "3578056789012345", name: "Hendra Kurniawan",   age: 26, team: "Mojokerto",  photo: null,        initials: "HK", color: "#d97706", status: "Verified" },
  { id: 7,  nik: "3578067890123456", name: "Yoga Pratama",       age: 20, team: "Malang",     photo: null,        initials: "YP", color: "#7c3aed", status: "Verified" },
  { id: 8,  nik: "3578078901234567", name: "Rafi Abdillah",     age: 22, team: "Surabaya",   photo: null,        initials: "RA", color: "#dc2626", status: "Pending"  },
  { id: 9,  nik: "3578089012345678", name: "Ilham Maulana",     age: 19, team: "Pasuruan",   photo: null,        initials: "IM", color: "#2563eb", status: "Verified" },
  { id: 10, nik: "3578090123456789", name: "Wahyu Santoso",     age: 27, team: "Gresik",     photo: null,        initials: "WS", color: "#16a34a", status: "Verified" },
  { id: 11, nik: "3578101234567890", name: "Rizal Firmansyah",  age: 23, team: "Jember",     photo: null,        initials: "RF", color: "#db2777", status: "Verified" },
  { id: 12, nik: "3578112345678901", name: "Agung Prasetyo",    age: 21, team: "Sidoarjo",   photo: null,        initials: "AP", color: "#0891b2", status: "Pending"  },
  { id: 13, nik: "3578123456789012", name: "Dedi Nurdiansyah",  age: 24, team: "Banyuwangi", photo: null,        initials: "DN", color: "#d97706", status: "Verified" },
  { id: 14, nik: "3578134567890123", name: "Kevin Irmansyah",   age: 22, team: "Malang",     photo: null,        initials: "KI", color: "#7c3aed", status: "Verified" },
  { id: 15, nik: "3578145678901234", name: "Fandi Ahmad",       age: 25, team: "Surabaya",   photo: null,        initials: "FA", color: "#ea580c", status: "Verified" },
];

// ─── Coaches ─────────────────────────────────────────────────────────────────

export const COACHES: CoachRecord[] = [
  { id: 1, nik: "3578211111111111", name: "Budi Santoso",   age: 42, team: "Surabaya",  license: "UEFA Pro",        photo: AVATAR_COACH, initials: "BS", color: "#2563eb", status: "Verified" },
  { id: 2, nik: "3578222222222222", name: "Hendra Wijaya",  age: 38, team: "Malang",    license: "AFC A",           photo: null,         initials: "HW", color: "#7c3aed", status: "Verified" },
  { id: 3, nik: "3578233333333333", name: "Agus Permana",   age: 45, team: "Gresik",    license: "AFC B",           photo: null,         initials: "AP", color: "#ea580c", status: "Pending"  },
  { id: 4, nik: "3578244444444444", name: "Irfan Hakim",    age: 40, team: "Sidoarjo",  license: "PSSI Lisensi A",  photo: null,         initials: "IH", color: "#16a34a", status: "Verified" },
  { id: 5, nik: "3578255555555555", name: "Susilo Pratama", age: 36, team: "Jember",    license: "AFC C",           photo: null,         initials: "SP", color: "#0891b2", status: "Verified" },
  { id: 6, nik: "3578266666666666", name: "Teguh Wibowo",   age: 50, team: "Pasuruan",  license: "UEFA Pro",        photo: null,         initials: "TW", color: "#d97706", status: "Verified" },
];

// ─── Referees ─────────────────────────────────────────────────────────────────

export const REFEREES: RefereeRecord[] = [
  { id: 1, nik: "3578311111111111", name: "Eko Prasetyo",    age: 35, role: "Main Referee", badge: "FIFA Badge",       photo: null, initials: "EP", color: "#2563eb", status: "Verified" },
  { id: 2, nik: "3578322222222222", name: "Wahyu Nugroho",   age: 33, role: "Assistant",    badge: "PSSI Licensed",    photo: null, initials: "WN", color: "#7c3aed", status: "Verified" },
  { id: 3, nik: "3578333333333333", name: "Dedi Kurniawan",  age: 40, role: "VAR",          badge: "FIFA Badge",       photo: null, initials: "DK", color: "#16a34a", status: "Pending"  },
  { id: 4, nik: "3578344444444444", name: "Rudi Hartono",    age: 38, role: "4th Official", badge: "PSSI Licensed",     photo: null, initials: "RH", color: "#ea580c", status: "Verified" },
  { id: 5, nik: "3578355555555555", name: "Bambang Suharto", age: 37, role: "Assistant",    badge: "PSSI Licensed",    photo: null, initials: "BS", color: "#0891b2", status: "Verified" },
];

// ─── Recent Athletes ──────────────────────────────────────────────────────────

export const RECENT_ATHLETES: RecentAthlete[] = [
  { id: 1, name: "Rizky Pratama", team: "Team Garuda", status: "Verified", photo: "https://images.unsplash.com/photo-1649440100794-0776df1177b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZm9vdGJhbGwlMjBzb2NjZXIlMjBwbGF5ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzIyNzA4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080", time: "2 min ago" },
  { id: 2, name: "Andi Setiawan", team: "Team Elang", status: "Verified", photo: "https://images.unsplash.com/photo-1601579196253-1dcfbd1eb93c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbGUlMjBhdGhsZXRlJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzIyNzA4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080", time: "15 min ago" },
  { id: 3, name: "Dimas Arya", team: "Team Garuda", status: "Pending", photo: "https://images.unsplash.com/photo-1706975187209-21f1d4541727?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbGUlMjBzb2NjZXIlMjBwbGF5ZXIlMjBhY3Rpb258ZW58MXx8fHwxNzcyMjcwODA1fDA&ixlib=rb-4.1.0&q=80&w=1080", time: "32 min ago" },
  { id: 4, name: "Fajar Hidayat", team: "Team Rajawali", status: "Verified", photo: "https://images.unsplash.com/photo-1721909795454-1cf6ee50f8cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZm9vdGJhbGwlMjBnb2Fsa2VlcGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyMjcwODA1fDA&ixlib=rb-4.1.0&q=80&w=1080", time: "1 hr ago" },
  { id: 5, name: "Bayu Saputra", team: "Team Elang", status: "Verified", photo: "https://images.unsplash.com/photo-1758887253448-172351fca22d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwYXRobGV0ZSUyMHNwb3J0cyUyMHRyYWluaW5nfGVufDF8fHx8MTc3MjI3MDgwNnww&ixlib=rb-4.1.0&q=80&w=1080", time: "2 hr ago" },
];

// ─── Recent Coaches ──────────────────────────────────────────────────────────

export const RECENT_COACHES: RecentCoach[] = [
  { id: 1, name: "Budi Santoso", team: "Team Garuda", status: "Verified", photo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwY29hY2glMjBzcG9ydHMlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzU0NzgzMDd8MA&ixlib=rb-4.1.0&q=80&w=400", time: "5 min ago" },
  { id: 2, name: "Hendra Wijaya", team: "Team Elang", status: "Verified", photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtYWxlJTIwY29hY2glMjBzcG9ydHMlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzU0NzgzMDd8MA&ixlib=rb-4.1.0&q=80&w=400", time: "22 min ago" },
  { id: 3, name: "Agus Permana", team: "Team Rajawali", status: "Pending", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtYWxlJTIwY29hY2glMjBzcG9ydHMlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzU0NzgzMDd8MA&ixlib=rb-4.1.0&q=80&w=400", time: "1 hr ago" },
];

// ─── Recent Referees ─────────────────────────────────────────────────────────

export const RECENT_REFEREES: RecentReferee[] = [
  { id: 1, name: "Eko Prasetyo", badge: "FIFA Licensed", status: "Verified", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcmVmZXJlZSUyMHNwb3J0cyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTQ3ODMwN3ww&ixlib=rb-4.1.0&q=80&w=400", time: "10 min ago" },
  { id: 2, name: "Wahyu Nugroho", badge: "PSSI Licensed", status: "Verified", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtYWxlJTIwcmVmZXJlZSUyMHNwb3J0cyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTQ3ODMwN3ww&ixlib=rb-4.1.0&q=80&w=400", time: "45 min ago" },
  { id: 3, name: "Dedi Kurniawan", badge: "PSSI Licensed", status: "Pending", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtYWxlJTIwcmVmZXJlZSUyMHNwb3J0cyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTQ3ODMwN3ww&ixlib=rb-4.1.0&q=80&w=400", time: "2 hr ago" },
];

// ─── Stats ─────────────────────────────────────────────────────────────────────

export interface AthleteStat {
  label: string;
  value: string;
  capacity: string;
  percent: number | null;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  barColor: string;
}

export const ATHLETE_STATS: AthleteStat[] = [
  {
    label: "Registered Athletes",
    value: "224",
    capacity: "/ 250",
    percent: 89.6,
    icon: Users,
    color: "#2563eb",
    bgColor: "#eff6ff",
    barColor: "bg-blue-500",
  },
  {
    label: "Matches Completed",
    value: "12",
    capacity: "/ 24",
    percent: 50,
    icon: Swords,
    color: "#16a34a",
    bgColor: "#f0fdf4",
    barColor: "bg-emerald-500",
  },
  {
    label: "Pending Approvals",
    value: "3",
    capacity: "",
    percent: null,
    icon: Clock,
    color: "#ea580c",
    bgColor: "#fff7ed",
    barColor: "bg-orange-500",
  },
];

// ─── Roster Config ────────────────────────────────────────────────────────────

export const ROSTER_CONFIG: Record<string, RosterConfig> = {
  athletes: {
    title: "List Athlete",
    icon: Users,
    accentColor: "#2563eb",
    accentBg: "#eff6ff",
    addLabel: "+ Add Athlete (via NIK)",
    totalLabel: "Total Athletes",
    total: 224,
    capacity: 250,
    verified: 218,
  },
  coaches: {
    title: "List Coach",
    icon: UserRoundCheck,
    accentColor: "#7c3aed",
    accentBg: "#faf5ff",
    addLabel: "+ Add Coach (via NIK)",
    totalLabel: "Total Coaches",
    total: 6,
    capacity: 20,
    verified: 5,
  },
  referees: {
    title: "List Referee",
    icon: Flag,
    accentColor: "#ea580c",
    accentBg: "#fff7ed",
    addLabel: "+ Add Referee (via NIK)",
    totalLabel: "Total Referees",
    total: 5,
    capacity: 15,
    verified: 4,
  },
};

// ─── Nav Items ────────────────────────────────────────────────────────────────

export interface AthleteNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ATHLETE_NAV_ITEMS: AthleteNavItem[] = [
  { label: "Dashboard", href: "/roster", icon: LayoutDashboard },
  { label: "Athlete Roster", href: "/roster/athletes", icon: Users },
  { label: "Coach Roster", href: "/roster/coaches", icon: UserRoundCheck },
  { label: "Referee Roster", href: "/roster/referees", icon: Flag },
];
