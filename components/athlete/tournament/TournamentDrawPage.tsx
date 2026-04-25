"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Eraser,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  Shield,
  Users,
} from "lucide-react";

interface Team {
  id: string;
  name: string;
  logoColor: string;
  logoInitials: string;
}

const MOCK_TEAMS: Team[] = [
  { id: "0001", name: "Surabaya FC",       logoColor: "#dc2626", logoInitials: "SFC"  },
  { id: "0002", name: "Team Elang",         logoColor: "#2563eb", logoInitials: "TE"   },
  { id: "0003", name: "Bali United U-20",   logoColor: "#e11d48", logoInitials: "BU"   },
  { id: "0004", name: "Bandung Raya",       logoColor: "#7c3aed", logoInitials: "BR"   },
  { id: "0005", name: "Persija U-20",       logoColor: "#ea580c", logoInitials: "PU"   },
  { id: "0006", name: "Borneo FC",          logoColor: "#0891b2", logoInitials: "BFC"  },
  { id: "0007", name: "PSM Makassar",       logoColor: "#059669", logoInitials: "PSM"  },
  { id: "0008", name: "Arema Malang",       logoColor: "#b45309", logoInitials: "ARM"  },
];

const GROUPS: { key: string; label: string; slots: number }[] = [
  { key: "A", label: "Group A", slots: 4 },
  { key: "B", label: "Group B", slots: 4 },
];

type SlotMap = Record<string, (Team | null)[]>;

function emptySlots(): SlotMap {
  const map: SlotMap = {};
  GROUPS.forEach((g) => (map[g.key] = Array(g.slots).fill(null)));
  return map;
}

