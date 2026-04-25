"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, FileText, MapPin, ReceiptText } from "lucide-react";
import { confirmSharePayment, refundSharePayment } from "@/app/actions/payment-actions";
import { useRouter } from "next/navigation";

export default function AdminPaymentPanel({ pendingPayments }: { pendingPayments: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!pendingPayments || pendingPayments.length === 0) return null;

  const handleConfirm = (paymentId: string) => {
    if (confirm("Bu ödemeyi onaylamak istiyor musunuz? Hisse 'SATILDI' statüsüne geçecektir.")) {
      startTransition(async () => {
        await confirmSharePayment(paymentId);
        router.refresh();
      });
    }
  };

  const handleRefund = (paymentId: string) => {
    if (confirm("Bu işlemi reddedip iade etmek istiyor musunuz? Hisse tekrar 'MUSAIT' statüsüne geçecektir.")) {
      startTransition(async () => {
        await refundSharePayment(paymentId);
        router.refresh();
      });
    }
  };

  return (
    <section className="space-y-6 mt-8 mb-12">
      <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-serif text-red-500 flex items-center gap-3 mb-6 border-b border-red-500/20 pb-3">
          <ReceiptText className="w-6 h-6" /> Bekleyen Ödeme Onayları (Admin Modülü)
        </h2>
        
        <div className="grid gap-4">
          {pendingPayments.map((payment) => (
            <div key={payment.id} className="bg-charcoal-black border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              
              {/* Payment Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-antique-gold/20 text-antique-gold px-3 py-1 rounded-lg text-xs font-bold uppercase">
                    {payment.method}
                  </span>
                  <span className="text-xl font-serif text-white">₺{payment.amount.toLocaleString()}</span>
                  <span className="text-xs text-ivory/50">{new Date(payment.createdAt).toLocaleString('tr-TR')}</span>
                </div>
                
                <h3 className="text-sm font-bold text-ivory/80 mb-1">
                  Oda: {payment.share.animal.breed} (Küpe: {payment.share.animal.id.slice(0,6)}) - {payment.share.shareNumber}. Hisse
                </h3>
                <p className="text-sm text-ivory/60">
                  Müşteri: <span className="text-ivory">{payment.share.customerName}</span> ({payment.share.customerPhone})
                </p>

                {payment.share.address && (
                  <p className="text-xs text-ivory/50 mt-2 flex items-start gap-1">
                    <MapPin size={14} className="min-w-[14px] mt-0.5" />
                    {payment.share.address.street}, {payment.share.address.district} / {payment.share.address.city}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleRefund(payment.id)}
                  disabled={isPending}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm disabled:opacity-50"
                  title="Reddet ve Müsait Yap"
                >
                  <XCircle size={18} /> Reddet
                </button>
                <button
                  onClick={() => handleConfirm(payment.id)}
                  disabled={isPending}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-900/50 text-sm disabled:opacity-50"
                >
                  <CheckCircle2 size={18} /> Ödemeyi Onayla
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
