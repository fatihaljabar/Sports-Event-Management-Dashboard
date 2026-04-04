"use client";

import { Users, Activity, KeyRound, ShieldAlert, UserCog } from "lucide-react";
import { ParticipantsTable } from "./components/ParticipantsTable";
import { useParticipants } from "./hooks/use-participants";

function StatCard({
  icon,
  iconBg,
  label,
  value,
  sub,
  accentColor,
  trend,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  accentColor?: string;
  trend?: string;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-5 py-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #F1F5F9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        flex: 1,
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{ width: "42px", height: "42px", background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p
          style={{
            color: "#94A3B8",
            fontSize: "0.67rem",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <p
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 700,
              fontSize: "1.9rem",
              color: accentColor ?? "#0F172A",
              lineHeight: 1.1,
            }}
          >
            {value}
          </p>
          {trend && (
            <span
              style={{ color: "#94A3B8", fontSize: "0.68rem", fontFamily: '"Inter", sans-serif' }}
            >
              {trend}
            </span>
          )}
        </div>
        <p
          style={{
            color: "#CBD5E1",
            fontSize: "0.67rem",
            fontFamily: '"Inter", sans-serif',
            marginTop: "1px",
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

export function ParticipantsPage() {
  const {
    search,
    setSearch,
    eventFilter,
    setEventFilter,
    divFilter,
    setDivFilter,
    filtered,
    activeCount,
    revokedCount,
    activeFilters,
    clearFilters,
    totalOrganizers,
  } = useParticipants();

  return (
    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="px-6 py-6" style={{ maxWidth: "1600px" }}>
        {/* HEADER */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                style={{ color: "#94A3B8", fontSize: "0.72rem", fontFamily: '"Inter", sans-serif' }}
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
                Organizer Keys &amp; Access
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
              Organizer Keys &amp; Access
            </h1>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.82rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "0.4rem",
              }}
            >
              Identity &amp; Access Management — who manages what, and which key belongs to whom.
            </p>
          </div>

          {/* Invite button */}
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
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg,#1E293B,#334155)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg,#0F172A,#1E293B)";
            }}
          >
            <UserCog className="w-4 h-4" strokeWidth={2} />
            Add Organizer
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="flex gap-4 mb-6">
          <StatCard
            icon={<Users className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
            iconBg="linear-gradient(135deg,#0F172A,#334155)"
            label="Total Organizers"
            value={String(totalOrganizers)}
            sub="Across all events"
          />
          <StatCard
            icon={<Activity className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
            iconBg="linear-gradient(135deg,#059669,#0D9488)"
            label="Active Keys"
            value={String(activeCount)}
            sub={`${activeCount} currently online`}
            accentColor="#059669"
            trend="94.7%"
          />
          <StatCard
            icon={<KeyRound className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
            iconBg="linear-gradient(135deg,#94A3B8,#64748B)"
            label="Unassigned Keys"
            value="8"
            sub="Awaiting assignment"
            accentColor="#64748B"
          />
          <StatCard
            icon={<ShieldAlert className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />}
            iconBg="linear-gradient(135deg,#EF4444,#DC2626)"
            label="Revoked"
            value={String(revokedCount)}
            sub="Keys deactivated"
            accentColor="#DC2626"
          />
        </div>

        {/* TABLE */}
        <ParticipantsTable
          filtered={filtered}
          totalOrganizers={totalOrganizers}
          revokedCount={revokedCount}
          search={search}
          onSearchChange={setSearch}
          eventFilter={eventFilter}
          onEventFilterChange={setEventFilter}
          divFilter={divFilter}
          onDivFilterChange={setDivFilter}
          activeFilters={activeFilters}
          onClearFilters={clearFilters}
        />

        <div style={{ height: "32px" }} />
      </div>
    </main>
  );
}
