import type { SportCategory } from "@/lib/types/event";
import { Globe, Lock } from "lucide-react";

export const SPORT_OPTIONS: SportCategory[] = [
  { id: "athletics", label: "Athletics", emoji: "🏃" },
  { id: "swimming", label: "Swimming", emoji: "🏊" },
  { id: "cycling", label: "Cycling", emoji: "🚴" },
  { id: "gymnastics", label: "Gymnastics", emoji: "🤸" },
  { id: "boxing", label: "Boxing", emoji: "🥊" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "volleyball", label: "Volleyball", emoji: "🏐" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "weightlifting", label: "Weightlifting", emoji: "🏋️" },
  { id: "wrestling", label: "Wrestling", emoji: "🤼" },
  { id: "archery", label: "Archery", emoji: "🏹" },
];

export const LOCATION_OPTIONS = [
  "Tokyo, Japan",
  "Singapore",
  "Bangkok, Thailand",
  "Kuala Lumpur, Malaysia",
  "Jakarta, Indonesia",
  "Manila, Philippines",
  "Hanoi, Vietnam",
  "Beijing, China",
  "Seoul, South Korea",
  "Taipei, Taiwan",
  "Hong Kong",
  "Osaka, Japan",
  "Kyoto, Japan",
];

export const TIMEZONE_MAP: Record<string, string> = {
  "Tokyo": "Asia/Tokyo (GMT+9)",
  "Tokyo, Japan": "Asia/Tokyo (GMT+9)",
  "Jakarta": "Asia/Jakarta (GMT+7)",
  "Jakarta, Indonesia": "Asia/Jakarta (GMT+7)",
  "Bangkok": "Asia/Bangkok (GMT+7)",
  "Bangkok, Thailand": "Asia/Bangkok (GMT+7)",
  "Singapore": "Asia/Singapore (GMT+8)",
  "Kuala Lumpur": "Asia/Kuala_Lumpur (GMT+8)",
  "Kuala Lumpur, Malaysia": "Asia/Kuala_Lumpur (GMT+8)",
  "Manila": "Asia/Manila (GMT+8)",
  "Manila, Philippines": "Asia/Manila (GMT+8)",
  "Hanoi": "Asia/Ho_Chi_Minh (GMT+7)",
  "Hanoi, Vietnam": "Asia/Ho_Chi_Minh (GMT+7)",
  "Beijing": "Asia/Shanghai (GMT+8)",
  "Beijing, China": "Asia/Shanghai (GMT+8)",
  "Seoul": "Asia/Seoul (GMT+9)",
  "Seoul, South Korea": "Asia/Seoul (GMT+9)",
  "Taipei": "Asia/Taipei (GMT+8)",
  "Taipei, Taiwan": "Asia/Taipei (GMT+8)",
  "Hong Kong": "Asia/Hong_Kong (GMT+8)",
  "Osaka": "Asia/Tokyo (GMT+9)",
  "Osaka, Japan": "Asia/Tokyo (GMT+9)",
  "Kyoto": "Asia/Tokyo (GMT+9)",
  "Kyoto, Japan": "Asia/Tokyo (GMT+9)",
};

export const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public", icon: Globe },
  { value: "private", label: "Private", icon: Lock },
] as const;

export type EventType = "single" | "multi";
