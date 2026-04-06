import type { AthleteRecord, CountryRecord, RankStyle } from "./types";

export { type AthleteRecord, type CountryRecord, type RankStyle };

export const ATHLETES: AthleteRecord[] = [
  { id: "A01", name: "Leon Marchand",       shortName: "L. Marchand",      photo: "https://images.unsplash.com/photo-1677170274581-b85e8469846c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "FRA", countryFull: "France",           flag: "🇫🇷", sport: "Swimming",    sportEmoji: "🏊", gender: "Men",   event: "Asian Games 2026", gold: 4, silver: 0, bronze: 1 },
  { id: "A02", name: "Simone Biles",         shortName: "S. Biles",         photo: "https://images.unsplash.com/photo-1669627960958-b4a809aa76ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "USA", countryFull: "United States",    flag: "🇺🇸", sport: "Gymnastics",   sportEmoji: "🤸", gender: "Women", event: "Asian Games 2026", gold: 3, silver: 1, bronze: 0 },
  { id: "A03", name: "Zhang Yufei",          shortName: "Z. Yufei",         photo: "https://images.unsplash.com/photo-1609753606721-0fb89e91e44c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "CHN", countryFull: "China",            flag: "🇨🇳", sport: "Swimming",    sportEmoji: "🏊", gender: "Women", event: "Asian Games 2026", gold: 2, silver: 2, bronze: 2 },
  { id: "A04", name: "Caeleb Dressel",       shortName: "C. Dressel",       photo: "https://images.unsplash.com/photo-1530907016641-244f1ee66465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "USA", countryFull: "United States",    flag: "🇺🇸", sport: "Swimming",    sportEmoji: "🏊", gender: "Men",   event: "Asian Games 2026", gold: 2, silver: 1, bronze: 0 },
  { id: "A05", name: "Noah Lyles",           shortName: "N. Lyles",         photo: "https://images.unsplash.com/photo-1766970096346-937852c7d350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "USA", countryFull: "United States",    flag: "🇺🇸", sport: "Athletics",   sportEmoji: "🏃", gender: "Men",   event: "Asian Games 2026", gold: 2, silver: 0, bronze: 1 },
  { id: "A06", name: "Li Wenwen",            shortName: "L. Wenwen",        photo: "https://images.unsplash.com/photo-1756699490187-86e370baa3a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "CHN", countryFull: "China",            flag: "🇨🇳", sport: "Weightlifting",sportEmoji: "🏋️", gender: "Women", event: "Asian Games 2026", gold: 1, silver: 2, bronze: 1 },
  { id: "A07", name: "Miltiadis Tentoglou",  shortName: "M. Tentoglou",    photo: "https://images.unsplash.com/photo-1622169804256-0eb6873ff441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "GRE", countryFull: "Greece",          flag: "🇬🇷", sport: "Athletics",   sportEmoji: "🏃", gender: "Men",   event: "Asian Games 2026", gold: 1, silver: 1, bronze: 0 },
  { id: "A08", name: "Viktor Axelsen",       shortName: "V. Axelsen",       photo: "https://images.unsplash.com/photo-1545175928-65a104e66691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "DEN", countryFull: "Denmark",         flag: "🇩🇰", sport: "Badminton",   sportEmoji: "🏸", gender: "Men",   event: "Asian Games 2026", gold: 1, silver: 0, bronze: 1 },
  { id: "A09", name: "Lalu Muhammad Zohri",   shortName: "L. Zohri",        photo: "https://images.unsplash.com/photo-1770564585770-90f5b235d28d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "IDN", countryFull: "Indonesia",       flag: "🇮🇩", sport: "Athletics",   sportEmoji: "🏃", gender: "Men",   event: "Asian Games 2026", gold: 1, silver: 0, bronze: 0 },
  { id: "A10", name: "Elaine Thompson-Herah", shortName: "E. Thompson",      photo: "https://images.unsplash.com/photo-1628970857977-3291ad0290b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "JAM", countryFull: "Jamaica",         flag: "🇯🇲", sport: "Athletics",   sportEmoji: "🏃", gender: "Women", event: "Unesa Cup",       gold: 1, silver: 0, bronze: 0 },
  { id: "A11", name: "Kevin Sanjaya Sukamuljo", shortName: "K. Sanjaya",    photo: "https://images.unsplash.com/photo-1609834265293-462cb479a028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "IDN", countryFull: "Indonesia",       flag: "🇮🇩", sport: "Badminton",   sportEmoji: "🏸", gender: "Men",   event: "Asian Games 2026", gold: 0, silver: 1, bronze: 1 },
  { id: "A12", name: "Rebeca Andrade",        shortName: "R. Andrade",        photo: "https://images.unsplash.com/photo-1659303387945-227f9901ada4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", country: "BRA", countryFull: "Brazil",          flag: "🇧🇷", sport: "Gymnastics",   sportEmoji: "🤸", gender: "Women", event: "Asian Games 2026", gold: 0, silver: 1, bronze: 0 },
];

export const COUNTRIES: CountryRecord[] = [
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

export const EVENTS  = ["All Events", "Asian Games 2026", "Unesa Cup", "Olympic Winter"] as const;
export const TEAMS   = ["All Teams", "United States", "France", "China", "Indonesia", "Greece", "Denmark", "Jamaica", "Australia", "Germany", "Brazil"] as const;
export const SPORTS  = ["All Sports", "Swimming", "Athletics", "Gymnastics", "Weightlifting", "Badminton"] as const;
export const GENDERS: ("All" | "Men" | "Women" | "Mixed")[] = ["All", "Men", "Women", "Mixed"];

export const RANK_STYLE: Record<number, RankStyle> = {
  1: { bg: "linear-gradient(135deg,#FEF9C3,#FEF3C7)", numColor: "#D97706", border: "#FDE68A", glow: "rgba(245,158,11,0.15)",       rowBg: "#FFFDF0", borderLeft: "#F59E0B" },
  2: { bg: "linear-gradient(135deg,#F8FAFC,#F1F5F9)", numColor: "#64748B", border: "#E2E8F0", glow: "rgba(100,116,139,0.08)",     rowBg: "#FAFBFC", borderLeft: "#94A3B8" },
  3: { bg: "linear-gradient(135deg,#FFF7ED,#FEF3C7)", numColor: "#B45309", border: "#FDE68A", glow: "rgba(180,83,9,0.1)",          rowBg: "#FFFAF5", borderLeft: "#D97706" },
};
