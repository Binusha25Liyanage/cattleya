import { formatLkr } from "@/lib/utils";

export function OrderSummary({ subtotal, shipping }: { subtotal: number; shipping: number }) {
  return (
    <aside className="rounded-3xl border border-gold/20 bg-white p-6 shadow-glow">
      <h3 className="font-heading text-xl">Order Summary</h3>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatLkr(subtotal)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{formatLkr(shipping)}</span></div>
        <div className="flex justify-between border-t border-gold/20 pt-2 text-base font-semibold"><span>Total</span><span>{formatLkr(subtotal + shipping)}</span></div>
      </div>
    </aside>
  );
}
