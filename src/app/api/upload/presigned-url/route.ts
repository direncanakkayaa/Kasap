import { NextResponse } from 'next/server';
import { generatePresignedUrl } from '@/lib/s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Bu işlem için giriş yapmalısınız.' }, { status: 401 });
    }

    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'Lütfen fileName ve fileType alanlarını gönderin.' },
        { status: 400 }
      );
    }

    const data = await generatePresignedUrl(fileName, fileType);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    return NextResponse.json(
      { error: 'Yükleme URL\'i oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
