/**
 * Rate Limiting Utility
 * Provides in-memory rate limiting for Server Actions and API routes
 *
 * Note: For production with multiple server instances, use Redis or similar
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limit configuration per endpoint type
 */
export const RATE_LIMIT_CONFIG = {
  // Default: 60 requests per minute
  DEFAULT: { maxRequests: 60, windowMs: 60 * 1000 },

  // Strict: 10 requests per minute (for sensitive operations)
  STRICT: { maxRequests: 10, windowMs: 60 * 1000 },

  // Lenient: 120 requests per minute (for read operations)
  LENIENT: { maxRequests: 120, windowMs: 60 * 1000 },

  // Upload: 5 uploads per minute (for file uploads)
  UPLOAD: { maxRequests: 5, windowMs: 60 * 1000 },
} as const;

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIG;

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param type - Rate limit type to apply
 * @returns Object with success status and remaining count
 */
export function checkRateLimit(
  identifier: string,
  type: RateLimitType = "DEFAULT"
): { success: boolean; remaining: number; resetTime?: number } {
  const config = RATE_LIMIT_CONFIG[type];
  const now = Date.now();

  // Get or create rate limit entry
  let entry = rateLimitStore.get(identifier);

  // Reset if window expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(identifier, entry);
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or admin actions
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Clean up expired entries from the store
 * Call this periodically to prevent memory leaks
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Auto-cleanup expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Get client IP address from headers
 */
export async function getClientIp(): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();

    // Check various headers for IP (in order of reliability)
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const cfConnectingIp = headersList.get("cf-connecting-ip");

    if (forwardedFor) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return forwardedFor.split(",")[0].trim();
    }

    if (realIp) {
      return realIp;
    }

    if (cfConnectingIp) {
      return cfConnectingIp;
    }

    // Fallback to a default (should not happen in production)
    return "unknown";
  } catch {
    return "unknown";
  }
}
