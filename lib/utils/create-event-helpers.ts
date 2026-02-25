import type { SportEvent } from "@/lib/types/event";
import { getSportsByIds as getSportsFromConstants } from "@/lib/constants/sports";
import { getTimezoneByLocation } from "@/lib/constants/locations";

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
 * Get timezone by location
 */
export { getTimezoneByLocation };

/**
 * Get sport categories by IDs
 */
export { getSportsFromConstants as getSportsByIds };
