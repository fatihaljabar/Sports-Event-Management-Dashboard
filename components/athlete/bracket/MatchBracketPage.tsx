"use client";

import { Fragment, useMemo, useState } from "react";
import { Trophy, Edit3, Crown, CheckCircle2, X } from "lucide-react";

interface Team {
  id: string;
  name: string;
  logoColor: string;
  logoInitials: string;
}

interface Match {
  id: string;
  round: 0 | 1 | 2; // 0=QF, 1=SF, 2=Final
  teamA: Team | null;
  teamB: Team | null;
  scoreA: number | null;
  scoreB: number | null;
}

const TEAMS: Team[] = [
  { id: "1", name: "Surabaya FC",       logoColor: "#dc2626", logoInitials: "SFC" },
  { id: "2", name: "Team Elang",         logoColor: "#2563eb", logoInitials: "TE" },
  { id: "3", name: "Bali United U-20",   logoColor: "#e11d48", logoInitials: "BU" },
  { id: "4", name: "Bandung Raya",       logoColor: "#7c3aed", logoInitials: "BR" },
  { id: "5", name: "Persija U-20",       logoColor: "#ea580c", logoInitials: "PU" },
  { id: "6", name: "Borneo FC",          logoColor: "#0891b2", logoInitials: "BFC" },
  { id: "7", name: "PSM Makassar",       logoColor: "#059669", logoInitials: "PSM" },
  { id: "8", name: "Arema Malang",       logoColor: "#b45309", logoInitials: "ARM" },
];

function winnerOf(m: Match | undefined): Team | null {
  if (!m) return null;
  if (m.scoreA == null || m.scoreB == null || !m.teamA || !m.teamB) return null;
  if (m.scoreA === m.scoreB) return null;
  return m.scoreA > m.scoreB ? m.teamA : m.teamB;
}

function initialMatches(): Match[] {
  const qf: Match[] = [
    { id: "qf1", round: 0, teamA: TEAMS[0], teamB: TEAMS[1], scoreA: 2, scoreB: 1 },
    { id: "qf2", round: 0, teamA: TEAMS[2], teamB: TEAMS[3], scoreA: 0, scoreB: 3 },
    { id: "qf3", round: 0, teamA: TEAMS[4], teamB: TEAMS[5], scoreA: 1, scoreB: 1 },
    { id: "qf4", round: 0, teamA: TEAMS[6], teamB: TEAMS[7], scoreA: null, scoreB: null },
  ];
  const sf: Match[] = [
    { id: "sf1", round: 1, teamA: winnerOf(qf[0]), teamB: winnerOf(qf[1]), scoreA: 2, scoreB: 0 },
    { id: "sf2", round: 1, teamA: winnerOf(qf[2]), teamB: winnerOf(qf[3]), scoreA: null, scoreB: null },
  ];
  const final: Match[] = [
    { id: "f1", round: 2, teamA: winnerOf(sf[0]), teamB: winnerOf(sf[1]), scoreA: null, scoreB: null },
  ];
  return [...qf, ...sf, ...final];
}

const CARD_H = 96;
const V_GAP = 40;

function MatchCard({
  match,
  onOpenScore,
  highlightWinnerId,
}: {
  match: Match;
  onOpenScore: (m: Match) => void;
  highlightWinnerId?: string | null;
}) {
  const winner = winnerOf(match);
  const played = match.scoreA != null && match.scoreB != null;

  const row = (team: Team | null, score: number | null, isWinner: boolean) => (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
      style={{
        backgroundColor: isWinner ? "rgba(22,163,74,0.08)" : "transparent",
      }}
    >
      <div
        className="flex items-center justify-center rounded-md text-white shrink-0"
        style={{
          width: "22px",
          height: "22px",
          backgroundColor: team?.logoColor ?? "#cbd5e1",
          fontFamily: "Barlow Condensed, sans-serif",
          fontSize: "10px",
          fontWeight: 700,
        }}
      >
        {team?.logoInitials ?? "—"}
      </div>
      <span
        className="flex-1 min-w-0 truncate"
        style={{
          fontFamily: "Barlow Condensed, sans-serif",
          fontSize: "13px",
          fontWeight: isWinner ? 700 : 600,
          color: team ? (isWinner ? "#15803d" : "#0f172a") : "#94a3b8",
          letterSpacing: "0.01em",
        }}
      >
        {team?.name ?? "TBD"}
      </span>
      <span
        className="shrink-0"
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "13px",
          fontWeight: 700,
          color: score == null ? "#cbd5e1" : isWinner ? "#15803d" : "#475569",
          minWidth: "14px",
          textAlign: "right",
        }}
      >
        {score ?? "–"}
      </span>
    </div>
  );

  const highlighted = highlightWinnerId && winner?.id === highlightWinnerId;

  return (
    <div
      className="group relative bg-white rounded-xl border transition-all"
      style={{
        width: "220px",
        height: `${CARD_H}px`,
        borderColor: highlighted ? "#86efac" : "#e2e8f0",
        boxShadow: highlighted
          ? "0 0 0 3px rgba(34,197,94,0.15), 0 4px 14px rgba(34,197,94,0.15)"
          : "0 1px 2px rgba(15,23,42,0.04)",
      }}
    >
      <div className="p-1.5">
        {row(match.teamA, match.scoreA, winner?.id === match.teamA?.id)}
        <div className="h-px bg-[#f1f5f9] mx-2" />
        {row(match.teamB, match.scoreB, winner?.id === match.teamB?.id)}
      </div>

      {/* Hover: Input Score */}
      <button
        onClick={() => onOpenScore(match)}
        className="absolute inset-x-0 -bottom-3 mx-auto w-max opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-white"
        style={{
          background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
          fontSize: "11px",
          fontWeight: 600,
          fontFamily: "Barlow Condensed, sans-serif",
          letterSpacing: "0.04em",
          boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
        }}
      >
        <Edit3 size={11} strokeWidth={2.5} /> {played ? "Edit Score" : "Input Score"}
      </button>

      {/* Status badge */}
      {played && (
        <span
          className="absolute -top-2 -right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white"
          style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.04em" }}
        >
          <CheckCircle2 size={9} strokeWidth={3} /> DONE
        </span>
      )}
    </div>
  );
}

