"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BarChart2,
  Bell,
  HelpCircle,
  LogOut,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const stats = [
  { label: "NET REVENUE", value: "$124,502.00", trend: "+14.2% from last month", positive: true },
  { label: "TOTAL ORDERS", value: "1,842", trend: "+5.7% from last month", positive: true },
  { label: "AI GENERATIONS", value: "8,291", trend: "+22.4% from last month", positive: true },
  { label: "CUSTOMER LTV", value: "$428.50", trend: "— Stable", positive: false },
];

const revenueData = [
  { week: "WEEK 1", revenue: 18000 },
  { week: "", revenue: 25000 },
  { week: "WEEK 2", revenue: 38000 },
  { week: "", revenue: 52000 },
  { week: "WEEK 3", revenue: 35000 },
  { week: "", revenue: 28000 },
  { week: "WEEK 4", revenue: 62000 },
  { week: "", revenue: 45000 },
];

const orderStatus = [
  { label: "Delivered", color: "#D0021B", pct: "64%" },
  { label: "Processing", color: "#6b7280", pct: "22%" },
  { label: "Shipped", color: "#d1d5db", pct: "14%" },
];

const topProducts = [
  { name: "CELESTIAL SILK SCARF", revenue: 42100, maxRevenue: 42100 },
  { name: "IMPERIAL BATIK WRAP", revenue: 38400, maxRevenue: 42100 },
  { name: "ETERNAL BLOOM CHEMISE", revenue: 29200, maxRevenue: 42100 },
  { name: "MIDNIGHT GARDEN KIMONO", revenue: 21050, maxRevenue: 42100 },
  { name: "PHOENIX RISING FOULARD", revenue: 18900, maxRevenue: 42100 },
];

const aiDesignData = [
  { day: "MON", designs: 180 },
  { day: "TUE", designs: 220 },
  { day: "WED", designs: 195 },
  { day: "THU", designs: 310 },
  { day: "FRI", designs: 410 },
  { day: "SAT", designs: 380 },
  { day: "SUN", designs: 290 },
];

const sessions = [
  { tag: "NEW GENERATION", tagType: "red", title: "Crimson Fractal", subtitle: "Processed in 3.2s", image: "/images/session-crimson.jpg" },
  { tag: "INVENTORY UPDATE", tagType: "gray", title: "Opal Silk Weave", subtitle: "+40 Units received", image: "/images/session-opal.jpg" },
  { tag: "SYSTEM ALERT", tagType: "red", title: "Design Pipeline", subtitle: "Batch processing 85%", image: "/images/session-pipeline.jpg" },
];

