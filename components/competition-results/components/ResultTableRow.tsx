"use client";

import { useState } from "react";
import { Eye, Flag } from "lucide-react";
import { PodiumCell } from "./PodiumCell";
import { STATUS_CFG, EVENT_COLOR } from "../constants";
import type { ResultRow } from "../types";

interface ResultTableRowProps {
  result: ResultRow;
  idx: number;
  isLast: boolean;
  onView: (r: ResultRow) => void;
}

export function ResultTableRow({ result, idx, isLast, onView }: ResultTableRowProps) {
  const [hovered, setHovered] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const isZebra = idx % 2 !== 0;
  const status = STATUS_CFG[result.status];
  const evColor = EVENT_COLOR[result.event] ?? { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" };

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#F5F9FF" : flagged ? "#FFF5F5" : isZebra ? "#FAFBFC" : "#FFFFFF",
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
        transition: "background-color 0.1s",
      }}
    >
      {/* Time */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap", width: "1%" }}>
        <div>
          <p
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 600,
              fontSize: "0.8rem",
              color: "#374151",
            }}
          >
            {result.timestamp}
          </p>
          <p style={{ color: "#CBD5E1", fontSize: "0.62rem", fontFamily: '"Inter", sans-serif' }}>
            {result.timeRelative}
          </p>
        </div>
      </td>

      {/* Match Context */}
      <td style={{ padding: "13px 16px", minWidth: "200px" }}>
        <div className="flex flex-col gap-1.5">
          <div
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 self-start"
            style={{ backgroundColor: evColor.bg, border: `1px solid ${evColor.border}` }}
          >
            <span style={{ fontSize: "0.75rem" }}>{result.eventEmoji}</span>
            <span
              style={{
                color: evColor.text,
                fontSize: "0.68rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                whiteSpace: "nowrap",
              }}
            >
              {result.event}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: "0.8rem" }}>{result.sportEmoji}</span>
            <span
              style={{
                color: "#374151",
                fontSize: "0.75rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
              }}
            >
              {result.sport}
            </span>
          </div>
          <span
            style={{
              color: "#CBD5E1",
              fontSize: "0.6rem",
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: "0.04em",
            }}
          >
            {result.matchId}
          </span>
        </div>
      </td>

      {/* Gold */}
      <td style={{ padding: "13px 16px" }}>
        <PodiumCell rank="gold" athlete={result.gold} emoji="🥇" />
      </td>

      {/* Silver */}
      <td style={{ padding: "13px 16px" }}>
        <PodiumCell rank="silver" athlete={result.silver} emoji="🥈" />
      </td>

      {/* Bronze */}
      <td style={{ padding: "13px 16px" }}>
        <PodiumCell rank="bronze" athlete={result.bronze} emoji="🥉" />
      </td>

      {/* Recorded By */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
        <p
          style={{
            color: "#374151",
            fontSize: "0.76rem",
            fontWeight: 500,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {result.recordedBy}
        </p>
        <span
          className="rounded-md px-1.5 py-0.5 mt-0.5 inline-block"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.6rem",
            color: "#64748B",
            backgroundColor: "#F1F5F9",
            border: "1px solid #E2E8F0",
            letterSpacing: "0.02em",
          }}
        >
          {result.refKey}
        </span>
      </td>

      {/* Status */}
      <td style={{ padding: "13px 16px" }}>
        <div>
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ backgroundColor: status.bg, border: `1px solid ${status.border}` }}
          >
            <div
              className="rounded-full flex-shrink-0"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: status.dot,
                boxShadow: result.status === "official" ? `0 0 4px ${status.dot}` : "none",
              }}
            />
            <span
              style={{
                color: status.text,
                fontSize: "0.7rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                whiteSpace: "nowrap",
              }}
            >
              {status.label}
            </span>
          </div>
          {result.note && (
            <div className="flex items-center gap-1 mt-1">
              <Flag className="w-3 h-3 flex-shrink-0" strokeWidth={2} style={{ color: "#F59E0B" }} />
              <p
                style={{
                  color: "#92400E",
                  fontSize: "0.6rem",
                  fontFamily: '"Inter", sans-serif',
                  whiteSpace: "nowrap",
                  maxWidth: "120px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {result.note}
              </p>
            </div>
          )}
        </div>
      </td>

      {/* Actions */}
      <td style={{ padding: "13px 16px" }}>
        <div className="flex items-center gap-1.5 justify-end">
          {/* View Details */}
          <button
            onClick={() => onView(result)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all"
            style={{
              border: "1.5px solid #BFDBFE",
              backgroundColor: "#EFF6FF",
              color: "#1D4ED8",
              fontSize: "0.74rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#DBEAFE")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EFF6FF")
            }
          >
            <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
            Details
          </button>

          {/* Flag Dispute */}
          <button
            onClick={() => setFlagged((f) => !f)}
            title={flagged ? "Remove flag" : "Flag dispute"}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: "30px",
              height: "30px",
              border: `1.5px solid ${flagged ? "#FCA5A5" : "#E2E8F0"}`,
              backgroundColor: flagged ? "#FEE2E2" : "transparent",
              color: flagged ? "#DC2626" : "#94A3B8",
            }}
            onMouseEnter={(e) => {
              if (!flagged) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEF2F2";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#FECACA";
                (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
              }
            }}
            onMouseLeave={(e) => {
              if (!flagged) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
              }
            }}
          >
            <Flag className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </td>
    </tr>
  );
}
