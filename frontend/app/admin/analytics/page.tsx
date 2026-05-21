"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowRight,
  BarChart2,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  UserCircle,
} from "lucide-react";

const kpiCards = [
  { label: "NET SALES", value: "$124,500.00", trend: "+12.4%", type: "positive" },
  { label: "ACTIVE ORDERS", value: "482", trend: "View Pipeline", type: "link" },
  { label: "CONVERSION RATE", value: "4.2%", trend: "+0.8%", type: "positive" },
  { label: "AVG. ORDER VALUE", value: "$258.00", trend: "— Stable", type: "stable" },
];

const revenueData = [
  { day: "MON", revenue: 42000 },
  { day: "TUE", revenue: 35000 },
  { day: "WED", revenue: 28000 },
  { day: "THU", revenue: 22000 },
  { day: "FRI", revenue: 38000 },
  { day: "SAT", revenue: 55000 },
  { day: "SUN", revenue: 72000 },
];

const pipelineData = [
  { name: "Fulfilled", value: 362, color: "#D0021B" },
  { name: "Processing", value: 84, color: "#6b7280" },
  { name: "Returned", value: 36, color: "#e5e7eb" },
];

const collections = [
  { name: "ETHEREAL CRIMSON SHAWL", revenue: 42800 },
  { name: "MIDNIGHT LOTUS BATIK", revenue: 31200 },
  { name: "CEREMONIAL IVORY WRAP", revenue: 28500 },
  { name: "GOLDEN PHEASANT SILK", revenue: 15900 },
  { name: "IMPERIAL ORCHID TAPESTRY", revenue: 11200 },
];

