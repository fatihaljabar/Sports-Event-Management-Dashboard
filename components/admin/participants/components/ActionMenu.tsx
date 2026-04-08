"use client";

import { useState, useRef } from "react";
import { MoreVertical, Pencil, RotateCcw, ShieldOff } from "lucide-react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import type { Organizer } from "../types";

interface ActionMenuProps {
  org: Organizer;
}

export function ActionMenu({ org }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  const items = [
    { icon: <Pencil className="w-3.5 h-3.5" />, label: "Edit Access", color: "#374151" },
    { icon: <RotateCcw className="w-3.5 h-3.5" />, label: "Reset Password", color: "#374151" },
    {
      icon: <ShieldOff className="w-3.5 h-3.5" />,
      label: org.status === "revoked" ? "Reinstate Key" : "Revoke Key",
      color: org.status === "revoked" ? "#059669" : "#EF4444",
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex items-center justify-center rounded-lg transition-all"
        style={{
          width: "28px",
          height: "28px",
          color: "#94A3B8",
          border: `1.5px solid ${open ? "#E2E8F0" : "transparent"}`,
          backgroundColor: open ? "#F1F5F9" : "transparent",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
          }
        }}
      >
        <MoreVertical className="w-3.5 h-3.5" strokeWidth={1.75} />
      </button>
      {open && (
        <div
          className="absolute right-0 z-50 rounded-xl overflow-hidden py-1"
          style={{
            top: "34px",
            minWidth: "172px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
            border: "1px solid #E2E8F0",
          }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-colors text-left"
              style={{
                color: item.color,
                fontSize: "0.8rem",
                fontFamily: '"Inter", sans-serif',
                backgroundColor: "transparent",
                border: "none",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
              }
            >
              <span style={{ color: item.color, opacity: 0.7 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
