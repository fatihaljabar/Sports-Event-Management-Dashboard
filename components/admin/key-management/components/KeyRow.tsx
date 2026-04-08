"use client";

import React from "react";
import { KeyRound } from "lucide-react";
import type { SportKey } from "../constants";
import { STATUS_CFG, SPORT_COLOR, SPORT_TEXT } from "../constants";
import { avatarInitials } from "../utils";
import { CopyButton } from "./CopyButton";
import { ActionMenu } from "./ActionMenu";

interface KeyRowProps {
  idx: number;
  keyItem: SportKey;
  isLast: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onRevoke: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  isReadOnly?: boolean;
  eventStatus?: "active" | "upcoming" | "completed" | "archived";
}

export function KeyRow({
  idx,
  keyItem,
  isLast,
  hovered,
  onHover,
  onRevoke,
  onRestore,
  onDelete,
  isReadOnly = false,
  eventStatus = "active",
}: KeyRowProps) {
  const isZebra = idx % 2 !== 0;
  const status = STATUS_CFG[keyItem.status];

  const rowBg = hovered
    ? "#F0F6FF"
    : isZebra
    ? "#FAFBFC"
    : "#FFFFFF";

  return (
    <tr
      onMouseEnter={() => onHover(keyItem.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        backgroundColor: rowBg,
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
        transition: "background-color 0.1s",
        opacity: keyItem.status === "revoked" ? 0.65 : 1,
      }}
    >
      {/* No. */}
      <td style={{ padding: "14px 20px", textAlign: "center" }}>
        <span
          style={{
            color: "#CBD5E1",
            fontSize: "0.72rem",
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 500,
          }}
        >
          {String(idx + 1).padStart(2, "0")}
        </span>
      </td>

      {/* Access Key */}
      <td style={{ padding: "14px 20px" }}>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
            style={{
              backgroundColor: keyItem.status === "revoked" ? "#FEF2F2" : "#F1F5F9",
              border: `1px solid ${keyItem.status === "revoked" ? "#FECACA" : "#E2E8F0"}`,
              maxWidth: "fit-content",
            }}
          >
            <KeyRound
              className="w-3 h-3 flex-shrink-0"
              strokeWidth={1.75}
              style={{ color: keyItem.status === "revoked" ? "#EF4444" : "#7C3AED" }}
            />
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.82rem",
                fontWeight: 600,
                color: keyItem.status === "revoked" ? "#DC2626" : "#5B21B6",
                letterSpacing: "0.06em",
                textDecoration: keyItem.status === "revoked" ? "line-through" : "none",
                whiteSpace: "nowrap",
              }}
            >
              {keyItem.code}
            </span>
          </div>
          {keyItem.status !== "revoked" && <CopyButton text={keyItem.code} />}
        </div>
        <p
          style={{
            color: "#CBD5E1",
            fontSize: "0.62rem",
            fontFamily: '"JetBrains Mono", monospace',
            marginTop: "3px",
          }}
        >
          Created {keyItem.createdAt}
        </p>
      </td>

      {/* Assigned Sport */}
      <td style={{ padding: "14px 20px" }}>
        <div
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1"
          style={{
            backgroundColor: SPORT_COLOR[keyItem.sport] ?? "#F1F5F9",
            border: `1px solid ${SPORT_COLOR[keyItem.sport] ?? "#E2E8F0"}`,
          }}
        >
          <span style={{ fontSize: "0.88rem" }}>{keyItem.sportEmoji}</span>
          <span
            style={{
              color: SPORT_TEXT[keyItem.sport] ?? "#374151",
              fontSize: "0.78rem",
              fontWeight: 600,
              fontFamily: '"Inter", sans-serif',
              whiteSpace: "nowrap",
            }}
          >
            {keyItem.sport}
          </span>
        </div>
      </td>

      {/* User Status */}
      <td style={{ padding: "14px 20px" }}>
        <div>
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{
              backgroundColor: status.bg,
              border: `1px solid ${status.border}`,
            }}
          >
            <div
              className="rounded-full flex-shrink-0"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: status.dot,
                boxShadow: keyItem.status === "confirmed" ? `0 0 4px ${status.dot}` : "none",
              }}
            />
            <span
              style={{
                color: status.color,
                fontSize: "0.72rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                whiteSpace: "nowrap",
              }}
            >
              {keyItem.status === "available"
                ? eventStatus === "completed"
                  ? "Event ended"
                  : eventStatus === "archived"
                    ? "Event archived"
                    : status.label
                : status.label}
            </span>
          </div>
          {keyItem.status === "available" && (
            <p
              style={{
                color: eventStatus === "completed" ? "#059669" : eventStatus === "archived" ? "#D97706" : "#CBD5E1",
                fontSize: "0.65rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "4px",
                paddingLeft: "2px",
              }}
            >
              {eventStatus === "completed"
                ? "Key no longer usable"
                : eventStatus === "archived"
                  ? "Key unusable until unarchived"
                  : "Waiting for registration"}
            </p>
          )}
          {keyItem.status === "revoked" && (
            <p
              style={{
                color: "#FCA5A5",
                fontSize: "0.65rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "4px",
                paddingLeft: "2px",
              }}
            >
              Access terminated
            </p>
          )}
        </div>
      </td>

      {/* Registered User */}
      <td style={{ padding: "14px 20px" }}>
        {keyItem.userEmail ? (
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{
                width: "30px",
                height: "30px",
                background: keyItem.userAvatar ?? "linear-gradient(135deg,#94A3B8,#64748B)",
                opacity: keyItem.status === "revoked" ? 0.6 : 1,
              }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  fontSize: "0.62rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                }}
              >
                {avatarInitials(keyItem.userEmail)}
              </span>
            </div>
            <div className="min-w-0">
              {keyItem.userName && (
                <p
                  style={{
                    color: "#374151",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    fontFamily: '"Inter", sans-serif',
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {keyItem.userName}
                </p>
              )}
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {keyItem.userEmail}
              </p>
            </div>
          </div>
        ) : (
          <span
            style={{
              color: "#CBD5E1",
              fontSize: "0.82rem",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            —
          </span>
        )}
      </td>

      {/* Actions */}
      <td style={{ padding: "14px 20px", textAlign: "center" }}>
        <ActionMenu
          keyItem={keyItem}
          onRevoke={onRevoke}
          onRestore={onRestore}
          onDelete={onDelete}
          isReadOnly={isReadOnly}
        />
      </td>
    </tr>
  );
}
