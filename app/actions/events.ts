"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import type { SportEvent, SportCategory, SponsorLogoData } from "@/lib/types/event";
import { Prisma } from "@prisma/client";
import { checkRateLimit, getClientIp, RATE_LIMIT_CONFIG, type RateLimitType } from "@/lib/rate-limit";

// ═══════════════════════════════════════════════════════════════
// SECURITY CONSTANTS
// ═══════════════════════════════════════════════════════════════

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_STRING_LENGTH = 500;
const MAX_EVENT_NAME_LENGTH = 200;
const MAX_LOCATION_LENGTH = 200;
const MAX_TIMEZONE_LENGTH = 100;
const MAX_SPONSOR_NAME_LENGTH = 100;

// Allowed file extensions for image upload
const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"] as const;
type AllowedImageExt = typeof ALLOWED_IMAGE_EXTENSIONS[number];

// Generic error messages for production (don't leak implementation details)
const GENERIC_ERROR_MESSAGES = {
  CREATE_FAILED: "Failed to create event. Please try again.",
  UPDATE_FAILED: "Failed to update event. Please try again.",
  DELETE_FAILED: "Failed to delete event. Please try again.",
  ARCHIVE_FAILED: "Failed to archive event. Please try again.",
  UNARCHIVE_FAILED: "Failed to restore event. Please try again.",
  DUPLICATE_FAILED: "Failed to duplicate event. Please try again.",
  EXPORT_FAILED: "Failed to export event data. Please try again.",
  UPLOAD_FAILED: "Failed to upload image. File must be under 5MB and in PNG, JPG, or WEBP format.",
  INVALID_INPUT: "Invalid input data. Please check your entries.",
} as const;

// ═══════════════════════════════════════════════════════════════
// SECURITY UTILITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Development mode check
 */
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Dev-only logger to prevent console.log in production
 */
const devLog = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors, but use different handling in prod
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, send to error tracking service (e.g., Sentry)
      // For now, still log but consider implementing proper error tracking
      console.error(...args);
    }
  },
  warn: (...args: unknown[]) => {
    // Always log warnings
    console.warn(...args);
  },
};

/**
 * Check rate limit for current request
 * Returns true if rate limited (should block), false if allowed
 */
async function isRateLimited(type: RateLimitType = "DEFAULT"): Promise<boolean> {
  if (isDevelopment) {
    return false; // Skip rate limiting in development
  }

  try {
    const ip = await getClientIp();
    const result = checkRateLimit(ip, type);

    if (!result.success) {
      console.warn(`Rate limit exceeded for ${ip}: ${type}`);
      return true;
    }

    return false;
  } catch {
    // Fail open in case of errors (don't block legitimate requests)
    return false;
  }
}

/**
 * Basic CSRF protection - verify request originates from same site
 * In production, this FAILS CLOSED (rejects invalid requests)
 * TODO: Enhance with proper CSRF tokens when authentication is implemented
 */
async function verifyRequestOrigin(): Promise<boolean> {
  try {
    const headersList = await headers();
    const referer = headersList.get("referer");
    const origin = headersList.get("origin");
    const host = headersList.get("host");

    // Allow requests with same-origin referer
    if (referer && host) {
      try {
        const refererUrl = new URL(referer);
        return refererUrl.host === host;
      } catch {
        return isDevelopment; // Fail open in dev, closed in prod
      }
    }

    // Allow requests with same-origin header
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        return originUrl.host === host;
      } catch {
        return isDevelopment; // Fail open in dev, closed in prod
      }
    }

    // No valid origin headers found
    return isDevelopment; // Fail open in dev, closed in prod
  } catch {
    // Header parsing failed
    return isDevelopment; // Fail open in dev, closed in prod
  }
}

/**
 * Sanitize string input - trim and limit length
 */
function sanitizeString(input: string, maxLength: number): string {
  const trimmed = input.trim();
  if (trimmed.length > maxLength) {
    return trimmed.substring(0, maxLength);
  }
  return trimmed;
}

