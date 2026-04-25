import { getAllGuides } from "@/app/actions/admin-product-actions";
import AdminGuideClient from "./AdminGuideClient";

export const revalidate = 0;

export default async function AdminGuidePage() {
  const guides = await getAllGuides();

  return <AdminGuideClient guides={guides} />;
}
