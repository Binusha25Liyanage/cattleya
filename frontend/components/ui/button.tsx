import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" };

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold";
  const variants = {
    default: "bg-cattleya-black text-gold border border-gold hover:bg-gold hover:text-cattleya-black",
    outline: "bg-transparent text-gold border border-gold hover:bg-gold hover:text-cattleya-black",
    ghost: "bg-transparent text-cattleya-black hover:bg-black/5",
  };
  return <button className={cn(base, variants[variant], className)} {...props} />;
}
