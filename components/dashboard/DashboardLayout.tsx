"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useDashboardSync } from "@/hooks/useDashboardSync";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { ScoreboardCards } from "@/components/dashboard/panels/ScoreboardCards";
import { EventsTable } from "@/components/dashboard/panels/EventsTable";
import { MedalTally } from "@/components/dashboard/panels/MedalTally";
import { ActivityFeed } from "@/components/dashboard/panels/ActivityFeed";
import { PerformanceChart } from "@/components/dashboard/panels/PerformanceChart";
import { CreateEventModal } from "@/components/CreateEventModal";
import { ParticipantsPage } from "@/components/ParticipantsPage";
import { CompetitionResultsPage } from "@/components/CompetitionResultsPage";
import { MedalStandingsPage } from "@/components/MedalStandingsPage";

export function DashboardLayout() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Dashboard sync - tracks last data fetch time from server
  const { lastSyncTime } = useDashboardSync();

  // Only render date/time on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Current date for display - use stable value until mounted
  const currentTime = mounted ? new Date() : new Date("2026-01-01T00:00:00Z");
  const formattedDate = format(currentTime, "EEEE, MMMM d, yyyy");
  const formattedTime = lastSyncTime
    ? format(lastSyncTime, "HH:mm:ss 'UTC'")
    : (mounted ? format(currentTime, "HH:mm:ss 'UTC'") : "00:00:00 UTC");

  const handleNavChange = (id: string) => {
    if (id === "events") {
      // Navigate to proper Next.js route for events
      router.push("/events");
      return;
    }
    setActiveNav(id);
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: "#F8FAFC",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <TopHeader onCreateEvent={() => setShowCreateModal(true)} />

        {/* Page Content */}
        {activeNav === "participants" ? (
          <ParticipantsPage />
        ) : activeNav === "results" ? (
          <CompetitionResultsPage />
        ) : activeNav === "medals" ? (
          <MedalStandingsPage />
        ) : (
          /* Scrollable Dashboard Content */
          <main
            className="flex-1 overflow-y-auto"
            style={{ backgroundColor: "#F8FAFC" }}
          >
            <div className="px-6 py-6" style={{ maxWidth: "1600px" }}>
              {/* Page Title */}
              <div className="flex items-end justify-between mb-6">
                <div>
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
                    Dashboard Overview
                  </h1>
                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.82rem",
                      fontFamily: '"Inter", sans-serif',
                      marginTop: "0.4rem",
                    }}
                    suppressHydrationWarning
                  >
                    {formattedDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.72rem",
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    Last sync:
                  </span>
                  <span
                    className="rounded-lg px-2.5 py-1"
                    style={{
                      backgroundColor: "#0F172A",
                      color: "#4ADE80",
                      fontSize: "0.72rem",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 500,
                    }}
                    suppressHydrationWarning
                  >
                    {formattedTime}
                  </span>
                </div>
              </div>

              {/* Section A: Scoreboard Cards */}
              <ScoreboardCards />

              {/* Section B + C: Chart + Right Panel */}
              <div
                className="mt-5 grid gap-5"
                style={{ gridTemplateColumns: "1fr 360px" }}
              >
                {/* Left Column */}
                <div className="flex flex-col gap-5 min-w-0">
                  <PerformanceChart />
                  <EventsTable />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-5">
                  <MedalTally />
                  <ActivityFeed />

                  {/* Quick Keys Panel */}
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                      border: "1px solid #F1F5F9",
                    }}
                  >
                    <div
                      className="px-5 pt-4 pb-3"
                      style={{ borderBottom: "1px solid #F8FAFC" }}
                    >
                      <h2
                        style={{
                          fontFamily: '"Barlow Condensed", sans-serif',
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          color: "#0F172A",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Pending Access Keys
                      </h2>
                      <p
                        style={{
                          color: "#94A3B8",
                          fontSize: "0.7rem",
                          fontFamily: '"Inter", sans-serif',
                          marginTop: "1px",
                        }}
                      >
                        Awaiting participant assignment
                      </p>
                    </div>
                    <div className="px-4 py-3 flex flex-col gap-2">
                      {[
                        { key: "KEY-9934", event: "EVT-003", sport: "🥊", status: "Unassigned" },
                        { key: "KEY-8821", event: "EVT-001", sport: "🏃", status: "Processing" },
                        { key: "KEY-7751", event: "EVT-005", sport: "⚽", status: "Unassigned" },
                        { key: "KEY-6612", event: "EVT-002", sport: "🏊", status: "Processing" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                          style={{ border: "1px solid #F1F5F9" }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLDivElement).style.backgroundColor = "#F8FAFC")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent")
                          }
                        >
                          <span style={{ fontSize: "1rem" }}>{item.sport}</span>
                          <div className="flex-1 min-w-0">
                            <span
                              style={{
                                fontFamily: '"JetBrains Mono", monospace',
                                fontWeight: 500,
                                fontSize: "0.8rem",
                                color: "#7C3AED",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {item.key}
                            </span>
                            <span
                              style={{
                                color: "#CBD5E1",
                                fontSize: "0.65rem",
                                fontFamily: '"JetBrains Mono", monospace',
                                marginLeft: "8px",
                              }}
                            >
                              {item.event}
                            </span>
                          </div>
                          <span
                            className="rounded-full"
                            style={{
                              backgroundColor:
                                item.status === "Unassigned"
                                  ? "#FEF3C7"
                                  : "#DBEAFE",
                              color:
                                item.status === "Unassigned"
                                  ? "#92400E"
                                  : "#1D4ED8",
                              fontSize: "0.62rem",
                              fontFamily: '"Inter", sans-serif',
                              fontWeight: 500,
                              padding: "2px 8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div
                      className="px-5 py-3 text-center"
                      style={{ borderTop: "1px solid #F8FAFC" }}
                    >
                      <button
                        style={{
                          color: "#2563EB",
                          fontSize: "0.75rem",
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 500,
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        Manage all keys →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Spacer */}
              <div style={{ height: "32px" }} />
            </div>
          </main>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
