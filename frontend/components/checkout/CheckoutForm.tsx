"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutForm({ onSubmit }: { onSubmit: (data: Record<string, string>) => void }) {
  const [step, setStep] = useState(1);
  return (
    <form
      className="space-y-6 rounded-3xl border border-gold/20 bg-white p-6 shadow-glow"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(Object.fromEntries(new FormData(event.currentTarget).entries() as Iterable<[string, string]>));
      }}
    >
      <div className="flex gap-2 text-sm">
        {["Shipping", "Payment", "Confirm"].map((label, index) => (
          <span key={label} className={`rounded-full px-3 py-1 ${step === index + 1 ? "bg-cattleya-black text-gold" : "bg-gold/10 text-cattleya-muted"}`}>
            {index + 1}. {label}
          </span>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" />
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => setStep((value) => Math.max(1, value - 1))}>Back</Button>
        <Button type="button" variant="outline" onClick={() => setStep((value) => Math.min(3, value + 1))}>Next</Button>
        <Button type="submit">Place Order</Button>
      </div>
    </form>
  );
}
