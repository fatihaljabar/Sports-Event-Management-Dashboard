"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Mail, RotateCcw, ShieldOff, Trash2 } from "lucide-react";
import type { KeyStatus, SportKey } from "../constants";

interface ActionMenuProps {
  keyItem: SportKey;
  onRevoke: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  color: string;
  action?: () => void;
}

export function ActionMenu({ keyItem, onRevoke, onRestore, onDelete }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        // Also close if clicked outside the dropdown (which is in portal)
        const dropdown = document.getElementById(`action-menu-dropdown-${keyItem.id}`);
        if (dropdown && !dropdown.contains(e.target as Node)) {
          setOpen(false);
          setPosition(null);
        }
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [keyItem.id]);

  const items: MenuItem[] = [
    ...(keyItem.status === "confirmed"
      ? [{ icon: <Mail className="w-3.5 h-3.5" />, label: "Resend Email", color: "#374151" }]
      : []),
    ...(keyItem.status === "revoked"
      ? [{ icon: <RotateCcw className="w-3.5 h-3.5" />, label: "Restore Key", color: "#059669", action: () => onRestore(keyItem.id) }]
      : []),
    ...(keyItem.status !== "revoked"
      ? [{ icon: <ShieldOff className="w-3.5 h-3.5" />, label: "Revoke Key", color: "#EF4444", action: () => onRevoke(keyItem.id) }]
      : []),
    { icon: <Trash2 className="w-3.5 h-3.5" />, label: "Delete Key", color: "#EF4444", action: () => onDelete(keyItem.id) },
  ];

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.right - 160, // Align to right (160px is menu width)
      });
    } else {
      setPosition(null);
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center justify-center rounded-lg transition-all"
        style={{
          width: "28px",
          height: "28px",
          color: "#94A3B8",
          border: "1.5px solid transparent",
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

      {open && position && createPortal(
        <div
          id={`action-menu-dropdown-${keyItem.id}`}
          className="rounded-xl overflow-hidden"
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
            minWidth: "160px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            border: "1px solid #E2E8F0",
            zIndex: 9999,
          }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={(e) => {
                e.stopPropagation();
                item.action?.();
                setOpen(false);
                setPosition(null);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-colors text-left"
              style={{
                color: item.color,
                fontSize: "0.8rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
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
        </div>,
        document.body
      )}
    </div>
  );
}
