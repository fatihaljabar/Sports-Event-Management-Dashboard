"use client";

import { useState } from "react";
import { Clock, UserCog, Pencil } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { CopyKeyButton } from "./CopyKeyButton";
import { PermissionChips } from "./PermissionChips";
import { ActionMenu } from "./ActionMenu";
import { STATUS_CFG, EVENT_COLOR } from "../constants";
import type { Organizer } from "../types";

interface ParticipantRowProps {
  org: Organizer;
  idx: number;
  isLast: boolean;
}

export function ParticipantRow({ org, idx, isLast }: ParticipantRowProps) {
  const [hovered, setHovered] = useState(false);
  const isZebra = idx % 2 !== 0;
  const status = STATUS_CFG[org.status];
  const evColor = EVENT_COLOR[org.event] ?? {
    bg: "#F1F5F9",
    text: "#475569",
    border: "#E2E8F0",
  };
  const isRevoked = org.status === "revoked";

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#F5F9FF" : isZebra ? "#FAFBFC" : "#FFFFFF",
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
        transition: "background-color 0.1s",
        opacity: isRevoked ? 0.65 : 1,
      }}
    >
      {/* Organizer Identity */}
      <td style={{ padding: "14px 20px" }}>
        <div className="flex items-center gap-3">
          {/* Avatar + online dot */}
          <div className="relative flex-shrink-0">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                width: "40px",
                height: "40px",
                border: "2px solid #F1F5F9",
                filter: isRevoked ? "grayscale(100%)" : "none",
              }}
            >
              <ImageWithFallback
                src={org.photo}
                alt={org.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {!isRevoked && (
              <div
                className="absolute -bottom-0.5 -right-0.5 rounded-full"
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#22C55E",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 0 4px #22C55E66",
                }}
              />
            )}
          </div>
          <div className="min-w-0">
            <p
              style={{
                color: "#0F172A",
                fontSize: "0.86rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                whiteSpace: "nowrap",
              }}
            >
              {org.name}
            </p>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.71rem",
                fontFamily: '"Inter", sans-serif',
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {org.email}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <UserCog
                className="w-2.5 h-2.5"
                strokeWidth={1.75}
                style={{ color: "#CBD5E1", flexShrink: 0 }}
              />
              <span
                style={{
                  color: "#64748B",
                  fontSize: "0.68rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {org.role}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Assigned Scope */}
      <td style={{ padding: "14px 20px" }}>
        <div className="flex flex-col gap-1.5">
          {/* Event badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 self-start"
            style={{ backgroundColor: evColor.bg, border: `1px solid ${evColor.border}` }}
          >
            <span style={{ fontSize: "0.78rem" }}>{org.eventEmoji}</span>
            <span
              style={{
                color: evColor.text,
                fontSize: "0.71rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                whiteSpace: "nowrap",
              }}
            >
              {org.event}
            </span>
          </div>
          {/* Division pill */}
          <div
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 self-start"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
          >
            <span style={{ fontSize: "0.75rem" }}>{org.divisionEmoji}</span>
            <span
              style={{
                color: "#374151",
                fontSize: "0.68rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              {org.division}
            </span>
          </div>
        </div>
      </td>

      {/* Permissions */}
      <td style={{ padding: "14px 20px" }}>
        <PermissionChips perms={org.permissions} />
      </td>

      {/* Access Key */}
      <td style={{ padding: "14px 20px" }}>
        <CopyKeyButton value={org.accessKey} />
      </td>

      {/* Last Login */}
      <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
        <div className="flex items-start gap-1.5">
          <Clock
            className="w-3 h-3 mt-0.5 flex-shrink-0"
            strokeWidth={1.75}
            style={{ color: "#CBD5E1" }}
          />
          <div>
            <p
              style={{
                color: "#374151",
                fontSize: "0.76rem",
                fontWeight: 500,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {org.lastLoginRelative}
            </p>
            <p
              style={{
                color: "#CBD5E1",
                fontSize: "0.62rem",
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              {org.lastLogin}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td style={{ padding: "14px 20px" }}>
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
              boxShadow: org.status === "active" ? `0 0 4px ${status.dot}` : "none",
            }}
          />
          <span
            style={{
              color: status.text,
              fontSize: "0.72rem",
              fontWeight: 600,
              fontFamily: '"Inter", sans-serif',
              whiteSpace: "nowrap",
            }}
          >
            {status.label}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td style={{ padding: "14px 20px" }}>
        <div className="flex items-center gap-1.5 justify-end">
          <button
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
            <Pencil className="w-3 h-3" strokeWidth={1.75} />
            Edit Access
          </button>
          <ActionMenu org={org} />
        </div>
      </td>
    </tr>
  );
}
