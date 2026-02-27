"use client";

import { useState, useEffect } from "react";
import { Clock, Globe } from "lucide-react";

interface TimezoneAlertProps {
  timezone: string;
}

interface TimezoneInfo {
  eventTime: string;
  eventDate: string;
  wibTime: string;
  wibDate: string;
  eventZoneName: string;
}

function formatDateTime(timezone: string): { time: string; date: string } {
  const now = new Date();

  const timeFormatter = new Intl.DateTimeFormat("en-ID", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat("en-ID", {
    timeZone: timezone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return {
    time: timeFormatter.format(now),
    date: dateFormatter.format(now),
  };
}

function getZoneName(timezone: string): string {
  if (timezone === "Asia/Jakarta") return "WIB";
  if (timezone === "Asia/Makassar") return "WITA";
  if (timezone === "Asia/Jayapura") return "WIT";
  // For international timezones, show the city name
  const parts = timezone.split("/");
  return parts[parts.length - 1]?.replace(/_/g, " ") || timezone;
}

export function TimezoneAlert({ timezone }: TimezoneAlertProps) {
  const [timeInfo, setTimeInfo] = useState<TimezoneInfo | null>(null);

  useEffect(() => {
    const updateTime = () => {
      if (!timezone) return;

      const eventDateTime = formatDateTime(timezone);
      const wibDateTime = formatDateTime("Asia/Jakarta");

      setTimeInfo({
        eventTime: eventDateTime.time,
        eventDate: eventDateTime.date,
        wibTime: wibDateTime.time,
        wibDate: wibDateTime.date,
        eventZoneName: getZoneName(timezone),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timezone]);

  if (!timeInfo || !timezone) {
    return null;
  }

  const isSameTimezone = timezone === "Asia/Jakarta";

  return (
    <div
      className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
      style={{
        backgroundColor: "#F0FDF4",
        border: "1px solid #BBF7D0",
      }}
    >
      <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.75} style={{ color: "#16A34A" }} />
      <div className="flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            style={{
              color: "#166534",
              fontSize: "0.7rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
            }}
          >
            Current Time
          </span>
          {!isSameTimezone && (
            <span
              style={{
                color: "#16A34A",
                fontSize: "0.65rem",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 500,
              }}
            >
              •
            </span>
          )}
        </div>

        {/* Event Timezone */}
        <div className="flex items-baseline gap-2 mt-1">
          <span
            style={{
              color: "#15803D",
              fontSize: "0.85rem",
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 600,
            }}
          >
            {timeInfo.eventTime}
          </span>
          <span
            style={{
              color: "#64748B",
              fontSize: "0.65rem",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {timeInfo.eventDate}
          </span>
          <span
            className="px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: "#DCFCE7",
              color: "#166534",
              fontSize: "0.6rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {timeInfo.eventZoneName}
          </span>
        </div>

        {/* WIB Time - only show if different timezone */}
        {!isSameTimezone && (
          <div className="flex items-baseline gap-2 mt-1.5 pt-1.5" style={{ borderTop: "1px dashed #86EFAC" }}>
            <span
              style={{
                color: "#15803D",
                fontSize: "0.85rem",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 600,
              }}
            >
              {timeInfo.wibTime}
            </span>
            <span
              style={{
                color: "#64748B",
                fontSize: "0.65rem",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {timeInfo.wibDate}
            </span>
            <span
              className="px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "#E0F2FE",
                color: "#0369A1",
                fontSize: "0.6rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              WIB
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
