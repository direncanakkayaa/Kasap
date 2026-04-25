"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateProduct(id: string, data: any) {
  const product = await prisma.product.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/products");
  revalidatePath("/urunler");
  return product;
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });
  revalidatePath("/admin/products");
  revalidatePath("/urunler");
}

export async function createProduct(data: any) {
  const product = await prisma.product.create({
    data,
  });
  revalidatePath("/admin/products");
  revalidatePath("/urunler");
  return product;
}

// User Actions
export async function getAllUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(id: string, role: any) {
  await prisma.user.update({
    where: { id },
    data: { role },
  });
  revalidatePath("/admin/users");
}

// Guide Actions
export async function getAllGuides() {
  return await prisma.meatGuide.findMany({
    orderBy: { title: "asc" },
  });
}

export async function updateGuide(id: string, data: any) {
  const guide = await prisma.meatGuide.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/guide");
  revalidatePath("/rehber");
  revalidatePath(`/rehber/${guide.slug}`);
  return guide;
}
