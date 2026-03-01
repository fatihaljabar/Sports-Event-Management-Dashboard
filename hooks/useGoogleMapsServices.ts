/**
 * Custom Hook: useGoogleMapsServices
 *
 * Manages Google Maps services initialization and provides access to:
 * - AutocompleteService
 * - Geocoder
 * - Loading state
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { loadGoogleMapsScript, isGoogleMapsLoaded, getGoogleMaps } from "@/lib/google-maps/loader";

// Use any for Google Maps types since they're loaded dynamically
interface AutocompleteService {
  getPlacePredictions(
    request: { input: string; componentRestrictions?: { country: string[] } },
    callback: (predictions: any[] | null, status: string) => void
  ): void;
}

interface Geocoder {
  geocode(
    request: { location: { lat: number; lng: number } },
    callback: (results: any[] | null, status: string) => void
  ): void;
}

interface PlacesService {
  getDetails(
    request: { placeId: string; fields: string[] },
    callback: (result: any | null, status: string) => void
  ): void;
  nearbySearch(
    request: { location: { lat: number; lng: number }; radius: number },
    callback: (results: any[] | null, status: string) => void
  ): void;
}

export interface GoogleMapsServices {
  autocompleteService: AutocompleteService | null;
  geocoder: Geocoder | null;
  placesService: ((element: HTMLElement) => PlacesService) | null;
}

export interface UseGoogleMapsServicesResult {
  services: GoogleMapsServices;
  isLoaded: boolean;
  isInitializing: boolean;
  error: string | null;
}

/**
 * Hook to load and manage Google Maps services
 */
export function useGoogleMapsServices(): UseGoogleMapsServicesResult {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const servicesRef = useRef<GoogleMapsServices>({
    autocompleteService: null,
    geocoder: null,
    placesService: null,
  });

  const initializeServices = useCallback(() => {
    try {
      const maps = getGoogleMaps();
      if (!maps?.places) {
        return false;
      }

      servicesRef.current = {
        autocompleteService: new maps.places.AutocompleteService() as unknown as AutocompleteService,
        geocoder: new maps.Geocoder() as unknown as Geocoder,
        placesService: (element: HTMLElement) => new maps.places.PlacesService(element) as unknown as PlacesService,
      };

      setIsLoaded(true);
      setIsInitializing(false);
      setError(null);
      return true;
    } catch (err) {
      console.error("[useGoogleMapsServices] Initialization failed:", err);
      setError("Failed to initialize Google Places");
      setIsInitializing(false);
      return false;
    }
  }, []);

  useEffect(() => {
    // Check if already loaded
    if (isGoogleMapsLoaded()) {
      initializeServices();
      return;
    }

    // Load script
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) {
      setError("Google Maps API key not configured");
      setIsInitializing(false);
      return;
    }

    const cleanup = loadGoogleMapsScript(() => {
      initializeServices();
    });

    return cleanup;
  }, [initializeServices]);

  return {
    services: servicesRef.current,
    isLoaded,
    isInitializing,
    error,
  };
}

/**
 * Hook to manage a Google Map instance
 */
export interface UseGoogleMapOptions {
  center?: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (event: any) => void;
  mapStyles?: Array<{ featureType?: string; elementType?: string; stylers: Array<{ visibility?: string; color?: string }> }>;
}

export interface GoogleMapInstance {
  map: any;
  marker: any;
  setCenter: (lat: number, lng: number) => void;
  setMarker: (lat: number, lng: number) => void;
  updateMarker: (lat: number, lng: number) => void;
  panTo: (lat: number, lng: number) => void;
}

export function useGoogleMap(
  mapRef: React.RefObject<HTMLDivElement>,
  options: UseGoogleMapOptions = {}
): GoogleMapInstance {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarkerState] = useState<any>(null);
  const markerRef = useRef<any>(null);

  const {
    center = { lat: -6.2088, lng: 106.8456 },
    zoom = 13,
    onMapClick,
    mapStyles,
  } = options;

  // Initialize map
  useEffect(() => {
    const maps = getGoogleMaps();
    if (!maps || !mapRef.current) return;

    // Wait for container to have dimensions
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

      const mapInstance = new maps.Map(mapRef.current, {
        center,
        zoom,
        styles: mapStyles || getDefaultMapStyles(),
      });

      setMap(mapInstance);

      if (onMapClick) {
        mapInstance.addListener("click", onMapClick);
      }
    };

    initializeWithDelay();
  }, []); // Only run once on mount

  const setCenter = useCallback((lat: number, lng: number) => {
    if (map) {
      map.panTo({ lat, lng });
    }
  }, [map]);

  const setMarker = useCallback((lat: number, lng: number) => {
    const maps = getGoogleMaps();
    if (!maps || !map) return;

    const newMarker = new maps.Marker({
      position: { lat, lng },
      map,
      animation: maps.Animation.DROP,
    });

    markerRef.current = newMarker;
    setMarkerState(newMarker);
  }, [map]);

  const updateMarker = useCallback((lat: number, lng: number) => {
    const maps = getGoogleMaps();
    if (!maps) return;

    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    } else if (map) {
      markerRef.current = new maps.Marker({
        position: { lat, lng },
        map,
        animation: maps.Animation.DROP,
      });
      setMarkerState(markerRef.current);
    }

    if (map) {
      map.panTo({ lat, lng });
    }
  }, [map]);

  const panTo = useCallback((lat: number, lng: number) => {
    if (map) {
      map.panTo({ lat, lng });
    }
  }, [map]);

  return {
    map,
    marker,
    setCenter,
    setMarker,
    updateMarker,
    panTo,
  };
}

/**
 * Default map styles - clean, minimal with POIs visible
 */
function getDefaultMapStyles(): Array<{ featureType?: string; elementType?: string; stylers: Array<{ visibility?: string; color?: string }> }> {
  return [
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
  ];
}
