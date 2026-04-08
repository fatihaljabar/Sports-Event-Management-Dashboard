import React from "react";
import { Layers, CheckCircle2, Archive, CalendarClock, Trophy, ArrowUpDown, Calendar, KeyRound } from "lucide-react";
import type { FilterTab, SortField, EventTypeFilter, SportEvent } from "./types";

export const TABS: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All Events", icon: <Layers className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { id: "active", label: "Active", icon: <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { id: "upcoming", label: "Upcoming", icon: <CalendarClock className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { id: "completed", label: "Completed", icon: <Trophy className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { id: "archived", label: "Archived", icon: <Archive className="w-3.5 h-3.5" strokeWidth={1.75} /> },
];

export const SORT_OPTIONS: { field: SortField; label: string; icon: React.ReactNode }[] = [
  { field: "name", label: "Name (A-Z)", icon: <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { field: "date", label: "Date (Newest)", icon: <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { field: "keys", label: "Keys Used", icon: <KeyRound className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { field: "location", label: "Location", icon: <Layers className="w-3.5 h-3.5" strokeWidth={1.75} /> },
];

export const EVENT_TYPE_OPTIONS: { id: EventTypeFilter; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All Types", icon: <Layers className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { id: "single", label: "Single Event", icon: <Trophy className="w-3.5 h-3.5" strokeWidth={1.75} /> },
  { id: "multi", label: "Multi-Event", icon: <Layers className="w-3.5 h-3.5" strokeWidth={1.75} /> },
];

export const DAYS_CONFIG: Record<
  SportEvent["daysVariant"],
  { bg: string; color: string; border: string }
> = {
  urgent: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  warning: { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  upcoming: { bg: "#DBEAFE", color: "#1D4ED8", border: "#BFDBFE" },
  far: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
  ended: { bg: "#F8FAFC", color: "#94A3B8", border: "#E2E8F0" },
};

const ITEMS_PER_PAGE = 8;

export { ITEMS_PER_PAGE };
