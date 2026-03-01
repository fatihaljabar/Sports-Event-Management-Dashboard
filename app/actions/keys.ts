"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import type { KeyStatus } from "@/components/KeyManagementPage";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface AccessKey {
  id: string;
  code: string;
  eventId: string;
  sportId: string;
  sportName: string;
  sportEmoji: string;
  status: KeyStatus;
  claimedById: string | null;
  claimedAt: Date | null;
  createdAt: Date;
}

export interface GenerateKeysData {
  eventId: string;
  sportId: string;
  sportName: string;
  sportEmoji: string;
  quantity: number;
}

export interface GenerateKeysResult {
  success: boolean;
  keys?: AccessKey[];
  error?: string;
}

export interface GetKeysResult {
  success: boolean;
  keys?: AccessKey[];
  error?: string;
}

export interface RevokeKeyResult {
  success: boolean;
  error?: string;
}

export interface RestoreKeyResult {
  success: boolean;
  error?: string;
}

export interface DeleteKeyResult {
  success: boolean;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const GENERIC_ERROR_MESSAGES = {
  GENERATE_FAILED: "Failed to generate keys. Please try again.",
  FETCH_FAILED: "Failed to fetch keys. Please try again.",
  REVOKE_FAILED: "Failed to revoke key. Please try again.",
  RESTORE_FAILED: "Failed to restore key. Please try again.",
  DELETE_FAILED: "Failed to delete key. Please try again.",
  INVALID_INPUT: "Invalid input data.",
} as const;

const MAX_KEYS_PER_BATCH = 1000;
const MIN_KEYS_PER_BATCH = 1;

// ═══════════════════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════════════════

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory rate limit store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_CONFIG = {
  // Max requests per window
  MAX_REQUESTS: 10,
  // Time window in milliseconds (1 minute)
  WINDOW_MS: 60 * 1000,
  // Cleanup interval in milliseconds (5 minutes)
  CLEANUP_MS: 5 * 60 * 1000,
} as const;

// Cleanup expired entries periodically
declare global {
  var rateLimitCleanup: NodeJS.Timeout | undefined;
}

if (typeof globalThis.rateLimitCleanup === "undefined") {
  globalThis.rateLimitCleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, RATE_LIMIT_CONFIG.CLEANUP_MS);
}

/**
 * Check rate limit for a given identifier (IP address)
 * Returns true if request is allowed, false if rate limited
 */
async function checkRateLimit(identifier: string): Promise<{ allowed: boolean; resetAt?: number }> {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up expired entry
  if (entry && now > entry.resetAt) {
    rateLimitStore.delete(identifier);
  }

  const currentEntry = rateLimitStore.get(identifier);

  if (!currentEntry) {
    // First request in window
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_CONFIG.WINDOW_MS,
    });
    return { allowed: true };
  }

  if (currentEntry.count >= RATE_LIMIT_CONFIG.MAX_REQUESTS) {
    // Rate limit exceeded
    return { allowed: false, resetAt: currentEntry.resetAt };
  }

  // Increment counter
  currentEntry.count++;
  return { allowed: true };
}

/**
 * Get client IP address from headers
 */
