import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://erdogankasap.com';

  // Ana sayfalar
  const routes = [
    '',
    '/urunler',
    '/rehber',
    '/dry-aged',
    '/hayvanlarimiz',
    '/kurban',
    '/canli-kesim',
    '/vekalet',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dinamik Ürünler (Eğer varsa)
  try {
    const products = await prisma.product.findMany({
      select: { id: true, updatedAt: true },
    });

    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/urunler/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Dinamik Rehber İçerikleri (Eğer varsa)
    const guides = await prisma.guide.findMany({
      select: { id: true, updatedAt: true },
    });

    const guideRoutes = guides.map((guide) => ({
      url: `${baseUrl}/rehber/${guide.id}`,
      lastModified: guide.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

    return [...routes, ...productRoutes, ...guideRoutes];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return routes;
  }
}
