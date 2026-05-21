"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  MoreHorizontal,
  Search,
  ShoppingBag,
  UserCircle,
  X,
} from "lucide-react";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar: string;
  itemCount: number;
  itemSummary: string;
  items: OrderItem[];
  total: number;
  status: "placed" | "payment_confirmed" | "processing" | "shipped" | "delivered";
  timeline: {
    stage: string;
    timestamp: string | null;
    completed: boolean;
  }[];
}

const statusOptions = ["All", "Processing", "Shipped", "Delivered", "Cancelled"] as const;

const orders: Order[] = [
  {
    id: "#CT-9921",
    customerName: "Julian Vance",
    customerEmail: "julian.vance@celestialmail.com",
    customerPhone: "+1 (555) 092-1182",
    customerAvatar: "/images/customer-julian-vance.jpg",
    itemCount: 3,
    itemSummary: "Silk Batik Scarf (+2)",
    items: [
      { name: "Silk Batik Scarf", qty: 1, price: 320, image: "/images/item-silk-scarf.jpg" },
      { name: "Royal Indigo Wrap", qty: 2, price: 920, image: "/images/item-indigo-wrap.jpg" },
    ],
    total: 1240,
    status: "processing",
    timeline: [
      { stage: "Order Placed", timestamp: "Oct 24, 2023 at 09:12 AM", completed: true },
      { stage: "Payment Confirmed", timestamp: "Oct 24, 2023 at 09:15 AM", completed: true },
      { stage: "Processing", timestamp: "Oct 25, 2023 at 11:45 AM", completed: true },
      { stage: "Shipped", timestamp: null, completed: false },
    ],
  },
  {
    id: "#CT-9918",
    customerName: "Elara Thorne",
    customerEmail: "elara.thorne@atelier.com",
    customerPhone: "+44 20 7946 0199",
    customerAvatar: "/images/customer-elara-thorne.jpg",
    itemCount: 1,
    itemSummary: "Parang Keris Robe",
    items: [{ name: "Parang Keris Robe", qty: 1, price: 850, image: "/images/item-parang-robe.jpg" }],
    total: 850,
    status: "shipped",
    timeline: [
      { stage: "Order Placed", timestamp: "Oct 22, 2023 at 02:30 PM", completed: true },
      { stage: "Payment Confirmed", timestamp: "Oct 22, 2023 at 02:33 PM", completed: true },
      { stage: "Processing", timestamp: "Oct 23, 2023 at 10:00 AM", completed: true },
      { stage: "Shipped", timestamp: "Oct 24, 2023 at 08:00 AM", completed: true },
    ],
  },
  {
    id: "#CT-9850",
    customerName: "Silas Vane",
    customerEmail: "s.vane@velvetmail.com",
    customerPhone: "+61 2 9876 0011",
    customerAvatar: "/images/customer-silas.jpg",
    itemCount: 2,
    itemSummary: "Midnight Indigo Tie (...",
    items: [
      { name: "Midnight Indigo Tie", qty: 1, price: 210, image: "/images/item-indigo-tie.jpg" },
      { name: "Batik Pocket Square", qty: 1, price: 210, image: "/images/item-pocket-square.jpg" },
    ],
    total: 420,
    status: "processing",
    timeline: [
      { stage: "Order Placed", timestamp: "Oct 20, 2023 at 11:00 AM", completed: true },
      { stage: "Payment Confirmed", timestamp: "Oct 20, 2023 at 11:04 AM", completed: true },
      { stage: "Processing", timestamp: null, completed: false },
      { stage: "Shipped", timestamp: null, completed: false },
    ],
  },
  {
    id: "#CT-9811",
    customerName: "Marcella Wu",
    customerEmail: "m.wu@bridalmuse.com",
    customerPhone: "+65 9123 4567",
    customerAvatar: "/images/customer-marcella.jpg",
    itemCount: 5,
    itemSummary: "Custom Bridal Batik ...",
    items: [
      { name: "Custom Bridal Batik Set", qty: 1, price: 2200, image: "/images/item-bridal.jpg" },
      { name: "Ceremonial Sash", qty: 2, price: 600, image: "/images/item-sash.jpg" },
      { name: "Veil Overlay", qty: 1, price: 600, image: "/images/item-veil.jpg" },
    ],
    total: 3400,
    status: "shipped",
    timeline: [
      { stage: "Order Placed", timestamp: "Oct 18, 2023 at 09:00 AM", completed: true },
      { stage: "Payment Confirmed", timestamp: "Oct 18, 2023 at 09:05 AM", completed: true },
      { stage: "Processing", timestamp: "Oct 19, 2023 at 02:00 PM", completed: true },
      { stage: "Shipped", timestamp: "Oct 21, 2023 at 10:00 AM", completed: true },
    ],
  },
];

function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function formatDate(date: string) {
  return new Date(date)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}

