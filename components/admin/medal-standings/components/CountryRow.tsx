"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { MedalBadge } from "./MedalBadge";
import { RANK_STYLE } from "../constants";
import type { CountryRecord } from "../types";

interface CountryRowProps {
  record: CountryRecord;
  rank: number;
  isLast: boolean;
}

export function CountryRow({ record, rank, isLast }: CountryRowProps) {
  const [hovered, setHovered] = useState(false);
  const rankStyle = RANK_STYLE[rank];
  const isTopThree = rank <= 3;
  const total = record.gold + record.silver + record.bronze;

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
        <div className="flex justify-center">
          {isTopThree ? (
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
                <Trophy
                  className="w-5 h-5"
                  strokeWidth={2}
                  style={{ color: rankStyle.numColor }}
                />
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

      {/* Country */}
      <td style={{ padding: "14px 16px" }}>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "2rem", lineHeight: 1, flexShrink: 0 }}>{record.flag}</span>
          <div>
            <p
              style={{
                color: "#0F172A",
                fontSize: "0.92rem",
                fontWeight: 700,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {record.countryFull}
            </p>
            <p
              style={{
                color: "#CBD5E1",
                fontSize: "0.65rem",
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: "0.05em",
              }}
            >
              {record.country}
            </p>
          </div>
        </div>
      </td>

      {/* Medal bars */}
      <td style={{ padding: "14px 16px", width: "140px" }}>
        {total > 0 && (
          <div>
            <div
              className="flex rounded-full overflow-hidden"
              style={{ height: "6px", gap: "1px" }}
            >
              {record.gold > 0 && (
                <div
                  style={{
                    flex: record.gold,
                    backgroundColor: "#F59E0B",
                    borderRadius: "3px 0 0 3px",
                  }}
                />
              )}
              {record.silver > 0 && (
                <div style={{ flex: record.silver, backgroundColor: "#94A3B8" }} />
              )}
              {record.bronze > 0 && (
                <div
                  style={{
                    flex: record.bronze,
                    backgroundColor: "#D97706",
                    borderRadius: "0 3px 3px 0",
                  }}
                />
              )}
            </div>
            <p
              style={{
                color: "#CBD5E1",
                fontSize: "0.6rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "3px",
              }}
            >
              {total} total medals
            </p>
          </div>
        )}
      </td>

      {/* Gold */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={record.gold} type="gold" />
      </td>

      {/* Silver */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={record.silver} type="silver" />
      </td>

      {/* Bronze */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <MedalBadge count={record.bronze} type="bronze" />
      </td>

      {/* Total */}
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
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
        <p
          style={{
            color: "#CBD5E1",
            fontSize: "0.6rem",
            fontFamily: '"Inter", sans-serif',
            marginTop: "2px",
          }}
        >
          medals
        </p>
      </td>
    </tr>
  );
}
