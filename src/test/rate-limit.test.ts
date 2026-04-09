import { describe, it, expect, beforeEach, vi } from "vitest";
import { RateLimiter } from "@/lib/rate-limit";

describe("Rate Limiter", () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    // Create a limiter with short window for testing
    limiter = new RateLimiter({
      windowMs: 1000, // 1 second window
      maxRequests: 3, // 3 requests per window
    });
  });

  it("should allow requests under the limit", async () => {
    const key = "test-user-1";

    const result1 = await limiter.check(key);
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = await limiter.check(key);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = await limiter.check(key);
    expect(result3.success).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it("should block requests over the limit", async () => {
    const key = "test-user-2";

    // Make 3 requests (at limit)
    await limiter.check(key);
    await limiter.check(key);
    await limiter.check(key);

    // 4th request should be blocked
    const result = await limiter.check(key);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should track different keys independently", async () => {
    const key1 = "user-a";
    const key2 = "user-b";

    // Exhaust limit for user-a
    await limiter.check(key1);
    await limiter.check(key1);
    await limiter.check(key1);

    const resultA = await limiter.check(key1);
    expect(resultA.success).toBe(false);

    // User-b should still have full limit
    const resultB = await limiter.check(key2);
    expect(resultB.success).toBe(true);
    expect(resultB.remaining).toBe(2);
  });

  it("should include rate limit headers in response", async () => {
    const key = "test-user-3";

    const result = await limiter.check(key);
    expect(result.limit).toBe(3);
    expect(result.remaining).toBe(2);
    expect(result.reset).toBeTypeOf("number");
    expect(result.reset).toBeGreaterThan(Date.now());
  });
});
