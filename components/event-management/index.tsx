import { Plus, ArrowUpDown, ChevronDown, Search, SlidersHorizontal, CheckCircle2, X } from "lucide-react";
import { EditEventModal } from "./EditEventModal";
import { TABS, SORT_OPTIONS, EVENT_TYPE_OPTIONS } from "./constants";
import { useEventManagement } from "./use-event-management";
import { EventTable } from "./EventTable";

interface EventManagementPageProps {
  onCreateEvent: () => void;
  onEventClick: (eventId: string) => void;
}

export function EventManagementPage({ onCreateEvent, onEventClick }: EventManagementPageProps) {
  const {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    hoveredRow,
    setHoveredRow,
    deleteConfirm,
    setDeleteConfirm,
    isDeleting,
    editingEvent,
    setEditingEvent,
    paginatedEvents,
    convertedEvents,
    tabCounts,
    filtered,
    sortField,
    sortDirection,
    setSortDirection,
    eventTypeFilter,
    setEventTypeFilter,
    sortDropdownOpen,
    setSortDropdownOpen,
    filtersDropdownOpen,
    setFiltersDropdownOpen,
    sortDropdownRef,
    filtersDropdownRef,
    hasActiveFilters,
    currentPage,
    totalPages,
    setCurrentPage,
    handleDeleteEvent,
    handleEditEvent,
    handleArchiveEvent,
    handleDuplicateEvent,
    handleExportEvent,
    handleSortChange,
    handleClearFilters,
    refreshEvents,
  } = useEventManagement();

  const handlers = {
    onEventClick,
    onDelete: handleDeleteEvent,
    onEdit: handleEditEvent,
    onArchive: handleArchiveEvent,
    onDuplicate: handleDuplicateEvent,
    onExport: handleExportEvent,
  };

  return (
    <main
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <div className="px-6 py-6" style={{ maxWidth: "1600px" }}>
        {/* ══════  PAGE HEADER  ══════ */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {/* Breadcrumb micro */}
              <span
                style={{
                  color: "#94A3B8",
                  fontSize: "0.72rem",
                }}
              >
                Dashboard
              </span>
              <span style={{ color: "#CBD5E1", fontSize: "0.72rem" }}>/</span>
              <span
                style={{
                  color: "#2563EB",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                }}
              >
                Event Management
              </span>
            </div>
            <h1
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 700,
                fontSize: "2.25rem",
                color: "#0F172A",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              Events Directory
            </h1>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.82rem",
                marginTop: "0.4rem",
              }}
            >
              {convertedEvents.length} total events &nbsp;·&nbsp;
              <span style={{ color: "#22C55E", fontWeight: 500 }}>
                {tabCounts.active} active
              </span>
              &nbsp;·&nbsp;
              <span style={{ color: "#3B82F6" }}>
                {tabCounts.upcoming} upcoming
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filters button */}
            <div ref={filtersDropdownRef} className="relative">
              <button
                onClick={() => setFiltersDropdownOpen(!filtersDropdownOpen)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all"
                style={{
                  border: hasActiveFilters
                    ? "1.5px solid #2563EB"
                    : "1.5px solid #E2E8F0",
                  backgroundColor: hasActiveFilters ? "#EFF6FF" : "#FFFFFF",
                  color: hasActiveFilters ? "#1D4ED8" : "#64748B",
                  fontSize: "0.82rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  if (!hasActiveFilters) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#CBD5E1";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#F8FAFC";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!hasActiveFilters) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#E2E8F0";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#FFFFFF";
                  }
                }}
              >
                <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
                Filters
                {hasActiveFilters && (
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#2563EB",
                      color: "#FFFFFF",
                      fontSize: "0.6rem",
                      fontWeight: 600,
                    }}
                  >
                    •
                  </span>
                )}
              </button>

              {/* Filters Dropdown */}
              {filtersDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 rounded-xl shadow-xl z-50"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    minWidth: "220px",
                    padding: "8px",
                  }}
                >
                  <div
                    className="flex items-center justify-between px-2 py-2"
                    style={{
                      borderBottom: "1px solid #F1F5F9",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: "#374151",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      Filters
                    </span>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="flex items-center gap-1 rounded px-2 py-1 transition-all"
                        style={{
                          backgroundColor: "#FEE2E2",
                          color: "#DC2626",
                          fontSize: "0.65rem",
                          fontWeight: 500,
                          fontFamily: '"Inter", sans-serif',
                          border: "none",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#FECACA";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#FEE2E2";
                        }}
                      >
                        <X className="w-3 h-3" strokeWidth={2} />
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Event Type Filter */}
                  <div style={{ marginBottom: "8px" }}>
                    <p
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontFamily: '"Inter", sans-serif',
                        marginBottom: "6px",
                        paddingLeft: "8px",
                      }}
                    >
                      Event Type
                    </p>
                    <div className="flex flex-col gap-1">
                      {EVENT_TYPE_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setEventTypeFilter(opt.id)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all text-left"
                          style={{
                            backgroundColor:
                              eventTypeFilter === opt.id
                                ? "#EFF6FF"
                                : "transparent",
                            border:
                              eventTypeFilter === opt.id
                                ? "1px solid #BFDBFE"
                                : "1px solid transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (eventTypeFilter !== opt.id)
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor = "#F8FAFC";
                          }}
                          onMouseLeave={(e) => {
                            if (eventTypeFilter !== opt.id)
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor = "transparent";
                          }}
                        >
                          <span
                            style={{
                              color:
                                eventTypeFilter === opt.id
                                  ? "#2563EB"
                                  : "#94A3B8",
                            }}
                          >
                            {opt.icon}
                          </span>
                          <span
                            style={{
                              color:
                                eventTypeFilter === opt.id
                                  ? "#1D4ED8"
                                  : "#64748B",
                              fontSize: "0.75rem",
                              fontWeight:
                                eventTypeFilter === opt.id ? 500 : 400,
                              fontFamily: '"Inter", sans-serif',
                            }}
                          >
                            {opt.label}
                          </span>
                          {eventTypeFilter === opt.id && (
                            <CheckCircle2
                              className="w-3.5 h-3.5 ml-auto"
                              style={{ color: "#2563EB" }}
                              strokeWidth={2}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Sort Display */}
                  <div
                    style={{
                      padding: "8px",
                      backgroundColor: "#F8FAFC",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.6rem",
                        fontWeight: 500,
                        fontFamily: '"Inter", sans-serif',
                        marginBottom: "4px",
                      }}
                    >
                      Current Sort
                    </p>
                    <p
                      style={{
                        color: "#374151",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {SORT_OPTIONS.find((s) => s.field === sortField)?.label}{" "}
                      {sortDirection === "asc" ? "(↑)" : "(↓)"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Create Event */}
            <button
              onClick={onCreateEvent}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                color: "#FFFFFF",
                fontSize: "0.84rem",
                fontWeight: 600,
                boxShadow: "0px 4px 16px rgba(37,99,235,0.32)",
                border: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#1D4ED8,#1E40AF)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0px 6px 20px rgba(37,99,235,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#2563EB,#1D4ED8)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0px 4px 16px rgba(37,99,235,0.32)";
              }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Create Event
            </button>
          </div>
        </div>

        {/* ══════  MAIN CARD  ══════ */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 24px rgba(0,0,0,0.06)",
            border: "1px solid #F1F5F9",
          }}
        >
          {/* ── Toolbar Row ── */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            {/* Filter Tabs */}
            <div className="flex items-center gap-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const count = tab.id === "all" ? tabCounts.all : (tabCounts[tab.id] ?? 0);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                    style={{
                      backgroundColor: isActive ? "#EFF6FF" : "transparent",
                      border: `1.5px solid ${isActive ? "#BFDBFE" : "transparent"}`,
                      color: isActive ? "#1D4ED8" : "#64748B",
                      fontSize: "0.8rem",
                      fontWeight: isActive ? 600 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    }}
                  >
                    <span style={{ color: isActive ? "#2563EB" : "#94A3B8" }}>
                      {tab.icon}
                    </span>
                    {tab.label}
                    <CountBadge count={count} active={isActive} />
                  </button>
                );
              })}
            </div>

            {/* Right: Search + sort */}
            <div className="flex items-center gap-3">
              <div
                className="relative flex items-center"
                style={{ width: "240px" }}
              >
                <Search
                  className="absolute left-3 w-3.5 h-3.5"
                  strokeWidth={1.75}
                  style={{ color: "#94A3B8" }}
                />
                <input
                  type="text"
                  placeholder="Search events…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg outline-none transition-all"
                  style={{
                    paddingLeft: "2rem",
                    paddingRight: "0.75rem",
                    paddingTop: "0.45rem",
                    paddingBottom: "0.45rem",
                    backgroundColor: "#F8FAFC",
                    border: "1.5px solid #E2E8F0",
                    fontSize: "0.78rem",
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

              <div ref={sortDropdownRef} className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                  style={{
                    border: "1.5px solid #E2E8F0",
                    backgroundColor: sortDropdownOpen ? "#F1F5F9" : "#F8FAFC",
                    color: "#64748B",
                    fontSize: "0.78rem",
                    fontFamily: '"Inter", sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#CBD5E1";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#F1F5F9";
                  }}
                  onMouseLeave={(e) => {
                    if (!sortDropdownOpen) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "#E2E8F0";
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "#F8FAFC";
                    }
                  }}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Sort
                  <ChevronDown
                    className="w-3 h-3 transition-transform"
                    style={{
                      transform: sortDropdownOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                    strokeWidth={2}
                  />
                </button>

                {/* Sort Dropdown */}
                {sortDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 rounded-xl shadow-xl z-50"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      minWidth: "180px",
                      padding: "6px",
                    }}
                  >
                    <p
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontFamily: '"Inter", sans-serif',
                        marginBottom: "6px",
                        paddingLeft: "8px",
                      }}
                    >
                      Sort by
                    </p>
                    <div className="flex flex-col gap-1">
                      {SORT_OPTIONS.map((opt) => {
                        const isActive = sortField === opt.field;
                        return (
                          <button
                            key={opt.field}
                            onClick={() => handleSortChange(opt.field)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all text-left"
                            style={{
                              backgroundColor: isActive
                                ? "#EFF6FF"
                                : "transparent",
                              border: isActive
                                ? "1px solid #BFDBFE"
                                : "1px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive)
                                (
                                  e.currentTarget as HTMLButtonElement
                                ).style.backgroundColor = "#F8FAFC";
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive)
                                (
                                  e.currentTarget as HTMLButtonElement
                                ).style.backgroundColor = "transparent";
                            }}
                          >
                            <span
                              style={{
                                color: isActive ? "#2563EB" : "#94A3B8",
                              }}
                            >
                              {opt.icon}
                            </span>
                            <span
                              style={{
                                color: isActive ? "#1D4ED8" : "#64748B",
                                fontSize: "0.75rem",
                                fontWeight: isActive ? 500 : 400,
                                fontFamily: '"Inter", sans-serif',
                                flex: 1,
                              }}
                            >
                              {opt.label}
                            </span>
                            {isActive && (
                              <span
                                style={{
                                  color: "#2563EB",
                                  fontSize: "0.65rem",
                                  fontFamily: '"JetBrains Mono", monospace',
                                }}
                              >
                                {sortDirection === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Toggle direction */}
                    <div
                      className="flex items-center justify-between rounded-lg px-3 py-2 mt-1 cursor-pointer transition-all"
                      style={{
                        borderTop: "1px solid #F1F5F9",
                        paddingTop: "10px",
                      }}
                      onClick={() =>
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc",
                        )
                      }
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLDivElement
                        ).style.backgroundColor = "#F8FAFC";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLDivElement
                        ).style.backgroundColor = "transparent";
                      }}
                    >
                      <span
                        style={{
                          color: "#64748B",
                          fontSize: "0.7rem",
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        Direction
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          style={{
                            color:
                              sortDirection === "asc" ? "#2563EB" : "#CBD5E1",
                            fontSize: "0.75rem",
                            fontWeight: sortDirection === "asc" ? 600 : 400,
                          }}
                        >
                          Asc
                        </span>
                        <span style={{ color: "#E2E8F0", fontSize: "0.6rem" }}>
                          |
                        </span>
                        <span
                          style={{
                            color:
                              sortDirection === "desc" ? "#2563EB" : "#CBD5E1",
                            fontSize: "0.75rem",
                            fontWeight: sortDirection === "desc" ? 600 : 400,
                          }}
                        >
                          Desc
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Table ── */}
          <EventTable
            events={paginatedEvents}
            hoveredRow={hoveredRow}
            deleteConfirm={deleteConfirm}
            onHover={setHoveredRow}
            setDeleteConfirm={setDeleteConfirm}
            handlers={handlers}
            isDeleting={isDeleting}
          />

          {/* ── Footer ── */}
          <TableFooter
            filteredCount={filtered.length}
            totalCount={convertedEvents.length}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <div style={{ height: "32px" }} />
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onUpdate={async () => {
            setEditingEvent(null);
            await refreshEvents();
          }}
        />
      )}
    </main>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function CountBadge({ count, active }: { count: number; active: boolean }) {
  return (
    <span
      className="flex items-center justify-center rounded-full"
      style={{
        minWidth: "18px",
        height: "18px",
        padding: "0 5px",
        backgroundColor: active ? "#2563EB" : "#F1F5F9",
        color: active ? "#FFFFFF" : "#94A3B8",
        fontSize: "0.6rem",
        fontFamily: '"JetBrains Mono", monospace',
        fontWeight: 600,
      }}
    >
      {count}
    </span>
  );
}

