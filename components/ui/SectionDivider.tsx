interface SectionDividerProps {
  label: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="flex items-center gap-3" style={{ margin: "4px 0 2px" }}>
      <span
        style={{
          color: "#94A3B8",
          fontSize: "0.65rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontFamily: '"Inter", sans-serif',
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", backgroundColor: "#F1F5F9" }} />
    </div>
  );
}
