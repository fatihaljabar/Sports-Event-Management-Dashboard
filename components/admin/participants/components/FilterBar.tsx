"use client";

import { useState, useRef } from "react";
import { Search, Filter, ChevronDown, Check, X } from "lucide-react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { EVENTS, DIVISIONS } from "../constants";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  eventFilter: string;
  onEventFilterChange: (value: string) => void;
  divFilter: string;
  onDivFilterChange: (value: string) => void;
  activeFilters: number;
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
}

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));
  const isFiltered = value !== options[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all"
        style={{
          border: `1.5px solid ${isFiltered ? "#BFDBFE" : "#E2E8F0"}`,
          backgroundColor: isFiltered ? "#EFF6FF" : "#FFFFFF",
          color: isFiltered ? "#1D4ED8" : "#374151",
          fontSize: "0.8rem",
          fontFamily: '"Inter", sans-serif',
          fontWeight: isFiltered ? 600 : 400,
          whiteSpace: "nowrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <Filter className="w-3.5 h-3.5" strokeWidth={1.75} style={{ opacity: 0.7 }} />
        <span>{isFiltered ? value : label}</span>
        <ChevronDown
          className="w-3.5 h-3.5"
          strokeWidth={2}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
            opacity: 0.6,
          }}
        />
      </button>
      {open && (
        <div
          className="absolute left-0 z-50 rounded-xl overflow-hidden py-1 mt-1"
          style={{
            minWidth: "200px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 28px rgba(0,0,0,0.11)",
            border: "1px solid #E2E8F0",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full text-left px-3.5 py-2.5 flex items-center gap-2 transition-colors"
              style={{
                backgroundColor: value === opt ? "#EFF6FF" : "transparent",
                color: value === opt ? "#1D4ED8" : "#374151",
                fontSize: "0.8rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: value === opt ? 600 : 400,
                border: "none",
              }}
              onMouseEnter={(e) => {
                if (value !== opt)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                if (value !== opt)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              {value === opt ? (
                <Check className="w-3 h-3 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
              ) : (
                <span style={{ width: "12px", display: "inline-block" }} />
              )}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterBar({
  search,
  onSearchChange,
  eventFilter,
  onEventFilterChange,
  divFilter,
  onDivFilterChange,
  activeFilters,
  onClearFilters,
  resultCount,
  totalCount,
}: FilterBarProps) {
  return (
    <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
      {/* Search */}
      <div className="relative" style={{ width: "320px", flexShrink: 0 }}>
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
          strokeWidth={1.75}
          style={{ color: "#94A3B8" }}
        />
        <input
          type="text"
          placeholder="Search manager name, email, or key…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg outline-none transition-all"
          style={{
            paddingLeft: "2.25rem",
            paddingRight: search ? "2.25rem" : "0.875rem",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
            backgroundColor: "#F8FAFC",
            border: "1.5px solid #E2E8F0",
            fontSize: "0.8rem",
            fontFamily: '"Inter", sans-serif',
            color: "#1E293B",
          }}
          onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#2563EB")}
          onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")}
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "#94A3B8" }}
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Filters */}
      <FilterDropdown
        label="Filter by Event"
        options={EVENTS}
        value={eventFilter}
        onChange={onEventFilterChange}
      />
      <FilterDropdown
        label="Filter by Division"
        options={DIVISIONS}
        value={divFilter}
        onChange={onDivFilterChange}
      />

      {activeFilters > 0 && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all"
          style={{
            border: "1.5px solid #FECACA",
            backgroundColor: "#FFF5F5",
            color: "#DC2626",
            fontSize: "0.78rem",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
          Clear {activeFilters}
        </button>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Result count */}
      <span
        style={{
          color: "#94A3B8",
          fontSize: "0.75rem",
          fontFamily: '"Inter", sans-serif',
          flexShrink: 0,
        }}
      >
        <strong style={{ color: "#374151" }}>{resultCount}</strong> of{" "}
        <strong style={{ color: "#374151" }}>{totalCount}</strong> organizers
      </span>
    </div>
  );
}
