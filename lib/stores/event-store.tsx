"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SportEvent } from "@/lib/types/event";
import { getEvents as fetchEvents } from "@/app/actions/events";

interface EventContextType {
  events: SportEvent[];
  isLoading: boolean;
  addEvent: (event: SportEvent) => void;
  updateEvent: (id: string, event: Partial<SportEvent>) => void;
  deleteEvent: (id: string) => void;
  archiveEvent: (id: string) => void;
  unarchiveEvent: (id: string, newStatus: SportEvent["status"]) => void;
  duplicateEvent: (event: SportEvent) => void;
  getEventById: (id: string) => SportEvent | undefined;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

/** Polling interval for events data (10 seconds) */
const EVENTS_REFETCH_INTERVAL = 10000;

/** Query key for fetching all events */
const EVENTS_QUERY_KEY = ["events"] as const;

// ═══════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════

/**
 * EventProvider - Manages events state with TanStack Query polling
 *
 * Features:
 * - Auto-polling every 10 seconds via TanStack Query
 * - Pauses polling when tab is inactive (Page Visibility API)
 * - Optimistic updates for mutations (add, update, delete, etc.)
 * - Automatic cache invalidation with query keys
 */
export function EventProvider({ children }: { children: React.ReactNode }) {
  // Local state for optimistic updates
  const [optimisticEvents, setOptimisticEvents] = useState<SportEvent[]>([]);

  // Track if we have optimistic updates pending
  const hasOptimisticUpdatesRef = useRef(false);

  // ═══════════════════════════════════════════════════════════════
  // PAGE VISIBILITY TRACKING
  // ═══════════════════════════════════════════════════════════════

  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // FETCH EVENTS WITH TANSTACK QUERY (POLLING)
  // ═══════════════════════════════════════════════════════════════

  const {
    data: fetchedEvents = [],
    isLoading: isLoading,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: async () => {
      const events = await fetchEvents();
      return events;
    },
    refetchInterval: isTabVisible ? EVENTS_REFETCH_INTERVAL : false, // Pause when tab hidden
    refetchIntervalInBackground: false, // Never poll when tab is background
    refetchOnWindowFocus: false, // Don't refetch on tab switch (we use interval)
    staleTime: 5000, // Consider data fresh for 5 seconds
    retry: 1, // Only retry once on failure
  });

  // Use optimistic events if we have pending updates, otherwise use fetched data
  const events = hasOptimisticUpdatesRef.current ? optimisticEvents : fetchedEvents;

  // ═══════════════════════════════════════════════════════════════
  // MUTATION HANDLERS (OPTIMISTIC UPDATES)
  // ═══════════════════════════════════════════════════════════════

  const refreshEvents = useCallback(async () => {
    await refetchEvents();
  }, [refetchEvents]);

  const addEvent = useCallback((event: SportEvent) => {
    setOptimisticEvents((prev) => [...prev, event]);
    hasOptimisticUpdatesRef.current = true;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<SportEvent>) => {
    setOptimisticEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
    hasOptimisticUpdatesRef.current = true;
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setOptimisticEvents((prev) => prev.filter((event) => event.id !== id));
    hasOptimisticUpdatesRef.current = true;
  }, []);

  const archiveEvent = useCallback((id: string) => {
    setOptimisticEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, status: "archived" as const } : event))
    );
    hasOptimisticUpdatesRef.current = true;
  }, []);

  const unarchiveEvent = useCallback((id: string, newStatus: SportEvent["status"]) => {
    setOptimisticEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, status: newStatus } : event))
    );
    hasOptimisticUpdatesRef.current = true;
  }, []);

  const duplicateEvent = useCallback((newEvent: SportEvent) => {
    setOptimisticEvents((prev) => [...prev, newEvent]);
    hasOptimisticUpdatesRef.current = true;
  }, []);

  const getEventById = useCallback(
    (id: string) => events.find((event) => event.id === id),
    [events]
  );

  // Clear optimistic updates flag after data is fetched from server
  useEffect(() => {
    if (fetchedEvents.length > 0 && hasOptimisticUpdatesRef.current) {
      hasOptimisticUpdatesRef.current = false;
    }
  }, [fetchedEvents]);

  return (
    <EventContext.Provider
      value={{
        events,
        isLoading,
        addEvent,
        updateEvent,
        deleteEvent,
        archiveEvent,
        unarchiveEvent,
        duplicateEvent,
        getEventById,
        refreshEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within EventProvider");
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════
// UTILITY: INVALIDATE EVENTS QUERY
// ═══════════════════════════════════════════════════════════════

/**
 * Hook to invalidate events query (for use after mutations)
 * This can be imported in Server Actions or mutation handlers
 */
import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateEvents() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
  }, [queryClient]);
}
