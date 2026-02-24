import type { SportEvent } from "@/lib/types/event";
import { SPORT_OPTIONS } from "@/lib/constants/event-constants";

/**
 * Generate next event ID based on existing events
 * Format: EVT-XXX (e.g., EVT-001, EVT-002)
 */
export function generateEventId(events: SportEvent[]): string {
  const maxId = events.reduce((max, event) => {
    const num = parseInt(event.id.split("-")[1]);
    return num > max ? num : max;
  }, 0);
  return `EVT-${String(maxId + 1).padStart(3, "0")}`;
}

/**
 * Calculate total keys based on quota and number of sports
 */
export function calculateTotalKeys(quota: number, sportsCount: number): number {
  return quota * sportsCount;
}

/**
 * Get timezone by location (simplified - in production use proper timezone API)
 */
export function getTimezoneByLocation(location: string): string {
  const timezoneMap: Record<string, string> = {
    "tokyo": "Asia/Tokyo (GMT+9)",
    "jakarta": "Asia/Jakarta (GMT+7)",
    "bangkok": "Asia/Bangkok (GMT+7)",
    "singapore": "Asia/Singapore (GMT+8)",
    "kuala lumpur": "Asia/Kuala_Lumpur (GMT+8)",
    "manila": "Asia/Manila (GMT+8)",
    "hanoi": "Asia/Ho_Chi_Minh (GMT+7)",
    "beijing": "Asia/Shanghai (GMT+8)",
    "seoul": "Asia/Seoul (GMT+9)",
    "taipei": "Asia/Taipei (GMT+8)",
    "hong kong": "Asia/Hong_Kong (GMT+8)",
    "osaka": "Asia/Tokyo (GMT+9)",
    "kyoto": "Asia/Tokyo (GMT+9)",
  };

  const lowerLocation = location.toLowerCase();
  for (const [key, value] of Object.entries(timezoneMap)) {
    if (lowerLocation.includes(key)) {
      return value;
    }
  }
  return "Asia/Bangkok (GMT+7)"; // Default
}

/**
 * Get sport categories by IDs
 */
export function getSportsByIds(sportIds: string[]) {
  return sportIds.map((id) => SPORT_OPTIONS.find((s) => s.id === id)!).filter(Boolean);
}
