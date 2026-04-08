export type OrgStatus = "active" | "revoked" | "suspended";

export interface Organizer {
  id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  event: string;
  eventEmoji: string;
  division: string;
  divisionEmoji: string;
  accessKey: string;
  lastLogin: string;
  lastLoginRelative: string;
  status: OrgStatus;
  permissions: string[];
}

export interface StatusConfig {
  label: string;
  dot: string;
  bg: string;
  text: string;
  border: string;
}

export interface EventColorConfig {
  bg: string;
  text: string;
  border: string;
}
