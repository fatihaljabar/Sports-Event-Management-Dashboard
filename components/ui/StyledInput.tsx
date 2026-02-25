import { useState } from "react";

interface StyledInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
}

export function StyledInput({
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  suffix,
  disabled = false,
}: StyledInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="flex items-center relative rounded-xl overflow-hidden"
      style={{
        border: `1.5px solid ${focused ? "#2563EB" : "#E2E8F0"}`,
        backgroundColor: disabled ? "#F8FAFC" : "#FFFFFF",
        boxShadow: focused
          ? "0 0 0 3px rgba(37,99,235,0.08)"
          : "0 1px 2px rgba(0,0,0,0.03)",
        transition: "border-color 0.15s, box-shadow 0.15s",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {icon && (
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ paddingLeft: "12px", color: focused ? "#2563EB" : "#94A3B8" }}
        >
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => !disabled && setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        style={{
          flex: 1,
          padding: icon ? "0.625rem 0.75rem" : "0.625rem 0.875rem",
          backgroundColor: "transparent",
          border: "none",
          outline: "none",
          fontSize: "0.85rem",
          fontFamily: '"Inter", sans-serif',
          color: "#1E293B",
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
      {suffix && (
        <div
          className="flex items-center flex-shrink-0"
          style={{ paddingRight: "12px", color: "#94A3B8" }}
        >
          {suffix}
        </div>
      )}
    </div>
  );
}
