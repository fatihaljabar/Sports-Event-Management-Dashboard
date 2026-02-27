"use server";

/**
 * Server Action to fetch timezone from Google Time Zone API
 * Called from server-side to bypass HTTP referrer restrictions
 */

interface TimezoneResult {
  success: boolean;
  timezone?: string;
  error?: string;
}

export async function getTimezoneByCoordinates(
  lat: number,
  lng: number
): Promise<TimezoneResult> {
  try {
    // Use separate API key for Time Zone API (without referer restrictions)
    const apiKey = process.env.GOOGLE_TIMEZONE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) {
      return { success: false, error: "API key not configured" };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("[Server Timezone API] Response:", data);

    if (data.status === "OK" && data.timeZoneId) {
      console.log("[Server Timezone API] Detected timezone:", data.timeZoneId, "for coords:", { lat, lng });
      return { success: true, timezone: data.timeZoneId };
    }

    return {
      success: false,
      error: data.status || "Unknown error",
    };
  } catch (error) {
    console.error("[Server Timezone API] Error:", error);
    return { success: false, error: "Failed to fetch timezone" };
  }
}
