interface FieldLabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export function FieldLabel({ children, required }: FieldLabelProps) {
  return (
    <label
      style={{
        display: "block",
        color: "#374151",
        fontSize: "0.78rem",
        fontWeight: 600,
        fontFamily: '"Inter", sans-serif',
        letterSpacing: "0.01em",
        marginBottom: "6px",
      }}
    >
      {children}
      {required && (
        <span style={{ color: "#EF4444", marginLeft: "3px" }}>*</span>
      )}
    </label>
  );
}
