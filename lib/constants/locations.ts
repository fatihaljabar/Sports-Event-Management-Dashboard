/**
 * Location Options - Popular cities in Asia-Pacific
 *
 * To add a new location:
 * 1. Add to LOCATION_OPTIONS array
 * 2. Add timezone mapping to TIMEZONE_MAP
 */
export const LOCATION_OPTIONS = [
  "Bangkok, Thailand",
  "Beijing, China",
  "Hanoi, Vietnam",
  "Hong Kong",
  "Jakarta, Indonesia",
  "Kuala Lumpur, Malaysia",
  "Kyoto, Japan",
  "Manila, Philippines",
  "Osaka, Japan",
  "Seoul, South Korea",
  "Singapore",
  "Taipei, Taiwan",
  "Tokyo, Japan",
];

/**
 * Timezone mappings for locations
 *
 * Format: "Location Name": "Timezone (GMT+offset)"
 */
export const TIMEZONE_MAP: Record<string, string> = {
  "Bangkok": "Asia/Bangkok (GMT+7)",
  "Bangkok, Thailand": "Asia/Bangkok (GMT+7)",
  "Beijing": "Asia/Shanghai (GMT+8)",
  "Beijing, China": "Asia/Shanghai (GMT+8)",
  "Hanoi": "Asia/Ho_Chi_Minh (GMT+7)",
  "Hanoi, Vietnam": "Asia/Ho_Chi_Minh (GMT+7)",
  "Hong Kong": "Asia/Hong_Kong (GMT+8)",
  "Jakarta": "Asia/Jakarta (GMT+7)",
  "Jakarta, Indonesia": "Asia/Jakarta (GMT+7)",
  "Kuala Lumpur": "Asia/Kuala_Lumpur (GMT+8)",
  "Kuala Lumpur, Malaysia": "Asia/Kuala_Lumpur (GMT+8)",
  "Kyoto": "Asia/Tokyo (GMT+9)",
  "Kyoto, Japan": "Asia/Tokyo (GMT+9)",
  "Manila": "Asia/Manila (GMT+8)",
  "Manila, Philippines": "Asia/Manila (GMT+8)",
  "Osaka": "Asia/Tokyo (GMT+9)",
  "Osaka, Japan": "Asia/Tokyo (GMT+9)",
  "Seoul": "Asia/Seoul (GMT+9)",
  "Seoul, South Korea": "Asia/Seoul (GMT+9)",
  "Singapore": "Asia/Singapore (GMT+8)",
  "Taipei": "Asia/Taipei (GMT+8)",
  "Taipei, Taiwan": "Asia/Taipei (GMT+8)",
  "Tokyo": "Asia/Tokyo (GMT+9)",
  "Tokyo, Japan": "Asia/Tokyo (GMT+9)",
};

/**
 * Get timezone by location name
 * Returns empty string if not found
 */
export function getTimezoneByLocation(location: string): string {
  return TIMEZONE_MAP[location] || "";
}
