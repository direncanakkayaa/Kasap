"use client";

import { Check, Clock, Utensils, Truck, CheckCircle2 } from "lucide-react";

interface StatusStepperProps {
  currentStatus: string;
  type: "share" | "order" | "dry-aged";
}

const STEPS = {
  share: [
    { id: "REZERVE",    label: "Rezerve Edildi",  icon: Clock },
    { id: "SATILDI",    label: "Ödeme Onaylandı", icon: Check },
    { id: "KESILDI",    label: "Kesim Yapıldı",   icon: Utensils },
    { id: "PARCALANDI", label: "Parçalandı",       icon: Utensils },
    { id: "TESLIM",     label: "Teslim Edildi",   icon: CheckCircle2 },
  ],
  order: [
    { id: "BEKLEMEDE",    label: "Sipariş Alındı",  icon: Clock },
    { id: "HAZIRLANIYOR", label: "Hazırlanıyor",    icon: Utensils },
    { id: "KARGODA",      label: "Yola Çıktı",      icon: Truck },
    { id: "TESLIM",       label: "Teslim Edildi",   icon: CheckCircle2 },
  ],
  "dry-aged": [
    { id: "DINLENIYOR", label: "Dinleniyor",     icon: Clock },
    { id: "HAZIR",      label: "Hazır",          icon: Check },
    { id: "TESLIM",     label: "Teslim Edildi",  icon: CheckCircle2 },
  ],
};

export function StatusStepper({ currentStatus, type }: StatusStepperProps) {
  const steps = STEPS[type];
  let activeIndex = steps.findIndex((s) => s.id === currentStatus);
  if (activeIndex === -1) activeIndex = 0;

  return (
    <div className="w-full py-4 overflow-x-auto no-scrollbar">
      <div className="min-w-[300px] sm:min-w-0">
        <div className="flex justify-between items-center relative px-4">
          <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 h-1 bg-[var(--taupe-surface)] z-0 rounded-full"></div>
          <div
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-[var(--antique-gold)] to-[#A98444] z-0 rounded-full transition-all duration-500"
            style={{ width: `calc(${(activeIndex / (steps.length - 1)) * 100}% - 2rem)` }}
          ></div>

          {steps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isCurrent = index === activeIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-[var(--antique-gold)] border-[var(--antique-gold)] text-[var(--deep-espresso)]"
                      : isCurrent
                      ? "bg-[#2A1B1A] border-[var(--antique-gold)] text-[var(--antique-gold)] shadow-[0_0_15px_rgba(197,160,89,0.5)]"
                      : "bg-[#2A1B1A] border-[var(--taupe-surface)] text-[var(--taupe-surface)]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap absolute -bottom-6 ${
                    isCurrent || isCompleted ? "text-[var(--antique-gold)]" : "text-[var(--taupe-surface)]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-8"></div>
    </div>
  );
}
