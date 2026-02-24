import React from "react";
import { Award } from "lucide-react";

interface CountryMedals {
  rank: number;
  country: string;
  code: string;
  flag: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

const tally: CountryMedals[] = [
  { rank: 1, country: "United States", code: "USA", flag: "🇺🇸", gold: 24, silver: 18, bronze: 15, total: 57 },
  { rank: 2, country: "China", code: "CHN", flag: "🇨🇳", gold: 22, silver: 16, bronze: 12, total: 50 },
  { rank: 3, country: "Great Britain", code: "GBR", flag: "🇬🇧", gold: 15, silver: 12, bronze: 14, total: 41 },
  { rank: 4, country: "Australia", code: "AUS", flag: "🇦🇺", gold: 12, silver: 11, bronze: 10, total: 33 },
  { rank: 5, country: "Germany", code: "DEU", flag: "🇩🇪", gold: 10, silver: 9, bronze: 11, total: 30 },
];

const medals = [
  { key: "gold", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", label: "G" },
  { key: "silver", color: "#94A3B8", bg: "rgba(148,163,184,0.12)", label: "S" },
  { key: "bronze", color: "#CD7C3F", bg: "rgba(205,124,63,0.12)", label: "B" },
];

export function MedalTally() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid #F1F5F9",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid #F8FAFC" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#0F172A",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Medal Tally
            </h2>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.7rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "1px",
              }}
            >
              Top performing nations
            </p>
          </div>
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <Award className="w-4 h-4" strokeWidth={1.75} style={{ color: "#F59E0B" }} />
          </div>
        </div>

        {/* Column Headers */}
        <div className="flex items-center mt-4 px-1">
          <div className="flex-1" />
          {medals.map((m) => (
            <div
              key={m.key}
              className="flex flex-col items-center"
              style={{ width: "44px" }}
            >
              <span
                className="rounded-full flex items-center justify-center"
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: m.bg,
                  color: m.color,
                  fontSize: "0.6rem",
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                }}
              >
                {m.label}
              </span>
            </div>
          ))}
          <div style={{ width: "44px", textAlign: "center" }}>
            <span
              style={{
                color: "#94A3B8",
                fontSize: "0.6rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              TTL
            </span>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="px-3 py-2">
        {tally.map((country, idx) => (
          <div
            key={country.code}
            className="flex items-center rounded-xl px-2 py-2.5 transition-colors"
            style={{ marginBottom: idx < tally.length - 1 ? "2px" : 0 }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.backgroundColor = "#F8FAFC")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent")
            }
          >
            {/* Rank */}
            <span
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 700,
                fontSize: "1.1rem",
                color: idx === 0 ? "#F59E0B" : "#CBD5E1",
                width: "24px",
                flexShrink: 0,
              }}
            >
              {country.rank}
            </span>

            {/* Flag */}
            <div
              className="flex items-center justify-center rounded-full overflow-hidden flex-shrink-0"
              style={{
                width: "28px",
                height: "28px",
                fontSize: "1.2rem",
                backgroundColor: "#F8FAFC",
                marginLeft: "4px",
                marginRight: "8px",
                border: "1.5px solid #F1F5F9",
              }}
            >
              {country.flag}
            </div>

            {/* Country */}
            <div className="flex-1 min-w-0">
              <p
                style={{
                  color: "#0F172A",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  fontFamily: '"Inter", sans-serif',
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {country.country}
              </p>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.62rem",
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                {country.code}
              </p>
            </div>

            {/* Medal Counts */}
            {[country.gold, country.silver, country.bronze].map((val, mi) => (
              <div
                key={mi}
                className="flex items-center justify-center"
                style={{ width: "44px" }}
              >
                <span
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: medals[mi].color,
                  }}
                >
                  {val}
                </span>
              </div>
            ))}

            {/* Total */}
            <div
              className="flex items-center justify-center"
              style={{ width: "44px" }}
            >
              <span
                className="rounded-lg flex items-center justify-center"
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#0F172A",
                  backgroundColor: "#F1F5F9",
                  padding: "2px 8px",
                  minWidth: "32px",
                  textAlign: "center",
                }}
              >
                {country.total}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid #F8FAFC" }}
      >
        <span
          style={{
            color: "#94A3B8",
            fontSize: "0.7rem",
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {tally.reduce((a, c) => a + c.total, 0)} total medals
        </span>
        <button
          style={{
            color: "#2563EB",
            fontSize: "0.75rem",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            backgroundColor: "transparent",
            border: "none",
          }}
        >
          View full standings →
        </button>
      </div>
    </div>
  );
}
