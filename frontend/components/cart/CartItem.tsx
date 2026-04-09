import Image from "next/image";
import { formatLkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartItem({ item, onRemove, onChange }: { item: { itemId: string; name?: string; image?: string; quantity: number; price?: number }; onRemove: () => void; onChange: (quantity: number) => void }) {
  return (
    <div className="flex gap-4 rounded-3xl border border-gold/20 bg-white p-4 shadow-glow">
      <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-gold/5">
        <Image src={item.image || "https://placehold.co/400x400/F5F0E8/0A0A0A.png"} alt={item.name || "Item"} fill className="object-cover" />
      </div>
      <div className="flex flex-1 items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg">{item.name}</h3>
          <p className="text-sm text-cattleya-muted">{formatLkr(item.price || 0)}</p>
          <div className="mt-3 flex items-center gap-2">
            <Button variant="outline" onClick={() => onChange(Math.max(1, item.quantity - 1))}>-</Button>
            <span className="min-w-8 text-center">{item.quantity}</span>
            <Button variant="outline" onClick={() => onChange(item.quantity + 1)}>+</Button>
          </div>
        </div>
        <Button variant="ghost" onClick={onRemove}>Remove</Button>
      </div>
    </div>
  );
}
