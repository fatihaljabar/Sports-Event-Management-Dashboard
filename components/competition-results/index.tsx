"use client";

import { useState, useEffect, useRef } from "react";
import {
  Download,
  RefreshCw,
  Activity,
  Hourglass,
  Flag,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { StatCard } from "./components/StatCard";
import { ResultsTable } from "./components/ResultsTable";
import { useResults } from "./hooks/use-results";

export function CompetitionResultsPage() {
  const {
    search,
    setSearch,
    eventFilter,
    setEventFilter,
    sportFilter,
    setSportFilter,
    statusFilter,
    setStatusFilter,
    filtered,
    officialCount,
    provisionalCount,
    disputedCount,
    activeFilters,
    clearFilters,
    totalResults,
  } = useResults();

  const [refreshing, setRefreshing] = useState(false);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const handleRefresh = () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    setRefreshing(true);
    refreshTimerRef.current = setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="px-6 py-6" style={{ maxWidth: "1600px" }}>

          {/* HEADER */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.72rem",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  Dashboard
                </span>
                <ChevronRight className="w-3 h-3" strokeWidth={2} style={{ color: "#CBD5E1" }} />
                <span
                  style={{
                    color: "#2563EB",
                    fontSize: "0.72rem",
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  Competition Results
                </span>
              </div>
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
                Live Results Monitor
              </h1>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.82rem",
                  fontFamily: '"Inter", sans-serif',
                  marginTop: "0.4rem",
                }}
              >
                Read-only live stream of all submitted podium results — monitor, verify, and flag
                disputes.
              </p>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Live badge */}
              <div
                className="flex items-center gap-2 rounded-xl px-3.5 py-2"
                style={{
                  backgroundColor: "#0F172A",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: "7px",
                    height: "7px",
                    backgroundColor: "#4ADE80",
                    boxShadow: "0 0 8px #4ADE80",
                  }}
                />
                <span
                  style={{
                    color: "#4ADE80",
                    fontSize: "0.72rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                  }}
                >
                  LIVE
                </span>
                <span
                  style={{
                    color: "#475569",
                    fontSize: "0.65rem",
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  Feb 24, 2026
                </span>
              </div>

              {/* Refresh */}
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all"
                style={{
                  border: "1.5px solid #E2E8F0",
                  backgroundColor: "#FFFFFF",
                  color: "#64748B",
                  fontSize: "0.8rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFFFFF")
                }
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
                  strokeWidth={1.75}
                />
                Refresh
              </button>

              {/* Export */}
              <button
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#0F172A,#1E293B)",
                  color: "#FFFFFF",
                  fontSize: "0.84rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  boxShadow: "0 4px 16px rgba(15,23,42,0.22)",
                  border: "none",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg,#1E293B,#334155)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg,#0F172A,#1E293B)")
                }
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                Export Report
              </button>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="flex gap-4 mb-6">
            <StatCard
              icon={<Activity className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
              iconBg="linear-gradient(135deg,#0F172A,#334155)"
              label="Results Published"
              value="342"
              sub="Across all events today"
            />
            <StatCard
              icon={<Hourglass className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
              iconBg="linear-gradient(135deg,#D97706,#F59E0B)"
              label="Pending Validation"
              value={String(provisionalCount)}
              sub="Awaiting head referee sign-off"
              accentColor="#D97706"
            />
            <StatCard
              icon={<Flag className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
              iconBg="linear-gradient(135deg,#DC2626,#EF4444)"
              label="Disputes"
              value={String(disputedCount)}
              sub="Flagged for review"
              accentColor={disputedCount > 0 ? "#DC2626" : "#94A3B8"}
            />
            <StatCard
              icon={<ShieldCheck className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
              iconBg="linear-gradient(135deg,#059669,#0D9488)"
              label="Official Results"
              value={String(officialCount)}
              sub={`${officialCount > 0 ? Math.round((officialCount / totalResults) * 100) : 0}% of today's total`}
              accentColor="#059669"
            />
          </div>

          {/* TABLE */}
          <ResultsTable
            filtered={filtered}
            totalResults={totalResults}
            search={search}
            onSearchChange={setSearch}
            eventFilter={eventFilter}
            onEventFilterChange={setEventFilter}
            sportFilter={sportFilter}
            onSportFilterChange={setSportFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            activeFilters={activeFilters}
            onClearFilters={clearFilters}
            officialCount={officialCount}
            provisionalCount={provisionalCount}
            disputedCount={disputedCount}
          />

          <div style={{ height: "32px" }} />
        </div>
      </main>
    </>
  );
}
