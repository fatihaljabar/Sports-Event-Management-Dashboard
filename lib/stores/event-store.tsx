"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { SportEvent } from "@/lib/types/event";

interface EventContextType {
  events: SportEvent[];
  addEvent: (event: SportEvent) => void;
  updateEvent: (id: string, event: Partial<SportEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => SportEvent | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<SportEvent[]>([
    // Initial sample data
    {
      id: "EVT-001",
      name: "World Athletics Championship 2026",
      type: "multi",
      status: "active",
      sports: [
        { id: "athletics", label: "Athletics", emoji: "🏃" },
        { id: "swimming", label: "Swimming", emoji: "🏊" },
      ],
      location: {
        city: "Tokyo, Japan",
        venue: "Tokyo Olympic Stadium",
        coordinates: { lat: 35.6812, lng: 139.7671 },
        timezone: "Asia/Tokyo (GMT+9)",
      },
      startDate: "2026-09-19",
      endDate: "2026-10-04",
      maxParticipants: 15000,
      usedKeys: 8420,
      totalKeys: 15000,
      visibility: "public",
    },
    {
      id: "EVT-002",
      name: "International Swimming Cup",
      type: "single",
      status: "upcoming",
      sports: [
        { id: "swimming", label: "Swimming", emoji: "🏊" },
      ],
      location: {
        city: "Singapore",
        venue: "Singapore Sports Hub",
        coordinates: { lat: 1.2966, lng: 103.8501 },
        timezone: "Asia/Singapore (GMT+8)",
      },
      startDate: "2026-11-15",
      endDate: "2026-11-20",
      maxParticipants: 800,
      usedKeys: 245,
      totalKeys: 800,
      visibility: "public",
    },
    {
      id: "EVT-003",
      name: "Regional Boxing Championship",
      type: "single",
      status: "active",
      sports: [
        { id: "boxing", label: "Boxing", emoji: "🥊" },
      ],
      location: {
        city: "Bangkok, Thailand",
        venue: "Thunderdome Stadium",
        coordinates: { lat: 13.7563, lng: 100.5018 },
        timezone: "Asia/Bangkok (GMT+7)",
      },
      startDate: "2026-08-10",
      endDate: "2026-08-18",
      maxParticipants: 500,
      usedKeys: 387,
      totalKeys: 500,
      visibility: "public",
    },
    {
      id: "EVT-004",
      name: "Southeast Asian Games",
      type: "multi",
      status: "upcoming",
      sports: [
        { id: "athletics", label: "Athletics", emoji: "🏃" },
        { id: "swimming", label: "Swimming", emoji: "🏊" },
        { id: "boxing", label: "Boxing", emoji: "🥊" },
        { id: "football", label: "Football", emoji: "⚽" },
      ],
      location: {
        city: "Kuala Lumpur, Malaysia",
        venue: "Bukit Jalil National Stadium",
        coordinates: { lat: 3.0568, lng: 101.7170 },
        timezone: "Asia/Kuala_Lumpur (GMT+8)",
      },
      startDate: "2026-12-01",
      endDate: "2026-12-15",
      maxParticipants: 8000,
      usedKeys: 1245,
      totalKeys: 8000,
      visibility: "public",
    },
    {
      id: "EVT-005",
      name: "National Tennis Open",
      type: "single",
      status: "completed",
      sports: [
        { id: "tennis", label: "Tennis", emoji: "🎾" },
      ],
      location: {
        city: "Jakarta, Indonesia",
        venue: "Gelora Bung Karno Tennis Center",
        coordinates: { lat: -6.2183, lng: 106.8022 },
        timezone: "Asia/Jakarta (GMT+7)",
      },
      startDate: "2026-06-05",
      endDate: "2026-06-12",
      maxParticipants: 200,
      usedKeys: 200,
      totalKeys: 200,
      visibility: "public",
    },
  ]);

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

  const getEventById = useCallback(
    (id: string) => events.find((event) => event.id === id),
    [events]
  );

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, getEventById }}
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
