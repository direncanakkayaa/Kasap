"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/order-actions";
import { Clock, Package, Truck, CheckCircle2, XCircle } from "lucide-react";

const STATUS_FLOW: Record<string, { next: string; label: string; icon: any; color: string }[]> = {
  ODEME_BEKLENIYOR: [
    { next: "IPTAL", label: "İptal Et", icon: XCircle, color: "border border-red-500/50 text-red-400 hover:bg-red-500/10" },
  ],
  ONAYLANDI: [
    { next: "HAZIRLANIYOR", label: "Hazırla", icon: Package, color: "bg-orange-600 hover:bg-orange-500 text-white" },
    { next: "IPTAL", label: "İptal Et", icon: XCircle, color: "border border-red-500/50 text-red-400 hover:bg-red-500/10" },
  ],
  HAZIRLANIYOR: [
    { next: "YOLDA", label: "Kuryeye Ver", icon: Truck, color: "bg-blue-600 hover:bg-blue-500 text-white" },
    { next: "IPTAL", label: "İptal Et", icon: XCircle, color: "border border-red-500/50 text-red-400 hover:bg-red-500/10" },
  ],
  YOLDA: [
    { next: "TAMAMLANDI", label: "Teslim Edildi", icon: CheckCircle2, color: "bg-emerald-600 hover:bg-emerald-500 text-white" },
  ],
  TAMAMLANDI: [],
  IPTAL: [],
  BEKLEMEDE: [
     { next: "ONAYLANDI", label: "Onayla", icon: CheckCircle2, color: "bg-amber-600 text-white" }
  ]
};

export default function AdminOrderActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const actions = STATUS_FLOW[currentStatus] || [];

  if (actions.length === 0) return null;

  const handleAction = (newStatus: string) => {
    const confirmMsg =
      newStatus === "IPTAL"
        ? "Bu siparişi iptal etmek istediğinize emin misiniz?"
        : `Sipariş durumunu "${newStatus}" olarak güncellemek istiyor musunuz?`;

    if (!confirm(confirmMsg)) return;

    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.next}
            onClick={() => handleAction(action.next)}
            disabled={isPending}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 ${action.color}`}
          >
            <Icon size={14} />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
