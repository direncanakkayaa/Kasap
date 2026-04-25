"use server";

import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("Dosya bulunamadı");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const extension = file.name.split(".").pop();
  const fileName = `${randomUUID()}.${extension}`;
  const path = join(process.cwd(), "public", "uploads", fileName);

  await writeFile(path, buffer);
  
  return `/uploads/${fileName}`;
}
