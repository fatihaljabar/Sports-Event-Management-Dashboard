import { NextResponse } from "next/server";

/**
 * API Route: /api/sync
 *
 * Provides lightweight sync timestamp for dashboard
 * Used by TanStack Query to track "Last sync" time
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "dashboard";

    // Return current server timestamp
    const timestamp = new Date().toISOString();

    return NextResponse.json({
      timestamp,
      status: "ok",
      type,
    });
  } catch (error) {
    console.error("Sync API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
