"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get("/orders/my").then((response) => setOrders(response.data.data));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-xl">Order {order.id}</h3>
                  <p className="text-sm text-cattleya-muted">{order.status}</p>
                </div>
                <div className="text-gold-dark">Rs. {Number(order.total).toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
