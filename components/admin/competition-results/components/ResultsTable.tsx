"use client";

import { useState } from "react";
import { Search, Filter, X, Activity, ShieldCheck } from "lucide-react";
import { FilterDropdown } from "./FilterDropdown";
import { ResultTableRow } from "./ResultTableRow";
import { DetailModal } from "./DetailModal";
import { STATUS_CFG, EVENTS, SPORTS, STATUSES } from "../constants";
import type { ResultRow, ResultStatus } from "../types";

interface ResultsTableProps {
  filtered: ResultRow[];
  totalResults: number;
  search: string;
  onSearchChange: (v: string) => void;
  eventFilter: string;
  onEventFilterChange: (v: string) => void;
  sportFilter: string;
  onSportFilterChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  activeFilters: number;
  onClearFilters: () => void;
  officialCount: number;
  provisionalCount: number;
  disputedCount: number;
}

export function ResultsTable({
  filtered,
  totalResults,
  search,
  onSearchChange,
  eventFilter,
  onEventFilterChange,
  sportFilter,
  onSportFilterChange,
  statusFilter,
  onStatusFilterChange,
  activeFilters,
  onClearFilters,
  officialCount,
  provisionalCount,
  disputedCount,
}: ResultsTableProps) {
  const [detailResult, setDetailResult] = useState<ResultRow | null>(null);

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          border: "1px solid #F1F5F9",
        }}
      >
        {/* Toolbar */}
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{ borderBottom: "1px solid #F1F5F9" }}
        >
          {/* Search */}
          <div className="relative" style={{ width: "300px", flexShrink: 0 }}>
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              strokeWidth={1.75}
              style={{ color: "#94A3B8" }}
            />
            <input
              type="text"
              placeholder="Search athlete or match ID…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg outline-none transition-all"
              style={{
                paddingLeft: "2.2rem",
                paddingRight: search ? "2.2rem" : "0.875rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                backgroundColor: "#F8FAFC",
                border: "1.5px solid #E2E8F0",
                fontSize: "0.8rem",
                fontFamily: '"Inter", sans-serif',
                color: "#1E293B",
              }}
              onFocus={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#2563EB")
              }
              onBlur={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")
              }
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

          <FilterDropdown
            label="All Events"
            options={EVENTS}
            value={eventFilter}
            onChange={onEventFilterChange}
            icon={<Filter className="w-3.5 h-3.5" />}
          />
          <FilterDropdown
            label="All Sports"
            options={SPORTS}
            value={sportFilter}
            onChange={onSportFilterChange}
            icon={<Filter className="w-3.5 h-3.5" />}
          />
          <FilterDropdown
            label="All Status"
            options={STATUSES}
            value={statusFilter}
            onChange={onStatusFilterChange}
            icon={<ShieldCheck className="w-3.5 h-3.5" />}
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

          <div className="flex-1" />
          <span
            style={{
              color: "#94A3B8",
              fontSize: "0.75rem",
              fontFamily: '"Inter", sans-serif',
              flexShrink: 0,
            }}
          >
            <strong style={{ color: "#374151" }}>{filtered.length}</strong> of{" "}
            <strong style={{ color: "#374151" }}>{totalResults}</strong> results
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#FAFBFC" }}>
                {[
                  { label: "Time",          align: "left"  as const, w: "8%" },
                  { label: "Match Context", align: "left"  as const, w: "20%" },
                  { label: "🥇 Gold",     align: "left"  as const, w: "14%" },
                  { label: "🥈 Silver",   align: "left"  as const, w: "14%" },
                  { label: "🥉 Bronze",   align: "left"  as const, w: "14%" },
                  { label: "Recorded By",  align: "left"  as const, w: "13%" },
                  { label: "Status",       align: "left"  as const, w: "10%" },
                  { label: "",              align: "right" as const, w: "7%" },
                ].map((col) => (
                  <th
                    key={col.label}
                    style={{
                      width: col.w,
                      padding: "9px 16px",
                      textAlign: col.align,
                      borderBottom: "1.5px solid #F1F5F9",
                      color: "#94A3B8",
                      fontSize: "0.64rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontFamily: '"Inter", sans-serif',
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-16">
                      <div
                        className="flex items-center justify-center rounded-2xl mb-4"
                        style={{
                          width: "64px",
                          height: "64px",
                          backgroundColor: "#F1F5F9",
                          border: "2px dashed #E2E8F0",
                        }}
                      >
                        <Activity
                          className="w-7 h-7"
                          strokeWidth={1.5}
                          style={{ color: "#CBD5E1" }}
                        />
                      </div>
                      <p
                        style={{
                          color: "#374151",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        No results found
                      </p>
                      <p
                        style={{
                          color: "#94A3B8",
                          fontSize: "0.78rem",
                          fontFamily: '"Inter", sans-serif',
                          marginTop: "4px",
                        }}
                      >
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((result, idx) => (
                  <ResultTableRow
                    key={result.id}
                    result={result}
                    idx={idx}
                    isLast={idx === filtered.length - 1}
                    onView={setDetailResult}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}
        >
          <div className="flex items-center gap-4">
            <span
              style={{
                color: "#94A3B8",
                fontSize: "0.72rem",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Page <strong style={{ color: "#374151" }}>1</strong> of{" "}
              <strong style={{ color: "#374151" }}>35</strong>
            </span>
            <div className="flex items-center gap-3">
              {(Object.entries(STATUS_CFG) as [ResultStatus, typeof STATUS_CFG[ResultStatus]][]).map(
                ([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div
                      className="rounded-full"
                      style={{ width: "6px", height: "6px", backgroundColor: cfg.dot }}
                    />
                    <span
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.67rem",
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {cfg.label}:{" "}
                      <strong style={{ color: "#374151" }}>
                        {key === "official" ? officialCount : key === "provisional" ? provisionalCount : disputedCount}
                      </strong>
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, "…", 35].map((p, i) => (
              <button
                key={i}
                className="flex items-center justify-center rounded-md transition-colors"
                style={{
                  minWidth: "28px",
                  height: "28px",
                  padding: "0 4px",
                  backgroundColor: p === 1 ? "#0F172A" : "transparent",
                  color:
                    p === 1 ? "#FFFFFF" : p === "…" ? "#CBD5E1" : "#64748B",
                  fontSize: "0.75rem",
                  fontFamily: '"JetBrains Mono", monospace',
                  border: `1.5px solid ${p === 1 ? "#0F172A" : p === "…" ? "transparent" : "#E2E8F0"}`,
                  cursor: p === "…" ? "default" : "pointer",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {detailResult && <DetailModal result={detailResult} onClose={() => setDetailResult(null)} />}
    </>
  );
}
