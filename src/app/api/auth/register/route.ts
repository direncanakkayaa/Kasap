import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // Rate Limiting: 1 saatte en fazla 5 kayıt denemesi
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || 'unknown';
    const { success } = await rateLimit(`register:${ip}`, { limit: 5, window: 3600 });
    
    if (!success) {
      return NextResponse.json(
        { error: 'Çok fazla kayıt denemesi yaptınız. Lütfen daha sonra tekrar deneyin.' }, 
        { status: 429 }
      );
    }

    const { name, phone, email, password } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Lütfen zorunlu alanları doldurun.' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          ...(email ? [{ email }] : [])
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Bu telefon numarası veya e-posta ile uyuşan bir hesap zaten mevcut.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone: cleanPhone,
        email: email || undefined,
        passwordHash,
      }
    });

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name } }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Kayıt sırasında bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
