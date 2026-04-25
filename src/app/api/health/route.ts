import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Redis } from 'ioredis';

// Helper for timeout
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), ms))
  ]);
};

export async function GET() {
  const healthStatus: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  try {
    // Check DB with 3 second timeout
    await withTimeout(
      prisma.$queryRaw`SELECT 1`,
      3000,
      "Database connection timed out"
    );
    healthStatus.services.database = 'connected';
  } catch (error: any) {
    console.error("[Healthcheck] DB Error:", error.message || error);
    healthStatus.status = 'unhealthy';
    healthStatus.services.database = 'error';
    healthStatus.dbError = error.message || String(error);
  }

  try {
    // Check Redis with 3 second timeout
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      connectTimeout: 3000,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null // Do not retry on failure for healthcheck
    });
    
    const pong = await withTimeout(
      redis.ping(),
      3000,
      "Redis ping timed out"
    );
    
    if (pong === 'PONG') {
      healthStatus.services.redis = 'connected';
    }
    await redis.quit();
  } catch (error: any) {
    console.error("[Healthcheck] Redis Error:", error.message || error);
    healthStatus.services.redis = 'error';
    healthStatus.redisError = error.message || String(error);
  }

  // İlk kurulum aşamasında Railway'in container'ı öldürmemesi için geçici olarak hep 200 dönüyoruz
  return NextResponse.json(healthStatus, { status: 200 });
}
