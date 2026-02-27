"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MapPin, X, Search, Loader2 } from "lucide-react";
import { getTimezoneByLocation } from "@/lib/constants/locations";

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
  onSelect: (location: string, placeId?: string) => void;
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
    console.log("[LocationModal] API Key exists:", !!apiKey);

    const initializeServices = () => {
      try {
        if (window.google?.maps?.places) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          geocoderRef.current = new window.google.maps.Geocoder();
          setHasGooglePlaces(true);
          setIsInitializing(false);
          console.log("[LocationModal] Services initialized successfully");
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
        console.log("[LocationModal] Script loaded, initializing services...");
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
        console.log("[LocationModal] Map ref not ready, retrying...");
        setTimeout(initializeWithDelay, 100);
        return;
      }

      const rect = mapRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.log("[LocationModal] Map container has no dimensions, retrying...");
        setTimeout(initializeWithDelay, 100);
        return;
      }

      console.log("[LocationModal] Initializing map...", { width: rect.width, height: rect.height });

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

          // Reverse geocode to get location name
          if (geocoderRef.current) {
            geocoderRef.current.geocode(
              { location: { lat, lng } },
              (results: any[], status: string) => {
                if (status === "OK" && results?.[0]) {
                  const locationName = results[0].formatted_address;
                  setSelectedLocation({ lat, lng, name: locationName });
                  setSearch(locationName);
                }
              }
            );
          }
        });

        console.log("[LocationModal] Map initialized successfully");
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
  const handleSelectPlace = useCallback((prediction: GooglePrediction) => {
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
      (place: GooglePlaceDetails | null, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          // Update map marker and center
          updateMarker(lat, lng);
          setSelectedLocation({ lat, lng, name: prediction.description });

          onSelect(prediction.description, prediction.place_id);
        } else {
          onSelect(prediction.description);
        }
        // Don't close immediately - let user see the map
        // onClose();
      }
    );
  }, [onSelect]);

  // Confirm selection and close
  const handleConfirmSelection = useCallback(() => {
    if (selectedLocation) {
      onSelect(selectedLocation.name);
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
