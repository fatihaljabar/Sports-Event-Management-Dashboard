export type ResultStatus = "official" | "provisional" | "disputed";

export interface PodiumAthlete {
  name: string;
  flag: string;
  country: string;
}

export interface ResultRow {
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

export interface StatusConfig {
  label: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export interface EventColorConfig {
  bg: string;
  text: string;
  border: string;
}
