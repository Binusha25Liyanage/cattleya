"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CartItem } from "@/components/cart/CartItem";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get("/cart").then((response) => setItems(response.data.data.items || []));
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 350;

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <div className="space-y-4">
        {items.map((item) => <CartItem key={item.itemId} item={item} onRemove={() => {}} onChange={() => {}} />)}
      </div>
      <div className="space-y-4">
        <OrderSummary subtotal={subtotal} shipping={shipping} />
        <Button className="w-full">Proceed to Checkout</Button>
      </div>
    </div>
  );
}
