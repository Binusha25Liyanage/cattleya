"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

type AdminSidebarProps = {
  activePage?: "dashboard" | "patrons" | "design-review" | "analytics";
};

const dashboardNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/revenue", label: "Revenue", icon: BarChart2 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/ai-metrics", label: "AI Metrics", icon: Sparkles },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
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
    (normalizedPath.startsWith("/admin/patrons")
      ? "patrons"
      : normalizedPath.startsWith("/admin/dashboard") || normalizedPath === "/admin"
      ? "dashboard"
      : normalizedPath.startsWith("/admin/design-review")
      ? "design-review"
      : normalizedPath.startsWith("/admin/analytics")
      ? "analytics"
      : "design-review");

  const navItems =
    resolvedPage === "dashboard" ? dashboardNav : resolvedPage === "patrons" ? patronsNav : designReviewNav;
  const activeHref =
    resolvedPage === "dashboard"
      ? normalizedPath === "/admin"
        ? "/admin/dashboard"
        : normalizedPath
      : normalizedPath;
  const sidebarBg = resolvedPage === "dashboard" ? "bg-[#1e1e1e]" : "bg-[#2a2a2a]";

  return (
    <aside className={`fixed left-0 top-0 z-20 flex h-screen w-52 flex-col ${sidebarBg} text-white`}>
      <div className="p-6">
        <div className="font-serif text-xl font-bold">CATTLEYA</div>
        <div className="mt-1 text-xs text-gray-400">Admin Portal</div>
      </div>

      <nav className="mt-6 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm transition ${
                isActive ? "bg-[#D0021B] text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {resolvedPage === "patrons" ? (
        <div className="mt-auto px-4 pb-6 pt-4">
          <button className="w-full rounded bg-[#D0021B] px-4 py-3 text-xs tracking-widest text-white transition hover:bg-red-800">
            NEW DESIGN
          </button>
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-500">
                <Image src="/images/admin-avatar.jpg" alt="Admin avatar" fill className="object-cover" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Administrator</div>
                <div className="text-xs text-gray-400">PREMIUM ACCESS</div>
              </div>
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
