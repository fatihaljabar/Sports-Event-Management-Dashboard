import type { SponsorLogoData } from "@/lib/types/event";

export type EventStatus = "active" | "inactive" | "upcoming" | "completed" | "archived";
export type EventType = "multi" | "single";
export type FilterTab = "all" | EventStatus;
export type SortField = "name" | "date" | "keys" | "location";
export type SortDirection = "asc" | "desc";
export type EventTypeFilter = "all" | "single" | "multi";

export interface SportEvent {
  id: string;
  logo: { bg: string; text: string; emoji: string };
  name: string;
  type: EventType;
  startDate: string;
  endDate: string;
  startDateActual: Date;
  endDateActual: Date;
  daysLabel: string;
  daysVariant: "urgent" | "warning" | "upcoming" | "ended" | "far";
  status: EventStatus;
  sports: string[];
  location: string;
  usedKeys: number;
  totalKeys: number;
  logoUrl?: string;
  sponsorLogos?: SponsorLogoData[];
}

export interface EventHandlers {
  onEventClick: (eventId: string) => void;
  onDelete: (eventId: string, eventName: string) => Promise<void>;
  onEdit?: (eventId: string) => void;
  onArchive?: (eventId: string, eventName: string, isArchived: boolean) => Promise<void>;
  onDuplicate?: (eventId: string) => Promise<void>;
  onExport?: (eventId: string, eventName: string) => Promise<void>;
}

export interface EventManagementState {
  activeTab: FilterTab;
  search: string;
  sortField: SortField;
  sortDirection: SortDirection;
  eventTypeFilter: EventTypeFilter;
  currentPage: number;
  hoveredRow: string | null;
  deleteConfirm: string | null;
  isDeleting: boolean;
  sortDropdownOpen: boolean;
  filtersDropdownOpen: boolean;
  editingEvent: import("@/lib/types/event").SportEvent | null;
}
