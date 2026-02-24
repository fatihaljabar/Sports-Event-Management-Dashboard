import React, { useState } from "react";
import { Search, Bell, Plus, ChevronRight, Home } from "lucide-react";

interface TopHeaderProps {
  onCreateEvent: () => void;
}

export function TopHeader({ onCreateEvent }: TopHeaderProps) {
  const [notifications] = useState(4);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header
      className="flex-shrink-0 flex items-center gap-4 px-6 py-3 z-20"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #F1F5F9",
        boxShadow: "0px 1px 8px rgba(0,0,0,0.04)",
        height: "60px",
      }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 flex-shrink-0">
        <Home className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} strokeWidth={1.75} />
        <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} strokeWidth={2} />
        <span
          style={{
            color: "#94A3B8",
            fontSize: "0.8rem",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Home
        </span>
        <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} strokeWidth={2} />
        <span
          style={{
            color: "#1E293B",
            fontSize: "0.8rem",
            fontWeight: 500,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Dashboard
        </span>
      </nav>

      {/* Search Bar */}
      <div className="flex-1 flex justify-center">
        <div
          className="relative flex items-center"
          style={{ maxWidth: "440px", width: "100%" }}
        >
          <Search
            className="absolute left-3 w-4 h-4"
            style={{ color: "#94A3B8" }}
            strokeWidth={1.75}
          />
          <input
            type="text"
            placeholder="Search athletes, events, keys…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-lg outline-none transition-all"
            style={{
              paddingLeft: "2.25rem",
              paddingRight: "1rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              backgroundColor: "#F8FAFC",
              border: "1.5px solid #E2E8F0",
              fontSize: "0.8rem",
              fontFamily: '"Inter", sans-serif',
              color: "#1E293B",
            }}
            onFocus={(e) =>
              ((e.target as HTMLInputElement).style.borderColor = "#2563EB")
            }
            onBlur={(e) =>
              ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")
            }
          />
          <kbd
            className="absolute right-3 rounded flex items-center gap-0.5 hidden sm:flex"
            style={{
              backgroundColor: "#F1F5F9",
              border: "1px solid #E2E8F0",
              padding: "1px 6px",
              fontSize: "0.6rem",
              color: "#94A3B8",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: "#64748B" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
          }
        >
          <Bell className="w-5 h-5" strokeWidth={1.75} />
          {notifications > 0 && (
            <span
              className="absolute top-1 right-1 flex items-center justify-center rounded-full"
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: "#EF4444",
                color: "#fff",
                fontSize: "0.55rem",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 500,
              }}
            >
              {notifications}
            </span>
          )}
        </button>

        {/* Divider */}
        <div
          className="h-6"
          style={{ width: "1px", backgroundColor: "#E2E8F0" }}
        />

        {/* Create Event FAB */}
        <button
          onClick={onCreateEvent}
          className="flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-150 active:scale-95"
          style={{
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            boxShadow: "0px 4px 14px rgba(37, 99, 235, 0.35)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1D4ED8")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2563EB")
          }
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "0.01em",
            }}
          >
            Create Event
          </span>
        </button>
      </div>
    </header>
  );
}