function TeamChip({
  team,
  draggable = true,
  onDragStart,
  showId = true,
  compact = false,
}: {
  team: Team;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  showId?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className={`flex items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#2563eb] hover:shadow-sm transition-all ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      style={{ padding: compact ? "8px 10px" : "10px 12px" }}
    >
      {draggable && <GripVertical size={14} className="text-[#cbd5e1] shrink-0" />}
      <div
        className="flex items-center justify-center rounded-lg text-white shrink-0"
        style={{
          width: compact ? "28px" : "34px",
          height: compact ? "28px" : "34px",
          backgroundColor: team.logoColor,
          fontFamily: "Barlow Condensed, sans-serif",
          fontSize: compact ? "11px" : "12px",
          fontWeight: 700,
        }}
      >
        {team.logoInitials}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[#0f172a] truncate"
          style={{
            fontFamily: "Barlow Condensed, sans-serif",
            fontSize: compact ? "14px" : "15px",
            fontWeight: 600,
            lineHeight: 1.1,
          }}
        >
          {team.name}
        </p>
        {showId && (
          <p className="text-[#94a3b8]" style={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace" }}>
            ID: {team.id}
          </p>
        )}
      </div>
    </div>
  );
}

export function TournamentDrawPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<SlotMap>(emptySlots);
  const [dragTeamId, setDragTeamId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const placedIds = useMemo(() => {
    const set = new Set<string>();
    Object.values(slots).forEach((arr) =>
      arr.forEach((t) => t && set.add(t.id))
    );
    return set;
  }, [slots]);

  const unplacedTeams = MOCK_TEAMS.filter((t) => !placedIds.has(t.id));
  const placedCount = placedIds.size;
  const totalSlots = GROUPS.reduce((s, g) => s + g.slots, 0);

  const handleDropSlot = (groupKey: string, slotIdx: number) => {
    if (!dragTeamId) return;
    const team = MOCK_TEAMS.find((t) => t.id === dragTeamId);
    if (!team) return;
    setSlots((prev) => {
      const next: SlotMap = {};
      Object.entries(prev).forEach(([k, arr]) => {
        next[k] = arr.map((t) => (t?.id === team.id ? null : t));
      });
      next[groupKey] = [...next[groupKey]];
      next[groupKey][slotIdx] = team;
      return next;
    });
    setDragTeamId(null);
    setDragOver(null);
  };

  const removeFromSlot = (groupKey: string, slotIdx: number) => {
    setSlots((prev) => {
      const next = { ...prev, [groupKey]: [...prev[groupKey]] };
      next[groupKey][slotIdx] = null;
      return next;
    });
  };

  const autoRandomize = () => {
    const shuffled = [...MOCK_TEAMS].sort(() => Math.random() - 0.5);
    const next: SlotMap = emptySlots();
    let i = 0;
    for (const g of GROUPS) {
      for (let s = 0; s < g.slots; s++) {
        next[g.key][s] = shuffled[i++] ?? null;
      }
    }
    setSlots(next);
  };

  const clearAll = () => setSlots(emptySlots());

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#64748b] mb-1" style={{ fontSize: "12px" }}>
              <Link
                href="/roster/tournament-format"
                className="hover:text-[#2563eb] transition-colors"
              >
                Tournament Format
              </Link>
              <span>›</span>
              <span className="text-[#475569]">Draw &amp; Seeding</span>
            </div>
            <h1
              className="text-[#0f172a]"
              style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "28px", fontWeight: 700, lineHeight: 1.15 }}
            >
              Tournament Draw &amp; Seeding
            </h1>
            <p className="text-[#64748b] mt-1" style={{ fontSize: "13px" }}>
              Drag teams from the list into group slots, or auto-randomize the draw.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg border border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9] transition-colors"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              <Eraser size={14} /> Clear All
            </button>
            <button
              onClick={autoRandomize}
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg text-white transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "Barlow Condensed, sans-serif",
                letterSpacing: "0.04em",
                boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
              }}
            >
              <Sparkles size={14} strokeWidth={2.5} /> Auto-Randomize
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left — Registered Teams */}
          <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 sticky top-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#eff6ff]">
                    <Users size={14} className="text-[#2563eb]" />
                  </div>
                  <h2
                    className="text-[#0f172a]"
                    style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "17px", fontWeight: 700 }}
                  >
                    Registered Teams
                  </h2>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569]"
                  style={{ fontSize: "11px", fontWeight: 600 }}
                >
                  {unplacedTeams.length}/{MOCK_TEAMS.length}
                </span>
              </div>
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {unplacedTeams.map((team) => (
                  <TeamChip
                    key={team.id}
                    team={team}
                    onDragStart={() => setDragTeamId(team.id)}
                  />
                ))}
                {unplacedTeams.length === 0 && (
                  <p className="text-[#94a3b8] text-center py-6" style={{ fontSize: "12px" }}>
                    All teams have been placed.
                  </p>
                )}
              </div>
            </div>
          </aside>

          {/* Right — Tournament Slots */}
          <section className="col-span-12 lg:col-span-8 xl:col-span-9">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#2563eb]" />
                <h2
                  className="text-[#0f172a]"
                  style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "17px", fontWeight: 700 }}
                >
                  Tournament Slots
                </h2>
              </div>
              <span className="text-[#64748b]" style={{ fontSize: "12px" }}>
                {placedCount} / {totalSlots} slots filled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {GROUPS.map((g) => (
                <div
                  key={g.key}
                  className="bg-white rounded-2xl border border-[#e2e8f0] p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className="text-[#0f172a]"
                      style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "20px", fontWeight: 700, letterSpacing: "0.02em" }}
                    >
                      {g.label}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded-full bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0]"
                      style={{ fontSize: "11px", fontWeight: 600 }}
                    >
                      {slots[g.key].filter(Boolean).length}/{g.slots}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {slots[g.key].map((team, i) => {
                      const key = `${g.key}-${i}`;
                      const isOver = dragOver === key;
                      return (
                        <div
                          key={key}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(key);
                          }}
                          onDragLeave={() => setDragOver((prev) => (prev === key ? null : prev))}
                          onDrop={() => handleDropSlot(g.key, i)}
                          className="rounded-xl transition-all"
                          style={{
                            border: `2px dashed ${isOver ? "#2563eb" : team ? "transparent" : "#cbd5e1"}`,
                            backgroundColor: isOver ? "#eff6ff" : team ? "transparent" : "#fafbfc",
                            padding: team ? "0" : "2px",
                            minHeight: "58px",
                          }}
                        >
                          {team ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 min-w-0">
                                <TeamChip team={team} draggable={false} />
                              </div>
                              <button
                                onClick={() => removeFromSlot(g.key, i)}
                                className="shrink-0 w-8 h-8 rounded-lg border border-[#e2e8f0] text-[#94a3b8] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors flex items-center justify-center"
                                aria-label="Remove team"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div
                              className="flex items-center justify-center h-full text-[#94a3b8] gap-2"
                              style={{ fontSize: "12px", minHeight: "54px" }}
                            >
                              <span
                                className="w-6 h-6 rounded-full flex items-center justify-center bg-[#f1f5f9] text-[#64748b]"
                                style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", fontWeight: 600 }}
                              >
                                {i + 1}
                              </span>
                              Drop a team here
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer nav */}
      <footer className="sticky bottom-0 bg-white border-t border-[#e2e8f0] px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push("/roster/tournament-format")}
          className="inline-flex items-center gap-2 px-4 h-11 rounded-lg border border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9] transition-colors"
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          <ArrowLeft size={14} /> Back to Selection
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[#94a3b8]" style={{ fontSize: "12px" }}>
            {placedCount === totalSlots
              ? "All slots filled — ready to generate."
              : `${totalSlots - placedCount} slot(s) remaining`}
          </span>
          <button
            disabled={placedCount !== totalSlots}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-lg text-white transition-all active:scale-[0.98]"
            style={{
              background:
                placedCount === totalSlots
                  ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
                  : "linear-gradient(135deg,#cbd5e1,#94a3b8)",
              fontSize: "13.5px",
              fontWeight: 600,
              fontFamily: "Barlow Condensed, sans-serif",
              letterSpacing: "0.04em",
              cursor: placedCount === totalSlots ? "pointer" : "not-allowed",
              boxShadow: placedCount === totalSlots ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
            }}
          >
            Confirm &amp; Generate Bracket <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </footer>
    </div>
  );
}