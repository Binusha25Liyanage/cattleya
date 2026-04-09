import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-sm outline-none placeholder:text-cattleya-muted focus:border-gold", className)} {...props} />;
}
