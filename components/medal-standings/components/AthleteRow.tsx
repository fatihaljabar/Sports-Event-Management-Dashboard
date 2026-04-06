"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { MedalBadge } from "./MedalBadge";
import { RANK_STYLE } from "../constants";
import type { AthleteRecord } from "../types";

interface AthleteRowProps {
  athlete: AthleteRecord;
  rank: number;
  isLast: boolean;
}

export function AthleteRow({ athlete, rank, isLast }: AthleteRowProps) {
  const [hovered, setHovered] = useState(false);
  const rankStyle = RANK_STYLE[rank];
  const total = athlete.gold + athlete.silver + athlete.bronze;
  const isTopThree = rank <= 3;

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor:
          hovered
            ? isTopThree
              ? rankStyle?.rowBg
              : "#F5F9FF"
            : isTopThree
            ? rankStyle?.rowBg
            : rank % 2 === 0
            ? "#FAFBFC"
            : "#FFFFFF",
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
        borderLeft: isTopThree ? `3px solid ${rankStyle?.borderLeft}` : "3px solid transparent",
        transition: "background-color 0.1s",
      }}
    >
      {/* Rank */}
      <td style={{ padding: "14px 16px 14px 20px", width: "72px" }}>
        <div className="flex items-center justify-center">
          {rank <= 3 ? (
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "44px",
                height: "44px",
                background: rankStyle.bg,
                border: `2px solid ${rankStyle.border}`,
                boxShadow: `0 4px 16px ${rankStyle.glow}`,
              }}
            >
              {rank === 1 ? (
                <Trophy className="w-5 h-5" strokeWidth={2} style={{ color: rankStyle.numColor }} />
              ) : (
                <span
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: rankStyle.numColor,
                    lineHeight: 1,
                  }}
                >
                  {rank}
                </span>
              )}
            </div>
          ) : (
            <div
              className="flex items-center justify-center"
              style={{ width: "44px", height: "44px" }}
            >
              <span
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: "1.35rem",
                  color: "#CBD5E1",
                  lineHeight: 1,
                }}
              >
                {rank}
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Athlete */}
      <td style={{ padding: "14px 16px" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 rounded-full overflow-hidden"
            style={{
              width: "44px",
              height: "44px",
              border: isTopThree ? `2.5px solid ${rankStyle?.border}` : "2px solid #F1F5F9",
              boxShadow: isTopThree
                ? `0 0 0 2px ${rankStyle?.rowBg}, 0 4px 12px ${rankStyle?.glow}`
                : "none",
            }}
          >
            <ImageWithFallback
              src={athlete.photo}
              alt={athlete.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="min-w-0">
            <p
              style={{
                color: "#0F172A",
                fontSize: "0.88rem",
                fontWeight: 700,
                fontFamily: '"Inter", sans-serif',
                whiteSpace: "nowrap",
              }}
            >
              {athlete.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span style={{ fontSize: "0.8rem" }}>{athlete.sportEmoji}</span>
              <span
                style={{
                  color: "#64748B",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                }}
              >
                {athlete.sport}
              </span>
              <span style={{ color: "#E2E8F0", fontSize: "0.7rem" }}>·</span>
              <span
                style={{
                  fontSize: "0.62rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  padding: "1px 6px",
                  borderRadius: "4px",
                  backgroundColor:
                    athlete.gender === "Women"
                      ? "#FCE7F3"
                      : athlete.gender === "Men"
                      ? "#EFF6FF"
                      : "#F0FDF4",
                  color:
                    athlete.gender === "Women"
                      ? "#9D174D"
                      : athlete.gender === "Men"
                      ? "#1D4ED8"
                      : "#15803D",
                  border: `1px solid ${
                    athlete.gender === "Women"
                      ? "#FBCFE8"
                      : athlete.gender === "Men"
                      ? "#BFDBFE"
                      : "#BBF7D0"
                  }`,
                }}
              >
                {athlete.gender}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Team */}
      <td style={{ padding: "14px 16px" }}>
        <div className="flex items-center gap-2.5">
          <span style={{ fontSize: "1.35rem", lineHeight: 1, flexShrink: 0 }}>{athlete.flag}</span>
          <div>
            <p
              style={{
                color: "#374151",
                fontSize: "0.82rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                whiteSpace: "nowrap",
              }}
            >
              {athlete.countryFull}
            </p>
            <p
              style={{
                color: "#CBD5E1",
                fontSize: "0.65rem",
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: "0.04em",
              }}
            >
              {athlete.country}
            </p>
          </div>
        </div>
      </td>

      {/* Gold */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={athlete.gold} type="gold" />
      </td>

      {/* Silver */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={athlete.silver} type="silver" />
      </td>

      {/* Bronze */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={athlete.bronze} type="bronze" />
      </td>

      {/* Total */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <div className="flex items-center justify-center">
          <span
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 800,
              fontSize: "1.55rem",
              color: isTopThree ? rankStyle?.numColor : "#374151",
              lineHeight: 1,
            }}
          >
            {total}
          </span>
        </div>
        <p
          style={{
            color: "#CBD5E1",
            fontSize: "0.6rem",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            marginTop: "2px",
          }}
        >
          medals
        </p>
      </td>
    </tr>
  );
}
