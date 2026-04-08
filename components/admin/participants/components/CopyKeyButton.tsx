"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyKeyButtonProps {
  value: string;
}

export function CopyKeyButton({ value }: CopyKeyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className="rounded-lg px-2.5 py-1.5 select-all"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: 500,
          fontSize: "0.75rem",
          color: "#475569",
          backgroundColor: "#F1F5F9",
          border: "1.5px solid #E2E8F0",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
      <button
        onClick={handleCopy}
        title="Copy key"
        className="flex items-center justify-center rounded-md transition-all flex-shrink-0"
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: copied ? "#DCFCE7" : "#F8FAFC",
          border: `1.5px solid ${copied ? "#BBF7D0" : "#E2E8F0"}`,
          color: copied ? "#15803D" : "#94A3B8",
        }}
        onMouseEnter={(e) => {
          if (!copied) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
          }
        }}
        onMouseLeave={(e) => {
          if (!copied) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
          }
        }}
      >
        {copied ? (
          <Check className="w-3 h-3" strokeWidth={2.5} />
        ) : (
          <Copy className="w-3 h-3" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}
