import type { LicenseType } from "../types";

interface LicenseBadgeProps {
  label: string;
  type?: LicenseType;
}

const STYLES = {
  fifa: { bg: "#eff6ff", color: "#1d4ed8" },
  afc: { bg: "#f0fdf4", color: "#15803d" },
  pssi: { bg: "#faf5ff", color: "#7c3aed" },
};

export function LicenseBadge({ label, type }: LicenseBadgeProps) {
  const t = type ?? "pssi";
  const s = STYLES[t];

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: s.bg,
        color: s.color,
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

export function getLicenseType(license: string): LicenseType {
  if (license.startsWith("UEFA") || license === "FIFA Badge") return "fifa";
  if (license.startsWith("AFC")) return "afc";
  return "pssi";
}
