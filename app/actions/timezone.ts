"use server";

/**
 * Server Action to fetch timezone from Google Time Zone API
 * Called from server-side to bypass HTTP referrer restrictions
 * Includes rate limiting to prevent API abuse
 */

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

interface TimezoneResult {
  success: boolean;
  timezone?: string;
  error?: string;
  retryAfter?: number;
}

export async function getTimezoneByCoordinates(
  lat: number,
  lng: number
): Promise<TimezoneResult> {
  try {
    // Get client IP for rate limiting
    const clientIp = await getClientIp();
    const identifier = `timezone:${clientIp}`;

    // Check rate limit
    const rateLimit = checkRateLimit(identifier, "DEFAULT");

    if (!rateLimit.success) {
      return {
        success: false,
        error: "Too many requests. Please try again later.",
        retryAfter: rateLimit.resetTime ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000) : 60,
      };
    }

    // Validate coordinates
    if (typeof lat !== "number" || typeof lng !== "number" ||
        lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return { success: false, error: "Invalid coordinates" };
    }

    // Use separate API key for Time Zone API (without referer restrictions)
    const apiKey = process.env.GOOGLE_TIMEZONE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) {
      return { success: false, error: "API key not configured" };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    const data = await response.json();

    if (data.status === "OK" && data.timeZoneId) {
      return { success: true, timezone: data.timeZoneId };
    }

    return {
      success: false,
      error: data.status || "Unknown error",
    };
  } catch {
    return { success: false, error: "Failed to fetch timezone" };
  }
}
