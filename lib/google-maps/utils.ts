/**
 * Google Maps Utility Functions
 *
 * Timezone utilities and reverse geocoding helpers
 */

import { getTimezoneByLocation } from "@/lib/constants/locations";
import { getTimezoneByCoordinates as getTimezoneByCoordinatesAction } from "@/app/actions/timezone";

/**
 * Address component interface for geocoding results
 */
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

/**
 * Fetch timezone from Google Time Zone API via Server Action
 */
export async function getTimezoneByCoordinates(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const result = await getTimezoneByCoordinatesAction(lat, lng);
    if (result.success && result.timezone) {
      return result.timezone;
    }
  } catch (error) {
    console.error("[Timezone] Error calling server action:", error);
  }

  // Fallback to approximation if API fails
  return getTimezoneByLocationFallback(lat, lng);
}

/**
 * Fallback timezone approximation (used when API fails)
 */
function getTimezoneByLocationFallback(lat: number, lng: number): string {
  // Indonesia timezones approximation
  if (lng >= 95 && lng <= 141) {
    if (lat >= -11 && lat <= -6) return "Asia/Makassar"; // WITA
    if (lat >= -6 && lat <= 0) return "Asia/Jakarta"; // WIB
    if (lat >= 0 && lat <= 6) return "Asia/Jayapura"; // WIT
  }

  // Major cities timezones
  if (lng >= 138 && lng <= 141 && lat >= 34 && lat <= 37) return "Asia/Tokyo";
  if (lng >= 126 && lng <= 130 && lat >= 33 && lat <= 38) return "Asia/Seoul";
  if (lng >= 116 && lng <= 120 && lat >= 39 && lat <= 41) return "Asia/Shanghai";
  if (lng >= 103 && lng <= 107 && lat >= 1 && lat <= 6) return "Asia/Bangkok";
  if (lng >= 100 && lng <= 104 && lat >= 13 && lat <= 18) return "Asia/Kuala_Lumpur";
  if (lng >= 103 && lng <= 105 && lat >= -1 && lat <= 2) return "Asia/Singapore";
  if (lng >= 120 && lng <= 125 && lat >= 13 && lat <= 16) return "Asia/Manila";
  if (lng >= 115 && lng <= 120 && lat >= -5 && lat <= 0) return "Asia/Jakarta";

  return "Asia/Jakarta"; // Default
}

/**
 * Clean Indonesian administrative prefixes from location names
 */
function cleanIndonesianPrefix(name: string): string {
  return name
    .replace(/^Kecamatan\s+/i, "")
    .replace(/^Kec\.\s+/i, "")
    .replace(/^Kelurahan\s+/i, "")
    .replace(/^Kel\.\s+/i, "")
    .replace(/^Desa\s+/i, "")
    .replace(/^Kota\s+/i, "")
    .replace(/^Kabupaten\s+/i, "")
    .replace(/^Kab\.\s+/i, "")
    .replace(/^Provinsi\s+/i, "")
    .replace(/^Prov\.\s+/i, "")
    .replace(/^Daerah Khusus Ibukota\s+/i, "")
    .replace(/^DKI\s+/i, "")
    .replace(/^Daerah Istimewa\s+/i, "")
    .replace(/^DI\s+/i, "")
    .trim();
}

/**
 * Format reverse geocode result to match autocomplete style.
 * Removes Plus Codes and cleans up Indonesian prefixes.
 */
