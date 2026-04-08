export type ViewMode = "athlete" | "country";
export type GenderFilter = "All" | "Men" | "Women" | "Mixed";

export interface AthleteRecord {
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

export interface CountryRecord {
  country: string;
  countryFull: string;
  flag: string;
  gold: number;
  silver: number;
  bronze: number;
}

export interface RankStyle {
  bg: string;
  numColor: string;
  border: string;
  glow: string;
  rowBg: string;
  borderLeft: string;
}
