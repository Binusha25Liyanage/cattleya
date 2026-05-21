"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/+$/, "") || "";
  const activePage = normalizedPath.startsWith("/admin/patrons")
    ? "patrons"
    : normalizedPath.startsWith("/admin/dashboard") || normalizedPath === "/admin"
    ? "dashboard"
    : normalizedPath.startsWith("/admin/design-review")
    ? "design-review"
    : normalizedPath.startsWith("/admin/analytics")
    ? "analytics"
    : undefined;

  return (
    <div className="flex min-h-screen bg-[#f5f3f0]">
      <AdminSidebar activePage={activePage} />
      <div className="ml-52 flex min-h-screen flex-1 flex-col overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
