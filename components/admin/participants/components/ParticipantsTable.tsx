"use client";

import { Users } from "lucide-react";
import { ParticipantRow } from "./ParticipantRow";
import { FilterBar } from "./FilterBar";
import { STATUS_CFG } from "../constants";
import type { Organizer, OrgStatus } from "../types";

interface ParticipantsTableProps {
  filtered: Organizer[];
  totalOrganizers: number;
  revokedCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  eventFilter: string;
  onEventFilterChange: (value: string) => void;
  divFilter: string;
  onDivFilterChange: (value: string) => void;
  activeFilters: number;
  onClearFilters: () => void;
}

export function ParticipantsTable({
  filtered,
  totalOrganizers,
  revokedCount,
  search,
  onSearchChange,
  eventFilter,
  onEventFilterChange,
  divFilter,
  onDivFilterChange,
  activeFilters,
  onClearFilters,
}: ParticipantsTableProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: "1px solid #F1F5F9",
      }}
    >
      <FilterBar
        search={search}
        onSearchChange={onSearchChange}
        eventFilter={eventFilter}
        onEventFilterChange={onEventFilterChange}
        divFilter={divFilter}
        onDivFilterChange={onDivFilterChange}
        activeFilters={activeFilters}
        onClearFilters={onClearFilters}
        resultCount={filtered.length}
        totalCount={totalOrganizers}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAFBFC" }}>
              {[
                { label: "Organizer", w: "22%" },
                { label: "Assigned Scope", w: "18%" },
                { label: "Permissions", w: "16%" },
                { label: "Access Key", w: "17%" },
                { label: "Last Login", w: "13%" },
                { label: "Status", w: "8%" },
                { label: "", w: "6%", align: "right" as const },
              ].map((col) => (
                <th
                  key={col.label}
                  style={{
                    width: col.w,
                    padding: "9px 20px",
                    textAlign: col.align ?? "left",
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
                <td colSpan={7}>
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
                      <Users className="w-7 h-7" strokeWidth={1.5} style={{ color: "#CBD5E1" }} />
                    </div>
                    <p
                      style={{
                        color: "#374151",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      No organizers found
                    </p>
                    <p
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.78rem",
                        fontFamily: '"Inter", sans-serif',
                        marginTop: "4px",
                      }}
                    >
                      Adjust your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((org, idx) => (
                <ParticipantRow
                  key={org.id}
                  org={org}
                  idx={idx}
                  isLast={idx === filtered.length - 1}
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
            style={{ color: "#94A3B8", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif' }}
          >
            Page <strong style={{ color: "#374151" }}>1</strong> of{" "}
            <strong style={{ color: "#374151" }}>19</strong>
          </span>
          {/* Status legend */}
          <div className="flex items-center gap-3">
            {(Object.entries(STATUS_CFG) as [OrgStatus, typeof STATUS_CFG[OrgStatus]][]).map(
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
                      {key === "active" ? 142 : key === "revoked" ? revokedCount : 2}
                    </strong>
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, "…", 19].map((p, i) => (
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
                border: `1.5px solid ${
                  p === 1 ? "#0F172A" : p === "…" ? "transparent" : "#E2E8F0"
                }`,
                cursor: p === "…" ? "default" : "pointer",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
