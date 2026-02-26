import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useEvents } from "@/lib/stores/event-store";
import { toast } from "sonner";
import {
  deleteEvent as deleteEventAction,
  archiveEvent as archiveEventAction,
  unarchiveEvent as unarchiveEventAction,
  duplicateEvent as duplicateEventAction,
  exportEventData,
} from "@/app/actions/events";
import type { SponsorLogoData, SportEvent as ApiSportEvent } from "@/lib/types/event";
import type {
  SportEvent,
  FilterTab,
  SortField,
  SortDirection,
  EventTypeFilter,
  EventManagementState,
} from "./types";
import { ITEMS_PER_PAGE } from "./constants";

export function useEventManagement() {
  const { events, deleteEvent: deleteEventFromStore, updateEvent: updateEventInStore, archiveEvent: archiveEventInStore, unarchiveEvent: unarchiveEventInStore, duplicateEvent: duplicateEventInStore, refreshEvents } = useEvents();

  // State
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filtersDropdownOpen, setFiltersDropdownOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ApiSportEvent | null>(null);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const filtersDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
      if (filtersDropdownRef.current && !filtersDropdownRef.current.contains(event.target as Node)) {
        setFiltersDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Convert events from store to component format
  const convertedEvents: SportEvent[] = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.map((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const daysUntil = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let daysVariant: SportEvent["daysVariant"] = "far";
      if (today > endDate) daysVariant = "ended";
      else if (daysUntil <= 7 && daysUntil >= 0) daysVariant = "urgent";
      else if (daysUntil <= 14 && daysUntil > 7) daysVariant = "warning";
      else if (daysUntil <= 30 && daysUntil > 14) daysVariant = "upcoming";

      const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      let daysLabel: string;
      if (today > endDate) {
        daysLabel = "Ended";
      } else {
        daysLabel = `${daysUntilEnd} Days Left`;
      }

      const formatDisplayDate = (date: Date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}`;
      };

      let calculatedStatus: SportEvent["status"] = "upcoming";
      if (event.status === "archived") {
        calculatedStatus = "archived";
      } else if (today > endDate) {
        calculatedStatus = "completed";
      } else if (today >= startDate && today <= endDate) {
        calculatedStatus = "active";
      } else if (today < startDate) {
        calculatedStatus = "upcoming";
      }

      const initials = event.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
      const emoji = event.sports[0]?.emoji || "🏆";

      return {
        id: event.id,
        logo: { bg: "linear-gradient(135deg,#2563EB,#7C3AED)", text: initials, emoji },
        name: event.name,
        type: event.type,
        startDate: formatDisplayDate(startDate),
        endDate: formatDisplayDate(endDate),
        startDateActual: startDate,
        endDateActual: endDate,
        daysLabel,
        daysVariant,
        status: calculatedStatus,
        sports: event.sports.map((s) => s.emoji),
        location: `${event.location.city}${event.location.venue ? `, ${event.location.venue}` : ""}`,
        usedKeys: event.usedKeys,
        totalKeys: event.totalKeys,
        logoUrl: event.logoUrl,
        sponsorLogos: event.sponsorLogos,
      };
    });
  }, [events]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: convertedEvents.length,
      active: convertedEvents.filter((e) => e.status === "active").length,
      inactive: convertedEvents.filter((e) => e.status === "inactive").length,
      upcoming: convertedEvents.filter((e) => e.status === "upcoming").length,
      completed: convertedEvents.filter((e) => e.status === "completed").length,
      archived: convertedEvents.filter((e) => e.status === "archived").length,
    };
  }, [convertedEvents]);

  // Filter and sort events
  const filtered = useMemo(() => {
    let result = convertedEvents;

    // Tab filter
    if (activeTab !== "all") {
      result = result.filter((e) => e.status === activeTab);
    }

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(searchLower) ||
          e.id.toLowerCase().includes(searchLower) ||
          e.location.toLowerCase().includes(searchLower)
      );
    }

    // Event type filter
    if (eventTypeFilter !== "all") {
      result = result.filter((e) => e.type === eventTypeFilter);
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison = a.startDateActual.getTime() - b.startDateActual.getTime();
          break;
        case "keys":
          comparison = (a.usedKeys / a.totalKeys) - (b.usedKeys / b.totalKeys);
          break;
        case "location":
          comparison = a.location.localeCompare(b.location);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [convertedEvents, activeTab, search, eventTypeFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedEvents = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleSortChange = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setSortDropdownOpen(false);
  }, [sortField, sortDirection]);

  const handleClearFilters = useCallback(() => {
    setEventTypeFilter("all");
    setSortField("date");
    setSortDirection("desc");
  }, []);

  const handleDeleteEvent = useCallback(async (eventId: string, eventName: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteEventAction(eventId);
      if (result.success) {
        deleteEventFromStore(eventId);
        setDeleteConfirm(null);
        toast("Event deleted successfully", {
          description: `"${eventName}" has been removed.`,
          className: "delete-toast",
        });
      } else {
        toast.error("Failed to delete event", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteEventFromStore]);

  const handleEditEvent = useCallback((eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setEditingEvent(event);
    }
  }, [events]);

  const handleArchiveEvent = useCallback(async (eventId: string, eventName: string, isArchived: boolean) => {
    try {
      if (isArchived) {
        const result = await unarchiveEventAction(eventId);
        if (result.success) {
          await refreshEvents();
          toast("Event restored successfully", {
            description: `"${eventName}" has been restored.`,
            className: "unarchive-toast",
          });
        } else {
          toast.error("Failed to restore event", {
            description: result.error || "Please try again.",
          });
        }
      } else {
        const result = await archiveEventAction(eventId);
        if (result.success) {
          archiveEventInStore(eventId);
          toast("Event archived", {
            description: `"${eventName}" has been archived.`,
            className: "archive-toast",
          });
        } else {
          toast.error("Failed to archive event", {
            description: result.error || "Please try again.",
          });
        }
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, [archiveEventInStore, refreshEvents]);

  const handleDuplicateEvent = useCallback(async (eventId: string) => {
    try {
      const result = await duplicateEventAction(eventId);
      if (result.success && result.event) {
        duplicateEventInStore(result.event);
        toast.success("Event duplicated successfully", {
          description: `A copy of "${result.event.name}" has been created.`,
        });
      } else {
        toast.error("Failed to duplicate event", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, [duplicateEventInStore]);

  const handleExportEvent = useCallback(async (eventId: string, eventName: string) => {
    try {
      const result = await exportEventData(eventId);
      if (result.success) {
        toast.success("Event exported successfully", {
          description: `"${eventName}" data has been exported.`,
        });
      } else {
        toast.error("Failed to export event", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, []);

  const hasActiveFilters = eventTypeFilter !== "all" || sortField !== "date" || sortDirection !== "desc";

  return {
    // State
    activeTab,
    setActiveTab,
    search,
    setSearch,
    sortField,
    sortDirection,
    setSortDirection,
    eventTypeFilter,
    setEventTypeFilter,
    currentPage,
    setCurrentPage,
    hoveredRow,
    setHoveredRow,
    deleteConfirm,
    setDeleteConfirm,
    isDeleting,
    sortDropdownOpen,
    setSortDropdownOpen,
    filtersDropdownOpen,
    setFiltersDropdownOpen,
    editingEvent,
    setEditingEvent,
    sortDropdownRef,
    filtersDropdownRef,

    // Data
    convertedEvents,
    filtered,
    paginatedEvents,
    tabCounts,
    totalPages,
    hasActiveFilters,
    ITEMS_PER_PAGE,

    // Handlers
    handleSortChange,
    handleClearFilters,
    handleDeleteEvent,
    handleEditEvent,
    handleArchiveEvent,
    handleDuplicateEvent,
    handleExportEvent,
    refreshEvents,
  };
}
