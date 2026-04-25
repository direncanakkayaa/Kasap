import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import RehberClient from "./RehberClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Et Rehberi — Kasap Erdoğan",
  description: "Antalya'nın uzman kasaplarından et hazırlama ve pişirme rehberi.",
};

export default async function RehberPage() {
  let guides = await prisma.meatGuide.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      animalType: true,
      shortDesc: true,
      imageUrl: true,
      breedRecommendations: true,
    },
  });

  return <RehberClient guides={guides as any} />;
}