/**
 * Validate and extract file extension from filename
 * Prevents double extension attacks (e.g., file.png.jpg)
 */
function validateFileExtension(fileName: string): AllowedImageExt | null {
  // Remove any query parameters or hashes
  const cleanName = fileName.split(/[?#]/)[0];

  // Get the last extension
  const parts = cleanName.split(".");
  if (parts.length < 2) return null;

  const ext = parts[parts.length - 1].toLowerCase();

  // Verify it's in our allowed list
  if (ALLOWED_IMAGE_EXTENSIONS.includes(ext as AllowedImageExt)) {
    return ext as AllowedImageExt;
  }

  return null;
}

/**
 * Validate file size from base64 string
 */
function validateBase64Size(base64: string, maxSize: number): boolean {
  // Remove data URL prefix if present
  let base64Data: string;
  if (base64.includes(",")) {
    base64Data = base64.split(",")[1];
  } else {
    base64Data = base64;
  }

  // Calculate decoded size (base64 is ~33% larger than original)
  const decodedSize = Math.floor((base64Data.length * 3) / 4);
  return decodedSize <= maxSize;
}

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
 * Upload logo to Supabase Storage with security validation
 */
async function uploadEventLogo(
  base64: string,
  fileName: string,
  eventId: string
): Promise<string | null> {
  try {
    const supabase = createServiceClient();

    // Validate file extension with improved security
    const ext = validateFileExtension(fileName);
    if (!ext) {
      console.error("Invalid file extension:", fileName);
      return null;
    }

    // Validate file size before processing
    if (!validateBase64Size(base64, MAX_FILE_SIZE)) {
      console.error("File size exceeds limit:", fileName);
      return null;
    }

    // Use timestamp for uniqueness to avoid cache issues
    const timestamp = Date.now();
    // Sanitize eventId in storage path to prevent path traversal
    const sanitizedEventId = eventId.replace(/[^a-zA-Z0-9-]/g, "");
    const storagePath = `event-logos/${sanitizedEventId}-${timestamp}.${ext}`;

    // Convert base64 to buffer
    let base64Data: string;
    if (base64.includes(",")) {
      base64Data = base64.split(",")[1]; // Remove data URL prefix
    } else {
      base64Data = base64;
    }

    const buffer = Buffer.from(base64Data, "base64");

    // Double-check buffer size
    if (buffer.length > MAX_FILE_SIZE) {
      console.error("Buffer size exceeds limit:", buffer.length);
      return null;
    }

    devLog.log("Uploading event logo:", storagePath, "Size:", buffer.length, "bytes");

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

    devLog.log("Upload successful, getting public URL...");

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("event-logos")
      .getPublicUrl(storagePath);

    devLog.log("Public URL:", publicUrlData.publicUrl);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Exception in uploadEventLogo:", error);
    return null;
  }
}

/**
 * Upload sponsor logos to Supabase Storage with security validation
 */
async function uploadSponsorLogos(
  sponsorLogos: Array<{ name: string; base64: string; fileName: string }>,
  eventId: string
): Promise<SponsorLogoData[]> {
  const results: SponsorLogoData[] = [];
  const supabase = createServiceClient();

  devLog.log(`Starting upload of ${sponsorLogos.length} sponsor logos for event ${eventId}`);

  const globalTimestamp = Date.now(); // Single timestamp for all uploads
  const sanitizedEventId = eventId.replace(/[^a-zA-Z0-9-]/g, "");

  for (let i = 0; i < sponsorLogos.length; i++) {
    const sponsor = sponsorLogos[i];
    try {
      // Sanitize sponsor name
      const sanitizedName = sanitizeString(sponsor.name, MAX_SPONSOR_NAME_LENGTH);

      // Validate file extension with improved security
      const ext = validateFileExtension(sponsor.fileName);
      if (!ext) {
        console.error(`[${i+1}/${sponsorLogos.length}] Invalid sponsor logo extension:`, sponsor.fileName);
        continue;
      }

      // Validate file size
      if (!validateBase64Size(sponsor.base64, MAX_FILE_SIZE)) {
        console.error(`[${i+1}/${sponsorLogos.length}] Sponsor logo exceeds size limit`);
        continue;
      }

      const storagePath = `sponsor-logos/${sanitizedEventId}-${globalTimestamp}-${i + 1}.${ext}`;

      // Convert base64 to buffer
      let base64Data: string;
      if (sponsor.base64.includes(",")) {
        base64Data = sponsor.base64.split(",")[1];
      } else {
        base64Data = sponsor.base64;
      }

      const buffer = Buffer.from(base64Data, "base64");

      // Double-check buffer size
      if (buffer.length > MAX_FILE_SIZE) {
        console.error(`[${i+1}/${sponsorLogos.length}] Buffer size exceeds limit:`, buffer.length);
        continue;
      }

      devLog.log(`[${i+1}/${sponsorLogos.length}] Uploading sponsor logo:`, storagePath, "Size:", buffer.length, "bytes");

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

      devLog.log(`[${i+1}/${sponsorLogos.length}] Upload successful:`, uploadData?.path);

      const { data: publicUrlData } = supabase.storage
        .from("event-logos")
        .getPublicUrl(storagePath);

      results.push({ name: sanitizedName, url: publicUrlData.publicUrl });
      devLog.log(`[${i+1}/${sponsorLogos.length}] Public URL:`, publicUrlData.publicUrl);
    } catch (error) {
      console.error(`[${i+1}/${sponsorLogos.length}] Exception uploading sponsor logo:`, error);
    }
  }

  devLog.log(`Sponsor logos upload complete. ${results.length}/${sponsorLogos.length} successful.`);
  return results;
}

/**
 * Create a new sport event with security validation
 */
export async function createEvent(data: CreateEventData): Promise<CreateEventResult> {
  // Verify request origin (basic CSRF protection)
  if (!(await verifyRequestOrigin())) {
    return { success: false, error: GENERIC_ERROR_MESSAGES.CREATE_FAILED };
  }

  // Rate limiting (use UPLOAD limit since this includes file uploads)
  if (await isRateLimited("UPLOAD")) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  try {
    // Sanitize and validate required fields
    const sanitizedName = sanitizeString(data.name, MAX_EVENT_NAME_LENGTH);
    if (!sanitizedName) {
      return { success: false, error: "Event name is required" };
    }

    const sanitizedLocationCity = sanitizeString(data.locationCity, MAX_LOCATION_LENGTH);
    if (!sanitizedLocationCity) {
      return { success: false, error: "Location is required" };
    }

    const sanitizedTimezone = sanitizeString(data.locationTimezone, MAX_TIMEZONE_LENGTH);

    if (!data.startDate) {
      return { success: false, error: "Start date is required" };
    }

    if (!data.endDate) {
      return { success: false, error: "End date is required" };
    }

    // Date range validation
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (startDate > endDate) {
      return { success: false, error: "End date must be after start date" };
    }

    if (data.maxParticipants < 1 || data.maxParticipants > 1000000) {
      return { success: false, error: "Max participants must be between 1 and 1,000,000" };
    }

    if (data.sports.length === 0 || data.sports.length > 50) {
      return { success: false, error: "At least 1 sport is required (max 50)" };
    }

    // Validate file uploads before proceeding
    if (data.logoBase64 && data.logoFileName) {
      const ext = validateFileExtension(data.logoFileName);
      if (!ext) {
        return { success: false, error: GENERIC_ERROR_MESSAGES.UPLOAD_FAILED };
      }
      if (!validateBase64Size(data.logoBase64, MAX_FILE_SIZE)) {
        return { success: false, error: GENERIC_ERROR_MESSAGES.UPLOAD_FAILED };
      }
    }

    if (data.sponsorLogos && data.sponsorLogos.length > 5) {
      return { success: false, error: "Maximum 5 sponsor logos allowed" };
    }

    // Generate event ID
    const eventId = await getNextEventId();

    // Upload logo if provided
    let logoUrl: string | null = null;
    if (data.logoBase64 && data.logoFileName) {
      devLog.log("Uploading logo for event:", eventId);
      logoUrl = await uploadEventLogo(data.logoBase64, data.logoFileName, eventId);
      devLog.log("Logo uploaded, URL:", logoUrl);
    }

    // Upload sponsor logos if provided
    let uploadedSponsors: SponsorLogoData[] = [];
    if (data.sponsorLogos && data.sponsorLogos.length > 0) {
      devLog.log("Uploading sponsor logos for event:", eventId);
      uploadedSponsors = await uploadSponsorLogos(data.sponsorLogos, eventId);
      devLog.log("Sponsor logos uploaded:", uploadedSponsors.length);
    }

    // Create event in database
    const event = await prisma.sportEvent.create({
      data: {
        eventId,
        name: sanitizedName,
        type: data.type,
        status: "upcoming",
        locationCity: sanitizedLocationCity,
        locationVenue: null,
        locationTimezone: sanitizedTimezone,
        coordinates: null as unknown as undefined,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        maxParticipants: data.maxParticipants,
        usedKeys: 0,
        totalKeys: data.totalKeys,
        visibility: data.visibility,
        logoUrl,
        sponsorLogos: uploadedSponsors.length > 0 ? (uploadedSponsors as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        sports: data.sports as unknown as Prisma.InputJsonValue,
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
      error: GENERIC_ERROR_MESSAGES.CREATE_FAILED,
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
  // Verify request origin (basic CSRF protection)
  if (!(await verifyRequestOrigin())) {
    return { success: false, error: GENERIC_ERROR_MESSAGES.DELETE_FAILED };
  }

  // Rate limiting (use STRICT limit for destructive operations)
  if (await isRateLimited("STRICT")) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  try {
    // Validate eventId format to prevent injection
    if (!eventId || !/^EVT-\d+$/.test(eventId)) {
      return { success: false, error: GENERIC_ERROR_MESSAGES.DELETE_FAILED };
    }

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
          const storagePath = pathParts.slice(bucketIndex + 1).join("/");
          const { error: deleteError } = await supabase.storage
            .from("event-logos")
            .remove([storagePath]);
          if (deleteError) {
            console.error("Error deleting event logo from storage:", deleteError);
          } else {
            devLog.log("Deleted event logo:", storagePath);
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
            const storagePath = pathParts.slice(bucketIndex + 1).join("/");
            const { error: deleteError } = await supabase.storage
              .from("event-logos")
              .remove([storagePath]);
            if (deleteError) {
              console.error("Error deleting sponsor logo from storage:", deleteError);
            } else {
              devLog.log("Deleted sponsor logo:", storagePath);
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
      error: GENERIC_ERROR_MESSAGES.DELETE_FAILED,
    };
  }
}

/**
 * Update an existing sport event
 */
export interface UpdateEventData {
  eventId: string;
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
  logoBase64?: string;
  logoFileName?: string;
  sponsorLogos?: Array<{ name: string; base64: string; fileName: string }>;
  keepExistingLogo?: boolean;
  keepExistingSponsors?: boolean;
}

export interface UpdateEventResult {
  success: boolean;
  event?: SportEvent;
  error?: string;
}

export async function updateEvent(data: UpdateEventData): Promise<UpdateEventResult> {
  // Verify request origin (basic CSRF protection)
  if (!(await verifyRequestOrigin())) {
    return { success: false, error: GENERIC_ERROR_MESSAGES.UPDATE_FAILED };
  }

  // Rate limiting (use UPLOAD limit since this includes file uploads)
  if (await isRateLimited("UPLOAD")) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  try {
    // Sanitize and validate required fields
    const sanitizedName = sanitizeString(data.name, MAX_EVENT_NAME_LENGTH);
    if (!sanitizedName) {
      return { success: false, error: "Event name is required" };
    }

    const sanitizedLocationCity = sanitizeString(data.locationCity, MAX_LOCATION_LENGTH);
    if (!sanitizedLocationCity) {
      return { success: false, error: "Location is required" };
    }

    const sanitizedTimezone = sanitizeString(data.locationTimezone, MAX_TIMEZONE_LENGTH);

    if (!data.startDate) {
      return { success: false, error: "Start date is required" };
    }

    if (!data.endDate) {
      return { success: false, error: "End date is required" };
    }

    // Date range validation
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (startDate > endDate) {
      return { success: false, error: "End date must be after start date" };
    }

    if (data.maxParticipants < 1 || data.maxParticipants > 1000000) {
      return { success: false, error: "Max participants must be between 1 and 1,000,000" };
    }

    if (data.sports.length === 0 || data.sports.length > 50) {
      return { success: false, error: "At least 1 sport is required (max 50)" };
    }

    // Validate file uploads before proceeding
    if (data.logoBase64 && data.logoFileName && !data.keepExistingLogo) {
      const ext = validateFileExtension(data.logoFileName);
      if (!ext) {
        return { success: false, error: GENERIC_ERROR_MESSAGES.UPLOAD_FAILED };
      }
      if (!validateBase64Size(data.logoBase64, MAX_FILE_SIZE)) {
        return { success: false, error: GENERIC_ERROR_MESSAGES.UPLOAD_FAILED };
      }
    }

    if (data.sponsorLogos && data.sponsorLogos.length > 5) {
      return { success: false, error: "Maximum 5 sponsor logos allowed" };
    }

    // Fetch existing event to get current data
    const existingEvent = await prisma.sportEvent.findUnique({
      where: { eventId: data.eventId },
    });

    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }

    // Upload new logo if provided
    let logoUrl: string | null = existingEvent.logoUrl;
    if (data.logoBase64 && data.logoFileName && !data.keepExistingLogo) {
      devLog.log("Uploading new logo for event:", data.eventId);
      logoUrl = await uploadEventLogo(data.logoBase64, data.logoFileName, data.eventId);
      devLog.log("New logo uploaded, URL:", logoUrl);
    }

    // Handle sponsor logos
    let uploadedSponsors: SponsorLogoData[] = [];
    const existingSponsors = existingEvent.sponsorLogos as unknown as SponsorLogoData[] | null;

    if (data.sponsorLogos && data.sponsorLogos.length > 0 && !data.keepExistingSponsors) {
      // Delete old sponsor logos from storage
      if (existingSponsors && existingSponsors.length > 0) {
        const supabase = createServiceClient();
        for (const sponsor of existingSponsors) {
          try {
            const url = new URL(sponsor.url);
            const pathParts = url.pathname.split("/");
            const bucketIndex = pathParts.indexOf("event-logos");
            if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
              const storagePath = pathParts.slice(bucketIndex + 1).join("/");
              await supabase.storage.from("event-logos").remove([storagePath]);
            }
          } catch (error) {
            console.error("Error deleting old sponsor logo:", error);
          }
        }
      }

      // Upload new sponsor logos
      devLog.log("Uploading new sponsor logos for event:", data.eventId);
      uploadedSponsors = await uploadSponsorLogos(data.sponsorLogos, data.eventId);
      devLog.log("New sponsor logos uploaded:", uploadedSponsors.length);
    } else if (data.keepExistingSponsors && existingSponsors) {
      uploadedSponsors = existingSponsors;
    }

    // Update event in database
    const event = await prisma.sportEvent.update({
      where: { eventId: data.eventId },
      data: {
        name: sanitizedName,
        type: data.type,
        locationCity: sanitizedLocationCity,
        locationTimezone: sanitizedTimezone,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        maxParticipants: data.maxParticipants,
        totalKeys: data.totalKeys,
        visibility: data.visibility,
        logoUrl,
        sponsorLogos: uploadedSponsors.length > 0 ? (uploadedSponsors as unknown as Prisma.InputJsonValue) : (existingEvent.sponsorLogos || Prisma.JsonNull),
        sports: data.sports as unknown as Prisma.InputJsonValue,
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
      sponsorLogos: uploadedSponsors.length > 0 ? uploadedSponsors : (existingSponsors ?? undefined),
    };

    return { success: true, event: transformedEvent };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      error: GENERIC_ERROR_MESSAGES.UPDATE_FAILED,
    };
  }
}

/**
 * Archive an event (change status to archived)
 */
export interface ArchiveEventResult {
  success: boolean;
  error?: string;
}

export async function archiveEvent(eventId: string): Promise<ArchiveEventResult> {
  // Verify request origin (basic CSRF protection)
  if (!(await verifyRequestOrigin())) {
    return { success: false, error: GENERIC_ERROR_MESSAGES.ARCHIVE_FAILED };
  }

  // Rate limiting (use DEFAULT limit)
  if (await isRateLimited("DEFAULT")) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  try {
    // Validate eventId format
    if (!eventId || !/^EVT-\d+$/.test(eventId)) {
      return { success: false, error: GENERIC_ERROR_MESSAGES.ARCHIVE_FAILED };
    }

    const event = await prisma.sportEvent.findUnique({
      where: { eventId },
    });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    await prisma.sportEvent.update({
      where: { eventId },
      data: { status: "archived" },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error archiving event:", error);
    return {
      success: false,
      error: GENERIC_ERROR_MESSAGES.ARCHIVE_FAILED,
    };
  }
}

/**
 * Unarchive an event (restore from archived status)
 */
export interface UnarchiveEventResult {
  success: boolean;
  error?: string;
}

export async function unarchiveEvent(eventId: string): Promise<UnarchiveEventResult> {
  // Verify request origin (basic CSRF protection)
  if (!(await verifyRequestOrigin())) {
    return { success: false, error: GENERIC_ERROR_MESSAGES.UNARCHIVE_FAILED };
  }

  // Rate limiting (use DEFAULT limit)
  if (await isRateLimited("DEFAULT")) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  try {
    // Validate eventId format
    if (!eventId || !/^EVT-\d+$/.test(eventId)) {
      return { success: false, error: GENERIC_ERROR_MESSAGES.UNARCHIVE_FAILED };
    }

    const event = await prisma.sportEvent.findUnique({
      where: { eventId },
    });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    // Calculate appropriate status based on dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(event.endDate);
    endDate.setHours(0, 0, 0, 0);
    const startDate = new Date(event.startDate);
    startDate.setHours(0, 0, 0, 0);

    let newStatus: "upcoming" | "active" | "completed" = "upcoming";
    if (today > endDate) {
      newStatus = "completed";
    } else if (today >= startDate && today <= endDate) {
      newStatus = "active";
    }

    await prisma.sportEvent.update({
      where: { eventId },
      data: { status: newStatus },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error unarchiving event:", error);
    return {
      success: false,
      error: GENERIC_ERROR_MESSAGES.UNARCHIVE_FAILED,
    };
  }
}

/**
 * Duplicate an event (create a copy with new ID)
 */
export interface DuplicateEventResult {
  success: boolean;
  event?: SportEvent;
  error?: string;
}

export async function duplicateEvent(eventId: string): Promise<DuplicateEventResult> {
  // Verify request origin (basic CSRF protection)
  if (!(await verifyRequestOrigin())) {
    return { success: false, error: GENERIC_ERROR_MESSAGES.DUPLICATE_FAILED };
  }

  // Rate limiting (use STRICT limit for duplication)
  if (await isRateLimited("STRICT")) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  try {
    // Validate eventId format
    if (!eventId || !/^EVT-\d+$/.test(eventId)) {
      return { success: false, error: GENERIC_ERROR_MESSAGES.DUPLICATE_FAILED };
    }

    const existingEvent = await prisma.sportEvent.findUnique({
      where: { eventId },
    });

    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }

    // Generate new event ID
    const newEventId = await getNextEventId();

    // Sanitize the name before duplication
    const sanitizedName = sanitizeString(
      `${existingEvent.name} (Copy)`,
      MAX_EVENT_NAME_LENGTH
    );

    // Create duplicate event
    const newEvent = await prisma.sportEvent.create({
      data: {
        eventId: newEventId,
        name: sanitizedName,
        type: existingEvent.type,
        status: "upcoming",
        locationCity: existingEvent.locationCity,
        locationVenue: existingEvent.locationVenue,
        locationTimezone: existingEvent.locationTimezone,
        coordinates: existingEvent.coordinates as unknown as undefined,
        startDate: existingEvent.startDate,
        endDate: existingEvent.endDate,
        maxParticipants: existingEvent.maxParticipants,
        usedKeys: 0,
        totalKeys: existingEvent.totalKeys,
        visibility: existingEvent.visibility,
        logoUrl: existingEvent.logoUrl,
        sponsorLogos: existingEvent.sponsorLogos as unknown as Prisma.InputJsonValue,
        sports: existingEvent.sports as unknown as Prisma.InputJsonValue,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    // Transform to SportEvent type
    const transformedEvent: SportEvent = {
      id: newEvent.eventId,
      name: newEvent.name,
      type: newEvent.type as "single" | "multi",
      status: newEvent.status as SportEvent["status"],
      sports: newEvent.sports as unknown as SportEvent["sports"],
      location: {
        city: newEvent.locationCity,
        venue: newEvent.locationVenue ?? "",
        coordinates: null,
        timezone: newEvent.locationTimezone,
      },
      startDate: newEvent.startDate.toISOString(),
      endDate: newEvent.endDate.toISOString(),
      maxParticipants: newEvent.maxParticipants,
      usedKeys: newEvent.usedKeys,
      totalKeys: newEvent.totalKeys,
      visibility: newEvent.visibility as "public" | "private",
      logoUrl: newEvent.logoUrl ?? undefined,
      sponsorLogos: (newEvent.sponsorLogos as unknown as SponsorLogoData[]) ?? undefined,
    };

    return { success: true, event: transformedEvent };
  } catch (error) {
    console.error("Error duplicating event:", error);
    return {
      success: false,
      error: GENERIC_ERROR_MESSAGES.DUPLICATE_FAILED,
    };
  }
}

/**
 * Export event data as JSON
 */
export interface ExportEventResult {
  success: boolean;
  data?: string;
  filename?: string;
  error?: string;
}

export async function exportEventData(eventId: string): Promise<ExportEventResult> {
  // Verify request origin (basic CSRF protection)
  if (!(await verifyRequestOrigin())) {
    return { success: false, error: GENERIC_ERROR_MESSAGES.EXPORT_FAILED };
  }

  // Rate limiting (use LENIENT limit for export operations)
  if (await isRateLimited("LENIENT")) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  try {
    // Validate eventId format
    if (!eventId || !/^EVT-\d+$/.test(eventId)) {
      return { success: false, error: GENERIC_ERROR_MESSAGES.EXPORT_FAILED };
    }

    const event = await prisma.sportEvent.findUnique({
      where: { eventId },
    });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    // Create export data object
    const exportData = {
      eventId: event.eventId,
      name: event.name,
      type: event.type,
      status: event.status,
      location: {
        city: event.locationCity,
        venue: event.locationVenue,
        timezone: event.locationTimezone,
      },
      dates: {
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
      },
      participants: {
        max: event.maxParticipants,
        usedKeys: event.usedKeys,
        totalKeys: event.totalKeys,
      },
      visibility: event.visibility,
      sports: event.sports,
      sponsorLogos: event.sponsorLogos,
      exportedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    // Sanitize filename to prevent path traversal
    const safeName = event.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
    const filename = `${safeName}_${event.eventId}.json`;

    return { success: true, data: jsonString, filename };
  } catch (error) {
    console.error("Error exporting event data:", error);
    return {
      success: false,
      error: GENERIC_ERROR_MESSAGES.EXPORT_FAILED,
    };
  }
}