const maxCollectionRevenue = Math.max(...collections.map((item) => item.revenue));

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "inventory" | "collections">("dashboard");

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-[#f5f3f0] text-sans">
      <div className="min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="font-serif text-xl font-bold tracking-wider text-gray-900">CATTLEYA</div>
            <div className="flex gap-8">
              {[
                { key: "dashboard", label: "DASHBOARD" },
                { key: "inventory", label: "INVENTORY" },
                { key: "collections", label: "COLLECTIONS" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "dashboard" | "inventory" | "collections")}
                  className={`text-sm tracking-widest uppercase pb-1 ${
                    activeTab === tab.key
                      ? "border-b-2 border-[#D0021B] font-semibold text-gray-900"
                      : "border-b-2 border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Search className="h-4 w-4 text-gray-400 cursor-pointer" />
            <Bell className="h-4 w-4 text-gray-400" />
            <UserCircle className="h-5 w-5 text-gray-500" />
          </div>
        </header>

        <div className="flex">
          <aside className="fixed left-0 top-[57px] w-44 min-h-[calc(100vh-57px)] bg-[#111111] text-white">
            <div className="p-5 pb-3">
              <div className="font-serif text-base font-bold">Management</div>
              <div className="mt-0.5 text-[10px] tracking-[0.2em] text-gray-500 uppercase">ETHEREAL EDITORIAL</div>
            </div>
            <nav className="mt-4 flex flex-col gap-0.5 px-2">
              {[
                { label: "Analytics", icon: BarChart2, active: true },
                { label: "Customers", icon: Users },
                { label: "AI Reviews", icon: Sparkles },
                { label: "Design Library", icon: BookOpen },
                { label: "Settings", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-xs uppercase tracking-wider ${
                      item.active ? "bg-[#D0021B] text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto p-4">
              <button className="w-full rounded bg-[#D0021B] px-4 py-3 text-xs tracking-widest text-white transition hover:bg-red-800">
                NEW COLLECTION
              </button>
            </div>
          </aside>

          <main className="ml-44 flex-1 min-h-[calc(100vh-57px)] bg-[#f5f3f0] p-10">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <h1 className="font-serif text-6xl font-light tracking-[0.15em] text-gray-900">PERFORMANCE</h1>
                  <p className="mt-2 max-w-2xl font-serif italic text-base text-gray-400">
                    The immense beauty of celestial revenue and growth.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <span className="tracking-wider">PAST 30 DAYS</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  <button className="rounded bg-gray-900 px-6 py-2.5 text-xs tracking-widest text-white transition hover:bg-gray-700">
                    EXPORT REPORT
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-0">
                {kpiCards.map((card, index) => (
                  <div
                    key={card.label}
                    className={`border border-gray-200 bg-white p-6 ${
                      index === 0 ? "rounded-l-lg" : ""
                    } ${index === kpiCards.length - 1 ? "rounded-r-lg" : ""}`}
                  >
                    <div className="border-l-4 border-[#D0021B] pl-4">
                      <p className="text-xs tracking-widest text-gray-400 uppercase">{card.label}</p>
                      <p className="mt-2 font-serif text-3xl font-light text-gray-900">{card.value}</p>
                      <div className="mt-3 flex items-center justify-between gap-1.5">
                        {card.type === "positive" ? (
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="h-3.5 w-3.5 text-[#D0021B]" />
                            <p className="text-xs text-[#D0021B] font-medium">{card.trend}</p>
                          </div>
                        ) : card.type === "stable" ? (
                          <p className="text-xs text-gray-400">{card.trend}</p>
                        ) : (
                          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900">
                            <ArrowRight className="h-3.5 w-3.5" />
                            {card.trend}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="col-span-2 rounded-lg border border-gray-100 bg-white p-7 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-xl tracking-wider text-gray-900">REVENUE OVER TIME</h2>
                      <p className="mt-1 font-serif italic text-sm text-gray-400">Daily fiscal expansion</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-[#D0021B]" />
                      <span className="text-xs tracking-wider text-gray-500">DIRECT SALES</span>
                    </div>
                  </div>
                  <div className="mt-6 h-52">
                    <ResponsiveContainer width="100%" height={210}>
                      <AreaChart data={revenueData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D0021B" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#D0021B" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 12 }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#D0021B"
                          strokeWidth={2}
                          fill="url(#revenueGrad)"
                          dot={false}
                          activeDot={{ r: 4, fill: "#D0021B", strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-white p-7 shadow-sm">
                  <div>
                    <h3 className="font-serif text-xl tracking-wider text-gray-900">ORDER PIPELINE</h3>
                    <p className="mt-1 font-serif italic text-sm text-gray-400">Logistical flow of Batik</p>
                  </div>
                  <div className="mt-6 relative h-44">
                    <ResponsiveContainer width="100%" height={176}>
                      <PieChart>
                        <Pie
                          data={pipelineData}
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={72}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {pipelineData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <p className="font-serif text-3xl text-gray-900">75%</p>
                        <p className="text-[10px] tracking-widest text-gray-400 uppercase">Complete</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2.5">
                    {pipelineData.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-xs tracking-wider text-gray-600 uppercase">{entry.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{Math.round((entry.value / 482) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-white p-7 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="font-serif text-xl tracking-wider text-gray-900">TOP ARTISANAL COLLECTIONS</h2>
                    <p className="mt-1 font-serif italic text-sm text-gray-400">The curated favorites of the season</p>
                  </div>
                  <button className="text-xs tracking-widest text-[#D0021B] underline underline-offset-4 hover:text-red-800">
                    VIEW INVENTORY GALLERY
                  </button>
                </div>
                <div className="mt-6 space-y-5">
                  {collections.map((collection) => (
                    <div key={collection.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-xs tracking-[0.15em] font-semibold uppercase text-gray-800">{collection.name}</p>
                        <p className="text-sm font-semibold text-gray-900">${collection.revenue.toLocaleString()}.00</p>
                      </div>
                      <div className="h-px w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-[#D0021B]"
                          style={{ width: `${(collection.revenue / maxCollectionRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <footer className="mt-16 flex flex-col gap-8 px-10 py-10 text-gray-700 lg:flex-row lg:justify-between lg:items-end">
                <div className="max-w-xl">
                  <p className="text-xs tracking-[0.25em] text-gray-400 uppercase">THE EDITORIAL LEDGER</p>
                  <p className="mt-3 max-w-md font-serif italic text-sm leading-relaxed text-gray-500">
                    "True luxury is not found in the speed of the transaction, but in the depth of the artistry. Our growth mirrors the slow, deliberate pace of the artisan's hand."
                  </p>
                </div>
                <div className="text-right text-xs tracking-widest text-gray-400">
                  <p>STATUS: IMMACULATE</p>
                  <p className="mt-1">VERSION: 2.0.4 · HEAVENLY</p>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
