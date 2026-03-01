/**
 * LocationModal Component
 *
 * Modal interface for selecting locations via:
 * - Interactive map with click-to-select
 * - Google Places autocomplete search
 * - POI (Point of Interest) detection and prioritization
 */

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MapPin, X, Search, Loader2 } from "lucide-react";

import type {
  GooglePrediction,
  GooglePlaceDetails,
  GooglePlaceResult,
  LocationData,
} from "./types";
import { DEFAULT_CENTER, getPlacePriority, getDistanceThreshold, VERY_CLOSE_THRESHOLD } from "./constants";
import { formatReverseGeocodeResult, sortPlacesByPriority } from "@/lib/google-maps/utils";
import { getGoogleMaps } from "@/lib/google-maps/loader";

export interface LocationModalProps {
  onClose: () => void;
  onSelect: (location: string, placeId?: string, coordinates?: { lat: number; lng: number }) => void;
  initialLocation?: LocationData | null;
}

// Use wrapper interfaces for dynamically loaded Google Maps services
interface AutocompleteService {
  getPlacePredictions(
    request: { input: string },
    callback: (predictions: GooglePrediction[] | null, status: string) => void
  ): void;
}

interface Geocoder {
  geocode(
    request: { location: { lat: number; lng: number } },
    callback: (results: any[] | null, status: string) => void
  ): void;
}

interface MapServices {
  autocompleteService: AutocompleteService | null;
  geocoder: Geocoder | null;
}

