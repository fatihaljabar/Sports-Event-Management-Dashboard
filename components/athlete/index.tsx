// Layout
export { AthleteLayout } from "./layout/AthleteLayout";
export { AthleteSidebar } from "./layout/AthleteSidebar";
export { AthleteTopHeader } from "./layout/AthleteTopHeader";

// Dashboard
export { AthleteStatsRow } from "./dashboard/AthleteStatsRow";
export { AthleteRecentRegistrations } from "./dashboard/AthleteRecentRegistrations";

// Modals
export { AddAthleteModal } from "./modals/AddAthleteModal";
export { QuickMatchInput } from "./modals/QuickMatchInput";

// Roster
export { AthletesPage } from "./roster/AthletesPage";
export { CoachesPage } from "./roster/CoachesPage";
export { RefereesPage } from "./roster/RefereesPage";
export { AvatarCell } from "./roster/AvatarCell";
export { StatusBadge } from "./roster/StatusBadge";
export { LicenseBadge } from "./roster/LicenseBadge";
export { getLicenseType } from "./roster/LicenseBadge";

// Types & Constants
export type {
  AthleteRecord,
  CoachRecord,
  RefereeRecord,
  RecentAthlete,
  RecentCoach,
  RecentReferee,
  RosterConfig,
  LicenseType,
  LicenseBadgeProps,
} from "./types";

export {
  ATHLETES,
  COACHES,
  REFEREES,
  RECENT_ATHLETES,
  RECENT_COACHES,
  RECENT_REFEREES,
  ATHLETE_STATS,
  ROSTER_CONFIG,
  ALL_TEAMS,
  AVATAR_COLORS,
} from "./constants";
