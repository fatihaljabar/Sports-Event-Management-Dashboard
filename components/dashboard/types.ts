/**
 * Dashboard component types
 * Shared type definitions for dashboard panels
 */

// Activity Feed Types
export interface Activity {
  id: string;
  type: "registration" | "medal" | "event" | "key" | "result" | "update";
  title: string;
  description: string;
  timestamp: string;
  key?: string;
}

// Medal Tally Types
export interface CountryMedals {
  rank: number;
  country: string;
  code: string;
  flag: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

// Performance Chart Types
export interface PerformanceDataPoint {
  month: string;
  events: number;
  athletes: number;
  keys: number;
}

export type Period = "30 Days" | "3 Months" | "6 Months";

// Quick Keys Panel Types
export interface PendingKey {
  key: string;
  event: string;
  sport: string;
  status: "Unassigned" | "Processing";
}
