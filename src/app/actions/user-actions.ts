"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function getUserAddresses() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  return await prisma.address.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { isDefault: "desc" },
  });
}

export async function createAddress(data: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const address = await prisma.address.create({
    data: {
      ...data,
      userId: (session.user as any).id,
    },
  });

  revalidatePath("/sepet");
  return address;
}

export async function setDefaultAddress(addressId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    }),
    prisma.address.update({
      where: { id: addressId, userId },
      data: { isDefault: true },
    }),
  ]);

  revalidatePath("/sepet");
}
