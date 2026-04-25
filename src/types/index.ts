// ── Ürünler ──
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl?: string;
  cookingTips: string[];
  inStock: boolean;
  stockQuantityGr?: number | null;
  unit: ProductUnit;
}

export type ProductCategory =
  | "dana"
  | "kuzu"
  | "tavuk"
  | "kusbasi"
  | "kiyma"
  | "biftek"
  | "sucuk"
  | "pastirma"
  | "ozel";

export type ProductUnit = "ADET" | "KG" | "GR";

// ── Hayvan & Hisse ──
export type AnimalStatus = "BEKLEMEDE" | "KESILDI" | "PARCALANDI";
export type ShareStatus = "MUSAIT" | "REZERVE" | "SATILDI" | "TESLIM";
export type PaymentStatus = "BEKLEMEDE" | "ONAYLANDI" | "IADE";
export type PaymentMethod = "NAKIT" | "HAVALE" | "KART";
export type OrderStatus = "BEKLEMEDE" | "HAZIRLANIYOR" | "KARGODA" | "TESLIM" | "IPTAL";
export type DryAgedStatus = "DINLENIYOR" | "HAZIR" | "TESLIM";
export type UserRole = "CUSTOMER" | "ADMIN" | "BUTCHER";

export interface Animal {
  id: string;
  breed: string;
  totalKg: number;
  status: AnimalStatus;
  streamUrl?: string;
  slaughterDate?: string;
}

export interface Share {
  id: string;
  animalId: string;
  shareNumber: number;
  customerName?: string;
  customerPhone?: string;
  status: ShareStatus;
  price?: number;
  payment?: SharePayment | null;
}

export interface SharePayment {
  id: string;
  shareId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptUrl?: string | null;
  notes?: string | null;
  paidAt?: string | null;
}

export interface ShareDistribution {
  perShareKg: number;
  kiymaKg: number;
  kusbasiKg: number;
  kemikliKg: number;
  digerKg: number;
  totalKg: number;
}

// ── Adres ──
export interface Address {
  id: string;
  userId?: string | null;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  postalCode?: string | null;
  isDefault: boolean;
}

// ── Sipariş ──
export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  totalAmount: number;
  addressId?: string | null;
}

// ── Navigasyon ──
export interface NavLink {
  label: string;
  href: string;
}

// ── Hizmet Kartı ──
export interface ServiceCard {
  title: string;
  description: string;
  icon: string;
  href: string;
}
