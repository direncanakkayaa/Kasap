import type { ShareDistribution } from "@/types";

export interface MeatCategory {
  key: keyof Omit<ShareDistribution, "perShareKg" | "totalKg">;
  label: string;
  percentage: number;
  color: string;
}

export const MEAT_CATEGORIES: MeatCategory[] = [
  { key: "kiymaKg", label: "Kıyma", percentage: 0.4, color: "#A0334D" },
  { key: "kusbasiKg", label: "Kuşbaşı", percentage: 0.3, color: "#D4AF37" },
  { key: "kemikliKg", label: "Kemikli Et", percentage: 0.2, color: "#B8960E" },
  { key: "digerKg", label: "Fire / Diğer", percentage: 0.1, color: "#5C0017" },
];

/**
 * Karkas ağırlığından hisse başı et dağılımını hesaplar
 */
export function calculateShareDistribution(
  totalKg: number,
  shareCount: number = 7
): ShareDistribution {
  const perShare = totalKg / shareCount;

  return {
    perShareKg: perShare,
    kiymaKg: +(perShare * 0.4).toFixed(1),
    kusbasiKg: +(perShare * 0.3).toFixed(1),
    kemikliKg: +(perShare * 0.2).toFixed(1),
    digerKg: +(perShare * 0.1).toFixed(1),
    totalKg: +perShare.toFixed(1),
  };
}
