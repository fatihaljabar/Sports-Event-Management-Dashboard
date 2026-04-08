"use client";

import { useEffect } from "react";
import { X, Clock, AlertTriangle } from "lucide-react";
import { STATUS_CFG, EVENT_COLOR } from "../constants";
import type { ResultRow } from "../types";

interface DetailModalProps {
  result: ResultRow;
  onClose: () => void;
}

export function DetailModal({ result, onClose }: DetailModalProps) {
  const status = STATUS_CFG[result.status];
  const evColor = EVENT_COLOR[result.event] ?? { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" };

  useEffect(() => {
    function h(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          width: "520px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          border: "1px solid #F1F5F9",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg,#0F172A,#1E293B)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.65rem",
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: "0.08em",
              }}
            >
              RESULT DETAIL — {result.matchId}
            </p>
            <h3
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                marginTop: "4px",
              }}
            >
              {result.sportEmoji} {result.sport}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-xl transition-all"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "#94A3B8",
              border: "none",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(255,255,255,0.15)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(255,255,255,0.08)")
            }
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 self-start"
              style={{ backgroundColor: evColor.bg, border: `1px solid ${evColor.border}` }}
            >
              <span style={{ fontSize: "0.9rem" }}>{result.eventEmoji}</span>
              <span
                style={{
                  color: evColor.text,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {result.event}
              </span>
            </div>
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ backgroundColor: status.bg, border: `1px solid ${status.border}` }}
            >
              <div
                className="rounded-full"
                style={{ width: "6px", height: "6px", backgroundColor: status.dot }}
              />
              <span
                style={{
                  color: status.text,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {status.label}
              </span>
            </div>
            {result.note && (
              <div
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1"
                style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
              >
                <AlertTriangle className="w-3 h-3" strokeWidth={2} style={{ color: "#D97706" }} />
                <span
                  style={{
                    color: "#92400E",
                    fontSize: "0.7rem",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {result.note}
                </span>
              </div>
            )}
          </div>

          {/* Podium */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #F1F5F9" }}>
            {[
              { rank: "gold" as const, emoji: "🥇", label: "1st Place — Gold Medal", athlete: result.gold },
              { rank: "silver" as const, emoji: "🥈", label: "2nd Place — Silver Medal", athlete: result.silver },
              { rank: "bronze" as const, emoji: "🥉", label: "3rd Place — Bronze Medal", athlete: result.bronze },
            ].map((row, i) => (
              <div
                key={row.rank}
                className="flex items-center gap-4 px-4 py-3.5"
                style={{
                  backgroundColor:
                    i === 0 ? "#FFFBEB" : i % 2 !== 0 ? "#FAFBFC" : "#FFFFFF",
                  borderTop: i > 0 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{row.emoji}</span>
                {row.athlete ? (
                  <div className="flex items-center gap-3 flex-1">
                    <span style={{ fontSize: "1.4rem" }}>{row.athlete.flag}</span>
                    <div>
                      <p
                        style={{
                          color: "#0F172A",
                          fontSize: "0.9rem",
                          fontWeight: i === 0 ? 700 : 600,
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        {row.athlete.name}
                      </p>
                      <p
                        style={{
                          color: "#94A3B8",
                          fontSize: "0.7rem",
                          fontFamily: '"JetBrains Mono", monospace',
                        }}
                      >
                        {row.athlete.country}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span
                    style={{
                      color: "#CBD5E1",
                      fontSize: "0.8rem",
                      fontFamily: '"Inter", sans-serif',
                      flex: 1,
                    }}
                  >
                    Not recorded
                  </span>
                )}
                <span
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.68rem",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {row.label.split("—")[0].trim()}
                </span>
              </div>
            ))}
          </div>

          {/* Recorded by */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}
          >
            <div>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.65rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Recorded By
              </p>
              <p
                style={{
                  color: "#0F172A",
                  fontSize: "0.86rem",
                  fontWeight: 600,
                  fontFamily: '"Inter", sans-serif',
                  marginTop: "2px",
                }}
              >
                {result.recordedBy}
              </p>
            </div>
            <div className="text-right">
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.65rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Ref Key
              </p>
              <span
                className="rounded-md px-2 py-1 mt-1 inline-block"
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.72rem",
                  color: "#475569",
                  backgroundColor: "#F1F5F9",
                  border: "1.5px solid #E2E8F0",
                }}
              >
                {result.refKey}
              </span>
            </div>
          </div>

          {/* Timestamp */}
          <div
            className="flex items-center gap-2"
            style={{ borderTop: "1px solid #F1F5F9", paddingTop: "12px" }}
          >
            <Clock className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#CBD5E1" }} />
            <span
              style={{ color: "#94A3B8", fontSize: "0.74rem", fontFamily: '"Inter", sans-serif' }}
            >
              Published <strong style={{ color: "#374151" }}>{result.timeRelative}</strong> ·{" "}
              {result.timestamp}
            </span>
            <span
              style={{
                color: "#CBD5E1",
                fontSize: "0.68rem",
                fontFamily: '"JetBrains Mono", monospace',
                marginLeft: "auto",
              }}
            >
              {result.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
