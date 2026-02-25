import { Globe, Lock } from "lucide-react";

// Re-export from dedicated files
export { SPORT_OPTIONS, getSportById, getSportsByIds, searchSports } from "./sports";
export { LOCATION_OPTIONS, TIMEZONE_MAP, getTimezoneByLocation } from "./locations";

/**
 * Visibility Options for Events
 */
export const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public", icon: Globe },
  { value: "private", label: "Private", icon: Lock },
] as const;

/**
 * Event Type Options
 */
export type EventType = "single" | "multi";
