"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
 * - Optimistic updates via queryClient.setQueryData
 * - No race conditions with fetched data
 */
export function EventProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

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
    data: events = [],
    isLoading,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: async () => {
      const events = await fetchEvents();
      return events;
    },
    refetchInterval: isTabVisible ? EVENTS_REFETCH_INTERVAL : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    retry: 1,
  });

  // ═══════════════════════════════════════════════════════════════
  // MUTATION HANDLERS (OPTIMISTIC UPDATES VIA CACHE)
  // ═══════════════════════════════════════════════════════════════

  const refreshEvents = useCallback(async () => {
    await refetchEvents();
  }, [refetchEvents]);

  const addEvent = useCallback((event: SportEvent) => {
    // Optimistic update via cache
    queryClient.setQueryData(EVENTS_QUERY_KEY, (old: SportEvent[] | undefined) => {
      return [...(old ?? []), event];
    });
  }, [queryClient]);

  const updateEvent = useCallback((id: string, updates: Partial<SportEvent>) => {
    queryClient.setQueryData(EVENTS_QUERY_KEY, (old: SportEvent[] | undefined) => {
      return old?.map((event) => (event.id === id ? { ...event, ...updates } : event)) ?? [];
    });
  }, [queryClient]);

  const deleteEvent = useCallback((id: string) => {
    // Optimistic update via cache
    queryClient.setQueryData(EVENTS_QUERY_KEY, (old: SportEvent[] | undefined) => {
      return old?.filter((event) => event.id !== id) ?? [];
    });
  }, [queryClient]);

  const archiveEvent = useCallback((id: string) => {
    queryClient.setQueryData(EVENTS_QUERY_KEY, (old: SportEvent[] | undefined) => {
      return old?.map((event) => (event.id === id ? { ...event, status: "archived" as const } : event)) ?? [];
    });
  }, [queryClient]);

  const unarchiveEvent = useCallback((id: string, newStatus: SportEvent["status"]) => {
    queryClient.setQueryData(EVENTS_QUERY_KEY, (old: SportEvent[] | undefined) => {
      return old?.map((event) => (event.id === id ? { ...event, status: newStatus } : event)) ?? [];
    });
  }, [queryClient]);

  const duplicateEvent = useCallback((newEvent: SportEvent) => {
    queryClient.setQueryData(EVENTS_QUERY_KEY, (old: SportEvent[] | undefined) => {
      return [...(old ?? []), newEvent];
    });
  }, [queryClient]);

  const getEventById = useCallback(
    (id: string) => events.find((event) => event.id === id),
    [events]
  );

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
 */
export function useInvalidateEvents() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
  }, [queryClient]);
}
