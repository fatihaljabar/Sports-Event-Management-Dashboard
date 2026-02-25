"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MapPin, X, Search } from "lucide-react";
import { LOCATION_OPTIONS, getTimezoneByLocation } from "@/lib/constants/locations";

interface LocationPickerProps {
  value: string;
  onChange: (value: string, timezone?: string) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [showMapModal, setShowMapModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local state when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Filter locations based on query
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

  // Select a location
  const selectLocation = useCallback((location: string) => {
    setQuery(location);
    setIsOpen(false);
    const timezone = getTimezoneByLocation(location);
    onChange(location, timezone);
  }, [onChange]);

  // Clear input
  const handleClear = useCallback(() => {
    setQuery("");
    setIsOpen(false);
    onChange("", "");
  }, [onChange]);

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
      {isOpen && filteredLocations.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden shadow-lg"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {filteredLocations.map((location) => (
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
  onSelect: (location: string) => void;
}

function LocationModal({ onClose, onSelect }: LocationModalProps) {
  const [search, setSearch] = useState("");

  const filteredLocations = search
    ? LOCATION_OPTIONS.filter((loc) =>
        loc.toLowerCase().includes(search.toLowerCase())
      )
    : LOCATION_OPTIONS;

  // Group by country/region
  const groupedLocations = filteredLocations.reduce((acc, loc) => {
    const country = loc.split(", ").pop() || "Other";
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(loc);
    return acc;
  }, {} as Record<string, string[]>);

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
                Choose from available cities
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
              placeholder="Search locations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                border: "1.5px solid #E2E8F0",
                backgroundColor: "#F8FAFC",
                fontFamily: '"Inter", sans-serif',
                color: "#1E293B",
              }}
            />
          </div>
        </div>

        {/* Location List */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 140px)" }}
        >
          {Object.entries(groupedLocations).map(([country, locations]) => (
            <div key={country}>
              {/* Country Header */}
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

              {/* Locations */}
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

          {filteredLocations.length === 0 && (
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
