import Redis from 'ioredis';

const globalForRedis = global as unknown as { redis: Redis };

export const redis = globalForRedis.redis || new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // Critical for BullMQ
  lazyConnect: true, // Build sırasında hemen bağlanmaya çalışıp hataya neden olmaması için
});

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
