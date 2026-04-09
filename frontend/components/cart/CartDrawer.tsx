"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  return <Button>Cart ({items.length})</Button>;
}
