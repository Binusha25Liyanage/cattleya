"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  BarChart2,
  BookOpen,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Package,
  Scissors,
  Settings,
  Settings2,
  ShoppingCart,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

type AdminSidebarProps = {
  activePage?: "overview" | "dashboard" | "orders" | "customers" | "patrons" | "design-review" | "analytics";
};

const overviewNav = [
  { href: "/admin/overview", label: "OVERVIEW", icon: "grid" as const },
  { href: "/admin/catalogue", label: "CATALOGUE", icon: BookOpen },
  { href: "/admin/orders", label: "ORDERS", icon: ShoppingCart },
  { href: "/admin/customers", label: "CUSTOMERS", icon: Users },
  { href: "/admin/ai-designs", label: "AI DESIGNS", icon: Sparkles },
  { href: "/admin/analytics", label: "ANALYTICS", icon: BarChart2 },
];

const dashboardNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/revenue", label: "Revenue", icon: BarChart2 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/ai-metrics", label: "AI Metrics", icon: Sparkles },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
];

const ordersNav = [
  { href: "/admin/dashboard", label: "DASHBOARD", icon: LayoutGrid },
  { href: "/admin/orders", label: "ORDERS", icon: ShoppingBag },
  { href: "/admin/inventory", label: "INVENTORY", icon: Archive },
  { href: "/admin/customers", label: "CUSTOMERS", icon: Users },
  { href: "/admin/artisans", label: "ARTISANS", icon: Scissors },
  { href: "/admin/settings", label: "SETTINGS", icon: Settings },
];

const customersNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/design-review", label: "Design Review", icon: Sparkles },
  { href: "/admin/batik-gallery", label: "Design Library", icon: LayoutGrid },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const patronsNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/patrons", label: "Valued Patrons", icon: Users },
  { href: "/admin/design-review", label: "Design Review", icon: Sparkles },
  { href: "/admin/batik-gallery", label: "Batik Gallery", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const designReviewNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Valued Patrons", icon: Users },
  { href: "/admin/design-review", label: "Design Review", icon: Sparkles },
  { href: "/admin/batik-gallery", label: "Batik Gallery", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ activePage }: AdminSidebarProps) {
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/+$/, "") || "";
  const resolvedPage =
    activePage ||
    (normalizedPath.startsWith("/admin/overview")
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
      : "design-review");

  const navItems =
    resolvedPage === "overview"
      ? overviewNav
      : resolvedPage === "orders"
      ? ordersNav
      : resolvedPage === "dashboard"
      ? dashboardNav
      : resolvedPage === "customers"
      ? customersNav
      : resolvedPage === "patrons"
      ? patronsNav
      : designReviewNav;
  const activeHref = normalizedPath;
  const sidebarBg =
    resolvedPage === "overview" || resolvedPage === "customers" || resolvedPage === "orders"
      ? "bg-[#111111]"
      : resolvedPage === "dashboard"
      ? "bg-[#1e1e1e]"
      : "bg-[#2a2a2a]";
  const sidebarWidthClass =
    resolvedPage === "customers" ? "w-60" : resolvedPage === "overview" || resolvedPage === "orders" ? "w-56" : "w-52";
  const topTitle =
    resolvedPage === "customers"
      ? "MANAGEMENT"
      : resolvedPage === "orders"
      ? "LUXURY BATIK ADMIN"
      : "ADMIN PORTAL";

  return (
    <aside className={`fixed left-0 top-0 z-20 flex h-screen ${sidebarWidthClass} flex-col ${sidebarBg} text-white`}>
      <div className="p-6">
        <div className="font-serif text-xl font-bold">CATTLEYA</div>
        <div className="mt-1 text-xs text-gray-400">{topTitle}</div>
      </div>

      <nav className="mt-6 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded px-4 py-3 text-sm uppercase tracking-widest transition ${
                isActive
                  ? "bg-[#1a1a1a] border-l-2 border-[#D0021B] text-white"
                  : "text-gray-500 hover:text-white hover:bg-white/10"
              }`}
            >
              {resolvedPage === "orders" && item.href === "/admin/orders" && isActive ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#D0021B]">
                  <ShoppingBag className="h-3 w-3 text-white" />
                </div>
              ) : item.icon === "grid" ? (
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4 shrink-0">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="bg-[#D0021B] rounded-[1px]" />
                  ))}
                </div>
              ) : (
                <item.icon className="h-4 w-4" />
              )}
              <span className="text-xs tracking-[0.15em]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {resolvedPage === "customers" ? (
        <div className="mt-auto px-4 pb-6 pt-4">
          <button className="w-full rounded bg-[#D0021B] px-4 py-3 text-xs tracking-widest text-white transition hover:bg-red-800">
            NEW COLLECTION
          </button>
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-600">
                <Image src="/images/admin-avatar.jpg" alt="Admin avatar" fill className="object-cover" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">ADMIN USER</div>
                <div className="text-[10px] tracking-widest text-gray-500 uppercase">ETHEREAL EDITORIAL</div>
              </div>
            </div>
          </div>
        </div>
      ) : resolvedPage === "overview" ? (
        <div className="mt-auto border-t border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-600">
              <Image src="/images/admin-avatar.jpg" alt="Admin avatar" fill className="object-cover" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">ADRIAN VANCE</div>
              <div className="text-[10px] tracking-widest text-gray-500 uppercase">SYSTEM ADMIN</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-auto border-t border-white/10 p-3">
          <Link href="/admin/support" className="flex items-center gap-3 rounded px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/10">
            <HelpCircle className="h-4 w-4" />
            Support
          </Link>
          <Link href="/admin/logout" className="flex items-center gap-3 rounded px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/10">
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </div>
      )}
    </aside>
  );
}
