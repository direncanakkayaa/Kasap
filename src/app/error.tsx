'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
    console.error('Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <AlertCircle size={200} className="text-red-900" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-red-50 p-4 rounded-full mb-6">
              <AlertCircle className="text-red-600 w-12 h-12" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Eyvah! Bir Hata Oluştu</h1>
            <p className="text-slate-600 text-lg">
              Beklenmedik bir sorunla karşılaştık. Teknik ekibimiz durumdan haberdar edildi.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <RefreshCcw size={18} />
            Tekrar Dene
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Home size={18} />
            Ana Sayfaya Dön
          </Link>
        </div>

        <div className="pt-8">
          <p className="text-slate-400 text-sm">
            Hata Kodu: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{error.digest || 'ERR_UNKNOWN'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
