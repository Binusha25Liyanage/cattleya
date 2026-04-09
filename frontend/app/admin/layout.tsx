import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cattleya-offwhite">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
