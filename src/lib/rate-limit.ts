/**
 * Simple in-memory rate limiter with sliding window
 * For production, consider using Redis with @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > 3600000) { // Remove entries older than 1 hour
      store.delete(key);
    }
  }
}, 300000);

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async check(key: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const now = Date.now();
    const entry = store.get(key);

    // If no entry or window has passed, create new entry
    if (!entry || now - entry.windowStart > this.config.windowMs) {
      store.set(key, {
        count: 1,
        windowStart: now,
      });
      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        reset: now + this.config.windowMs,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.config.maxRequests) {
      return {
        success: false,
        limit: this.config.maxRequests,
        remaining: 0,
        reset: entry.windowStart + this.config.windowMs,
      };
    }

    // Increment count
    entry.count++;
    store.set(key, entry);

    return {
      success: true,
      limit: this.config.maxRequests,
      remaining: this.config.maxRequests - entry.count,
      reset: entry.windowStart + this.config.windowMs,
    };
  }
}

// Rate limiter instances for different endpoints
export const generateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 requests per minute (adjust as needed)
});

// For authenticated users (higher limits)
export const generateLimiterAuthenticated = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute for logged in users
});

// Helper to get client IP from request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return "anonymous";
}
