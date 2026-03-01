/**
 * LocationPicker Component
 *
 * Main location picker input with:
 * - Google Places autocomplete
 * - Map modal for visual selection
 * - Timezone detection based on coordinates
 */

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MapPin, X, Loader2 } from "lucide-react";

import type {
  LocationPickerProps,
  GooglePrediction,
  GooglePlaceDetails,
  LocationData,
  Coordinates,
} from "./types";
import { AUTOCOMPLETE_COUNTRIES } from "./constants";
import { LocationModal } from "./LocationModal";
import { getTimezoneByCoordinates, getTimezoneByLocation } from "@/lib/google-maps/utils";
import { loadGoogleMapsScript, getGoogleMaps } from "@/lib/google-maps/loader";

export function LocationPicker({ value, onChange, initialCoordinates }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [showMapModal, setShowMapModal] = useState(false);
  const [predictions, setPredictions] = useState<GooglePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<any>(null);

  // Track the actual current location (from initial OR from user selection)
  const currentLocationRef = useRef<LocationData | null>(null);

  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(() => {
    // Only set initial location if both coordinates AND value are provided
    if (initialCoordinates && value) {
      const loc = { lat: initialCoordinates.lat, lng: initialCoordinates.lng, name: value };
      currentLocationRef.current = loc;
      return loc;
    }
    return null;
  });

  // Load Google Places API on mount
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (apiKey) {
      loadGoogleMapsScript(() => {
        const maps = getGoogleMaps();
        if (maps?.places) {
          autocompleteServiceRef.current = new maps.places.AutocompleteService();
        }
      });
    }
  }, []);

  // Update local state when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Update currentLocation when initialCoordinates changes
  // This ensures the map modal opens at the correct position when editing
  useEffect(() => {
    if (initialCoordinates && initialCoordinates.lat && initialCoordinates.lng) {
      const newLocation = { lat: initialCoordinates.lat, lng: initialCoordinates.lng, name: value };
      setCurrentLocation(newLocation);
      currentLocationRef.current = newLocation;
    }
  }, [initialCoordinates?.lat, initialCoordinates?.lng, value]);

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
          componentRestrictions: { country: AUTOCOMPLETE_COUNTRIES },
        },
        (predictions: GooglePrediction[] | null, status: string) => {
          const maps = getGoogleMaps();
          if (status === maps?.places.PlacesServiceStatus.OK && predictions) {
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
    const maps = getGoogleMaps();
    if (!maps?.places?.PlacesService) {
      onChange(description);
      return;
    }

    const service = new maps.places.PlacesService(document.createElement("div"));
    service.getDetails(
      {
        placeId,
        fields: ["geometry", "address_components"],
      },
      async (place: GooglePlaceDetails | null, status: string) => {
        if (status === "OK" && place?.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          // Store current location for map modal
          setCurrentLocation({ lat, lng, name: description });
          currentLocationRef.current = { lat, lng, name: description };
          const timezone = await getTimezoneByCoordinates(lat, lng);
          onChange(description, timezone, { lat, lng });
        } else {
          setCurrentLocation(null);
          currentLocationRef.current = null;
          const timezone = getTimezoneByLocation(description);
          onChange(description, timezone);
        }
      }
    );
  }, [onChange]);

  // Select a location
  const selectLocation = useCallback(async (
    location: string,
    placeId?: string,
    coordinates?: Coordinates
  ) => {
    setQuery(location);
    setIsOpen(false);
    setPredictions([]);

    if (coordinates) {
      // Store current location for map modal
      const newLocation = { lat: coordinates.lat, lng: coordinates.lng, name: location };
      setCurrentLocation(newLocation);
      currentLocationRef.current = newLocation;
      // Fetch timezone using coordinates
      const timezone = await getTimezoneByCoordinates(coordinates.lat, coordinates.lng);
      onChange(location, timezone, coordinates);
    } else if (placeId) {
      getPlaceDetails(placeId, location);
    } else {
      setCurrentLocation(null);
      currentLocationRef.current = null;
      const timezone = getTimezoneByLocation(location);
      onChange(location, timezone);
    }
  }, [onChange, getPlaceDetails]);

  // Clear input
  const handleClear = useCallback(() => {
    setQuery("");
    setIsOpen(false);
    setPredictions([]);
    setCurrentLocation(null);
    currentLocationRef.current = null;
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
      {showMapModal && (
        <LocationModal
          onClose={() => setShowMapModal(false)}
          onSelect={selectLocation}
          initialLocation={currentLocation}
        />
      )}
    </div>
  );
}
