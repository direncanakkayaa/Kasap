import { getAllUsers } from "@/app/actions/admin-product-actions";
import AdminUsersClient from "./AdminUsersClient";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return <AdminUsersClient users={users} />;
}
