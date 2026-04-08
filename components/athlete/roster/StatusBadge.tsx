"use client";

import { ShieldCheck } from "lucide-react";

export function StatusBadge({ status }: { status: "Verified" | "Pending" }) {
  if (status === "Verified") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{
          backgroundColor: "#dcfce7",
          color: "#15803d",
          fontSize: "11px",
          fontWeight: 600,
        }}
      >
        <ShieldCheck size={11} strokeWidth={2.5} />
        Verified
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: "#fef9c3",
        color: "#a16207",
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      <span
        className="rounded-full"
        style={{ width: "6px", height: "6px", backgroundColor: "#f59e0b" }}
      />
      Pending
    </span>
  );
}
