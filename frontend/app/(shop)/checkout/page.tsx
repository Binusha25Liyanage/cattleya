"use client";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <CheckoutForm onSubmit={() => undefined} />
      <OrderSummary subtotal={4500} shipping={350} />
    </div>
  );
}
