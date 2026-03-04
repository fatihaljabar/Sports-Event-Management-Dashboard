"use client";

import React, { useState } from "react";
import { X, Hash, RefreshCw, Zap, Check, AlertCircle, Archive } from "lucide-react";
import { generateKeys } from "@/app/actions/keys";
import { toast } from "sonner";
import type { SportCategory } from "@/lib/types/event";

interface GenerateKeysModalProps {
  onClose: () => void;
  eventName: string;
  eventId: string;
  eventSports?: SportCategory[];
  onKeysGenerated: () => void;
  remainingQuota?: number;
  totalQuota?: number;
}

interface AvailableSport {
  name: string;
  emoji: string;
  id: string;
}

export function GenerateKeysModal({
  onClose,
  eventName,
  eventId,
  eventSports,
  onKeysGenerated,
  remainingQuota = 0,
  totalQuota = 0,
}: GenerateKeysModalProps) {
  // Convert SportCategory[] to AvailableSport[] format
  const availableSports: AvailableSport[] = eventSports && eventSports.length > 0
    ? eventSports.map((s) => ({ name: s.label, emoji: s.emoji, id: s.id }))
    : [];

  const [qty, setQty] = useState("10");
  const [selectedSport, setSelectedSport] = useState(availableSports[0]?.name || "");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = async () => {
    if (!selectedSport) return;

    const sport = availableSports.find((s) => s.name === selectedSport);
    if (!sport) return;

    setGenerating(true);
    try {
      const result = await generateKeys({
        eventId,
        sportId: sport.id,
        sportName: sport.name,
        sportEmoji: sport.emoji,
        quantity: parseInt(qty) || 10,
      });

      if (result.success) {
        setDone(true);
        onKeysGenerated();
        // Show warning if event is archived
        if (result.warning) {
          toast("Keys generated with warning", {
            description: result.warning,
            className: "archive-toast",
            icon: <Archive className="w-5 h-5" style={{ color: "#D97706" }} />,
          });
        } else {
          toast.success("Keys generated successfully", {
            description: `${qty} access keys have been created.`,
          });
        }
        setTimeout(() => onClose(), 1200);
      } else {
        toast.error("Failed to generate keys", {
          description: result.error || "Please try again.",
        });
        setGenerating(false);
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      setGenerating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          width: "460px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          border: "1px solid #E2E8F0",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #F1F5F9" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg,#2563EB,#7C3AED)",
              }}
            >
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "#0F172A",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Generate Access Keys
              </h3>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {eventName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: "30px", height: "30px", color: "#94A3B8", border: "1.5px solid #E2E8F0" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
              (e.currentTarget as HTMLButtonElement).style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
            }}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Sport select */}
          <div>
            <label
              style={{
                color: "#374151",
                fontSize: "0.78rem",
                fontWeight: 500,
                fontFamily: '"Inter", sans-serif',
                display: "block",
                marginBottom: "8px",
              }}
            >
              Assigned Sport
            </label>
            {availableSports.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableSports.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSport(s.name)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                    style={{
                      border: `1.5px solid ${selectedSport === s.name ? "#2563EB" : "#E2E8F0"}`,
                      backgroundColor: selectedSport === s.name ? "#EFF6FF" : "#FAFBFC",
                      color: selectedSport === s.name ? "#1D4ED8" : "#64748B",
                      fontSize: "0.78rem",
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: selectedSport === s.name ? 600 : 400,
                    }}
                  >
                    <span>{s.emoji}</span>
                    {s.name}
                  </button>
                ))}
              </div>
            ) : (
              <div
                className="rounded-lg px-3 py-2"
                style={{
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#B91C1C",
                  fontSize: "0.75rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                No sports available for this event
              </div>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label
              style={{
                color: "#374151",
                fontSize: "0.78rem",
                fontWeight: 500,
                fontFamily: '"Inter", sans-serif',
                display: "block",
                marginBottom: "8px",
              }}
            >
              Number of Keys
            </label>
            <div className="flex items-center gap-3">
              {["5", "10", "25", "50", "100"].map((n) => (
                <button
                  key={n}
                  onClick={() => setQty(n)}
                  className="flex items-center justify-center rounded-lg transition-all"
                  style={{
                    width: "50px",
                    height: "36px",
                    border: `1.5px solid ${qty === n ? "#2563EB" : "#E2E8F0"}`,
                    backgroundColor: qty === n ? "#EFF6FF" : "transparent",
                    color: qty === n ? "#1D4ED8" : "#64748B",
                    fontSize: "0.82rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: qty === n ? 700 : 400,
                  }}
                >
                  {n}
                </button>
              ))}
              <input
                type="number"
                placeholder="Custom"
                value={!["5","10","25","50","100"].includes(qty) ? qty : ""}
                onChange={(e) => setQty(e.target.value)}
                className="flex-1 rounded-lg outline-none transition-all"
                style={{
                  padding: "8px 12px",
                  border: "1.5px solid #E2E8F0",
                  backgroundColor: "#FAFBFC",
                  fontSize: "0.82rem",
                  fontFamily: '"JetBrains Mono", monospace',
                  color: "#374151",
                  height: "36px",
                }}
                onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#2563EB")}
                onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")}
              />
            </div>
          </div>

          {/* Key prefix preview */}
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: "#F8FAFC", border: "1.5px dashed #E2E8F0" }}
          >
            <Hash className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} style={{ color: "#94A3B8" }} />
            <div>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.68rem",
                  fontFamily: '"Inter", sans-serif',
                  marginBottom: "2px",
                }}
              >
                Preview format
              </p>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.88rem",
                  color: "#7C3AED",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}
              >
                AG26-XXXX-XXX
              </span>
            </div>
            <div
              className="ml-auto rounded-md px-2 py-1"
              style={{ backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE" }}
            >
              <span
                style={{
                  color: "#5B21B6",
                  fontSize: "0.65rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                }}
              >
                Auto-generated
              </span>
            </div>
          </div>

          {/* Warning */}
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-2.5"
            style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" strokeWidth={1.75} style={{ color: "#D97706" }} />
            <p
              style={{
                color: "#92400E",
                fontSize: "0.72rem",
                fontFamily: '"Inter", sans-serif',
                lineHeight: 1.5,
              }}
            >
              Generating{" "}
              <strong>{qty || 0}</strong> keys will consume{" "}
              <strong>{qty || 0}</strong> from your remaining quota. Current available:{" "}
              <strong>{remainingQuota} slots</strong> (total: {totalQuota}).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid #F1F5F9" }}
        >
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 transition-all"
            style={{
              border: "1.5px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
              color: "#64748B",
              fontSize: "0.82rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating || done}
            className="flex items-center gap-2 rounded-xl px-5 py-2 transition-all"
            style={{
              background: done
                ? "linear-gradient(135deg,#059669,#0D9488)"
                : "linear-gradient(135deg,#2563EB,#1D4ED8)",
              color: "#FFFFFF",
              fontSize: "0.82rem",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(37,99,235,0.28)",
              border: "none",
              opacity: generating ? 0.85 : 1,
              transition: "all 0.3s",
            }}
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2} />
                Generating…
              </>
            ) : done ? (
              <>
                <Check className="w-4 h-4" strokeWidth={2.5} />
                Generated!
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" strokeWidth={2} />
                Generate {qty || 0} Keys
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
