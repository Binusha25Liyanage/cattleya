import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-32 w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-sm outline-none placeholder:text-cattleya-muted focus:border-gold", className)} {...props} />;
}
