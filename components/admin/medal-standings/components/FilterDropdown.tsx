"use client";

import { useState, useRef } from "react";
import { ChevronDown, Check, Filter } from "lucide-react";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface FilterDropdownProps {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}

export function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
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
        <Filter className="w-3.5 h-3.5" strokeWidth={1.75} style={{ opacity: 0.6 }} />
        {isFiltered ? value : label}
        <ChevronDown
          className="w-3.5 h-3.5"
          strokeWidth={2}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
            opacity: 0.5,
          }}
        />
      </button>
      {open && (
        <div
          className="absolute left-0 z-50 rounded-xl overflow-hidden py-1 mt-1"
          style={{
            minWidth: "200px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
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