function TableFooter({
  filteredCount,
  totalCount,
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  filteredCount: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}) {
  return (
    <div
      className="flex items-center justify-between px-6 py-3"
      style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}
    >
      <span
        style={{
          color: "#94A3B8",
          fontSize: "0.75rem",
        }}
      >
        Showing{" "}
        <span style={{ color: "#374151", fontWeight: 500 }}>
          {filteredCount}
        </span>{" "}
        of{" "}
        <span style={{ color: "#374151", fontWeight: 500 }}>
          {totalCount}
        </span>{" "}
        events
        {totalPages > 1 && (
          <span style={{ color: "#CBD5E1", marginLeft: "8px" }}>
            · Page {currentPage} of {totalPages}
          </span>
        )}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {/* Previous button */}
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "transparent",
              color: currentPage === 1 ? "#CBD5E1" : "#64748B",
              fontSize: "0.78rem",
              fontFamily: '"JetBrains Mono", monospace',
              border: "1.5px solid #E2E8F0",
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
            }}
          >
            ‹
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
            let pageNum;
            if (totalPages <= 3) {
              pageNum = i + 1;
            } else if (currentPage === 1) {
              pageNum = i + 1;
            } else if (currentPage === totalPages) {
              pageNum = totalPages - 2 + i;
            } else {
              pageNum = currentPage - 1 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className="flex items-center justify-center rounded-lg transition-all"
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor:
                    currentPage === pageNum ? "#2563EB" : "transparent",
                  color: currentPage === pageNum ? "#FFFFFF" : "#64748B",
                  fontSize: "0.78rem",
                  fontFamily: '"JetBrains Mono", monospace',
                  border: `1.5px solid ${currentPage === pageNum ? "#2563EB" : "#E2E8F0"}`,
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== pageNum) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== pageNum) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                  }
                }}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next button */}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "transparent",
              color: currentPage === totalPages ? "#CBD5E1" : "#64748B",
              fontSize: "0.78rem",
              fontFamily: '"JetBrains Mono", monospace',
              border: "1.5px solid #E2E8F0",
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
