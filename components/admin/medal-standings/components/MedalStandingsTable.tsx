"use client";

import { Medal } from "lucide-react";
import { AthleteRow } from "./AthleteRow";
import { CountryRow } from "./CountryRow";
import type { AthleteRecord, CountryRecord } from "../types";

interface MedalStandingsTableProps {
  sortedAthletes: AthleteRecord[];
  sortedCountries: CountryRecord[];
  totalMedals: number;
}

export function MedalStandingsTable({
  sortedAthletes,
  sortedCountries,
  totalMedals,
}: MedalStandingsTableProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: "1px solid #F1F5F9",
      }}
    >
      {/* Table header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}
      >
        <div className="flex items-center gap-2">
          <Medal className="w-4 h-4" strokeWidth={1.75} style={{ color: "#F59E0B" }} />
          <span
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 700,
              fontSize: "1rem",
              color: "#0F172A",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {sortedAthletes.length > 0 ? "Athlete Rankings" : "National Medal Tally"}
          </span>
          <span
            className="rounded-full px-2 py-0.5"
            style={{
              backgroundColor: "#F1F5F9",
              color: "#64748B",
              fontSize: "0.7rem",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {sortedAthletes.length > 0
              ? `${sortedAthletes.length} athletes`
              : `${sortedCountries.length} nations`}
          </span>
        </div>
        <p
          style={{
            color: "#94A3B8",
            fontSize: "0.72rem",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {totalMedals} total medals · Ranked by 🥇 gold
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAFBFC" }}>
              {[
                { label: "Rank",         w: "72px",  align: "center" as const },
                { label: "Athlete / Nation", w: sortedAthletes.length > 0 ? "260px" : "200px", align: "left" as const },
                { label: sortedAthletes.length > 0 ? "Team" : "Distribution", w: sortedAthletes.length > 0 ? "160px" : "140px", align: "left" as const },
                { label: "🥇 Gold",   w: "96px",  align: "center" as const },
                { label: "🥈 Silver", w: "96px",  align: "center" as const },
                { label: "🥉 Bronze", w: "96px",  align: "center" as const },
                { label: "Total",     w: "80px",  align: "center" as const },
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
            {sortedAthletes.length > 0 ? (
              sortedAthletes.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-14">
                      <Medal className="w-10 h-10 mb-3" strokeWidth={1.25} style={{ color: "#E2E8F0" }} />
                      <p
                        style={{
                          color: "#374151",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        No athletes found
                      </p>
                      <p
                        style={{
                          color: "#94A3B8",
                          fontSize: "0.78rem",
                          fontFamily: '"Inter", sans-serif',
                          marginTop: "4px",
                        }}
                      >
                        Adjust your filters above.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedAthletes.map((athlete, idx) => (
                  <AthleteRow
                    key={athlete.id}
                    athlete={athlete}
                    rank={idx + 1}
                    isLast={idx === sortedAthletes.length - 1}
                  />
                ))
              )
            ) : (
              sortedCountries.map((c, idx) => (
                <CountryRow
                  key={c.country}
                  record={c}
                  rank={idx + 1}
                  isLast={idx === sortedCountries.length - 1}
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full" style={{ width: "6px", height: "6px", backgroundColor: "#F59E0B" }} />
            <span
              style={{
                color: "#94A3B8",
                fontSize: "0.67rem",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Top 3 rows highlighted
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-1 rounded-full"
              style={{ background: "linear-gradient(90deg,#F59E0B,#94A3B8,#D97706)" }}
            />
            <span
              style={{
                color: "#94A3B8",
                fontSize: "0.67rem",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Medal bar (G/S/B)
            </span>
          </div>
        </div>
        <p
          style={{
            color: "#CBD5E1",
            fontSize: "0.67rem",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Last updated: Feb 24, 2026 ·{" "}
          <span style={{ fontFamily: '"JetBrains Mono", monospace' }}>14:05 UTC</span>
        </p>
      </div>
    </div>
  );
}