export function LocationModal({ onClose, onSelect, initialLocation }: LocationModalProps) {
  const [search, setSearch] = useState("");
  const [predictions, setPredictions] = useState<GooglePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<MapServices>({
    autocompleteService: null,
    geocoder: null,
  });
  const [hasGooglePlaces, setHasGooglePlaces] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Map refs and state
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  // Refs for UI behavior control
  const hasSelectedResultRef = useRef(false); // Track if user has selected a result
  const isUserTypingRef = useRef(false); // Track if search change is from user typing

  // Load Google Places and initialize services
  useEffect(() => {
    const initializeServices = () => {
      try {
        const maps = getGoogleMaps();
        if (!maps?.places) return false;

        setServices({
          autocompleteService: new maps.places.AutocompleteService(),
          geocoder: new maps.Geocoder(),
        });
        setHasGooglePlaces(true);
        setIsInitializing(false);
        return true;
      } catch (error) {
        console.error("[LocationModal] Failed to initialize:", error);
        setInitError("Failed to initialize Google Places");
        setIsInitializing(false);
        return false;
      }
    };

    if (initializeServices()) return;

    // Dynamically import the loader to avoid loading it at module level
    import("@/lib/google-maps/loader").then(({ loadGoogleMapsScript }) => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
      if (apiKey) {
        loadGoogleMapsScript(() => {
          initializeServices();
        });
      } else {
        setInitError("Google Maps API key not configured");
        setIsInitializing(false);
      }
    });
  }, []);

  // Initialize map when services are ready
  useEffect(() => {
    if (!hasGooglePlaces || mapInstanceRef.current || !mapRef.current) return;

    const maps = getGoogleMaps();
    if (!maps) return;

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

      const centerLat = initialLocation?.lat ?? DEFAULT_CENTER.lat;
      const centerLng = initialLocation?.lng ?? DEFAULT_CENTER.lng;
      const zoom = initialLocation ? 15 : 13;

      const map = new maps.Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom,
        styles: [
          { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "on" }] },
          { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
          { featureType: "administrative.neighborhood", stylers: [{ visibility: "off" }] },
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

      // Set initial marker and location if provided
      if (initialLocation && maps.Marker) {
        markerRef.current = new maps.Marker({
          position: { lat: initialLocation.lat, lng: initialLocation.lng },
          map,
          animation: maps.Animation.DROP,
        });
        setSelectedLocation({
          lat: initialLocation.lat,
          lng: initialLocation.lng,
          name: initialLocation.name,
        });
        isUserTypingRef.current = false;
        setSearch(initialLocation.name);
        hasSelectedResultRef.current = true;
      }

      // Map click handler
      map.addListener("click", (e: any) => {
        handleMapClick(e, maps, map);
      });
    };

    initializeWithDelay();
  }, [hasGooglePlaces, initialLocation]);

  // Update map when initialLocation changes (subsequent modal opens)
  useEffect(() => {
    if (!mapInstanceRef.current || !hasGooglePlaces || !initialLocation) return;

    const maps = getGoogleMaps();
    if (!maps) return;

    mapInstanceRef.current.panTo({
      lat: initialLocation.lat,
      lng: initialLocation.lng,
    });

    if (maps.Marker) {
      if (markerRef.current) {
        markerRef.current.setPosition({
          lat: initialLocation.lat,
          lng: initialLocation.lng,
        });
      } else {
        markerRef.current = new maps.Marker({
          position: { lat: initialLocation.lat, lng: initialLocation.lng },
          map: mapInstanceRef.current,
          animation: maps.Animation.DROP,
        });
      }
    }

    setSelectedLocation({
      lat: initialLocation.lat,
      lng: initialLocation.lng,
      name: initialLocation.name,
    });

    isUserTypingRef.current = false;
    setSearch(initialLocation.name);
    hasSelectedResultRef.current = true;
  }, [initialLocation?.lat, initialLocation?.lng, initialLocation?.name, hasGooglePlaces]);

  // Handle map click
  const handleMapClick = (
    e: any,
    maps: any,
    map: any
  ) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // Update marker
    if (maps.Marker) {
      if (markerRef.current) {
        markerRef.current.setPosition({ lat, lng });
      } else {
        markerRef.current = new maps.Marker({
          position: { lat, lng },
          map: mapInstanceRef.current,
          animation: maps.Animation.DROP,
        });
      }
    }

    map.panTo({ lat, lng });

    // Handle POI click (placeId in event)
    if (e.placeId && maps.places?.PlacesService) {
      const service = new maps.places.PlacesService(document.createElement("div"));

      service.getDetails(
        {
          placeId: e.placeId,
          fields: ["name", "types", "formatted_address", "address_components"],
        },
        (detail: GooglePlaceResult | null, detailStatus: string) => {
          if (detailStatus === "OK" && detail) {
            setSelectedLocation({ lat, lng, name: detail.name });
            isUserTypingRef.current = false;
            setSearch(detail.name);
            hasSelectedResultRef.current = true;
          } else {
            setSelectedLocation({ lat, lng, name: "Selected Location" });
            isUserTypingRef.current = false;
            setSearch("Selected Location");
          }
        }
      );
      return;
    }

    // Nearby search for POIs
    if (maps.places?.PlacesService) {
      const service = new maps.places.PlacesService(document.createElement("div"));

      service.nearbySearch(
        {
          location: { lat, lng },
          radius: 500,
        },
        (results: GooglePlaceResult[] | null, status: string) => {
          if (status === maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            const sortedPlaces = sortPlacesByPriority(results, lat, lng);

            if (sortedPlaces.length > 0) {
              const bestPlace = sortedPlaces[0];
              const placeLat = bestPlace.geometry?.location?.lat();
              const placeLng = bestPlace.geometry?.location?.lng();

              if (placeLat !== undefined && placeLng !== undefined) {
                const distance = Math.sqrt(
                  Math.pow(lat - placeLat, 2) + Math.pow(lng - placeLng, 2)
                );
                const priority = getPlacePriority(bestPlace.types);
                const distanceThreshold = getDistanceThreshold(priority);

                if (distance < distanceThreshold || distance < VERY_CLOSE_THRESHOLD) {
                  service.getDetails(
                    {
                      placeId: (bestPlace as any).place_id,
                      fields: ["name", "types", "formatted_address", "address_components"],
                    },
                    (detail: GooglePlaceResult | null, detailStatus: string) => {
                      if (detailStatus === "OK" && detail) {
                        setSelectedLocation({ lat, lng, name: detail.name });
                        isUserTypingRef.current = false;
                        setSearch(detail.name);
                        hasSelectedResultRef.current = true;
                      }
                    }
                  );
                  return;
                }
              }
            }
          }

          // Fallback to reverse geocoding
          if (services.geocoder) {
            services.geocoder.geocode(
              { location: { lat, lng } },
              (geoResults: any, geoStatus: string) => {
                if (geoStatus === "OK" && geoResults?.[0]) {
                  const formattedName = formatReverseGeocodeResult(
                    geoResults[0].formatted_address,
                    geoResults[0].address_components
                  );
                  setSelectedLocation({ lat, lng, name: formattedName });
                  isUserTypingRef.current = false;
                  setSearch(formattedName);
                }
              }
            );
          }
        }
      );
    } else if (services.geocoder) {
      services.geocoder.geocode(
        { location: { lat, lng } },
        (results: any, status: string) => {
          if (status === "OK" && results?.[0]) {
            const formattedName = formatReverseGeocodeResult(
              results[0].formatted_address,
              results[0].address_components
            );
            setSelectedLocation({ lat, lng, name: formattedName });
            isUserTypingRef.current = false;
            setSearch(formattedName);
          }
        }
      );
    }
  };

  // Update marker position helper
  const updateMarker = useCallback((lat: number, lng: number) => {
    const maps = getGoogleMaps();
    if (!maps?.Marker || !mapInstanceRef.current) return;

    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    } else {
      markerRef.current = new maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        animation: maps.Animation.DROP,
      });
    }

    mapInstanceRef.current.panTo({ lat, lng });
  }, []);

  // Handle prediction hover (preview on map)
  const handlePredictionHover = useCallback((prediction: GooglePrediction) => {
    if (hasSelectedResultRef.current) return;

    const maps = getGoogleMaps();
    if (!maps?.places?.PlacesService || !mapInstanceRef.current) return;

    const service = new maps.places.PlacesService(document.createElement("div"));
    service.getDetails(
      { placeId: prediction.place_id, fields: ["geometry"] },
      (place: any, status: string) => {
        if (status === "OK" && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          mapInstanceRef.current!.panTo({ lat, lng });
          updateMarker(lat, lng);
        }
      }
    );
  }, [updateMarker]);

  // Fetch predictions from search input
  useEffect(() => {
    if (!search || !services.autocompleteService) {
      setPredictions([]);
      return;
    }

    // Re-enable hover preview when user types
    if (isUserTypingRef.current) {
      hasSelectedResultRef.current = false;
    }

    setIsLoading(true);
    services.autocompleteService.getPlacePredictions(
      { input: search },
      (predictions: GooglePrediction[] | null, status: string) => {
        const maps = getGoogleMaps();
        if (status === maps?.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions.slice(0, 10));
        } else {
          setPredictions([]);
        }
        setIsLoading(false);
      }
    );
  }, [search, services.autocompleteService]);

  // Select a place from predictions
  const handleSelectPlace = useCallback(async (prediction: GooglePrediction) => {
    hasSelectedResultRef.current = true;

    const maps = getGoogleMaps();
    if (!maps?.places?.PlacesService) {
      onSelect(prediction.description);
      onClose();
      return;
    }

    const service = new maps.places.PlacesService(document.createElement("div"));
    service.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["geometry", "address_components"],
      },
      async (place: GooglePlaceDetails | null, status: string) => {
        if (status === maps.places.PlacesServiceStatus.OK && place?.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          updateMarker(lat, lng);
          setSelectedLocation({ lat, lng, name: prediction.description });
          hasSelectedResultRef.current = true;

          onSelect(prediction.description, prediction.place_id, { lat, lng });
        } else {
          onSelect(prediction.description);
        }
      }
    );
  }, [onSelect, updateMarker]);

  // Confirm selection
  const handleConfirmSelection = useCallback(() => {
    if (selectedLocation) {
      onSelect(selectedLocation.name, undefined, {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });
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
                {isInitializing
                  ? "Loading Google Places..."
                  : initError
                  ? "Error loading Google Places"
                  : hasGooglePlaces
                  ? "Search cities worldwide using Google Places"
                  : "Initializing..."}
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
              onChange={(e) => {
                isUserTypingRef.current = true;
                setSearch(e.target.value);
              }}
              placeholder={
                isInitializing
                  ? "Loading..."
                  : initError
                  ? "Error loading service"
                  : "Search any place worldwide..."
              }
              disabled={isInitializing || initError !== null}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl text-sm outline-none"
              style={{
                border: "1.5px solid #E2E8F0",
                backgroundColor: hasGooglePlaces && !isInitializing ? "#F8FAFC" : "#F1F5F9",
                fontFamily: '"Inter", sans-serif',
                color: hasGooglePlaces && !isInitializing ? "#1E293B" : "#94A3B8",
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPredictions([]);
                    hasSelectedResultRef.current = false;
                    setSelectedLocation(null);
                  }}
                  className="flex items-center justify-center rounded-full transition-colors"
                  style={{
                    width: "18px",
                    height: "18px",
                    backgroundColor: "#F1F5F9",
                    color: "#64748B",
                  }}
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

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {/* Map Container */}
          {!isInitializing && !initError && (
            <div style={{ height: "320px", position: "relative", flexShrink: 0 }}>
              <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

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
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748B",
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        Selected Location
                      </div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "#1E293B",
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        {selectedLocation.name}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocation(null);
                        hasSelectedResultRef.current = false;
                      }}
                      className="flex items-center justify-center rounded-full transition-colors flex-shrink-0"
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#F1F5F9",
                        color: "#64748B",
                      }}
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
            <div className="overflow-y-auto" style={{ height: "180px" }}>
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
                  onMouseEnter={() => handlePredictionHover(prediction)}
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
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid #F1F5F9" }}>
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
