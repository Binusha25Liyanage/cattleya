"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Bell,
  CreditCard,
  Package,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  UserCircle,
} from "lucide-react";

const kpiData = [
  {
    label: "ORDERS TODAY",
    value: "24",
    trend: { text: "+12%", type: "positive" as const },
    icon: TrendingUp,
  },
  {
    label: "REVENUE THIS MONTH",
    value: "482,500",
    prefix: "Rs.",
    trend: null,
    icon: CreditCard,
  },
  {
    label: "PENDING AI DESIGNS",
    value: "12",
    trend: { text: "NEEDS REVIEW", type: "badge-gray" as const },
    icon: Sparkles,
  },
  {
    label: "LOW STOCK ITEMS",
    value: "08",
    trend: { text: "ACTION REQUIRED", type: "badge-red" as const },
    icon: Package,
  },
];

const revenueData30 = [
  { day: "DAY 01", revenue: 18000 },
  { day: "", revenue: 14000 },
  { day: "", revenue: 22000 },
  { day: "", revenue: 16000 },
  { day: "DAY 10", revenue: 28000 },
  { day: "", revenue: 35000 },
  { day: "", revenue: 25000 },
  { day: "", revenue: 42000 },
  { day: "DAY 20", revenue: 55000 },
  { day: "", revenue: 48000 },
  { day: "", revenue: 62000 },
  { day: "", revenue: 58000 },
  { day: "DAY 30", revenue: 70000 },
];

const pendingDesigns = [
  { id: 1, image: "/images/pending-design-1.jpg" },
  { id: 2, image: "/images/pending-design-2.jpg" },
  { id: 3, image: "/images/pending-design-3.jpg" },
  { id: 4, image: "/images/pending-design-4.jpg" },
];

const recentOrders = [
  {
    id: "#ORD-7721",
    customerName: "Sophia Moretti",
    customerInitials: "SM",
    avatarColor: "bg-purple-400",
    items: "2x Custom Batik Silk",
    total: 24500,
    status: "SHIPPED" as const,
    date: "2023-10-24",
  },
  {
    id: "#ORD-7719",
    customerName: "Robert De Luca",
    customerInitials: "RD",
    avatarColor: "bg-blue-400",
    items: "1x Royal Peacock Scarf",
    total: 12800,
    status: "PROCESSING" as const,
    date: "2023-10-24",
  },
  {
    id: "#ORD-7718",
    customerName: "Elena Kostic",
    customerInitials: "EK",
    avatarColor: "bg-teal-400",
    items: "3x Limited Print Series",
    total: 45200,
    status: "DELIVERED" as const,
    date: "2023-10-23",
  },
];

function formatOrderDate(dateString: string) {
  return new Date(dateString)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}

