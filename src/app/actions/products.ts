"use server";

import { prisma } from "@/lib/prisma";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getAdditions() {
  try {
    const additions = await prisma.addition.findMany({
      where: { inStock: true },
      orderBy: { category: "asc" },
    });
    return additions;
  } catch (error) {
    console.error("Failed to fetch additions:", error);
    return [];
  }
}
