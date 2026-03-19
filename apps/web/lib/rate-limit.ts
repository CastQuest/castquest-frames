/**
 * Simple in-memory rate limiter for Next.js API routes and server actions
 * 
 * Usage:
 * ```typescript
 * import { rateLimit, RateLimitError } from "@/lib/rate-limit"
 * 
 * export async function POST(request: Request) {
 *   const ip = request.headers.get("x-forwarded-for") || "anonymous"
 *   
 *   try {
 *     await rateLimit.check(ip, { limit: 10, window: 60 }) // 10 requests per minute
 *   } catch (error) {
 *     if (error instanceof RateLimitError) {
 *       return Response.json({ error: "Too many requests" }, { status: 429 })
 *     }
 *     throw error
 *   }
 *   
 *   // Handle request...
 * }
 * ```
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in seconds */
  window: number
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  limit: parseInt(process.env.RATE_LIMIT_PER_MINUTE ?? "60", 10),
  window: 60, // 1 minute
}

// In-memory store for rate limit data
// In production, use Redis or similar for distributed rate limiting
const store = new Map<string, RateLimitEntry>()

// Cleanup old entries periodically
const CLEANUP_INTERVAL = 60 * 1000 // 1 minute
let cleanupTimer: NodeJS.Timeout | null = null

function startCleanup() {
  if (cleanupTimer) return
  
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) {
        store.delete(key)
      }
    }
  }, CLEANUP_INTERVAL)
  
  // Don't prevent process from exiting
  cleanupTimer.unref()
}

export class RateLimitError extends Error {
  public readonly retryAfter: number
  public readonly limit: number
  public readonly remaining: number

  constructor(retryAfter: number, limit: number, remaining: number) {
    super(`Rate limit exceeded. Retry after ${retryAfter} seconds.`)
    this.name = "RateLimitError"
    this.retryAfter = retryAfter
    this.limit = limit
    this.remaining = remaining
  }
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

class RateLimiter {
  constructor() {
    startCleanup()
  }

  /**
   * Check if a request is rate limited
   * @throws {RateLimitError} if rate limit is exceeded
   */
  async check(
    identifier: string,
    options: Partial<RateLimitOptions> = {}
  ): Promise<RateLimitResult> {
    const { limit, window } = { ...DEFAULT_OPTIONS, ...options }
    const key = `ratelimit:${identifier}`
    const now = Date.now()
    const windowMs = window * 1000

    let entry = store.get(key)

    // If no entry or window expired, create new entry
    if (!entry || entry.resetAt < now) {
      entry = {
        count: 1,
        resetAt: now + windowMs,
      }
      store.set(key, entry)
      
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: entry.resetAt,
      }
    }

    // Increment count
    entry.count++
    store.set(key, entry)

    const remaining = Math.max(0, limit - entry.count)
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)

    if (entry.count > limit) {
      throw new RateLimitError(retryAfter, limit, remaining)
    }

    return {
      success: true,
      limit,
      remaining,
      reset: entry.resetAt,
    }
  }

  /**
   * Get rate limit status without incrementing counter
   */
  async status(
    identifier: string,
    options: Partial<RateLimitOptions> = {}
  ): Promise<RateLimitResult> {
    const { limit, window } = { ...DEFAULT_OPTIONS, ...options }
    const key = `ratelimit:${identifier}`
    const now = Date.now()
    const windowMs = window * 1000

    const entry = store.get(key)

    if (!entry || entry.resetAt < now) {
      return {
        success: true,
        limit,
        remaining: limit,
        reset: now + windowMs,
      }
    }

    const remaining = Math.max(0, limit - entry.count)

    return {
      success: entry.count <= limit,
      limit,
      remaining,
      reset: entry.resetAt,
    }
  }

  /**
   * Reset rate limit for an identifier
   */
  async reset(identifier: string): Promise<void> {
    const key = `ratelimit:${identifier}`
    store.delete(key)
  }

  /**
   * Clear all rate limit data
   */
  async clear(): Promise<void> {
    store.clear()
  }
}

// Export singleton instance
export const rateLimit = new RateLimiter()

// Export headers helper for API routes
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.floor(result.reset / 1000)),
  }
}

// Helper to get client IP from request
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  
  const realIP = request.headers.get("x-real-ip")
  if (realIP) {
    return realIP
  }
  
  return "anonymous"
}
