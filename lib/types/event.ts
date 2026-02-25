// Shared types for Event Management
export type EventType = "single" | "multi";
export type EventStatus = "active" | "inactive" | "upcoming" | "ongoing" | "completed" | "archived";

export interface SportCategory {
  id: string;
  label: string;
  emoji: string;
}

export interface SponsorLogo {
  id: string;
  name: string;
  size: string;
  file: File | null;
}

export interface EventLocation {
  city: string;
  venue: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  timezone: string;
}

export interface CreateEventData {
  name: string;
  type: EventType;
  sports: string[];
  location: EventLocation;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  visibility: "public" | "private";
  logo: File | null;
  sponsorLogos: SponsorLogo[];
}

export interface SponsorLogoData {
  name: string;
  url: string;
}

export interface SportEvent {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  sports: SportCategory[];
  location: EventLocation;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  usedKeys: number;
  totalKeys: number;
  visibility: "public" | "private";
  logoUrl?: string;
  sponsorLogos?: SponsorLogoData[];
}
