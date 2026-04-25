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
  } catch (error) {
    healthStatus.status = 'unhealthy';
    healthStatus.services.database = 'error';
  }

  try {
    // Check Redis
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    const pong = await redis.ping();
    if (pong === 'PONG') {
      healthStatus.services.redis = 'connected';
    }
    await redis.quit();
  } catch (error) {
    // Redis might not be critical for basic health but good to know
    healthStatus.services.redis = 'error';
  }

  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  return NextResponse.json(healthStatus, { status: statusCode });
}