function ScoreDialog({
  match,
  onClose,
  onSave,
}: {
  match: Match;
  onClose: () => void;
  onSave: (a: number, b: number) => void;
}) {
  const [a, setA] = useState(match.scoreA ?? 0);
  const [b, setB] = useState(match.scoreB ?? 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="absolute inset-0 bg-[#0f172a]/60" onClick={onClose} />
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <div>
            <h2
              className="text-[#0f172a]"
              style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "20px", fontWeight: 700 }}
            >
              Input Match Score
            </h2>
            <p className="text-[#64748b] mt-0.5" style={{ fontSize: "12.5px" }}>
              {match.round === 0 ? "Quarter-final" : match.round === 1 ? "Semi-final" : "Final"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {[{ team: match.teamA, score: a, setScore: setA }, { team: match.teamB, score: b, setScore: setB }].map((side, i) => (
            <Fragment key={i}>
              {i === 1 && (
                <span
                  className="text-[#cbd5e1]"
                  style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "22px", fontWeight: 700 }}
                >
                  VS
                </span>
              )}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-lg text-white"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: side.team?.logoColor ?? "#cbd5e1",
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {side.team?.logoInitials ?? "—"}
                </div>
                <p
                  className="text-[#0f172a] text-center truncate w-full"
                  style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "14px", fontWeight: 600 }}
                >
                  {side.team?.name ?? "TBD"}
                </p>
                <input
                  type="number"
                  min={0}
                  value={side.score}
                  onChange={(e) => side.setScore(Math.max(0, Number(e.target.value || 0)))}
                  className="w-16 h-12 text-center rounded-lg border border-[#e2e8f0] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 outline-none text-[#0f172a]"
                  style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "20px", fontWeight: 700 }}
                />
              </div>
            </Fragment>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#f1f5f9] bg-[#fafbfc]">
          <button
            onClick={onClose}
            className="px-4 h-10 rounded-lg border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9]"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(a, b)}
            disabled={!match.teamA || !match.teamB}
            className="px-4 h-10 rounded-lg text-white"
            style={{
              background: match.teamA && match.teamB ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "linear-gradient(135deg,#cbd5e1,#94a3b8)",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "Barlow Condensed, sans-serif",
              letterSpacing: "0.04em",
              cursor: match.teamA && match.teamB ? "pointer" : "not-allowed",
            }}
          >
            Save Score
          </button>
        </div>
      </div>
    </div>
  );
}