export function formatReverseGeocodeResult(
  formattedAddress: string,
  addressComponents?: AddressComponent[]
): string {
  if (!formattedAddress) return "";

  // Remove Google Plus Code (pattern: XX00+00, XXX+XXX, etc.)
  const plusCodePattern = /^[A-Z]{2}[0-9]+[+-]?[0-9A-Z]*,\s*/;
  const cleaned = formattedAddress.replace(plusCodePattern, "");

  // If we have address components, build a cleaner format
  if (addressComponents && addressComponents.length > 0) {
    const parts: string[] = [];

    // Extract parts
    const streetNumber = addressComponents.find(c => c.types.includes("street_number"))?.long_name || "";
    const route = addressComponents.find(c => c.types.includes("route"))?.long_name || "";
    const premise = addressComponents.find(c => c.types.includes("premise"))?.long_name || "";
    const establishment = addressComponents.find(c => c.types.includes("establishment"))?.long_name || "";
    const pointOfInterest = addressComponents.find(c => c.types.includes("point_of_interest"))?.long_name || "";
    const locality = addressComponents.find(c => c.types.includes("locality"))?.long_name || "";
    const admin2 = addressComponents.find(c => c.types.includes("administrative_area_level_2"))?.long_name || "";
    const admin1 = addressComponents.find(c => c.types.includes("administrative_area_level_1"))?.long_name || "";
    const country = addressComponents.find(c => c.types.includes("country"))?.long_name || "";

    // Primary location name (POI, establishment, or premise)
    if (pointOfInterest) parts.push(pointOfInterest);
    else if (establishment) parts.push(establishment);
    else if (premise) parts.push(premise);

    // Street address
    const streetParts = [streetNumber, route].filter(Boolean).join(" ");
    if (streetParts) parts.push(streetParts);

    // City/locality
    const city = locality || cleanIndonesianPrefix(admin2);
    if (city && !parts.includes(city)) parts.push(city);

    // Province/State
    let province = cleanIndonesianPrefix(admin1);
    // For Indonesia, don't add province if it's Jakarta and city is also Jakarta
    if (province && province !== city && country === "Indonesia") {
      const admin1Short = addressComponents.find(c => c.types.includes("administrative_area_level_1"))?.short_name;
      if (admin1Short && admin1Short !== admin1) {
        province = admin1Short;
      }
      parts.push(province);
    } else if (province && province !== city && country !== "Indonesia") {
      parts.push(province);
    }

    // Country (only if not the default/implicit country)
    if (country && country !== "Indonesia") {
      parts.push(country);
    }

    if (parts.length > 0) {
      return parts.join(", ");
    }
  }

  // Fallback: Clean the formatted address by removing known patterns
  let fallback = cleaned;

  // Remove Indonesian prefixes from formatted address
  const indonesianPrefixes = [
    /\bKecamatan\s+/gi,
    /\bKec\.\s+/gi,
    /\bKelurahan\s+/gi,
    /\bKel\.\s+/gi,
    /\bDesa\s+/gi,
    /\bKota\s+/gi,
    /\bKabupaten\s+/gi,
    /\bKab\.\s+/gi,
    /\bProvinsi\s+/gi,
    /\bProv\.\s+/gi,
    /\bDKI\s+/gi,
    /\bDaerah Khusus Ibukota\s+/gi,
  ];

  for (const pattern of indonesianPrefixes) {
    fallback = fallback.replace(pattern, "");
  }

  // Remove postal code at the end
  fallback = fallback.replace(/\s+\d{5}$/, "");

  return fallback.trim();
}

/**
 * Sort nearby places by priority and distance.
 * Prioritizes larger venues (malls, stadiums) over smaller ones (shops, restaurants).
 */
export function sortPlacesByPriority(
  places: Array<{ geometry?: { location?: { lat(): number; lng(): number } }; types: string[] }>,
  clickLat: number,
  clickLng: number
): typeof places {
  return places
    .map((place) => {
      const placeLat = place.geometry?.location?.lat();
      const placeLng = place.geometry?.location?.lng();

      if (placeLat === undefined || placeLng === undefined) return null;

      // Calculate distance (simple Euclidean - sufficient for small distances)
      const distance = Math.sqrt(
        Math.pow(clickLat - placeLat, 2) + Math.pow(clickLng - placeLng, 2)
      );

      return {
        place,
        distance,
        priority: getPlacePriorityForSort(place.types),
      };
    })
    .filter((item): item is { place: typeof places[number]; distance: number; priority: number } => item !== null)
    .sort((a, b) => {
      // First sort by priority (higher first)
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      // Then sort by distance (closer first)
      return a.distance - b.distance;
    })
    .map((item) => item.place);
}

/**
 * Get priority for sorting - imported from constants but inline here for file independence
 */
function getPlacePriorityForSort(placeTypes: readonly string[] = []): number {
  const POI_TYPE_PRIORITY: Record<string, number> = {
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
    "lodging": 60,
    "hotel": 60,
    "restaurant": 20,
    "cafe": 20,
    "bar": 20,
    "night_club": 20,
    "bakery": 15,
    "meal_takeaway": 15,
    "meal_delivery": 15,
    "store": 15,
    "supermarket": 25,
    "grocery_or_supermarket": 25,
    "clothing_store": 15,
    "shoe_store": 15,
    "electronics_store": 15,
    "department_store": 30,
    "hardware_store": 20,
    "bank": 30,
    "atm": 10,
    "pharmacy": 35,
    "doctor": 30,
    "dentist": 30,
    "hair_care": 15,
    "beauty_salon": 15,
    "gym": 25,
    "transit_station": 50,
    "subway_station": 50,
    "bus_station": 45,
    "train_station": 50,
    "taxi_stand": 20,
    "establishment": 5,
    "point_of_interest": 5,
  };

  if (!placeTypes || placeTypes.length === 0) return 5;

  let maxPriority = 5;
  for (const type of placeTypes) {
    const priority = POI_TYPE_PRIORITY[type];
    if (priority && priority > maxPriority) {
      maxPriority = priority;
    }
  }
  return maxPriority;
}

/**
 * Re-export timezone helper for external use
 */
export { getTimezoneByLocation };
