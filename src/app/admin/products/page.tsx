import { getAllProducts } from "@/app/actions/admin-product-actions";
import AdminProductsClient from "./AdminProductsClient";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return <AdminProductsClient products={products} />;
}
