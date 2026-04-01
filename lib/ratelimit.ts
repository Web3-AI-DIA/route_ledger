import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function checkRateLimit(identifier: string) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("Upstash Redis environment variables are not set. Rate limiting is disabled.");
    return { success: true, remaining: 10, reset: Date.now() + 10000 };
  }
  
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
  return { success, limit, reset, remaining };
}
