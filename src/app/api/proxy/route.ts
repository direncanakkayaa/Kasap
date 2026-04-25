import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shareId, customerName, customerTc, signatureData, consentText } = body;

    if (!shareId || !customerName || !customerTc || !signatureData) {
      return NextResponse.json(
        { error: 'Tüm alanların doldurulması zorunludur.' },
        { status: 400 }
      );
    }

    // Hisse var mı kontrol et
    const share = await prisma.share.findUnique({ where: { id: shareId } });
    if (!share) {
      return NextResponse.json(
        { error: 'Belirtilen hisse bulunamadı. Lütfen Hisse ID numaranızı kontrol edin.' },
        { status: 404 }
      );
    }

    // Hisse en azından REZERVE veya SATILDI olmalı (ödeme bekleniyor/tamamlandı)
    if (share.status === 'MUSAIT') {
      return NextResponse.json(
        { error: 'Vekalet vermek için önce hisseyi rezerve etmeniz gerekmektedir.' },
        { status: 400 }
      );
    }

    // Zaten vekalet var mı?
    const existingProxy = await prisma.proxyConsent.findUnique({ where: { shareId } });
    if (existingProxy) {
      return NextResponse.json({ error: 'Bu hisse için zaten vekalet verilmiş.' }, { status: 400 });
    }

    // Vekalet oluştur — Share statusunu DEĞİŞTİRME (ödeme onayı ayrı akış)
    const proxyConsent = await prisma.proxyConsent.create({
      data: {
        shareId,
        customerName,
        customerTc,
        signatureData,
        consentText:
          consentText ||
          'Erdoğan Kasap nezdinde kesilecek olan kurbanlık hissem için firmaya dijital olarak vekalet veriyorum.',
      },
    });

    return NextResponse.json({ success: true, data: proxyConsent }, { status: 201 });
  } catch (error) {
    console.error('Proxy Consent Error:', error);
    return NextResponse.json(
      { error: 'Vekalet işlemi sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