export default function AdminDashboardPage() {
  const [activeRange, setActiveRange] = useState<"7days" | "30days" | "1year">("30days");

  return (
    <div className="flex min-h-screen font-sans">
      <aside className="fixed left-0 top-0 z-20 flex h-screen w-48 flex-col bg-[#1e1e1e] text-white">
        <div className="p-5">
          <div className="font-serif text-lg font-bold">CATTLEYA</div>
          <div className="mt-0.5 text-xs text-gray-400">Admin Console</div>
        </div>

        <nav className="mt-6 flex flex-col gap-1 px-3">
          <a className="flex items-center gap-3 rounded bg-[#D0021B] px-3 py-2.5 text-sm" href="#">
            <Sparkles className="h-4 w-4" />
            Dashboard
          </a>
          <a className="flex items-center gap-3 rounded px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/10" href="#">
            <BarChart2 className="h-4 w-4" />
            Revenue
          </a>
          <a className="flex items-center gap-3 rounded px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/10" href="#">
            <ShoppingBag className="h-4 w-4" />
            Orders
          </a>
          <a className="flex items-center gap-3 rounded px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/10" href="#">
            <Sparkles className="h-4 w-4" />
            AI Metrics
          </a>
          <a className="flex items-center gap-3 rounded px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/10" href="#">
            <Package className="h-4 w-4" />
            Inventory
          </a>
        </nav>

        <div className="mt-auto border-t border-white/10 p-3">
          <a className="flex items-center gap-3 rounded px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/10" href="#">
            <HelpCircle className="h-4 w-4" />
            Support
          </a>
          <a className="flex items-center gap-3 rounded px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/10" href="#">
            <LogOut className="h-4 w-4" />
            Logout
          </a>
        </div>
      </aside>

      <main className="ml-48 flex-1 bg-[#f0f0f0] p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-lg bg-white border border-gray-100 px-8 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-widest text-[#D0021B] font-semibold uppercase">DASHBOARD OVERVIEW</p>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input className="w-56 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 pl-9 text-sm text-gray-700 outline-none" placeholder="Search designs..." />
              </div>
              <div className="flex items-center gap-4">
                <Bell className="h-5 w-5 text-gray-500" />
                <Settings className="h-5 w-5 text-gray-500" />
                <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-600">
                  <Image src="/images/admin-avatar.jpg" alt="Admin" fill className="object-cover" unoptimized />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {stats.map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-100 bg-white p-5">
                <p className="text-xs tracking-widest text-gray-400 uppercase">{item.label}</p>
                <p className="mt-1 font-serif text-3xl font-bold text-gray-900">{item.value}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <TrendingUp className={`h-3.5 w-3.5 ${item.positive ? "text-[#D0021B]" : "text-gray-400"}`} />
                  <p className={`text-xs ${item.positive ? "text-[#D0021B]" : "text-gray-400"}`}>{item.trend}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 rounded-lg border border-gray-100 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900">REVENUE OVER TIME</h2>
                  <p className="mt-0.5 text-sm italic text-gray-400">An overview of fiscal performance across the current quarter</p>
                </div>
                <div className="flex gap-2">
                  {[
                    { key: "7days", label: "7 DAYS" },
                    { key: "30days", label: "30 DAYS" },
                    { key: "1year", label: "1 YEAR" },
                  ].map((range) => (
                    <button
                      key={range.key}
                      onClick={() => setActiveRange(range.key as "7days" | "30days" | "1year")}
                      className={`rounded px-3 py-1 text-xs ${activeRange === range.key ? "bg-[#D0021B] text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 h-56">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "none", borderRadius: 6, color: "#fff", fontSize: 12 }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#D0021B" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#D0021B" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">ORDERS BY STATUS</h3>
                <p className="mt-0.5 text-sm italic text-gray-400">Operational distribution</p>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="relative w-36 h-36">
                  <div className="absolute top-0 left-0 h-12 w-12 border-t-4 border-l-4 border-[#D0021B]" />
                  <div className="absolute top-0 right-0 h-12 w-12 border-t-4 border-r-4 border-[#D0021B]" />
                  <div className="absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 border-[#D0021B]" />
                  <div className="absolute bottom-0 right-0 h-12 w-12 border-b-4 border-r-4 border-[#D0021B]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="font-serif text-4xl font-bold text-gray-900">1,842</p>
                    <p className="mt-1 text-xs tracking-widest text-gray-400">TOTAL</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {orderStatus.map((entry) => (
                  <div key={entry.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span>{entry.label}</span>
                    </div>
                    <span className="text-gray-900 font-medium">{entry.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-lg border border-gray-100 bg-white p-6">
              <h3 className="font-serif text-lg font-bold text-gray-900">TOP 5 PRODUCTS</h3>
              <div className="mt-5 space-y-5">
                {topProducts.map((product) => (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-xs uppercase tracking-wide text-gray-800 font-medium">{product.name}</p>
                      <p className="text-sm font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
                    </div>
                    <div className="h-1 rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-[#D0021B]" style={{ width: `${(product.revenue / product.maxRevenue) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-[#1a1a1a] p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-white tracking-wider">AI DESIGNS GENERATED</h3>
                  <p className="mt-1 text-xs italic text-gray-400">Creative engine velocity & computational output</p>
                </div>
                <Sparkles className="h-5 w-5 text-[#D0021B]" />
              </div>

              <div className="mt-4 h-40">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={aiDesignData} barSize={18} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: "#0a0a0a", border: "none", fontSize: 11, color: "#fff" }}
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Bar dataKey="designs" radius={[3, 3, 0, 0]}>
                      {aiDesignData.map((entry, index) => (
                        <Cell key={entry.day} fill={index === aiDesignData.length - 2 ? "#D0021B" : "#3a3a3a"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <div>
                  <p className="text-xs tracking-widest text-gray-500">HIGHEST VELOCITY</p>
                  <p className="mt-1 font-serif text-2xl text-white">3,412 pts/day</p>
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-widest text-gray-500">AVG. GENERATION TIME</p>
                  <p className="mt-1 font-serif text-2xl text-white">4.2s</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="font-serif text-xl font-bold text-gray-900">RECENT CREATIVE SESSIONS</div>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {sessions.map((session) => (
                <div key={session.title} className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded bg-gray-200">
                    <Image src={session.image} alt={session.title} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold tracking-widest uppercase ${session.tagType === "red" ? "text-[#D0021B]" : "text-gray-500"}`}>{session.tag}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900">{session.title}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{session.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="rounded-lg bg-[#1a1a1a] py-12 text-center text-white">
            <p className="font-serif text-2xl tracking-widest">CATTLEYA</p>
            <p className="mt-2 text-xs tracking-[0.3em] text-gray-500">THE IMMENSE BEAUTY OF HEAVEN — ADMINISTRATIVE ANALYTICS</p>
            <p className="mt-4 text-xs text-gray-600">© 2024 CATTLEYA ARTISANAL DESIGN. ALL RIGHTS RESERVED.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