export default function AdminOrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("All");

  const statusIndex = statusOptions.indexOf(statusFilter);
  const nextStatus = () => {
    const nextIndex = (statusIndex + 1) % statusOptions.length;
    setStatusFilter(statusOptions[nextIndex]);
  };

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const query = orderSearch.toLowerCase();
        const matchesSearch =
          query === "" ||
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query);
        const matchesStatus = statusFilter === "All" || order.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      }),
    [orderSearch, statusFilter],
  );

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;

  return (
    <div className="flex flex-row min-h-screen bg-[#f5f3f0] font-sans text-gray-900">
      <div className="flex-1">
        <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div className="font-serif italic text-xl font-semibold text-gray-800">Admin Portal</div>
            <div className="flex flex-1 max-w-md items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5">
              <Search className="h-4 w-4 text-gray-300" />
              <input
                value={orderSearch}
                onChange={(event) => setOrderSearch(event.target.value)}
                placeholder="Global Search..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f5f3f0] p-10 overflow-y-auto min-h-screen">
          <div>
            <h1 className="font-serif text-5xl font-light tracking-wide text-gray-900">Orders</h1>
            <p className="mt-1 text-base italic text-gray-400">Managing the flow of ethereal craftsmanship</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex flex-1 max-w-sm items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                value={orderSearch}
                onChange={(event) => setOrderSearch(event.target.value)}
                placeholder="Search by Order ID, customer name..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <button
              type="button"
              onClick={nextStatus}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-gray-600"
            >
              <span>Status: {statusFilter}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_2fr_3fr_1.5fr] gap-4 bg-gray-50 px-6 py-4 text-xs tracking-[0.15em] text-gray-400 uppercase">
              <div>ORDER ID</div>
              <div>CUSTOMER</div>
              <div>ITEMS</div>
              <div>TOTAL</div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrderId === order.id;
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`grid w-full grid-cols-[1fr_2fr_3fr_1.5fr] gap-4 px-6 py-5 text-left transition hover:bg-[#faf8f5] ${
                      isSelected ? "bg-[#fff5f5] border-l-2 border-l-[#D0021B]" : ""
                    }`}
                  >
                    <div className="text-sm font-mono font-semibold text-gray-900">{order.id}</div>
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-300">
                        <Image src={order.customerAvatar} alt={order.customerName} fill className="object-cover" unoptimized />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{order.itemCount} Items</span>
                      <span className="text-xs text-gray-400 truncate">{order.itemSummary}</span>
                    </div>
                    <div className="text-sm font-bold text-[#D0021B]">{formatPrice(order.total)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm text-gray-400">
            <span>Showing 1-{filteredOrders.length} of 248 orders</span>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="w-[420px] min-h-screen border-l border-gray-200 bg-white">
          <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.2em] text-[#D0021B] uppercase font-semibold">ORDER DETAILS</p>
                <h2 className="mt-1 font-serif text-3xl font-bold text-gray-900">{selectedOrder.id}</h2>
              </div>
              <button type="button" onClick={() => setSelectedOrderId(null)} className="text-gray-400 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex min-h-[calc(100vh-5rem)] flex-col gap-8 overflow-y-auto px-6 py-6">
            <section>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">CUSTOMER INFORMATION</p>
              <div className="mt-3 flex items-center gap-4 rounded-lg bg-[#f5f3f0] p-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-gray-300">
                  <Image src={selectedOrder.customerAvatar} alt={selectedOrder.customerName} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">{selectedOrder.customerName}</p>
                  <p className="mt-1 text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                  <p className="mt-1 text-sm text-gray-500">{selectedOrder.customerPhone}</p>
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">ORDERED ITEMS</p>
              <div className="mt-3 flex flex-col divide-y divide-gray-100">
                {selectedOrder.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-4 py-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-gray-200">
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="mt-1 text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                    <div className="text-sm font-bold text-gray-900">{formatPrice(item.price)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <p className="font-serif text-base text-gray-600">Total Amount</p>
                <p className="font-serif text-2xl font-bold text-[#D0021B]">{formatPrice(selectedOrder.total)}</p>
              </div>
            </section>

            <section className="pb-16">
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">ORDER TIMELINE</p>
              <div className="mt-4 space-y-6">
                {selectedOrder.timeline.map((step, index) => (
                  <div key={step.stage} className="relative flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          step.completed ? "bg-[#D0021B] border-[#D0021B]" : "bg-white border-gray-300"
                        }`}
                      />
                      {index < selectedOrder.timeline.length - 1 ? (
                        <span className={`mt-1 block h-full w-0.5 ${step.completed ? "bg-[#D0021B]" : "bg-gray-200"}`} />
                      ) : null}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${step.completed ? "text-gray-900" : "text-gray-400"}`}>{step.stage}</p>
                      <p className="mt-1 text-xs text-gray-400">{step.timestamp ?? "Pending dispatch"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="sticky bottom-0 z-10 border-t border-gray-100 bg-white px-6 py-5">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => console.log("Update status for", selectedOrder?.id)}
                className="flex-1 rounded bg-[#D0021B] py-4 text-xs tracking-widest text-white hover:bg-red-800 transition"
              >
                UPDATE STATUS
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 rounded border border-gray-300 bg-white py-4 text-xs tracking-widest text-gray-700 hover:bg-gray-50 transition"
              >
                PRINT INVOICE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
