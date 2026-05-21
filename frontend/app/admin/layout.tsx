"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/+$/, "") || "";
  const activePage = normalizedPath.startsWith("/admin/overview")
    ? "overview"
    : normalizedPath.startsWith("/admin/customers")
    ? "customers"
    : normalizedPath.startsWith("/admin/patrons")
    ? "patrons"
    : normalizedPath.startsWith("/admin/dashboard") || normalizedPath === "/admin"
    ? "dashboard"
    : normalizedPath.startsWith("/admin/design-review")
    ? "design-review"
    : normalizedPath.startsWith("/admin/analytics")
    ? "analytics"
    : undefined;

  const sidebarWidthClass = activePage === "customers" ? "w-60" : activePage === "overview" ? "w-56" : "w-52";
  const mainMarginClass = activePage === "customers" ? "ml-60" : activePage === "overview" ? "ml-56" : "ml-52";
  const showTopBar = activePage !== "customers" && activePage !== "overview";

  return (
    <div className="flex min-h-screen bg-[#f5f3f0]">
      <div className={sidebarWidthClass}>
        <AdminSidebar activePage={activePage} />
      </div>
      <div className={`${mainMarginClass} flex min-h-screen flex-1 flex-col overflow-hidden`}>
        {showTopBar ? <AdminTopBar /> : null}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
