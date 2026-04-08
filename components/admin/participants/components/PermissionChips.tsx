interface PermissionChipsProps {
  perms: string[];
}

export function PermissionChips({ perms }: PermissionChipsProps) {
  const visible = perms.slice(0, 2);
  const overflow = perms.length - 2;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((p) => (
        <span
          key={p}
          className="rounded-md px-1.5 py-0.5"
          style={{
            backgroundColor: "#F1F5F9",
            color: "#475569",
            fontSize: "0.6rem",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            whiteSpace: "nowrap",
            border: "1px solid #E2E8F0",
          }}
        >
          {p}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="rounded-md px-1.5 py-0.5"
          style={{
            backgroundColor: "#F8FAFC",
            color: "#94A3B8",
            fontSize: "0.6rem",
            fontFamily: '"Inter", sans-serif',
            border: "1px solid #E2E8F0",
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
