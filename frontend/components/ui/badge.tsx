import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark", className)} {...props} />;
}
