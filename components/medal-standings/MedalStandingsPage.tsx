"use client";

import {
  Download,
  X,
  Users,
  Globe,
  ArrowUpDown,
} from "lucide-react";
import { MedalStandingsTable } from "./components/MedalStandingsTable";
import { PodiumHero } from "./components/PodiumHero";
import { FilterDropdown } from "./components/FilterDropdown";
import { useMedalStandings } from "./hooks/use-medal-standings";
import { EVENTS, TEAMS, SPORTS, GENDERS } from "./constants";
import type { GenderFilter, ViewMode } from "./types";

export function MedalStandingsPage() {
  const {
    view,
    setView,
    eventFilter,
    setEventFilter,
    teamFilter,
    setTeamFilter,
    sportFilter,
    setSportFilter,
    gender,
    setGender,
    search,
    setSearch,
    sortedAthletes,
    sortedCountries,
    activeFilters,
    clearFilters,
    totalMedals,
  } = useMedalStandings();

  return (
    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="px-6 py-6" style={{ maxWidth: "1400px" }}>

        {/* HEADER */}
        <div className="flex items-end justify-between mb-5">
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
              <span style={{ color: "#CBD5E1" }}>/</span>
              <span
                style={{
                  color: "#2563EB",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                }}
              >
                Medal Standings
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
              Medal Standings
            </h1>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.82rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "0.4rem",
              }}
            >
              Individual athlete and national medal leaderboards — ranked by gold count.
            </p>
          </div>
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

        {/* VIEW TOGGLE + FILTERS */}
        <div
          className="rounded-2xl px-5 py-4 mb-5 flex items-center gap-4 flex-wrap"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #F1F5F9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Toggle tabs */}
          <div
            className="flex items-center rounded-xl overflow-hidden flex-shrink-0"
            style={{ border: "1.5px solid #E2E8F0", backgroundColor: "#F8FAFC" }}
          >
            {(
              [
                { id: "athlete" as ViewMode, icon: <Users className="w-3.5 h-3.5" strokeWidth={1.75} />, label: "By Athlete" },
                { id: "country" as ViewMode, icon: <Globe className="w-3.5 h-3.5" strokeWidth={1.75} />, label: "By Country" },
              ]
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2 transition-all"
                style={{
                  backgroundColor: view === tab.id ? "#0F172A" : "transparent",
                  color: view === tab.id ? "#FFFFFF" : "#64748B",
                  fontSize: "0.8rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: view === tab.id ? 600 : 400,
                  border: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "28px", backgroundColor: "#F1F5F9", flexShrink: 0 }} />

          {/* Filters */}
          <FilterDropdown
            label="Filter Event"
            options={EVENTS}
            value={eventFilter}
            onChange={setEventFilter}
          />
          {view === "athlete" && (
            <>
              <FilterDropdown
                label="Filter Team / Country"
                options={TEAMS}
                value={teamFilter}
                onChange={setTeamFilter}
              />
              <FilterDropdown
                label="Filter Sport"
                options={SPORTS}
                value={sportFilter}
                onChange={setSportFilter}
              />

              {/* Gender toggle pills */}
              <div
                className="flex items-center gap-1 rounded-lg p-0.5"
                style={{ backgroundColor: "#F8FAFC", border: "1.5px solid #E2E8F0" }}
              >
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g as GenderFilter)}
                    className="rounded-md px-3 py-1.5 transition-all"
                    style={{
                      backgroundColor: gender === g ? "#FFFFFF" : "transparent",
                      color: gender === g ? "#0F172A" : "#94A3B8",
                      fontSize: "0.76rem",
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: gender === g ? 600 : 400,
                      border: `1.5px solid ${gender === g ? "#E2E8F0" : "transparent"}`,
                      boxShadow: gender === g ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </>
          )}

          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all"
              style={{
                border: "1.5px solid #FECACA",
                backgroundColor: "#FFF5F5",
                color: "#DC2626",
                fontSize: "0.78rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
              Clear {activeFilters}
            </button>
          )}

          <div className="flex-1" />

          {/* Search */}
          <div className="relative flex-shrink-0" style={{ width: "220px" }}>
            <ArrowUpDown
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              strokeWidth={1.75}
              style={{ color: "#CBD5E1" }}
            />
            <input
              type="text"
              placeholder={view === "athlete" ? "Search athlete…" : "Search country…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg outline-none"
              style={{
                paddingLeft: "2.1rem",
                paddingRight: "0.75rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                backgroundColor: "#F8FAFC",
                border: "1.5px solid #E2E8F0",
                fontSize: "0.8rem",
                fontFamily: '"Inter", sans-serif',
                color: "#1E293B",
              }}
              onFocus={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#2563EB")
              }
              onBlur={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")
              }
            />
          </div>
        </div>

        {/* PODIUM HERO */}
        <PodiumHero
          athletes={sortedAthletes}
          countries={sortedCountries}
          view={view}
        />

        {/* TABLE */}
        <MedalStandingsTable
          sortedAthletes={sortedAthletes}
          sortedCountries={sortedCountries}
          totalMedals={totalMedals}
        />

        <div style={{ height: "32px" }} />
      </div>
    </main>
  );
}
