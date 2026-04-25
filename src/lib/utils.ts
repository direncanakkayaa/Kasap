/**
 * className birleştirme (falsy değerleri filtreler)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Para birimi formatla (₺)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Kilogram formatla
 */
export function formatKg(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}
