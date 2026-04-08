import React from "react";
import { KeyRound, Zap } from "lucide-react";

interface EmptyStateProps {
  onGenerate: () => void;
}

export function EmptyState({ onGenerate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div
        className="flex items-center justify-center rounded-2xl mb-4"
        style={{
          width: "72px",
          height: "72px",
          backgroundColor: "#F1F5F9",
          border: "2px dashed #E2E8F0",
        }}
      >
        <KeyRound className="w-8 h-8" strokeWidth={1.5} style={{ color: "#CBD5E1" }} />
      </div>
      <p style={{ color: "#374151", fontSize: "1rem", fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
        No access keys yet
      </p>
      <p style={{ color: "#94A3B8", fontSize: "0.82rem", fontFamily: '"Inter", sans-serif', marginTop: "4px", marginBottom: "16px" }}>
        Generate your first batch of keys to get started.
      </p>
      <button
        onClick={onGenerate}
        className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all"
        style={{
          background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
          color: "#FFFFFF",
          fontSize: "0.84rem",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          boxShadow: "0 4px 14px rgba(37,99,235,0.28)",
          border: "none",
        }}
      >
        <Zap className="w-4 h-4" strokeWidth={2} />
        Generate your first batch of keys
      </button>
    </div>
  );
}
