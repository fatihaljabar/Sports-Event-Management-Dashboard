/**
 * Dashboard constants
 * Mock data and configuration values for dashboard panels
 * TODO: Replace mock data with real API calls when backend is ready
 */

import type { Activity, CountryMedals, PendingKey } from "./types";

// ==================== ACTIVITY FEED ====================
export const ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "medal",
    title: "Gold Medal Awarded",
    description: "Michael Chen — 200m Freestyle Swimming",
    timestamp: "02:14:33",
    key: "KEY-8821",
  },
  {
    id: "2",
    type: "registration",
    title: "Athlete Registered",
    description: "Sarah Johnson — Athletics, Germany",
    timestamp: "01:52:07",
    key: "KEY-4432",
  },
  {
    id: "3",
    type: "result",
    title: "Score Recorded",
    description: "9.87s — 100m Sprint Final, Berlin",
    timestamp: "01:30:45",
  },
  {
    id: "4",
    type: "key",
    title: "Access Key Generated",
    description: "Participant batch — EVT-003",
    timestamp: "01:10:22",
    key: "KEY-7751",
  },
  {
    id: "5",
    type: "update",
    title: "Event Updated",
    description: "World Athletics Championship — venue confirmed",
    timestamp: "00:48:11",
  },
  {
    id: "6",
    type: "event",
    title: "New Event Created",
    description: "Tennis Grand Slam Open — Melbourne 2026",
    timestamp: "00:15:08",
  },
];

// ==================== MEDAL TALLY ====================
export const MEDAL_TALLY: CountryMedals[] = [
  {
    rank: 1,
    country: "United States",
    code: "USA",
    flag: "🇺🇸",
    gold: 24,
    silver: 18,
    bronze: 15,
    total: 57,
  },
  {
    rank: 2,
    country: "China",
    code: "CHN",
    flag: "🇨🇳",
    gold: 22,
    silver: 16,
    bronze: 12,
    total: 50,
  },
  {
    rank: 3,
    country: "Great Britain",
    code: "GBR",
    flag: "🇬🇧",
    gold: 15,
    silver: 12,
    bronze: 14,
    total: 41,
  },
  {
    rank: 4,
    country: "Australia",
    code: "AUS",
    flag: "🇦🇺",
    gold: 12,
    silver: 11,
    bronze: 10,
    total: 33,
  },
  {
    rank: 5,
    country: "Germany",
    code: "DEU",
    flag: "🇩🇪",
    gold: 10,
    silver: 9,
    bronze: 11,
    total: 30,
  },
];

// ==================== QUICK KEYS PANEL ====================
export const PENDING_KEYS: PendingKey[] = [
  { key: "KEY-9934", event: "EVT-003", sport: "🥊", status: "Unassigned" },
  { key: "KEY-8821", event: "EVT-001", sport: "🏃", status: "Processing" },
  { key: "KEY-7751", event: "EVT-005", sport: "⚽", status: "Unassigned" },
  { key: "KEY-6612", event: "EVT-002", sport: "🏊", status: "Processing" },
];

// ==================== SCOREBOARD CARDS ====================
export const SCOREBOARD_STATS = {
  totalEvents: 42,
  activeEvents: 12,
  totalAthletes: 8540,
  totalKeys: 2847,
};

// ==================== PERFORMANCE CHART ====================
export const PERFORMANCE_DATA = {
  "6 Months": [
    { month: "Sep '25", events: 8, athletes: 420, keys: 95 },
    { month: "Oct '25", events: 12, athletes: 685, keys: 134 },
    { month: "Nov '25", events: 9, athletes: 510, keys: 108 },
    { month: "Dec '25", events: 6, athletes: 290, keys: 72 },
    { month: "Jan '26", events: 15, athletes: 890, keys: 198 },
    { month: "Feb '26", events: 18, athletes: 1240, keys: 247 },
  ],
  "3 Months": [
    { month: "Dec '25", events: 6, athletes: 290, keys: 72 },
    { month: "Jan '26", events: 15, athletes: 890, keys: 198 },
    { month: "Feb '26", events: 18, athletes: 1240, keys: 247 },
  ],
  "30 Days": [
    { month: "Week 1", events: 4, athletes: 280, keys: 61 },
    { month: "Week 2", events: 6, athletes: 350, keys: 78 },
    { month: "Week 3", events: 5, athletes: 410, keys: 89 },
    { month: "Week 4", events: 3, athletes: 200, keys: 19 },
  ],
};

export const CHART_PERIODS = ["30 Days", "3 Months", "6 Months"] as const;
