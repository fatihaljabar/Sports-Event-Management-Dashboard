import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Plus, ChevronRight, Home, Calendar, Key, Users, Trophy } from "lucide-react";
import { useNotification, NotificationItem } from "@/components/contexts/NotificationContext";

// Get notification icon based on type - moved outside component for performance
const getNotificationIcon = (type: NotificationItem["type"]) => {
  switch (type) {
    case "event":
      return <Calendar className="w-4 h-4" style={{ color: "#2563EB" }} />;
    case "key":
      return <Key className="w-4 h-4" style={{ color: "#7C3AED" }} />;
    case "participant":
      return <Users className="w-4 h-4" style={{ color: "#059669" }} />;
    case "result":
      return <Trophy className="w-4 h-4" style={{ color: "#F59E0B" }} />;
  }
};

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isClickable?: boolean;
}

interface TopHeaderProps {
  onCreateEvent: () => void;
  onSearch?: (query: string) => void;
  breadcrumbs?: BreadcrumbItem[];
}

export function TopHeader({ onCreateEvent, onSearch, breadcrumbs }: TopHeaderProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use NotificationContext
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Default breadcrumbs for dashboard home
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/", isClickable: true },
    { label: "Dashboard", href: "/", isClickable: true },
  ];

  const breadcrumbList = breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchValue);
    }
  }, [onSearch, searchValue]);

  const handleBreadcrumbClick = useCallback((item: BreadcrumbItem, index: number) => {
    // Don't navigate if it's the last item (current page) or not clickable
    if (index === breadcrumbList.length - 1 || !item.isClickable || !item.href) {
      return;
    }
    router.push(item.href);
  }, [router, breadcrumbs]);

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
        {breadcrumbList.map((item, index) => (
          <React.Fragment key={index}>
            {index === 0 ? (
              // First item - show Home icon only (no text)
              <Home
                className="w-3.5 h-3.5"
                style={{
                  color: item.isClickable && index < breadcrumbList.length - 1 ? "#94A3B8" : "#1E293B",
                  cursor: item.isClickable && index < breadcrumbList.length - 1 ? "pointer" : "default"
                }}
                strokeWidth={1.75}
                onClick={() => handleBreadcrumbClick(item, index)}
              />
            ) : (
              // Other items - show ChevronRight + label
              <>
                <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} strokeWidth={2} />
                <span
                  style={{
                    color: index === breadcrumbList.length - 1 ? "#1E293B" : "#94A3B8",
                    fontSize: "0.8rem",
                    fontWeight: index === breadcrumbList.length - 1 ? 500 : 400,
                    fontFamily: '"Inter", sans-serif',
                    cursor: item.isClickable && index < breadcrumbList.length - 1 ? "pointer" : "default",
                  }}
                  onClick={() => handleBreadcrumbClick(item, index)}
                >
                  {item.label}
                </span>
              </>
            )}
          </React.Fragment>
        ))}
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
            onKeyDown={handleSearchKeyDown}
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
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: "#64748B" }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
            }
          >
            <Bell className="w-5 h-5" strokeWidth={1.75} />
            {unreadCount > 0 && (
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
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 rounded-xl shadow-xl z-50"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                width: "380px",
                maxHeight: "470px",
                overflow: "hidden",
              }}
            >
              {/* Dropdown Header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid #F1F5F9" }}
              >
                <span
                  style={{
                    color: "#0F172A",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      color: "#2563EB",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      fontFamily: '"Inter", sans-serif',
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = "#1D4ED8")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = "#2563EB")
                    }
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="overflow-y-auto" style={{ maxHeight: "380px" }}>
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: "#CBD5E1" }} />
                    <p style={{ color: "#94A3B8", fontSize: "0.8rem" }}>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex gap-3 px-4 py-3 transition-colors cursor-pointer"
                      style={{
                        backgroundColor: notification.isRead ? "#FFFFFF" : "#F8FAFC",
                        borderBottom: "1px solid #F8FAFC",
                      }}
                      onClick={() => markAsRead(notification.id)}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.backgroundColor = "#F8FAFC")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.backgroundColor = notification.isRead ? "#FFFFFF" : "#F8FAFC")
                      }
                    >
                      {/* Icon */}
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: notification.isRead ? "#F1F5F9" : "#EFF6FF",
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            style={{
                              color: "#0F172A",
                              fontSize: "0.8rem",
                              fontWeight: notification.isRead ? 400 : 500,
                              fontFamily: '"Inter", sans-serif',
                            }}
                          >
                            {notification.title}
                          </span>
                          {!notification.isRead && (
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: "#2563EB" }}
                            />
                          )}
                        </div>
                        <p
                          style={{
                            color: "#64748B",
                            fontSize: "0.75rem",
                            fontFamily: '"Inter", sans-serif',
                            marginTop: "2px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {notification.message}
                        </p>
                        <span
                          style={{
                            color: "#94A3B8",
                            fontSize: "0.65rem",
                            fontFamily: '"JetBrains Mono", monospace',
                            marginTop: "4px",
                            display: "inline-block",
                          }}
                        >
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div
                className="px-4 py-3 flex justify-center"
                style={{ borderTop: "1px solid #F1F5F9" }}
              >
                <button
                  style={{
                    color: "#2563EB",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    fontFamily: '"Inter", sans-serif',
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = "#1D4ED8")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = "#2563EB")
                  }
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

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