export function MatchBracketPage() {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [editing, setEditing] = useState<Match | null>(null);

  const qf = matches.filter((m) => m.round === 0);
  const sf = matches.filter((m) => m.round === 1);
  const fn = matches.filter((m) => m.round === 2);

  const championId = useMemo(() => winnerOf(fn[0])?.id ?? null, [fn]);

  const saveScore = (a: number, b: number) => {
    if (!editing) return;
    setMatches((prev) => {
      const next = prev.map((m) =>
        m.id === editing.id ? { ...m, scoreA: a, scoreB: b } : m
      );
      // Recompute downstream teams
      const qfN = next.filter((m) => m.round === 0);
      const sfN = next.filter((m) => m.round === 1);
      const fnN = next.filter((m) => m.round === 2);
      sfN[0] = { ...sfN[0], teamA: winnerOf(qfN[0]), teamB: winnerOf(qfN[1]) };
      sfN[1] = { ...sfN[1], teamA: winnerOf(qfN[2]), teamB: winnerOf(qfN[3]) };
      fnN[0] = { ...fnN[0], teamA: winnerOf(sfN[0]), teamB: winnerOf(sfN[1]) };
      // Invalidate stale scores where teams changed
      const resetIfTeamsChanged = (before: Match, after: Match): Match =>
        before.teamA?.id !== after.teamA?.id || before.teamB?.id !== after.teamB?.id
          ? { ...after, scoreA: null, scoreB: null }
          : after;
      const sfResolved = sfN.map((after, i) => resetIfTeamsChanged(next.filter((m) => m.round === 1)[i], after));
      const fnResolved = fnN.map((after, i) => resetIfTeamsChanged(next.filter((m) => m.round === 2)[i], after));
      return [...qfN, ...sfResolved, ...fnResolved];
    });
    setEditing(null);
  };

  // Column layout constants
  const colGap = 80;
  const qfSpacing = CARD_H + V_GAP; // 136
  const colHeight = qf.length * qfSpacing;

  const columnCenters = (count: number) => {
    const spacing = colHeight / count;
    return Array.from({ length: count }, (_, i) => spacing * i + spacing / 2);
  };
  const qfCenters = columnCenters(qf.length);
  const sfCenters = columnCenters(sf.length);
  const fnCenters = columnCenters(fn.length);

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-[#f8fafc]" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#eff6ff]">
            <Trophy size={20} className="text-[#2563eb]" />
          </div>
          <div>
            <h1
              className="text-[#0f172a]"
              style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "28px", fontWeight: 700, lineHeight: 1.15 }}
            >
              Match Bracket
            </h1>
            <p className="text-[#64748b] mt-0.5" style={{ fontSize: "13px" }}>
              Live view of quarter-finals, semi-finals, and final. Hover a match to input scores.
            </p>
          </div>
        </div>

        {championId && (
          <div
            className="inline-flex items-center gap-2 px-4 h-11 rounded-xl"
            style={{
              background: "linear-gradient(135deg,#fef3c7,#fde68a)",
              border: "1px solid #fbbf24",
            }}
          >
            <Crown size={16} className="text-amber-600" />
            <span className="text-amber-900" style={{ fontSize: "12px", fontWeight: 600 }}>
              Champion:
            </span>
            <span
              className="text-amber-900"
              style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "16px", fontWeight: 700 }}
            >
              {TEAMS.find((t) => t.id === championId)?.name}
            </span>
          </div>
        )}
      </div>

      {/* Bracket */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 overflow-x-auto">
        {/* Round headers */}
        <div className="flex gap-[80px] mb-4" style={{ paddingLeft: "0" }}>
          {["Quarter-finals", "Semi-finals", "Final"].map((label, i) => (
            <div
              key={label}
              style={{ width: "220px", display: "flex", justifyContent: "center" }}
            >
              <span
                className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-[#f1f5f9] text-[#475569]"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                ROUND {i + 1} &middot; {label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        <div
          className="relative"
          style={{ height: `${colHeight}px`, minWidth: `${220 * 3 + colGap * 2}px` }}
        >
          {/* SVG connectors */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
          >
            {/* QF -> SF connectors */}
            {qf.map((m, i) => {
              const x1 = 220;
              const y1 = qfCenters[i];
              const sfIdx = Math.floor(i / 2);
              const x2 = 220 + colGap;
              const y2 = sfCenters[sfIdx];
              const midX = (x1 + x2) / 2;
              const winner = winnerOf(m);
              const advancing = winner && sf[sfIdx] && (sf[sfIdx].teamA?.id === winner.id || sf[sfIdx].teamB?.id === winner.id);
              return (
                <path
                  key={`c-qf-${m.id}`}
                  d={`M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`}
                  fill="none"
                  stroke={advancing ? "#22c55e" : "#e2e8f0"}
                  strokeWidth={advancing ? 2 : 1.5}
                  style={advancing ? { filter: "drop-shadow(0 0 4px rgba(34,197,94,0.4))" } : undefined}
                />
              );
            })}
            {/* SF -> Final connectors */}
            {sf.map((m, i) => {
              const x1 = 220 * 2 + colGap;
              const y1 = sfCenters[i];
              const x2 = 220 * 2 + colGap * 2;
              const y2 = fnCenters[0];
              const midX = (x1 + x2) / 2;
              const winner = winnerOf(m);
              const advancing = winner && fn[0] && (fn[0].teamA?.id === winner.id || fn[0].teamB?.id === winner.id);
              return (
                <path
                  key={`c-sf-${m.id}`}
                  d={`M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`}
                  fill="none"
                  stroke={advancing ? "#22c55e" : "#e2e8f0"}
                  strokeWidth={advancing ? 2 : 1.5}
                  style={advancing ? { filter: "drop-shadow(0 0 4px rgba(34,197,94,0.4))" } : undefined}
                />
              );
            })}
          </svg>

          {/* Columns */}
          {[qf, sf, fn].map((col, colIdx) => {
            const centers = [qfCenters, sfCenters, fnCenters][colIdx];
            const left = colIdx * (220 + colGap);
            return col.map((match, i) => (
              <div
                key={match.id}
                className="absolute"
                style={{
                  left: `${left}px`,
                  top: `${centers[i] - CARD_H / 2}px`,
                }}
              >
                <MatchCard
                  match={match}
                  onOpenScore={setEditing}
                  highlightWinnerId={championId}
                />
              </div>
            ));
          })}
        </div>
      </div>

      {editing && (
        <ScoreDialog
          match={editing}
          onClose={() => setEditing(null)}
          onSave={saveScore}
        />
      )}
    </div>
  );
}