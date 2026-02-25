"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import type { SportEvent, SportCategory, SponsorLogoData } from "@/lib/types/event";

export interface CreateEventData {
  name: string;
  type: "single" | "multi";
  sports: SportCategory[];
  locationCity: string;
  locationTimezone: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  totalKeys: number;
  visibility: "public" | "private";
  logoBase64?: string; // Base64 encoded image from client
  logoFileName?: string; // Original filename
  sponsorLogos?: Array<{ name: string; base64: string; fileName: string }>; // Sponsor logos
}

export interface CreateEventResult {
  success: boolean;
  event?: SportEvent;
  error?: string;
}

/**
 * Get next event ID in format EVT-XXX
 */
async function getNextEventId(): Promise<string> {
  const events = await prisma.sportEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  if (events.length === 0) {
    return "EVT-001";
  }

  const lastEventId = events[0].eventId;
  const lastNum = parseInt(lastEventId.split("-")[1]);
  const nextNum = lastNum + 1;

  return `EVT-${String(nextNum).padStart(3, "0")}`;
}

/**
 * Upload logo to Supabase Storage
 */
async function uploadEventLogo(
  base64: string,
  fileName: string,
  eventId: string
): Promise<string | null> {
  try {
    const supabase = createServiceClient();

    // Extract file extension from original filename
    const ext = fileName.split(".").pop()?.toLowerCase() || "png";

    // Validate extension (no SVG - not supported by Supabase Storage)
    const allowedExts = ["png", "jpg", "jpeg", "webp"];
    if (!allowedExts.includes(ext)) {
      console.error("Invalid file extension:", ext);
      return null;
    }

    // Use timestamp for uniqueness to avoid cache issues
    const timestamp = Date.now();
    const storagePath = `event-logos/${eventId}-${timestamp}.${ext}`;

    // Convert base64 to buffer
    let base64Data: string;
    if (base64.includes(",")) {
      base64Data = base64.split(",")[1]; // Remove data URL prefix
    } else {
      base64Data = base64;
    }

    const buffer = Buffer.from(base64Data, "base64");

    console.log("Uploading event logo:", storagePath, "Size:", buffer.length, "bytes");

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("event-logos")
      .upload(storagePath, buffer, {
        contentType: ext === "jpg" ? "image/jpeg" : `image/${ext}`,
        upsert: false, // Create new file to avoid cache
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return null;
    }

    console.log("Upload successful, getting public URL...");

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("event-logos")
      .getPublicUrl(storagePath);

    console.log("Public URL:", publicUrlData.publicUrl);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Exception in uploadEventLogo:", error);
    return null;
  }
}

/**
 * Upload sponsor logos to Supabase Storage
 */
async function uploadSponsorLogos(
  sponsorLogos: Array<{ name: string; base64: string; fileName: string }>,
  eventId: string
): Promise<SponsorLogoData[]> {
  const results: SponsorLogoData[] = [];
  const supabase = createServiceClient();

  console.log(`Starting upload of ${sponsorLogos.length} sponsor logos for event ${eventId}`);

  const globalTimestamp = Date.now(); // Single timestamp for all uploads

  for (let i = 0; i < sponsorLogos.length; i++) {
    const sponsor = sponsorLogos[i];
    try {
      const ext = sponsor.fileName.split(".").pop()?.toLowerCase() || "png";
      // No SVG support - Supabase Storage doesn't support it well
      const allowedExts = ["png", "jpg", "jpeg", "webp"];
      if (!allowedExts.includes(ext)) {
        console.error(`[${i+1}/${sponsorLogos.length}] Invalid sponsor logo extension:`, ext, "(SVG not supported)");
        continue;
      }

      const storagePath = `sponsor-logos/${eventId}-${globalTimestamp}-${i + 1}.${ext}`;

      // Convert base64 to buffer
      let base64Data: string;
      if (sponsor.base64.includes(",")) {
        base64Data = sponsor.base64.split(",")[1];
      } else {
        base64Data = sponsor.base64;
      }

      const buffer = Buffer.from(base64Data, "base64");

      console.log(`[${i+1}/${sponsorLogos.length}] Uploading sponsor logo:`, storagePath, "Size:", buffer.length, "bytes");

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("event-logos")
        .upload(storagePath, buffer, {
          contentType: ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`,
          upsert: false,
        });

      if (uploadError) {
        console.error(`[${i+1}/${sponsorLogos.length}] Sponsor logo upload error:`, uploadError.message);
        continue;
      }

      console.log(`[${i+1}/${sponsorLogos.length}] Upload successful:`, uploadData?.path);

      const { data: publicUrlData } = supabase.storage
        .from("event-logos")
        .getPublicUrl(storagePath);

      results.push({ name: sponsor.name, url: publicUrlData.publicUrl });
      console.log(`[${i+1}/${sponsorLogos.length}] Public URL:`, publicUrlData.publicUrl);
    } catch (error) {
      console.error(`[${i+1}/${sponsorLogos.length}] Exception uploading sponsor logo:`, error);
    }
  }

  console.log(`Sponsor logos upload complete. ${results.length}/${sponsorLogos.length} successful.`);
  return results;
}

/**
 * Create a new sport event
 */
export async function createEvent(data: CreateEventData): Promise<CreateEventResult> {
  try {
    // Validate required fields
    if (!data.name.trim()) {
      return { success: false, error: "Event name is required" };
    }

    if (!data.locationCity.trim()) {
      return { success: false, error: "Location is required" };
    }

    if (!data.startDate) {
      return { success: false, error: "Start date is required" };
    }

    if (!data.endDate) {
      return { success: false, error: "End date is required" };
    }

    if (data.maxParticipants < 1) {
      return { success: false, error: "Max participants must be at least 1" };
    }

    if (data.sports.length === 0) {
      return { success: false, error: "At least 1 sport is required" };
    }

    // Generate event ID
    const eventId = await getNextEventId();

    // Upload logo if provided
    let logoUrl: string | null = null;
    if (data.logoBase64 && data.logoFileName) {
      console.log("Uploading logo for event:", eventId);
      logoUrl = await uploadEventLogo(data.logoBase64, data.logoFileName, eventId);
      console.log("Logo uploaded, URL:", logoUrl);
    }

    // Upload sponsor logos if provided
    let uploadedSponsors: SponsorLogoData[] = [];
    if (data.sponsorLogos && data.sponsorLogos.length > 0) {
      console.log("Uploading sponsor logos for event:", eventId);
      uploadedSponsors = await uploadSponsorLogos(data.sponsorLogos, eventId);
      console.log("Sponsor logos uploaded:", uploadedSponsors.length);
    }

    // Create event in database
    const event = await prisma.sportEvent.create({
      data: {
        eventId,
        name: data.name,
        type: data.type,
        status: "upcoming",
        locationCity: data.locationCity,
        locationVenue: null,
        locationTimezone: data.locationTimezone,
        coordinates: null as unknown as undefined,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        maxParticipants: data.maxParticipants,
        usedKeys: 0,
        totalKeys: data.totalKeys,
        visibility: data.visibility,
        logoUrl,
        sponsorLogos: uploadedSponsors.length > 0 ? uploadedSponsors as unknown as Record<string, never> : null,
        sports: data.sports as unknown as Record<string, never>,
      },
    });

    // Revalidate cache
    revalidatePath("/");
    revalidatePath("/dashboard");

    // Transform to SportEvent type
    const transformedEvent: SportEvent = {
      id: event.eventId,
      name: event.name,
      type: event.type as "single" | "multi",
      status: event.status as SportEvent["status"],
      sports: event.sports as unknown as SportEvent["sports"],
      location: {
        city: event.locationCity,
        venue: event.locationVenue ?? "",
        coordinates: null,
        timezone: event.locationTimezone,
      },
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      maxParticipants: event.maxParticipants,
      usedKeys: event.usedKeys,
      totalKeys: event.totalKeys,
      visibility: event.visibility as "public" | "private",
      logoUrl: event.logoUrl ?? undefined,
      sponsorLogos: uploadedSponsors,
    };

    return { success: true, event: transformedEvent };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create event",
    };
  }
}

/**
 * Get all sport events
 */
export async function getEvents(): Promise<SportEvent[]> {
  try {
    const events = await prisma.sportEvent.findMany({
      orderBy: { createdAt: "desc" },
    });

    return events.map((event) => ({
      id: event.eventId,
      name: event.name,
      type: event.type as "single" | "multi",
      status: event.status as SportEvent["status"],
      sports: event.sports as unknown as SportEvent["sports"],
      location: {
        city: event.locationCity,
        venue: event.locationVenue ?? "",
        coordinates: null,
        timezone: event.locationTimezone,
      },
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      maxParticipants: event.maxParticipants,
      usedKeys: event.usedKeys,
      totalKeys: event.totalKeys,
      visibility: event.visibility as "public" | "private",
      logoUrl: event.logoUrl ?? undefined,
      sponsorLogos: (event.sponsorLogos as unknown as SponsorLogoData[]) ?? undefined,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

/**
 * Get a single event by ID
 */
export async function getEventById(eventId: string): Promise<SportEvent | null> {
  try {
    const event = await prisma.sportEvent.findUnique({
      where: { eventId },
    });

    if (!event) return null;

    return {
      id: event.eventId,
      name: event.name,
      type: event.type as "single" | "multi",
      status: event.status as SportEvent["status"],
      sports: event.sports as unknown as SportEvent["sports"],
      location: {
        city: event.locationCity,
        venue: event.locationVenue ?? "",
        coordinates: null,
        timezone: event.locationTimezone,
      },
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      maxParticipants: event.maxParticipants,
      usedKeys: event.usedKeys,
      totalKeys: event.totalKeys,
      visibility: event.visibility as "public" | "private",
      logoUrl: event.logoUrl ?? undefined,
      sponsorLogos: (event.sponsorLogos as unknown as SponsorLogoData[]) ?? undefined,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

/**
 * Delete an event and its associated images from storage
 */
export async function deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceClient();

    // First, fetch the event to get logo URLs
    const event = await prisma.sportEvent.findUnique({
      where: { eventId },
    });

    if (!event) {
      return {
        success: false,
        error: "Event not found",
      };
    }

    // Delete event logo from storage
    if (event.logoUrl) {
      try {
        // Extract path from URL
        const url = new URL(event.logoUrl);
        const pathParts = url.pathname.split("/");
        // Path format: /storage/v1/object/public/bucket-name/path/to/file
        const bucketIndex = pathParts.indexOf("event-logos");
        if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
          const storagePath = pathParts.slice(bucketIndex).join("/");
          const { error: deleteError } = await supabase.storage
            .from("event-logos")
            .remove([storagePath]);
          if (deleteError) {
            console.error("Error deleting event logo from storage:", deleteError);
          } else {
            console.log("Deleted event logo:", storagePath);
          }
        }
      } catch (error) {
        console.error("Exception deleting event logo:", error);
      }
    }

    // Delete sponsor logos from storage
    if (event.sponsorLogos) {
      const sponsorLogos = event.sponsorLogos as unknown as SponsorLogoData[];
      for (const sponsor of sponsorLogos) {
        try {
          const url = new URL(sponsor.url);
          const pathParts = url.pathname.split("/");
          const bucketIndex = pathParts.indexOf("event-logos");
          if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
            const storagePath = pathParts.slice(bucketIndex).join("/");
            const { error: deleteError } = await supabase.storage
              .from("event-logos")
              .remove([storagePath]);
            if (deleteError) {
              console.error("Error deleting sponsor logo from storage:", deleteError);
            } else {
              console.log("Deleted sponsor logo:", storagePath);
            }
          }
        } catch (error) {
          console.error("Exception deleting sponsor logo:", error);
        }
      }
    }

    // Delete event from database
    await prisma.sportEvent.delete({
      where: { eventId },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete event",
    };
  }
}
