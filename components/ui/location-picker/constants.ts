/**
 * POI (Point of Interest) Type Priority Constants
 *
 * Higher number = more important (should be selected over smaller POIs inside)
 * This mimics Google Maps behavior where clicking a mall selects the mall, not a store inside
 */

export const POI_TYPE_PRIORITY: Readonly<Record<string, number>> = {
  // Large venues/buildings (highest priority)
  "shopping_mall": 100,
  "stadium": 100,
  "airport": 100,
  "university": 95,
  "hospital": 95,
  "convention_center": 90,
  "casino": 85,
  "amusement_park": 85,
  "zoo": 85,
  "museum": 80,
  "library": 75,
  "city_hall": 75,
  "courthouse": 70,
  "place_of_worship": 70,
  "primary_school": 65,
  "secondary_school": 65,
  "school": 65,

  // Accommodation
  "lodging": 60,
  "hotel": 60,

  // Food & Drink (lower priority - usually inside larger venues)
  "restaurant": 20,
  "cafe": 20,
  "bar": 20,
  "night_club": 20,
  "bakery": 15,
  "meal_takeaway": 15,
  "meal_delivery": 15,

  // Stores (lower priority - usually inside malls)
  "store": 15,
  "supermarket": 25,
  "grocery_or_supermarket": 25,
  "clothing_store": 15,
  "shoe_store": 15,
  "electronics_store": 15,
  "department_store": 30,
  "hardware_store": 20,

  // Services (low priority)
  "bank": 30,
  "atm": 10,
  "pharmacy": 35,
  "doctor": 30,
  "dentist": 30,
  "hair_care": 15,
  "beauty_salon": 15,
  "gym": 25,

  // Transportation
  "transit_station": 50,
  "subway_station": 50,
  "bus_station": 45,
  "train_station": 50,
  "taxi_stand": 20,

  // Generic type (lowest priority - use as fallback)
  "establishment": 5,
  "point_of_interest": 5,
} as const;

/**
 * Default center coordinates for Jakarta (fallback location)
 */
export const DEFAULT_CENTER = Object.freeze({
  lat: -6.2088,
  lng: 106.8456,
});

/**
 * Country codes for autocomplete restrictions
 */
export const AUTOCOMPLETE_COUNTRIES = Object.freeze([
  "id", // Indonesia
  "sg", // Singapore
  "my", // Malaysia
  "th", // Thailand
  "vn", // Vietnam
  "ph", // Philippines
  "jp", // Japan
  "kr", // South Korea
  "cn", // China
  "au", // Australia
  "in", // India
  "ae", // UAE
  "us", // USA
  "gb", // UK
  "fr", // France
  "de", // Germany
  "nl", // Netherlands
  "es", // Spain
  "it", // Italy
] as const);

/**
 * Get priority score for a place based on its types.
 * Higher score = more important, should be selected over smaller POIs.
 */
export function getPlacePriority(placeTypes: readonly string[] = []): number {
  if (!placeTypes || placeTypes.length === 0) return 5;

  let maxPriority = 5; // Default low priority

  for (const type of placeTypes) {
    const priority = POI_TYPE_PRIORITY[type];
    if (priority && priority > maxPriority) {
      maxPriority = priority;
    }
  }

  return maxPriority;
}

/**
 * Distance thresholds for POI selection based on priority
 */
export function getDistanceThreshold(priority: number): number {
  // Distance thresholds in degrees (approximate)
  // High priority places (malls, stadiums): 200m
  // Medium priority (hotels, supermarkets): 100m
  // Low priority (restaurants, stores): 50m
  if (priority >= 80) return 0.002; // 200m for major venues
  if (priority >= 50) return 0.001; // 100m for medium places
  if (priority >= 25) return 0.0007; // 70m for supermarkets etc
  return 0.0005; // 50m default
}

/**
 * Very close threshold (within ~10m) - accepts POI regardless of priority
 */
export const VERY_CLOSE_THRESHOLD = 0.0001;
