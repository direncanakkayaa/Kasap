import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import GurmeChatBot from "@/components/chat/GurmeChatBot";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://erdogankasap.com'),
  title: {
    default: "Kasap Erdoğan — Premium Et & Şarküteri",
    template: "%s | Kasap Erdoğan"
  },
  description:
    "2010'dan beri Antalya'nın lezzet durağı. Kasap Erdoğan olarak, Muratpaşa (Yalı Caddesi) ve Lara şubelerimizde en taze ve kaliteli etleri sunuyoruz.",
  keywords: [
    "kasap", "et", "antalya kasap", "muratpaşa kasap", "lara kasap", 
    "kasap erdoğan", "dana", "kuzu", "biftek", "steakhouse"
  ],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://erdogankasap.com',
    siteName: 'Kasap Erdoğan',
    title: 'Kasap Erdoğan — Premium Et & Şarküteri',
    description: "2010'dan beri Antalya'nın lezzet durağı. En taze ve kaliteli etler.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kasap Erdoğan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kasap Erdoğan — Premium Et & Şarküteri',
    description: "2010'dan beri Antalya'nın lezzet durağı. En taze ve kaliteli etler.",
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-deep-espresso text-ivory">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <Footer />
            <GurmeChatBot />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
