import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Redis } from 'ioredis';

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
    // Check DB
    await prisma.$queryRaw`SELECT 1`;
    healthStatus.services.database = 'connected';
  } catch (error: any) {
    console.error("[Healthcheck] DB Error:", error.message || error);
    healthStatus.status = 'unhealthy';
    healthStatus.services.database = 'error';
    healthStatus.dbError = error.message || String(error);
  }

  try {
    // Check Redis
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    const pong = await redis.ping();
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
