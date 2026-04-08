/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */

/**
 * Generate avatar initials from email address
 */
export function avatarInitials(email: string): string {
  const parts = email.split("@")[0].split(/[._-]/);
  return (parts[0]?.[0] ?? "?").toUpperCase() + (parts[1]?.[0] ?? parts[0]?.[1] ?? "").toUpperCase();
}

/**
 * Generate page numbers with ellipsis for pagination
 */
export function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];

  if (totalPages <= 5) {
    // Show all pages if 5 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Format date range for display
 */
export function formatRangeDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[start.getMonth()]} ${start.getDate()} – ${months[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
}

/**
 * Get event emoji from first sport
 */
export function getEventEmoji(sports?: Array<{ emoji: string }>): string {
  return sports?.[0]?.emoji ?? "🏆";
}

/**
 * Calculate event status dynamically based on dates
 */
export function getCalculatedStatus(event: { status?: string; startDate: string; endDate: string }): "active" | "upcoming" | "completed" | "archived" {
  // Use database status for archived
  if (event.status === "archived") {
    return "archived";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  // Calculate based on dates
  if (today > endDate) {
    return "completed";
  } else if (today >= startDate && today <= endDate) {
    return "active";
  } else {
    return "upcoming";
  }
}

/**
 * Transform database AccessKey to SportKey format
 */
export function transformAccessKeyToSportKey(accessKey: {
  id: string;
  code: string;
  sportName: string;
  sportEmoji: string;
  status: "available" | "confirmed" | "revoked";
  claimedById: string | null;
  createdAt: Date;
}) {
  const formatDate = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return {
    id: accessKey.id,
    code: accessKey.code,
    sport: accessKey.sportName,
    sportEmoji: accessKey.sportEmoji,
    status: accessKey.status,
    // User info (will be populated when user claims key)
    userEmail: undefined,
    userName: undefined,
    userAvatar: undefined,
    createdAt: formatDate(accessKey.createdAt),
  };
}
