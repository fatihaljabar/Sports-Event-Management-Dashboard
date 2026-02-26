"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
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

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load events from database on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshEvents = useCallback(async () => {
    await loadEvents();
  }, []);

  const addEvent = useCallback((event: SportEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<SportEvent>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  const archiveEvent = useCallback((id: string) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, status: "archived" as const } : event))
    );
  }, []);

  const unarchiveEvent = useCallback((id: string, newStatus: SportEvent["status"]) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, status: newStatus } : event))
    );
  }, []);

  const duplicateEvent = useCallback((newEvent: SportEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  }, []);

  const getEventById = useCallback(
    (id: string) => events.find((event) => event.id === id),
    [events]
  );

  return (
    <EventContext.Provider
      value={{ events, isLoading, addEvent, updateEvent, deleteEvent, archiveEvent, unarchiveEvent, duplicateEvent, getEventById, refreshEvents }}
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
