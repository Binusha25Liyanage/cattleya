import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Users, Sparkles, Image as ImageIcon, Settings } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Valued Patrons", icon: Users },
  { href: "/admin/design-review", label: "Design Review", icon: Sparkles, active: true },
  { href: "/admin/batik-gallery", label: "Batik Gallery", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-52 flex-col bg-[#2a2a2a] text-white overflow-hidden">
      <div className="p-6">
        <div className="font-serif text-xl font-bold">CATTLEYA</div>
        <div className="mt-1 text-xs text-gray-400">Admin Portal</div>
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#D0021B] px-3 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
          <span className="text-base">+</span>
          New Design
        </button>
      </div>

      <nav className="mt-8 flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded px-4 py-3 text-sm transition ${
                item.active ? "bg-[#D0021B] text-white" : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-500">
            <Image src="/images/admin-avatar.jpg" alt="Admin avatar" fill className="object-cover" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Julian Rossi</div>
            <div className="text-xs text-gray-400">Lead Curator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
