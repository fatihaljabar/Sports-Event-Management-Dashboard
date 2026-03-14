"use client";

import {
  ArrowLeft,
  MapPin,
  Calendar,
  Download,
  Plus,
  ChevronRight,
  Layers,
  Trophy,
  Users,
  KeyRound,
  UserCheck,
  AlertCircle,
  Archive,
} from "lucide-react";
import type { EventStatusType } from "../constants";
import { EVENT_STATUS_CFG } from "../constants";
import { formatRangeDate } from "../utils";
import { StatCard } from "./StatCard";
import type { SportEvent } from "@/lib/types/event";

interface KeyManagementHeaderProps {
  event: SportEvent | null;
  eventStatus: EventStatusType;
  total: number;
  generated: number;
  confirmed: number;
  onBack: () => void;
  onNavigateToEvents: () => void;
  onGenerateKeys: () => void;
  isReadOnly?: boolean;
}

export function KeyManagementHeader({
  event,
  eventStatus,
  total,
  generated,
  confirmed,
  onBack,
  onNavigateToEvents,
  onGenerateKeys,
  isReadOnly = false,
}: KeyManagementHeaderProps) {
  const eventDisplayName = event?.name ?? "Unknown Event";
  const eventDisplayLocation = event?.location?.city ?? "Unknown Location";
  const eventDisplayDates = event
    ? formatRangeDate(event.startDate, event.endDate)
    : "TBD – TBD, TBD";
  const eventLogoUrl = event?.logoUrl;
  const eventIsMulti = event?.type === "multi";
  const eventStatusCfg = EVENT_STATUS_CFG[eventStatus] || EVENT_STATUS_CFG.upcoming;

  // Get emoji from first sport
  const eventEmoji = event?.sports?.[0]?.emoji ?? "🏆";

  return (
    <>
      {/* ══════  PAGE HEADER  ══════ */}
      <div className="mb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all"
            style={{
              color: "#64748B",
              fontSize: "0.72rem",
              fontFamily: '"Inter", sans-serif',
              border: "1.5px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
              (e.currentTarget as HTMLButtonElement).style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFFFFF";
              (e.currentTarget as HTMLButtonElement).style.color = "#64748B";
            }}
          >
            <ArrowLeft className="w-3 h-3" strokeWidth={2} />
            Back
          </button>

          <span style={{ color: "#CBD5E1", fontSize: "0.65rem" }}>·</span>

          <div className="flex items-center gap-1" style={{ fontSize: "0.72rem", fontFamily: '"Inter", sans-serif' }}>
            <span
              className="cursor-pointer transition-colors"
              style={{ color: "#94A3B8" }}
              onClick={onNavigateToEvents}
              onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#2563EB")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#94A3B8")}
            >
              Event Management
            </span>
            <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} strokeWidth={2} />
            <span style={{ color: "#64748B", fontWeight: 400 }}>
              {eventDisplayName}
            </span>
            <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} strokeWidth={2} />
            <span style={{ color: "#2563EB", fontWeight: 500 }}>Participants & Keys</span>
          </div>
        </div>

        {/* Status Alert Banner */}
        {(eventStatus === "completed" || eventStatus === "archived") && (
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3 mb-4"
            style={{
              backgroundColor: eventStatus === "completed" ? "#ECFDF5" : "#FFFBEB",
              border: `1px solid ${eventStatus === "completed" ? "#A7F3D0" : "#FDE68A"}`,
            }}
          >
            {eventStatus === "completed" ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#059669" }} strokeWidth={1.75} />
            ) : (
              <Archive className="w-5 h-5 flex-shrink-0" style={{ color: "#D97706" }} strokeWidth={1.75} />
            )}
            <div className="flex-1">
              <p
                style={{
                  color: eventStatus === "completed" ? "#065F46" : "#92400E",
                  fontSize: "0.8rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                }}
              >
                {eventStatus === "completed"
                  ? "This event has ended - key management is view-only"
                  : "This event is archived - keys cannot be used by participants until unarchived"}
              </p>
            </div>
          </div>
        )}

        {/* Title row */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {/* Event logo */}
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  width: "48px",
                  height: "48px",
                  background: eventLogoUrl
                    ? "transparent"
                    : "linear-gradient(135deg,#2563EB,#7C3AED)",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                }}
              >
                {eventLogoUrl ? (
                  <img
                    src={eventLogoUrl}
                    alt={eventDisplayName}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                  />
                ) : (
                  <span style={{ fontSize: "1.4rem" }}>{eventEmoji}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1
                    style={{
                      fontFamily: '"Barlow Condensed", sans-serif',
                      fontWeight: 700,
                      fontSize: "2.25rem",
                      color: "#0F172A",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {eventDisplayName}
                  </h1>
                  {/* Status badge */}
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 flex-shrink-0"
                    style={{
                      backgroundColor: eventStatusCfg.bg,
                      border: `1px solid ${eventStatusCfg.border}`,
                    }}
                  >
                    <div
                      className="rounded-full"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: eventStatusCfg.dot,
                        boxShadow: eventStatus === "active" || eventStatus === "upcoming" ? `0 0 5px ${eventStatusCfg.dot}` : "none",
                      }}
                    />
                    <span style={{ color: eventStatusCfg.color, fontSize: "0.7rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                      {eventStatusCfg.label}
                    </span>
                  </div>
                  {eventIsMulti ? (
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 flex-shrink-0"
                      style={{ backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE" }}
                    >
                      <Layers className="w-3 h-3" strokeWidth={1.75} style={{ color: "#7C3AED" }} />
                      <span style={{ color: "#5B21B6", fontSize: "0.7rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                        Multi-Event
                      </span>
                    </div>
                  ) : (
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 flex-shrink-0"
                      style={{ backgroundColor: "#FEF3C7", border: "1px solid #FDE68A" }}
                    >
                      <Trophy className="w-3 h-3" strokeWidth={1.75} style={{ color: "#F59E0B" }} />
                      <span style={{ color: "#B45309", fontSize: "0.7rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                        Single Event
                      </span>
                    </div>
                  )}
                </div>
                {/* Meta */}
                <div className="flex items-center gap-4 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#94A3B8" }} />
                    <span style={{ color: "#64748B", fontSize: "0.78rem", fontFamily: '"Inter", sans-serif' }}>
                      {eventDisplayDates}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#94A3B8" }} />
                    <span style={{ color: "#64748B", fontSize: "0.78rem", fontFamily: '"Inter", sans-serif' }}>
                      {eventDisplayLocation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all"
              style={{
                border: "1.5px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                color: "#64748B",
                fontSize: "0.82rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFFFFF";
              }}
            >
              <Download className="w-4 h-4" strokeWidth={1.75} />
              Export CSV
            </button>

            <button
              onClick={onGenerateKeys}
              disabled={isReadOnly}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all active:scale-95"
              style={{
                background: isReadOnly
                  ? "#E5E7EB"
                  : eventStatus === "archived"
                    ? "linear-gradient(135deg,#F59E0B,#D97706)"
                    : "linear-gradient(135deg,#2563EB,#1D4ED8)",
                color: isReadOnly ? "#9CA3AF" : "#FFFFFF",
                fontSize: "0.84rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                boxShadow: isReadOnly
                  ? "none"
                  : eventStatus === "archived"
                    ? "0 4px 16px rgba(245,158,11,0.32)"
                    : "0 4px 16px rgba(37,99,235,0.32)",
                border: isReadOnly ? "1px solid #D1D5DB" : "none",
                cursor: isReadOnly ? "not-allowed" : "pointer",
                opacity: isReadOnly ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isReadOnly) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    eventStatus === "archived"
                      ? "linear-gradient(135deg,#D97706,#B45309)"
                      : "linear-gradient(135deg,#1D4ED8,#1E40AF)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    eventStatus === "archived"
                      ? "0 6px 20px rgba(245,158,11,0.45)"
                      : "0 6px 20px rgba(37,99,235,0.45)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isReadOnly) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    eventStatus === "archived"
                      ? "linear-gradient(135deg,#F59E0B,#D97706)"
                      : "linear-gradient(135deg,#2563EB,#1D4ED8)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    eventStatus === "archived"
                      ? "0 4px 16px rgba(245,158,11,0.32)"
                      : "0 4px 16px rgba(37,99,235,0.32)";
                }
              }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Generate Keys
              {eventStatus === "archived" && !isReadOnly && (
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 400,
                    opacity: 0.9,
                    marginLeft: "2px",
                  }}
                >
                  (Archived)
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ══════  STAT CARDS  ══════ */}
      <div className="flex gap-4 mb-6">
        <StatCard
          icon={<Users className="w-5 h-5 text-white" strokeWidth={1.75} />}
          iconBg="linear-gradient(135deg,#0F172A,#1E293B)"
          label="Total Quota"
          value={total.toLocaleString()}
          sub="Max registered users"
        />
        <StatCard
          icon={<KeyRound className="w-5 h-5 text-white" strokeWidth={1.75} />}
          iconBg="linear-gradient(135deg,#2563EB,#7C3AED)"
          label="Keys Generated"
          value={generated.toLocaleString()}
          sub={`${total - generated} slots remaining`}
          accent="#2563EB"
        />
        <StatCard
          icon={<UserCheck className="w-5 h-5 text-white" strokeWidth={1.75} />}
          iconBg="linear-gradient(135deg,#059669,#0D9488)"
          label="Confirmed Users"
          value={confirmed.toLocaleString()}
          sub={`${Math.round((confirmed / generated) * 100)}% key activation rate`}
          accent="#059669"
        />
      </div>
    </>
  );
}
