import { requireAdmin } from "@/lib/workspace";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return <>{children}</>;
}
