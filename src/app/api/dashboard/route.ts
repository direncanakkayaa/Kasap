import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Telefon numarası gereklidir.' }, { status: 400 });
  }

  try {
    // Clean phone number (leave only digits for exact match, or use contains based on how it's saved)
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // Find shares by customer phone
    const shares = await prisma.share.findMany({
      where: { customerPhone: { contains: cleanPhone } },
      include: { animal: true, distribution: true },
    });

    // Find orders by customer phone
    const orders = await prisma.order.findMany({
      where: { customerPhone: { contains: cleanPhone } },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });

    // Find dry-aged orders by customer phone
    const dryAgedOrders = await prisma.dryAgedOrder.findMany({
      where: { customerPhone: { contains: cleanPhone } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ shares, orders, dryAgedOrders });
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
    return NextResponse.json({ error: 'Veriler alınırken hata oluştu.' }, { status: 500 });
  }
}
