import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy key"
      className="flex items-center justify-center rounded-md transition-all flex-shrink-0"
      style={{
        width: "24px",
        height: "24px",
        backgroundColor: copied ? "#DCFCE7" : "transparent",
        border: `1px solid ${copied ? "#BBF7D0" : "#E2E8F0"}`,
        color: copied ? "#15803D" : "#94A3B8",
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9";
          (e.currentTarget as HTMLButtonElement).style.color = "#475569";
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
        }
      }}
    >
      {copied ? <Check className="w-3 h-3" strokeWidth={2.5} /> : <Copy className="w-3 h-3" strokeWidth={1.75} />}
    </button>
  );
}
