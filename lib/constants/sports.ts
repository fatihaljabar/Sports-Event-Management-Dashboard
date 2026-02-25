import type { SportCategory } from "@/lib/types/event";

/**
 * Sport Categories - Alphabetically sorted
 *
 * To add a new sport:
 * 1. Add to this array in alphabetical order by label
 * 2. Use format: { id: "lowercase-id", label: "Display Name", emoji: "emoji" }
 * 3. ID should be URL-friendly (lowercase, hyphens for spaces)
 */
export const SPORT_OPTIONS: SportCategory[] = [
  // A
  { id: "archery", label: "Archery", emoji: "🏹" },
  { id: "athletics", label: "Athletics", emoji: "🏃" },

  // B
  { id: "badminton", label: "Badminton", emoji: "🏸" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "boxing", label: "Boxing", emoji: "🥊" },

  // C
  { id: "canoe", label: "Canoe/Kayak", emoji: "🛶" },
  { id: "cycling", label: "Cycling", emoji: "🚴" },

  // D
  { id: "diving", label: "Diving", emoji: "🤽" },

  // E
  { id: "equestrian", label: "Equestrian", emoji: "🏇" },

  // F
  { id: "fencing", label: "Fencing", emoji: "🤺" },
  { id: "football", label: "Football", emoji: "⚽" },

  // G
  { id: "golf", label: "Golf", emoji: "⛳" },
  { id: "gymnastics", label: "Gymnastics", emoji: "🤸" },

  // H
  { id: "handball", label: "Handball", emoji: "🤾" },
  { id: "hockey", label: "Hockey", emoji: "🏒" },

  // J
  { id: "judo", label: "Judo", emoji: "🥋" },

  // K
  { id: "karate", label: "Karate", emoji: "🥋" },

  // R
  { id: "rowing", label: "Rowing", emoji: "🚣" },
  { id: "rugby", label: "Rugby", emoji: "🏉" },

  // S
  { id: "sailing", label: "Sailing", emoji: "⛵" },
  { id: "shooting", label: "Shooting", emoji: "🔫" },
  { id: "skateboarding", label: "Skateboarding", emoji: "🛹" },
  { id: "sport-climbing", label: "Sport Climbing", emoji: "🧗" },
  { id: "swimming", label: "Swimming", emoji: "🏊" },

  // T
  { id: "table-tennis", label: "Table Tennis", emoji: "🏓" },
  { id: "taekwondo", label: "Taekwondo", emoji: "🥋" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "triathlon", label: "Triathlon", emoji: "🏃" },

  // V
  { id: "volleyball", label: "Volleyball", emoji: "🏐" },

  // W
  { id: "weightlifting", label: "Weightlifting", emoji: "🏋️" },
  { id: "wrestling", label: "Wrestling", emoji: "🤼" },
];

/**
 * Get sport option by ID
 */
export function getSportById(id: string): SportCategory | undefined {
  return SPORT_OPTIONS.find((sport) => sport.id === id);
}

/**
 * Get multiple sport options by IDs
 */
export function getSportsByIds(ids: string[]): SportCategory[] {
  return ids.map((id) => getSportById(id)).filter((sport): sport is SportCategory => sport !== undefined);
}

/**
 * Search sports by label
 */
export function searchSports(query: string): SportCategory[] {
  const q = query.toLowerCase();
  return SPORT_OPTIONS.filter((sport) =>
    sport.label.toLowerCase().includes(q) || sport.id.toLowerCase().includes(q)
  );
}
