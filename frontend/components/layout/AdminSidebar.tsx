"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useAdminChatStore } from "@/store/adminChatStore";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/designs", label: "Designs" },
  { href: "/admin/chat", label: "Chat", icon: MessageSquare },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminSidebar() {
  const totalUnread = useAdminChatStore((state) => state.totalUnread);

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col bg-cattleya-black px-5 py-6 text-gold">
      <div className="mb-8 flex items-center gap-3">
        <Image src="/images/logo.png" alt="CATTLEYA" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
        <div>
          <div className="font-heading text-xl tracking-[0.2em]">CATTLEYA</div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Admin</div>
        </div>
      </div>
      <nav className="space-y-2 text-sm">
        {items.map((item) => {
          const isChat = item.href === "/admin/chat";
          return (
            <Link key={item.href} href={item.href} className="group relative flex items-center gap-3 rounded-2xl border border-gold/10 px-4 py-3 hover:bg-gold hover:text-cattleya-black">
              {item.icon ? <item.icon className="h-4 w-4" /> : null}
              <span>{item.label}</span>
              {isChat && totalUnread > 0 ? (
                <span className="absolute right-3 top-3 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#D0021B] px-2 text-[11px] font-semibold text-white">
                  {totalUnread}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
