"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MapPin, X, Search, Loader2 } from "lucide-react";
import { getTimezoneByLocation } from "@/lib/constants/locations";
import { getTimezoneByCoordinates } from "@/app/actions/timezone";

interface LocationPickerProps {
  value: string;
  onChange: (value: string, timezone?: string, coordinates?: { lat: number; lng: number }) => void;
}

// Google Places Autocomplete types
interface GooglePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GooglePlaceDetails {
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

// Global callback for Google Places API
declare global {
  interface Window {
    initGooglePlacesAutocomplete?: () => void;
    google?: any;
  }
}

let isGoogleScriptLoaded = false;
let isGoogleScriptLoading = false;

function loadGooglePlacesScript(callback: () => void) {
  if (isGoogleScriptLoaded || window.google?.maps?.places) {
    callback();
    return;
  }

  if (isGoogleScriptLoading) {
    // Wait for loading to complete
    const checkInterval = setInterval(() => {
      if (isGoogleScriptLoaded || window.google?.maps?.places) {
        clearInterval(checkInterval);
        callback();
      }
    }, 100);
    return;
  }

  isGoogleScriptLoading = true;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  if (!apiKey) {
    console.warn("Google Maps API key not found");
    isGoogleScriptLoading = false;
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlacesAutocomplete`;
  script.async = true;
  script.defer = true;

  window.initGooglePlacesAutocomplete = () => {
    isGoogleScriptLoaded = true;
    isGoogleScriptLoading = false;
    callback();
  };

  script.onerror = () => {
    console.error("Failed to load Google Places API");
    isGoogleScriptLoading = false;
  };

  document.head.appendChild(script);
}

// Fetch timezone from Google Time Zone API via Server Action
async function getTimezoneFromCoordinates(lat: number, lng: number): Promise<string> {
  try {
    const result = await getTimezoneByCoordinates(lat, lng);
    if (result.success && result.timezone) {
      return result.timezone;
    }
  } catch (error) {
    console.error("[Timezone] Error calling server action:", error);
  }

  // Fallback to approximation if API fails
  const fallback = getTimezoneByLocationFallback(lat, lng);
  console.log("[Timezone] Using fallback timezone:", fallback);
  return fallback;
}

// Fallback timezone approximation (used when API fails)
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
 * Format reverse geocode result to match autocomplete style
 * Removes Plus Codes and cleans up Indonesian prefixes
 */
function formatReverseGeocodeResult(
  formattedAddress: string,
  addressComponents?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>
): string {
  if (!formattedAddress) return "";

  // Remove Google Plus Code (pattern: XX00+00, XXX+XXX, etc.)
  const plusCodePattern = /^[A-Z]{2}[0-9]+[+-]?[0-9A-Z]*,\s*/;
  const cleaned = formattedAddress.replace(plusCodePattern, "");

  // Helper to clean Indonesian admin names
  const cleanIndonesianPrefix = (name: string): string => {
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
  };

  // If we have address components, build a cleaner format
  if (addressComponents && addressComponents.length > 0) {
    const components = addressComponents;

    // Extract parts
    const streetNumber = components.find(c => c.types.includes("street_number"))?.long_name || "";
    const route = components.find(c => c.types.includes("route"))?.long_name || "";
    const premise = components.find(c => c.types.includes("premise"))?.long_name || "";
    const establishment = components.find(c => c.types.includes("establishment"))?.long_name || "";
    const pointOfInterest = components.find(c => c.types.includes("point_of_interest"))?.long_name || "";
    const locality = components.find(c => c.types.includes("locality"))?.long_name || "";
    const admin2 = components.find(c => c.types.includes("administrative_area_level_2"))?.long_name || "";
    const admin1 = components.find(c => c.types.includes("administrative_area_level_1"))?.long_name || "";
    const country = components.find(c => c.types.includes("country"))?.long_name || "";
    // Postal code (not displayed but used for filtering)

    // Build clean address parts
    const parts: string[] = [];

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
      // Use English name for Indonesian provinces if available
      const admin1Short = components.find(c => c.types.includes("administrative_area_level_1"))?.short_name;
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

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [showMapModal, setShowMapModal] = useState(false);
  const [predictions, setPredictions] = useState<GooglePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<any>(null);

  // Load Google Places API on mount
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (apiKey) {
      loadGooglePlacesScript(() => {
        if (window.google?.maps?.places) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        }
      });
    }
  }, []);

  // Update local state when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Fetch predictions from Google Places
  const fetchPredictions = useCallback(async (input: string) => {
    if (!input || !autocompleteServiceRef.current) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input,
          // No types restriction - allows searching for all places including stadiums, venues, addresses, etc.
          componentRestrictions: { country: ["id", "sg", "my", "th", "vn", "ph", "jp", "kr", "cn", "au", "in", "ae", "us", "gb", "fr", "de", "nl", "es", "it"] }
        },
        (predictions: GooglePrediction[] | null, status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions);
          } else {
            setPredictions([]);
          }
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setPredictions([]);
      setIsLoading(false);
    }
  }, []);

  // Debounced fetch
  useEffect(() => {
    if (!query || !autocompleteServiceRef.current) {
      setPredictions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchPredictions(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchPredictions]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setIsOpen(true);
  }, []);

  // Get place details from Google Places
  const getPlaceDetails = useCallback((placeId: string, description: string) => {
    if (!window.google?.maps?.places?.PlacesService) {
      onChange(description);
      return;
    }

    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails(
      {
        placeId,
        fields: ["geometry", "address_components"],
      },
      async (place: GooglePlaceDetails | null, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const timezone = await getTimezoneFromCoordinates(lat, lng);
          onChange(description, timezone, { lat, lng });
        } else {
          const timezone = getTimezoneByLocation(description);
          onChange(description, timezone);
        }
      }
    );
  }, [onChange]);

  // Select a location
  const selectLocation = useCallback(async (location: string, placeId?: string, coordinates?: { lat: number; lng: number }) => {
    setQuery(location);
    setIsOpen(false);
    setPredictions([]);

    if (coordinates) {
      // Fetch timezone using coordinates
      const timezone = await getTimezoneFromCoordinates(coordinates.lat, coordinates.lng);
      onChange(location, timezone, coordinates);
    } else if (placeId) {
      getPlaceDetails(placeId, location);
    } else {
      const timezone = getTimezoneByLocation(location);
      onChange(location, timezone);
    }
  }, [onChange, getPlaceDetails]);

  // Clear input
  const handleClear = useCallback(() => {
    setQuery("");
    setIsOpen(false);
    setPredictions([]);
    onChange("", "", undefined);
  }, [onChange]);

  const showDropdown = isOpen && predictions.length > 0;

  return (
    <div className="relative">
      {/* Input with map icon button */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              // Delay closing to allow click on dropdown items
              setTimeout(() => setIsOpen(false), 200);
            }}
            placeholder="Search city or venue..."
            className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm outline-none transition-all"
            style={{
              border: "1.5px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
              fontFamily: '"Inter", sans-serif',
              color: "#1E293B",
            }}
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-colors"
              style={{ width: "18px", height: "18px", backgroundColor: "#F1F5F9", color: "#64748B" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E2E8F0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9";
              }}
            >
              <X className="w-3 h-3" strokeWidth={2.5} />
            </button>
          )}

          {isLoading && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#94A3B8" }} strokeWidth={2} />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowMapModal(true)}
          className="flex items-center justify-center rounded-xl transition-all"
          style={{
            width: "42px",
            height: "42px",
            backgroundColor: "#EFF6FF",
            border: "1.5px solid #BFDBFE",
            color: "#2563EB",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#DBEAFE";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EFF6FF";
          }}
          title="Select from Map"
        >
          <MapPin className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {showDropdown && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden shadow-lg"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {/* Google Places predictions */}
          {predictions.length > 0 && (
            <>
              <div
                className="px-3 py-1.5"
                style={{
                  fontSize: "0.65rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  backgroundColor: "#F8FAFC",
                }}
              >
                Google Places
              </div>
              {predictions.map((prediction) => (
                <button
                  key={prediction.place_id}
                  type="button"
                  onMouseDown={() => selectLocation(prediction.description, prediction.place_id)}
                  className="w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
                >
                  <div
                    className="text-sm"
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      color: "#1E293B",
                      fontWeight: 500,
                    }}
                  >
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      color: "#94A3B8",
                    }}
                  >
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </button>
              ))}
            </>
          )}

          {predictions.length === 0 && query && isLoading === false && (
            <div
              className="px-3 py-4 text-center"
              style={{ color: "#94A3B8", fontFamily: '"Inter", sans-serif', fontSize: "0.75rem" }}
            >
              No locations found for "{query}"
            </div>
          )}
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && <LocationModal onClose={() => setShowMapModal(false)} onSelect={selectLocation} />}
    </div>
  );
}

// Location Modal Component
interface LocationModalProps {
  onClose: () => void;
  onSelect: (location: string, placeId?: string, coordinates?: { lat: number; lng: number }) => void;
}

/**
 * POI Type Priority - Higher number = more important (should be selected over smaller POIs inside)
 * This mimics Google Maps behavior where clicking a mall selects the mall, not a store inside
 */
const POI_TYPE_PRIORITY: Record<string, number> = {
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
};

/**
 * Get priority score for a place based on its types
 * Higher score = more important, should be selected over smaller POIs
 */
function getPlacePriority(placeTypes: string[] = []): number {
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
 * Sort nearby places by priority and distance
 * Prioritizes larger venues (malls, stadiums) over smaller ones (shops, restaurants)
 */
function sortPlacesByPriority(
  places: any[],
  clickLat: number,
  clickLng: number
): any[] {
  return places
    .map((place) => {
      const placeLat = place.geometry?.location?.lat();
      const placeLng = place.geometry?.location?.lng();

      if (!placeLat || !placeLng) return null;

      // Calculate distance
      const distance = Math.sqrt(
        Math.pow(clickLat - placeLat, 2) + Math.pow(clickLng - placeLng, 2)
      );

      // Get priority based on place types
      const priority = getPlacePriority(place.types);

      return {
        place,
        distance,
        priority,
      };
    })
    .filter((item) => item !== null)
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

function LocationModal({ onClose, onSelect }: LocationModalProps) {
  const [search, setSearch] = useState("");
  const [predictions, setPredictions] = useState<GooglePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteServiceRef = useRef<any>(null);
  const [hasGooglePlaces, setHasGooglePlaces] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Map related refs and state
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [hasSelectedResult, setHasSelectedResult] = useState(false); // Track if user has clicked a result

  // Load Google Places script when modal opens
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

    const initializeServices = () => {
      try {
        if (window.google?.maps?.places) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          geocoderRef.current = new window.google.maps.Geocoder();
          setHasGooglePlaces(true);
          setIsInitializing(false);
          return true;
        }
        return false;
      } catch (error) {
        console.error("[LocationModal] Failed to initialize:", error);
        setInitError("Failed to initialize Google Places");
        setIsInitializing(false);
        return false;
      }
    };

    // Try to initialize immediately if already loaded
    if (initializeServices()) {
      return;
    }

    // Load script and then initialize
    if (apiKey) {
      loadGooglePlacesScript(() => {
        initializeServices();
      });
    } else {
      console.error("[LocationModal] No API key found");
      setInitError("Google Maps API key not configured");
      setIsInitializing(false);
    }
  }, []);

  // Initialize map when services are ready and ref is available
  useEffect(() => {
    if (!hasGooglePlaces || mapInstanceRef.current) {
      return;
    }

    // Wait for the map container to be rendered with proper dimensions
    const initializeWithDelay = () => {
      if (!mapRef.current) {
        setTimeout(initializeWithDelay, 100);
        return;
      }

      const rect = mapRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setTimeout(initializeWithDelay, 100);
        return;
      }

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: -6.2088, lng: 106.8456 }, // Jakarta default
          zoom: 13,
          styles: [
            { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "on" }] },
            { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
            { featureType: "administrative.neighborhood", stylers: [{ visibility: "off" }] },
            // Show POIs with labels (all types including stadiums, gyms, etc.)
            { featureType: "poi", elementType: "all", stylers: [{ visibility: "on" }] },
            { featureType: "poi", elementType: "labels.text", stylers: [{ visibility: "on" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#333333" }] },
            { featureType: "poi", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
            { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ visibility: "simplified" }] },
            { featureType: "water", stylers: [{ color: "#aadaff" }] },
          ],
        });

        mapInstanceRef.current = map;

        // Add click listener to map
        map.addListener("click", (e: any) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();

          // Update marker
          if (window.google?.maps?.Marker) {
            if (markerRef.current) {
              markerRef.current.setPosition({ lat, lng });
            } else {
              markerRef.current = new window.google.maps.Marker({
                position: { lat, lng },
                map: mapInstanceRef.current,
                animation: window.google.maps.Animation.DROP,
              });
            }
          }

          // Center map on new location
          map.panTo({ lat, lng });

          // Try to find nearby POI first (like Google Maps behavior)
          // If clicking on a POI, show POI name; otherwise show address
          if (window.google?.maps?.places?.PlacesService) {
            const service = new window.google.maps.places.PlacesService(document.createElement("div"));

            // Helper function to handle POI selection
            const handlePOISelection = (places: any[]) => {
              if (places.length === 0) return false;

              // Sort places by priority (malls > restaurants) then distance
              const sortedPlaces = sortPlacesByPriority(places, lat, lng);

              if (sortedPlaces.length > 0) {
                const bestPlace = sortedPlaces[0];

                // Calculate distance to the best place
                const placeLat = bestPlace.geometry?.location?.lat();
                const placeLng = bestPlace.geometry?.location?.lng();
                const distance = Math.sqrt(Math.pow(lat - placeLat, 2) + Math.pow(lng - placeLng, 2));

                // Get place priority for distance threshold
                const priority = getPlacePriority(bestPlace.types);

                // Distance thresholds in degrees (approximate)
                // High priority places (malls, stadiums): 200m
                // Medium priority (hotels, supermarkets): 100m
                // Low priority (restaurants, stores): 50m
                let distanceThreshold = 0.0005; // 50m default
                if (priority >= 80) distanceThreshold = 0.002; // 200m for major venues
                else if (priority >= 50) distanceThreshold = 0.001; // 100m for medium places
                else if (priority >= 25) distanceThreshold = 0.0007; // 70m for supermarkets etc

                // Always accept POI if it's very close (within 10m) regardless of priority
                const veryCloseThreshold = 0.0001; // ~10m

                if (distance < distanceThreshold || distance < veryCloseThreshold) {
                  // Get place details to get full address
                  service.getDetails(
                    {
                      placeId: bestPlace.place_id,
                      fields: ["name", "types", "formatted_address", "address_components"],
                    },
                    (detail: any, detailStatus: string) => {
                      if (detailStatus === "OK" && detail) {
                        // Use POI name directly (like Google Maps behavior)
                        const displayName = detail.name;
                        setSelectedLocation({ lat, lng, name: displayName });
                        setSearch(displayName);
                      } else {
                        // Fallback to just the name
                        setSelectedLocation({ lat, lng, name: bestPlace.name });
                        setSearch(bestPlace.name);
                      }
                    }
                  );
                  return true;
                }
              }
              return false;
            };

            // First search: By radius (300m) to catch nearby places
            service.nearbySearch(
              {
                location: { lat, lng },
                radius: 300, // 300 meters - larger radius to catch POIs when zoomed in
              },
              (results: any[], status: string) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length > 0) {
                  const handled = handlePOISelection(results);
                  if (handled) return;
                }

                // Second search: Try with rankBy DISTANCE to get closest places
                service.nearbySearch(
                  {
                    location: { lat, lng },
                    rankBy: window.google.maps.places.RankBy.DISTANCE,
                  },
                  (distanceResults: any[], distanceStatus: string) => {
                    if (distanceStatus === window.google.maps.places.PlacesServiceStatus.OK && distanceResults?.length > 0) {
                      const handled = handlePOISelection(distanceResults.slice(0, 10)); // Check top 10 closest
                      if (handled) return;
                    }

                    // No nearby POI found in any search, use reverse geocoding for address
                    if (geocoderRef.current) {
                      geocoderRef.current.geocode(
                        { location: { lat, lng } },
                        (geoResults: any[], geoStatus: string) => {
                          if (geoStatus === "OK" && geoResults?.[0]) {
                            // Format the result to match autocomplete style (remove Plus Code, clean prefixes)
                            const formattedName = formatReverseGeocodeResult(
                              geoResults[0].formatted_address,
                              geoResults[0].address_components
                            );
                            setSelectedLocation({ lat, lng, name: formattedName });
                            setSearch(formattedName);
                          }
                        }
                      );
                    }
                  }
                );
              }
            );
          } else if (geocoderRef.current) {
            // Fallback if PlacesService not available
            geocoderRef.current.geocode(
              { location: { lat, lng } },
              (results: any[], status: string) => {
                if (status === "OK" && results?.[0]) {
                  const formattedName = formatReverseGeocodeResult(
                    results[0].formatted_address,
                    results[0].address_components
                  );
                  setSelectedLocation({ lat, lng, name: formattedName });
                  setSearch(formattedName);
                }
              }
            );
          }
        });
      } catch (error) {
        console.error("[LocationModal] Map initialization failed:", error);
      }
    };

    // Start initialization with delay
    initializeWithDelay();
  }, [hasGooglePlaces]);

  // Update marker position (for external calls)
  const updateMarker = (lat: number, lng: number) => {
    if (!window.google?.maps?.Marker || !mapInstanceRef.current) return;

    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    } else {
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        animation: window.google.maps.Animation.DROP,
      });
    }

    mapInstanceRef.current.panTo({ lat, lng });
  };

  // Pan map to location when prediction is hovered (only active before user clicks a result)
  const handlePredictionHover = (prediction: GooglePrediction) => {
    // Disable hover preview after user has clicked a result
    if (hasSelectedResult) return;
    if (!window.google?.maps?.places?.PlacesService || !mapInstanceRef.current) return;

    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails(
      { placeId: prediction.place_id, fields: ["geometry"] },
      (place: any, status: string) => {
        if (status === "OK" && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          mapInstanceRef.current.panTo({ lat, lng });
          updateMarker(lat, lng);
        }
      }
    );
  };

  // Fetch predictions (worldwide search, no country restriction)
  useEffect(() => {
    if (!search || !autocompleteServiceRef.current) {
      setPredictions([]);
      return;
    }

    // Re-enable hover preview when user starts a new search
    setHasSelectedResult(false);

    setIsLoading(true);
    try {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: search,
          // No types restriction - allows searching for all places including stadiums, venues, addresses, etc.
        },
        (predictions: GooglePrediction[] | null, status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions.slice(0, 10));
          } else {
            setPredictions([]);
          }
          setIsLoading(false);
        }
      );
    } catch {
      setPredictions([]);
      setIsLoading(false);
    }
  }, [search]);

  // Get place details and select
  const handleSelectPlace = useCallback(async (prediction: GooglePrediction) => {
    // Mark that user has clicked a result - disable hover preview
    setHasSelectedResult(true);

    if (!window.google?.maps?.places?.PlacesService) {
      onSelect(prediction.description);
      onClose();
      return;
    }

    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["geometry", "address_components"],
      },
      async (place: GooglePlaceDetails | null, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          // Update map marker and center
          updateMarker(lat, lng);
          setSelectedLocation({ lat, lng, name: prediction.description });

          // Pass coordinates for timezone detection
          onSelect(prediction.description, prediction.place_id, { lat, lng });
        } else {
          onSelect(prediction.description);
        }
        // Don't close immediately - let user see the map
        // onClose();
      }
    );
  }, [onSelect]);

  // Confirm selection and close
  const handleConfirmSelection = useCallback(async () => {
    if (selectedLocation) {
      // Pass coordinates for timezone detection
      onSelect(selectedLocation.name, undefined, { lat: selectedLocation.lat, lng: selectedLocation.lng });
    }
    onClose();
  }, [selectedLocation, onSelect, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.72)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: "100%",
          maxWidth: "800px",
          maxHeight: "90vh",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 24px 80px rgba(0,0,0,0.22)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #F1F5F9" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#EFF6FF",
                border: "1.5px solid #BFDBFE",
              }}
            >
              <MapPin className="w-4 h-4" style={{ color: "#2563EB" }} strokeWidth={2} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#0F172A",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Select Location
              </h3>
              <p
                style={{
                  color: initError ? "#EF4444" : "#94A3B8",
                  fontSize: "0.75rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {isInitializing ? "Loading Google Places..." :
                 initError ? "Error loading Google Places" :
                 hasGooglePlaces ? "Search cities worldwide using Google Places" :
                 "Initializing..."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#F8FAFC",
              border: "1.5px solid #E2E8F0",
              color: "#64748B",
            }}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#94A3B8" }}
              strokeWidth={2}
              width={16}
              height={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isInitializing ? "Loading..." : initError ? "Error loading service" : "Search any place worldwide..."}
              disabled={isInitializing || initError !== null}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl text-sm outline-none"
              style={{
                border: "1.5px solid #E2E8F0",
                backgroundColor: (hasGooglePlaces && !isInitializing) ? "#F8FAFC" : "#F1F5F9",
                fontFamily: '"Inter", sans-serif',
                color: (hasGooglePlaces && !isInitializing) ? "#1E293B" : "#94A3B8",
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPredictions([]);
                    setHasSelectedResult(false); // Re-enable hover preview
                    setSelectedLocation(null); // Clear selected location card
                  }}
                  className="flex items-center justify-center rounded-full transition-colors"
                  style={{ width: "18px", height: "18px", backgroundColor: "#F1F5F9", color: "#64748B" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E2E8F0";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9";
                  }}
                >
                  <X className="w-3 h-3" strokeWidth={2.5} />
                </button>
              )}
              {isLoading && (
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#94A3B8" }} strokeWidth={2} />
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area - Map + Search Results */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {/* Map Container */}
          {!isInitializing && !initError && (
            <div style={{ height: "320px", position: "relative", flexShrink: 0 }}>
              <div
                ref={mapRef}
                style={{ width: "100%", height: "100%" }}
              />
              {/* Selected location overlay */}
              {selectedLocation && (
                <div
                  className="absolute bottom-3 left-3 right-3 rounded-xl px-3 py-2"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: "0.75rem", color: "#64748B", fontFamily: '"Inter", sans-serif' }}>
                        Selected Location
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#1E293B", fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                        {selectedLocation.name}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocation(null);
                        setHasSelectedResult(false); // Re-enable hover preview
                      }}
                      className="flex items-center justify-center rounded-full transition-colors flex-shrink-0"
                      style={{ width: "20px", height: "20px", backgroundColor: "#F1F5F9", color: "#64748B" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E2E8F0";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9";
                      }}
                    >
                      <X className="w-3 h-3" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Search Results Panel */}
        {search && (
          <div
            className="overflow-y-auto"
            style={{ height: "180px" }}
          >
            {predictions.length > 0 && (
              <div
                className="px-5 py-2 sticky top-0 z-10"
                style={{
                  backgroundColor: "#F8FAFC",
                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: "#2563EB",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Worldwide Search Results
                </span>
              </div>
            )}
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                type="button"
                onClick={() => handleSelectPlace(prediction)}
                onMouseEnter={!hasSelectedResult ? () => handlePredictionHover(prediction) : undefined}
                className="w-full px-5 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3"
                style={{ borderBottom: "1px solid #F8FAFC" }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: "28px",
                    height: "28px",
                    backgroundColor: "#DBEAFE",
                    color: "#2563EB",
                  }}
                >
                  <MapPin strokeWidth={2} width={14} height={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                      color: "#1E293B",
                    }}
                  >
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontFamily: '"Inter", sans-serif',
                      color: "#94A3B8",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </button>
            ))}
            {predictions.length === 0 && search && !isLoading && (
              <div
                className="px-5 py-6 text-center"
                style={{ color: "#94A3B8", fontFamily: '"Inter", sans-serif', fontSize: "0.8rem" }}
              >
                <MapPin className="w-5 h-5 mx-auto mb-2" style={{ opacity: 0.5 }} strokeWidth={2} />
                No locations found for "{search}"
                <div style={{ fontSize: "0.7rem", marginTop: "0.25rem" }}>
                  Try a different search or click on the map
                </div>
              </div>
            )}
          </div>
        )}
        </div>

        {/* Footer Actions */}
        {!isInitializing && !initError && (
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderTop: "1px solid #F1F5F9" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                backgroundColor: "#F8FAFC",
                border: "1.5px solid #E2E8F0",
                color: "#64748B",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSelection}
              disabled={!selectedLocation}
              className="px-5 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                backgroundColor: selectedLocation ? "#2563EB" : "#94A3B8",
                border: "none",
                color: "#FFFFFF",
                opacity: selectedLocation ? 1 : 0.6,
                cursor: selectedLocation ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => {
                if (selectedLocation) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1D4ED8";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = selectedLocation ? "#2563EB" : "#94A3B8";
              }}
            >
              <MapPin strokeWidth={2} width={14} height={14} />
              {selectedLocation ? "Confirm Location" : "Select a Location"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
