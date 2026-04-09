"use client";

import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-sm outline-none focus:border-gold", className)} {...props}>
      {children}
    </select>
  );
}
