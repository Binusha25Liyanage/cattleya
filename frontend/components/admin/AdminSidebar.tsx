"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Image as ImageIcon,
  Settings,
  BarChart2,
  ShoppingBag,
  Package,
  HelpCircle,
  LogOut,
} from "lucide-react";

const dashboardNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/revenue", label: "Revenue", icon: BarChart2 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/ai-metrics", label: "AI Metrics", icon: Sparkles },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
];

const designReviewNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Valued Patrons", icon: Users },
  { href: "/admin/design-review", label: "Design Review", icon: Sparkles },
  { href: "/admin/batik-gallery", label: "Batik Gallery", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const navItems = pathname?.startsWith("/admin/dashboard") ? dashboardNav : designReviewNav;
  const activeHref = pathname === "/admin" || pathname?.startsWith("/admin/dashboard") ? "/admin/dashboard" : pathname;

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-48 flex-col bg-[#1e1e1e] text-white">
      <div className="p-5">
        <div className="font-serif text-lg font-bold">CATTLEYA</div>
        <div className="mt-0.5 text-xs text-gray-400">Admin Console</div>
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
    </aside>
  );
}
