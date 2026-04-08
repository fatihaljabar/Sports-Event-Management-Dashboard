"use client";

import { Trophy, Globe } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import type { AthleteRecord, CountryRecord, ViewMode } from "../types";

interface PodiumHeroProps {
  athletes: AthleteRecord[];
  countries: CountryRecord[];
  view: ViewMode;
}

const heights = ["h-24", "h-32", "h-20"];
const rankLabels = ["2nd", "1st", "3rd"];
const rankColors = ["#94A3B8", "#F59E0B", "#D97706"];
const rankEmojis = ["🥈", "🥇", "🥉"];
const podiumColors = ["#F8FAFC", "#FFFBEB", "#FFF7ED"];
const podiumBorders = ["#E2E8F0", "#FDE68A", "#FED7AA"];

export function PodiumHero({ athletes, countries, view }: PodiumHeroProps) {
  if (view === "athlete") {
    const top3 = athletes.slice(0, 3);
    if (top3.length < 3) return null;
    const order = [top3[1], top3[0], top3[2]];

    return (
      <div
        className="rounded-2xl p-6 mb-5"
        style={{
          background: "linear-gradient(135deg,#0F172A 0%,#1E293B 60%,#0F172A 100%)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg,#F59E0B,#EF4444)",
              boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
            }}
          >
            <Trophy className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                lineHeight: 1,
              }}
            >
              Podium — Top 3 Athletes
            </h2>
            <p
              style={{
                color: "#64748B",
                fontSize: "0.7rem",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Based on gold medal count (Olympic standard)
            </p>
          </div>
        </div>

        <div className="flex items-end justify-center gap-4">
          {order.map((athlete, i) => (
            <div
              key={athlete.id}
              className="flex flex-col items-center gap-3"
              style={{ width: "160px" }}
            >
              <div className="flex flex-col items-center gap-2">
                <span style={{ fontSize: "1.5rem" }}>{rankEmojis[i]}</span>
                <div
                  className="rounded-full overflow-hidden"
                  style={{
                    width: "56px",
                    height: "56px",
                    border: `3px solid ${rankColors[i]}`,
                    boxShadow: `0 0 0 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.4)`,
                  }}
                >
                  <ImageWithFallback
                    src={athlete.photo}
                    alt={athlete.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="text-center">
                  <p
                    style={{
                      color: "#FFFFFF",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      fontFamily: '"Inter", sans-serif',
                      whiteSpace: "nowrap",
                    }}
                  >
                    {athlete.shortName}
                  </p>
                  <div className="flex items-center gap-1 justify-center mt-0.5">
                    <span style={{ fontSize: "0.9rem" }}>{athlete.flag}</span>
                    <span
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.65rem",
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {athlete.country}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#64748B",
                      fontSize: "0.65rem",
                      fontFamily: '"Inter", sans-serif',
                      marginTop: "1px",
                    }}
                  >
                    {athlete.sportEmoji} {athlete.sport}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ fontSize: "0.75rem" }}>🥇{athlete.gold}</span>
                  <span style={{ fontSize: "0.75rem" }}>🥈{athlete.silver}</span>
                  <span style={{ fontSize: "0.75rem" }}>🥉{athlete.bronze}</span>
                </div>
              </div>
              <div
                className={`w-full flex items-center justify-center rounded-t-xl ${heights[i]}`}
                style={{
                  backgroundColor: podiumColors[i],
                  border: `2px solid ${podiumBorders[i]}`,
                  borderBottom: "none",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 800,
                    fontSize: "2.5rem",
                    color: rankColors[i],
                    opacity: 0.3,
                    position: "absolute",
                  }}
                >
                  {rankLabels[i]}
                </span>
                <span
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: rankColors[i],
                    position: "relative",
                    letterSpacing: "0.04em",
                  }}
                >
                  {rankLabels[i]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const top3c = countries.slice(0, 3);
  if (top3c.length < 3) return null;
  const orderC = [top3c[1], top3c[0], top3c[2]];

  return (
    <div
      className="rounded-2xl p-6 mb-5"
      style={{
        background: "linear-gradient(135deg,#0F172A 0%,#1E293B 60%,#0F172A 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg,#F59E0B,#EF4444)",
            boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
          }}
        >
          <Globe className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h2
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            Podium — Top 3 Nations
          </h2>
          <p
            style={{
              color: "#64748B",
              fontSize: "0.7rem",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Ranked by gold medal count
          </p>
        </div>
      </div>
      <div className="flex items-end justify-center gap-4">
        {orderC.map((c, i) => (
          <div
            key={c.country}
            className="flex flex-col items-center gap-3"
            style={{ width: "160px" }}
          >
            <div className="flex flex-col items-center gap-2">
              <span style={{ fontSize: "1.5rem" }}>{rankEmojis[i]}</span>
              <span style={{ fontSize: "2.8rem", lineHeight: 1 }}>{c.flag}</span>
              <div className="text-center">
                <p
                  style={{
                    color: "#FFFFFF",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {c.countryFull}
                </p>
                <p
                  style={{
                    color: "#64748B",
                    fontSize: "0.65rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    marginTop: "2px",
                  }}
                >
                  {c.country}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span style={{ fontSize: "0.75rem" }}>🥇{c.gold}</span>
                <span style={{ fontSize: "0.75rem" }}>🥈{c.silver}</span>
                <span style={{ fontSize: "0.75rem" }}>🥉{c.bronze}</span>
              </div>
            </div>
            <div
              className={`w-full flex items-center justify-center rounded-t-xl ${heights[i]}`}
              style={{
                backgroundColor: podiumColors[i],
                border: `2px solid ${podiumBorders[i]}`,
                borderBottom: "none",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 800,
                  fontSize: "2.5rem",
                  color: rankColors[i],
                  opacity: 0.2,
                  position: "absolute",
                }}
              >
                {rankLabels[i]}
              </span>
              <span
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: rankColors[i],
                  position: "relative",
                  letterSpacing: "0.04em",
                }}
              >
                {rankLabels[i]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
