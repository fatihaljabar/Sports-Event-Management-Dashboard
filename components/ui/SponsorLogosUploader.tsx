"use client";

import { useRef, useCallback } from "react";
import { Upload, X, CheckCircle2 } from "lucide-react";

export interface UploadedFile {
  name: string;
  size: string;
  preview: string | null;
}

interface SponsorLogosUploaderProps {
  logos: UploadedFile[];
  onAdd: (file: UploadedFile) => void;
  onRemove: (index: number) => void;
  accentColor?: string;
}

const MAX_LOGOS = 5;

export function SponsorLogosUploader({
  logos,
  onAdd,
  onRemove,
  accentColor = "#7C3AED",
}: SponsorLogosUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (logos.length >= MAX_LOGOS) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        onAdd({
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          preview: null,
        });
      }
    },
    [logos.length, onAdd]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (logos.length >= MAX_LOGOS) return;

    const file = e.target.files?.[0];
    if (file) {
      onAdd({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        preview: null,
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => {}}
        onDrop={handleDrop}
        className="relative rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all"
        style={{
          border: `2px dashed ${logos.length >= MAX_LOGOS ? "#E2E8F0" : "#CBD5E1"}`,
          backgroundColor: logos.length >= MAX_LOGOS ? "#F8FAFC" : "#FAFBFC",
          minHeight: "80px",
          padding: "12px",
          opacity: logos.length >= MAX_LOGOS ? 0.6 : 1,
          pointerEvents: logos.length >= MAX_LOGOS ? "none" : "auto",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={logos.length >= MAX_LOGOS}
        />

        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: logos.length >= MAX_LOGOS ? "#F1F5F9" : "#F1F5F9",
            }}
          >
            <Upload
              className="w-4 h-4"
              strokeWidth={1.75}
              style={{ color: logos.length >= MAX_LOGOS ? "#94A3B8" : accentColor }}
            />
          </div>
          <div>
            <p
              style={{
                color: logos.length >= MAX_LOGOS ? "#94A3B8" : "#374151",
                fontSize: "0.72rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {logos.length >= MAX_LOGOS
                ? "Maximum 5 sponsor logos"
                : "Add sponsor logo"}
            </p>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.62rem",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              PNG, SVG · Max 2 MB
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded logos list */}
      {logos.length > 0 && (
        <div className="space-y-2">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{
                backgroundColor: `${accentColor}08`,
                border: `1px solid ${accentColor}20`,
              }}
            >
              <CheckCircle2
                className="w-4 h-4 flex-shrink-0"
                strokeWidth={2}
                style={{ color: accentColor }}
              />
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    color: "#1E293B",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    fontFamily: '"Inter", sans-serif',
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {logo.name}
                </p>
                <p
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.6rem",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {logo.size}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="flex items-center justify-center rounded-full flex-shrink-0 transition-all"
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#FEF2F2",
                  border: "1.5px solid #FECACA",
                  color: "#EF4444",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEE2E2";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#FCA5A5";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEF2F2";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#FECACA";
                }}
                title="Remove sponsor logo"
              >
                <X className="w-3 h-3" strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      {logos.length > 0 && (
        <p
          style={{
            color: accentColor,
            fontSize: "0.65rem",
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {logos.length} / {MAX_LOGOS} sponsor logos
        </p>
      )}
    </div>
  );
}