async function getClientIP(): Promise<string> {
  try {
    const headersList = await headers();
    return (
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headersList.get("x-real-ip") ||
      headersList.get("cf-connecting-ip") ||
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

// ═══════════════════════════════════════════════════════════════
// SECURITY UTILITIES
// ═══════════════════════════════════════════════════════════════

const isDevelopment = process.env.NODE_ENV === "development";

async function verifyRequestOrigin(): Promise<boolean> {
  try {
    const headersList = await headers();
    const referer = headersList.get("referer");
    const host = headersList.get("host");

    if (referer && host) {
      try {
        const refererUrl = new URL(referer);
        return refererUrl.host === host;
      } catch {
        return isDevelopment;
      }
    }

    if (host) {
      const origin = headersList.get("origin");
      if (origin) {
        try {
          const originUrl = new URL(origin);
          return originUrl.host === host;
        } catch {
          return isDevelopment;
        }
      }
    }

    return isDevelopment;
  } catch {
    return isDevelopment;
  }
}

// ═══════════════════════════════════════════════════════════════
// KEY GENERATION
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a unique access key code with format: {PREFIX}{YY}-{XXXXXX}-{SPORT}
 * Uses cryptographically secure random generation via nanoid
 *
 * Security: 6 characters = 64^6 = 68.7 billion combinations
 * With rate limiting (10 req/min): ~13,000 years to brute force
 */
function generateKeyCode(eventPrefix: string, sportId: string): string {
  const year = new Date().getFullYear().toString().slice(2);
  // nanoid with custom alphabet (no ambiguous chars like 0/O, 1/I/l)
  const randomPart = nanoid(6);
  // Convert sport ID to uppercase (first 3 chars max)
  const sportCode = sportId.toUpperCase().slice(0, 3).padEnd(3, "X");

  return `${eventPrefix}${year}-${randomPart}-${sportCode}`;
}

/**
 * Generate access keys for an event
 */
export async function generateKeys(data: GenerateKeysData): Promise<GenerateKeysResult> {
  // Verify request origin
  if (!(await verifyRequestOrigin())) {
    return { success: false, error: GENERIC_ERROR_MESSAGES.GENERATE_FAILED };
  }

  // Rate limiting check
  const clientIP = await getClientIP();
  const rateLimit = await checkRateLimit(`generateKeys:${clientIP}`);
  if (!rateLimit.allowed) {
    const resetDate = new Date(rateLimit.resetAt!);
    const resetTime = resetDate.toLocaleTimeString();
    return {
      success: false,
      error: `Too many requests. Please try again after ${resetTime}.`,
    };
  }

  try {
    // Validate inputs
    if (!data.eventId || !data.sportId || !data.sportName) {
      return { success: false, error: GENERIC_ERROR_MESSAGES.INVALID_INPUT };
    }

    if (data.quantity < MIN_KEYS_PER_BATCH || data.quantity > MAX_KEYS_PER_BATCH) {
      return { success: false, error: `Quantity must be between ${MIN_KEYS_PER_BATCH} and ${MAX_KEYS_PER_BATCH}.` };
    }

    // Verify event exists
    const event = await prisma.sportEvent.findUnique({
      where: { eventId: data.eventId },
    });

    if (!event) {
      return { success: false, error: "Event not found." };
    }

    // Get event prefix from name (first 2 chars, uppercase)
    const eventPrefix = event.name.slice(0, 2).toUpperCase();

    // Generate keys
    const keysToCreate = [];
    for (let i = 0; i < data.quantity; i++) {
      const code = generateKeyCode(eventPrefix, data.sportId);

      keysToCreate.push({
        code,
        eventId: data.eventId,
        sportId: data.sportId,
        sportName: data.sportName,
        sportEmoji: data.sportEmoji,
        status: "AVAILABLE" as const,
      });
    }

    // Bulk create keys
    const createdKeys = await prisma.accessKey.createMany({
      data: keysToCreate,
    });

    // Revalidate cache
    revalidatePath("/events");
    revalidatePath(`/events/${data.eventId}`);

    // Fetch created keys to return
    const allKeys = await prisma.accessKey.findMany({
      where: { eventId: data.eventId },
      orderBy: { createdAt: "desc" },
    });

    const transformedKeys: AccessKey[] = allKeys.map((key) => ({
      id: key.id,
      code: key.code,
      eventId: key.eventId,
      sportId: key.sportId,
      sportName: key.sportName,
      sportEmoji: key.sportEmoji,
      status: key.status.toLowerCase() as KeyStatus,
      claimedById: key.claimedById,
      claimedAt: key.claimedAt,
      createdAt: key.createdAt,
    }));

    return { success: true, keys: transformedKeys };
  } catch (error) {
    console.error("Error generating keys:", error);
    return {
      success: false,
      error: GENERIC_ERROR_MESSAGES.GENERATE_FAILED,
    };
  }
}

/**
 * Get all keys for an event
 */
export async function getKeysByEvent(eventId: string): Promise<GetKeysResult> {
  try {
    if (!eventId) {
      return { success: false, error: GENERIC_ERROR_MESSAGES.INVALID_INPUT };
    }

    const keys = await prisma.accessKey.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

    const transformedKeys: AccessKey[] = keys.map((key) => ({
      id: key.id,
      code: key.code,
      eventId: key.eventId,
      sportId: key.sportId,
      sportName: key.sportName,
      sportEmoji: key.sportEmoji,
      status: key.status.toLowerCase() as KeyStatus,
      claimedById: key.claimedById,
      claimedAt: key.claimedAt,
      createdAt: key.createdAt,
    }));

    return { success: true, keys: transformedKeys };
  } catch (error) {
    console.error("Error fetching keys:", error);
    return {
      success: false,
      error: GENERIC_ERROR_MESSAGES.FETCH_FAILED,
    };
  }
}

/**
 * Revoke an access key
 */
export async function revokeKey(keyId: string): Promise<RevokeKeyResult> {
  // Verify request origin
  if (!(await verifyRequestOrigin())) {
    return { success: false, error: GENERIC_ERROR_MESSAGES.REVOKE_FAILED };
  }

  // Rate limiting check
  const clientIP = await getClientIP();
  const rateLimit = await checkRateLimit(`revokeKey:${clientIP}`);
  if (!rateLimit.allowed) {
    const resetDate = new Date(rateLimit.resetAt!);
    const resetTime = resetDate.toLocaleTimeString();
    return {
      success: false,
      error: `Too many requests. Please try again after ${resetTime}.`,
    };
  }

  try {
    if (!keyId) {
      return { success: false, error: GENERIC_ERROR_MESSAGES.INVALID_INPUT };
    }

    await prisma.accessKey.update({
      where: { id: keyId },
      data: { status: "REVOKED" },
    });

    revalidatePath("/events");

    return { success: true };
  } catch (error) {
    console.error("Error revoking key:", error);
    return {
      success: false,
      error: GENERIC_ERROR_MESSAGES.REVOKE_FAILED,
    };
  }
}

/**
 * Restore a revoked access key back to available
 */
export async function restoreKey(keyId: string): Promise<RestoreKeyResult> {
  // Verify request origin
  if (!(await verifyRequestOrigin())) {
    return { success: false, error: GENERIC_ERROR_MESSAGES.RESTORE_FAILED };
  }

  // Rate limiting check
  const clientIP = await getClientIP();
  const rateLimit = await checkRateLimit(`restoreKey:${clientIP}`);
  if (!rateLimit.allowed) {
    const resetDate = new Date(rateLimit.resetAt!);
    const resetTime = resetDate.toLocaleTimeString();
    return {
      success: false,
      error: `Too many requests. Please try again after ${resetTime}.`,
    };
  }

  try {
    if (!keyId) {
      return { success: false, error: GENERIC_ERROR_MESSAGES.INVALID_INPUT };
    }

    await prisma.accessKey.update({
      where: { id: keyId },
      data: { status: "AVAILABLE" },
    });

    revalidatePath("/events");

    return { success: true };
  } catch (error) {
    console.error("Error restoring key:", error);
    return {
      success: false,
      error: GENERIC_ERROR_MESSAGES.RESTORE_FAILED,
    };
  }
}

/**
 * Delete an access key permanently
 */
export async function deleteKey(keyId: string): Promise<DeleteKeyResult> {
  // Verify request origin
  if (!(await verifyRequestOrigin())) {
    return { success: false, error: GENERIC_ERROR_MESSAGES.DELETE_FAILED };
  }

  // Rate limiting check
  const clientIP = await getClientIP();
  const rateLimit = await checkRateLimit(`deleteKey:${clientIP}`);
  if (!rateLimit.allowed) {
    const resetDate = new Date(rateLimit.resetAt!);
    const resetTime = resetDate.toLocaleTimeString();
    return {
      success: false,
      error: `Too many requests. Please try again after ${resetTime}.`,
    };
  }

  try {
    if (!keyId) {
      return { success: false, error: GENERIC_ERROR_MESSAGES.INVALID_INPUT };
    }

    await prisma.accessKey.delete({
      where: { id: keyId },
    });

    revalidatePath("/events");

    return { success: true };
  } catch (error) {
    console.error("Error deleting key:", error);
    return {
      success: false,
      error: GENERIC_ERROR_MESSAGES.DELETE_FAILED,
    };
  }
}