export default function AdminOverviewPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans text-gray-900">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          <h1 className="font-serif text-xl font-bold italic text-gray-900">Dashboard</h1>
          <div className="flex w-full max-w-3xl items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5">
            <Search className="h-4 w-4 text-gray-300" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search orders, patterns, or customers..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5 text-gray-500" />
            <Settings className="h-5 w-5 text-gray-500" />
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
              <UserCircle className="h-5 w-5 text-gray-600" />
              <span className="text-xs tracking-widest text-gray-700 font-medium">ADMIN</span>
            </div>
          </div>
        </div>
      </div>

      <main className="px-10 py-10">
        <div className="max-w-4xl">
          <p className="font-serif italic text-3xl font-light text-gray-700">The Immense Beauty of Heaven</p>
          <p className="mt-1.5 text-sm text-gray-400">
            Welcome back, Adrian. Here is your boutique performance overview.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-5 mt-8">
          {kpiData.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-r-lg border border-gray-100 border-l-4 border-l-[#D0021B] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.2em] text-gray-400 uppercase leading-tight">{item.label}</p>
                    <div className="mt-2">
                      {item.prefix ? (
                        <div className="flex flex-col leading-none">
                          <span className="text-xl text-gray-500">{item.prefix}</span>
                          <span className="font-serif text-4xl font-bold text-gray-900">{item.value}</span>
                        </div>
                      ) : (
                        <p className="font-serif text-4xl font-bold text-gray-900">{item.value}</p>
                      )}
                    </div>
                    {item.trend ? (
                      item.trend.type === "positive" ? (
                        <p className="mt-2 text-xs font-medium text-green-600">{item.trend.text}</p>
                      ) : item.trend.type === "badge-gray" ? (
                        <span className="mt-2 inline-flex rounded border border-gray-200 bg-gray-100 px-2 py-1 text-[10px] tracking-wider text-gray-600">
                          {item.trend.text}
                        </span>
                      ) : (
                        <span className="mt-2 inline-flex rounded border border-[#D0021B]/20 bg-[#D0021B]/10 px-2 py-1 text-[10px] tracking-wider text-[#D0021B]">
                          {item.trend.text}
                        </span>
                      )
                    ) : null}
                  </div>
                  <Icon className="h-5 w-5 text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="col-span-2 rounded-lg border border-gray-100 bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-lg tracking-wider text-gray-900">REVENUE — LAST 30 DAYS</h2>
                <p className="mt-1 font-serif italic text-sm text-gray-400">Visualizing growth patterns</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#D0021B]" />
                <span className="text-xs tracking-widest text-gray-500">GROSS SALES</span>
              </div>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height={256}>
                <AreaChart data={revenueData30} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="rsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D0021B" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#D0021B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f0ede9" strokeDasharray="0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    ticks={["DAY 01", "DAY 10", "DAY 20", "DAY 30"]}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 12 }}
                    formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area
                    type="linear"
                    dataKey="revenue"
                    stroke="#D0021B"
                    strokeWidth={2.5}
                    fill="url(#rsGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#D0021B", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-[#f5f3f0] p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-base font-bold text-gray-900 leading-tight">PENDING DESIGNS PREVIEW</h3>
                <p className="mt-1 text-xs text-[#D0021B] underline underline-offset-2 hover:text-red-800 cursor-pointer">Review All</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pendingDesigns.map((design) => (
                <div key={design.id} className="relative aspect-square overflow-hidden rounded bg-gray-300">
                  <img src={design.image} alt={`Pending design ${design.id}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs italic text-gray-400 leading-relaxed">
              Generated patterns utilize Cattleya's proprietary AI training set based on traditional Javanese motifs.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="font-serif text-xl font-bold tracking-wider text-gray-900">RECENT ORDERS</div>
          <div className="mt-5 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_1.5fr_2fr_1.2fr_1.2fr_1fr_0.8fr] gap-4 bg-gray-50 px-6 py-4">
              {[
                "ORDER ID",
                "CUSTOMER",
                "ITEMS",
                "TOTAL",
                "STATUS",
                "DATE",
                "ACTIONS",
              ].map((header) => (
                <div key={header} className="text-xs tracking-[0.15em] text-gray-400 uppercase font-medium">
                  {header}
                </div>
              ))}
            </div>
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order, idx) => (
                <div
                  key={order.id}
                  className={`grid grid-cols-[1fr_1.5fr_2fr_1.2fr_1.2fr_1fr_0.8fr] gap-4 px-6 py-5 items-center transition hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-[#f0ede9]" : "bg-[#e8e5e1]"
                  }`}
                >
                  <div className="text-sm font-mono font-semibold text-gray-900">{order.id}</div>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${order.avatarColor}`}>
                      {order.customerInitials}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{order.customerName}</span>
                  </div>
                  <div className="text-sm text-gray-600">{order.items}</div>
                  <div>
                    <div className="text-xs text-gray-500">Rs.</div>
                    <div className="font-serif text-base font-bold text-gray-900">{order.total.toLocaleString()}</div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs tracking-wider font-medium ${
                        order.status === "SHIPPED"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : order.status === "PROCESSING"
                          ? "bg-orange-50 text-orange-600 border border-orange-200"
                          : order.status === "DELIVERED"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs leading-tight text-gray-500 whitespace-pre-line">
                    {formatOrderDate(order.date).replace(/, /g, ",\n")}
                  </div>
                  <div className="text-gray-400 hover:text-gray-700 cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-16 rounded-lg bg-[#111111] px-10 py-8 text-white">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <span className="font-serif text-lg font-bold tracking-widest">CATTLEYA</span>
              <span className="text-xs tracking-wider text-gray-500 uppercase">© 2024 ADMINISTRATIVE SYSTEMS</span>
            </div>
            <div className="flex flex-wrap items-center gap-8 text-xs tracking-widest text-gray-400 uppercase">
              <button className="hover:text-white">SERVER STATUS</button>
              <button className="hover:text-white">API DOCS</button>
              <button className="hover:text-white">SUPPORT</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
