import { z } from 'zod';

const envSchema = z.object({
  // Veritabanı
  DATABASE_URL: z.string().url(),
  
  // Auth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  
  // S3 Storage
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_S3_BUCKET_NAME: z.string().min(1),
  
  // API Keys
  GEMINI_API_KEY: z.string().optional(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

// Validate process.env
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Geçersiz Çevre Değişkenleri (Invalid Environment Variables):');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Geçersiz çevre değişkenleri nedeniyle uygulama başlatılamadı.');
  }
}

export const env = parsed.success ? parsed.data : process.env as any;
