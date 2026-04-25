import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379');
const redisPassword = process.env.REDIS_PASSWORD;

const redis = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
});

export interface RateLimitConfig {
  limit: number;
  window: number; // seconds
}

export async function rateLimit(identifier: string, config: RateLimitConfig) {
  const key = `ratelimit:${identifier}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, config.window);
  }

  return {
    success: current <= config.limit,
    remaining: Math.max(0, config.limit - current),
    reset: await redis.ttl(key),
  };
}
