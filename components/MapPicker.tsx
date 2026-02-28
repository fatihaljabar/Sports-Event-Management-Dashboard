"use client";

import React, { useState, useCallback } from "react";
import Map from "react-map-gl/maplibre";
import { MapPin, X } from "lucide-react";
import type { EventLocation } from "@/lib/types/event";

// Timezone data for common regions
const TIMEZONE_MAP: Record<string, string> = {
  "Tokyo": "Asia/Tokyo (GMT+9)",
  "Jakarta": "Asia/Jakarta (GMT+7)",
  "Bangkok": "Asia/Bangkok (GMT+7)",
  "Singapore": "Asia/Singapore (GMT+8)",
  "Kuala Lumpur": "Asia/Kuala_Lumpur (GMT+8)",
  "Manila": "Asia/Manila (GMT+8)",
  "Hanoi": "Asia/Ho_Chi_Minh (GMT+7)",
  "Beijing": "Asia/Shanghai (GMT+8)",
  "Seoul": "Asia/Seoul (GMT+9)",
  "Taipei": "Asia/Taipei (GMT+8)",
  "Hong Kong": "Asia/Hong_Kong (GMT+8)",
  "Osaka": "Asia/Tokyo (GMT+9)",
  "Kyoto": "Asia/Tokyo (GMT+9)",
};

const DEFAULT_COORDINATES = {
  lat: 13.7563, // Bangkok as default (SE Asia center)
  lng: 100.5018,
};

interface MapPickerProps {
  location: EventLocation;
  onLocationChange: (location: EventLocation) => void;
  onClose: () => void;
}

export function MapPicker({ location, onLocationChange, onClose }: MapPickerProps) {
  const [viewState, setViewState] = useState({
    longitude: location.coordinates?.lng || DEFAULT_COORDINATES.lng,
    latitude: location.coordinates?.lat || DEFAULT_COORDINATES.lat,
    zoom: 10,
  });

  const [clickedCoords, setClickedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(location.coordinates);

  const handleClick = useCallback((e: any) => {
    const { lng, lat } = e.lngLat;
    setClickedCoords({ lat, lng });
    setViewState((prev) => ({ ...prev, longitude: lng, latitude: lat }));

    // Try to detect timezone based on coordinates (simplified)
    // In production, you'd use a proper timezone API
    const detectedTimezone = TIMEZONE_MAP[location.city] || "Asia/Bangkok (GMT+7)";

    // Update location
    onLocationChange({
      ...location,
      coordinates: { lat, lng },
      timezone: detectedTimezone,
    });
  }, [location, onLocationChange]);

  const handleConfirm = () => {
    if (clickedCoords) {
      onLocationChange({
        ...location,
        coordinates: clickedCoords,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Select Venue Location</h3>
              <p className="text-sm text-gray-500">
                Click on the map to pin the exact location
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Map */}
        <div className="h-80 w-full bg-gray-100">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            onClick={handleClick}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://demotiles.maplibre.org/style.json"
            attributionControl={false}
          >
            {clickedCoords && (
              <div
                className="marker"
                style={{
                  transform: `translate(${window.innerWidth / 2}px, ${window.innerHeight / 2}px) translate(-50%, -100%)`,
                }}
              >
                <MapPin className="w-8 h-8 text-blue-500" strokeWidth={2.5} />
              </div>
            )}
          </Map>
        </div>

        {/* Selected Location Info */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {clickedCoords
                  ? `Selected: ${clickedCoords.lat.toFixed(4)}, ${clickedCoords.lng.toFixed(4)}`
                  : "Click on the map to select location"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Timezone:{" "}
                {clickedCoords ? location.timezone : "Will be auto-detected"}
              </p>
            </div>
            <button
              onClick={handleConfirm}
              disabled={!clickedCoords}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
