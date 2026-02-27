"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MapPin, X, Search, Loader2 } from "lucide-react";
import { LOCATION_OPTIONS, getTimezoneByLocation } from "@/lib/constants/locations";

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

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
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

function getTimezoneFromCoordinates(lat: number, lng: number): string {
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
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
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
          types: ["(cities)"],
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

  // Filter locations from static list (fallback)
  const filteredLocations = query
    ? LOCATION_OPTIONS.filter((loc) =>
        loc.toLowerCase().includes(query.toLowerCase())
      )
    : LOCATION_OPTIONS;

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
      (place: GooglePlaceDetails | null, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const timezone = getTimezoneFromCoordinates(lat, lng);
          onChange(description, timezone, { lat, lng });
        } else {
          const timezone = getTimezoneByLocation(description);
          onChange(description, timezone);
        }
      }
    );
  }, [onChange]);

  // Select a location
  const selectLocation = useCallback((location: string, placeId?: string) => {
    setQuery(location);
    setIsOpen(false);
    setPredictions([]);

    if (placeId) {
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

  const showDropdown = isOpen && (predictions.length > 0 || filteredLocations.length > 0);

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

          {/* Fallback locations */}
          {filteredLocations.length > 0 && predictions.length > 0 && (
            <div style={{ borderTop: "1px solid #F1F5F9" }} />
          )}

          {filteredLocations.length > 0 && (
            <>
              {predictions.length > 0 && (
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
                  Popular Locations
                </div>
              )}
              {filteredLocations.slice(0, predictions.length > 0 ? 5 : 10).map((location) => (
                <button
                  key={location}
                  type="button"
                  onMouseDown={() => selectLocation(location)}
                  className="w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
                >
                  <div
                    className="text-sm flex items-center gap-2"
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      color: "#1E293B",
                      fontWeight: 500,
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} strokeWidth={2} />
                    {location}
                  </div>
                </button>
              ))}
            </>
          )}

          {predictions.length === 0 && filteredLocations.length === 0 && query && (
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
  onSelect: (location: string, placeId?: string) => void;
}

function LocationModal({ onClose, onSelect }: LocationModalProps) {
  const [search, setSearch] = useState("");
  const [predictions, setPredictions] = useState<GooglePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteServiceRef = useRef<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [hasGooglePlaces, setHasGooglePlaces] = useState(false);

  // Load Google Places script when modal opens
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (apiKey && !window.google?.maps?.places) {
      loadGooglePlacesScript(() => {
        if (window.google?.maps?.places) {
          setHasGooglePlaces(true);
          setScriptLoaded(true);
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        }
      });
    } else if (window.google?.maps?.places) {
      setHasGooglePlaces(true);
      setScriptLoaded(true);
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  // Fetch predictions (worldwide search, no country restriction)
  useEffect(() => {
    if (!search || !autocompleteServiceRef.current) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: search,
          types: ["(cities)"],
          // No country restrictions for worldwide search
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
    } catch (error) {
      setPredictions([]);
      setIsLoading(false);
    }
  }, [search]);

  // Group static locations by country/region
  const groupedLocations = LOCATION_OPTIONS.reduce((acc, loc) => {
    const country = loc.split(", ").pop() || "Other";
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(loc);
    return acc;
  }, {} as Record<string, string[]>);

  // Get place details and select
  const handleSelectPlace = useCallback((prediction: GooglePrediction) => {
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
      (place: GooglePlaceDetails | null, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const timezone = getTimezoneFromCoordinates(lat, lng);
          onSelect(prediction.description, prediction.place_id);
        } else {
          onSelect(prediction.description);
        }
        onClose();
      }
    );
  }, [onClose, onSelect]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.72)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "80vh",
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
                  color: "#94A3B8",
                  fontSize: "0.75rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {hasGooglePlaces ? "Search worldwide or choose from popular cities" : "Loading location services..."}
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
              placeholder={hasGooglePlaces ? "Search any city worldwide..." : "Search cities..."}
              disabled={!hasGooglePlaces && !scriptLoaded}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none"
              style={{
                border: "1.5px solid #E2E8F0",
                backgroundColor: hasGooglePlaces ? "#F8FAFC" : "#F1F5F9",
                fontFamily: '"Inter", sans-serif',
                color: hasGooglePlaces ? "#1E293B" : "#94A3B8",
              }}
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: "#94A3B8" }} strokeWidth={2} />
            )}
          </div>
        </div>

        {/* Results */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 140px)" }}
        >
          {/* Google Places results */}
          {predictions.length > 0 && (
            <>
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
              {predictions.map((prediction) => (
                <button
                  key={prediction.place_id}
                  type="button"
                  onClick={() => handleSelectPlace(prediction)}
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
              <div style={{ borderTop: "1px solid #E2E8F0", margin: "8px 0" }} />
            </>
          )}

          {/* Popular locations - only show when not searching or no results */}
          {(predictions.length === 0 || !search) && Object.entries(groupedLocations).map(([country, locations]) => (
            <div key={country}>
              <div
                className="px-5 py-2 sticky top-0 z-10"
                style={{
                  backgroundColor: "#F8FAFC",
                  borderBottom: "1px solid #F1F5F9",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: "#64748B",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {country}
                </span>
              </div>
              {locations.map((location) => {
                const city = location.split(", ")[0];
                return (
                  <button
                    key={location}
                    type="button"
                    onClick={() => {
                      onSelect(location);
                      onClose();
                    }}
                    className="w-full px-5 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3"
                    style={{ borderBottom: "1px solid #F8FAFC" }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: "28px",
                        height: "28px",
                        backgroundColor: "#EFF6FF",
                        color: "#2563EB",
                      }}
                    >
                      <MapPin strokeWidth={2} width={14} height={14} />
                    </div>
                    <div className="flex-1">
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 500,
                          color: "#1E293B",
                        }}
                      >
                        {city}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          fontFamily: '"Inter", sans-serif',
                          color: "#94A3B8",
                        }}
                      >
                        {location}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          {predictions.length === 0 && search && !isLoading && (
            <div
              className="px-5 py-8 text-center"
              style={{ color: "#94A3B8", fontFamily: '"Inter", sans-serif' }}
            >
              No locations found for "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
