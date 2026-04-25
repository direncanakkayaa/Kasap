import { getLiveOrders } from "@/app/actions/order-actions";
import LiveOrdersClient from "./LiveOrdersClient";

export const revalidate = 0;

export default async function LiveOrdersPage() {
  const orders = await getLiveOrders();

  return <LiveOrdersClient initialOrders={orders} />;
}
