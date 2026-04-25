import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

const globalForRedis = global as unknown as { redis: Redis };

export const redis = globalForRedis.redis || new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null, // Critical for BullMQ
});

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
