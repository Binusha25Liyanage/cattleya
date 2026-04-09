"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";

export function Navbar() {
  const user = useUserStore((state) => state.user);
  return (
    <header className="sticky top-0 z-40 border-b border-gold/10 bg-cattleya-black text-gold">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="CATTLEYA" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
          <div>
            <div className="font-heading text-lg tracking-[0.2em]">CATTLEYA</div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-gold/80">Immense Beauty of Heaven</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          <Link href="/products">Collection</Link>
          <Link href="/customize">AI Studio</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/cart" aria-label="Cart"><ShoppingBag size={18} /></Link>
          {user ? <Link href="/admin">Admin</Link> : <Link href="/login">Login</Link>}
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/cart"><ShoppingBag size={18} /></Link>
          <Button variant="ghost" className="text-gold"><Menu size={18} /></Button>
        </div>
      </div>
    </header>
  );
}
