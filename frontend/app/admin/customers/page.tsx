"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Pencil,
  Search,
  Settings,
  Trash2,
  UserCircle,
} from "lucide-react";

interface Customer {
  id: number;
  name: string;
  tier: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: string;
  joinedDate: string;
  status: "ACTIVE" | "INACTIVE";
  avatar: string;
}

const customers: Customer[] = [
  {
    id: 1,
    name: "ELARA VANCE",
    tier: "Platinum Tier",
    email: "elara.vance@celestial.com",
    phone: "+44 20 7946 0128",
    orders: 24,
    totalSpent: "$14,280.00",
    joinedDate: "2023-10-12",
    status: "ACTIVE",
    avatar: "/images/customer-elara.jpg",
  },
  {
    id: 2,
    name: "JULIAN THORNE",
    tier: "Gold Tier",
    email: "j.thorne@atelier.fr",
    phone: "+33 1 42 68 53 00",
    orders: 12,
    totalSpent: "$8,940.50",
    joinedDate: "2024-01-05",
    status: "ACTIVE",
    avatar: "/images/customer-julian.jpg",
  },
  {
    id: 3,
    name: "SOPHIA CHEN",
    tier: "Silver Tier",
    email: "sophia.c@design.io",
    phone: "+1 212 555 0198",
    orders: 8,
    totalSpent: "$4,120.00",
    joinedDate: "2024-02-28",
    status: "INACTIVE",
    avatar: "/images/customer-sophia.jpg",
  },
  {
    id: 4,
    name: "MARCUS REED",
    tier: "New Member",
    email: "mreed@bespoke.com",
    phone: "+61 2 9876 5432",
    orders: 2,
    totalSpent: "$1,850.00",
    joinedDate: "2024-03-14",
    status: "ACTIVE",
    avatar: "/images/customer-marcus.jpg",
  },
];

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) => {
        const query = searchQuery.toLowerCase();
        return (
          query === "" ||
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.includes(query)
        );
      }),
    [searchQuery],
  );

  const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-[#f5f3f0] px-10 py-10 font-sans">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] text-gray-400 uppercase">CUSTOMER REPOSITORY</p>
          <div className="mt-2 text-base font-serif italic text-gray-600">Refined Patronage</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded border border-gray-200 bg-white px-4 py-2.5 w-64">
            <Search className="h-4 w-4 text-gray-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search Patrons..."
              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
          <Bell className="h-5 w-5 text-gray-400 cursor-pointer" />
          <UserCircle className="h-6 w-6 text-gray-500 cursor-pointer" />
        </div>
      </div>

      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-7xl font-light tracking-[0.1em] text-gray-900">CLIENTELE</h1>
          <p className="mt-0 text-5xl font-serif italic text-[#D0021B] leading-tight">Management Suite</p>
        </div>
        <div className="flex items-center gap-3 self-end pb-2">
          <button className="rounded-none border border-gray-400 bg-transparent px-6 py-3 text-xs tracking-widest text-gray-700 hover:bg-gray-100 transition">
            EXPORT REPORT
          </button>
          <button className="rounded-none bg-gray-900 px-6 py-3 text-xs tracking-widest text-white hover:bg-gray-700 transition">
            ADD CUSTOMER
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="grid grid-cols-[2.5fr_2fr_0.8fr_1.2fr_1.2fr_1fr_1.2fr] gap-4 bg-[#1a1a1a] px-6 py-4">
          {[
            "PATRON",
            "CONTACT DETAILS",
            "ORDERS",
            "TOTAL SPENT",
            "JOINED DATE",
            "STATUS",
            "ACTIONS",
          ].map((item) => (
            <div key={item} className="text-xs tracking-[0.2em] text-gray-300 uppercase font-medium">
              {item}
            </div>
          ))}
        </div>
        <div className="divide-y divide-gray-200">
          {paginatedCustomers.map((customer, idx) => (
            <div
              key={customer.id}
              className={`grid grid-cols-[2.5fr_2fr_0.8fr_1.2fr_1.2fr_1fr_1.2fr] gap-4 px-6 py-5 items-center transition hover:brightness-95 ${
                idx % 2 === 0 ? "bg-[#f0ede9]" : "bg-[#e8e5e1]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-gray-600">
                  <Image src={customer.avatar} alt={customer.name} fill className="object-cover" unoptimized />
                  {customer.status === "ACTIVE" ? (
                    <span className="absolute bottom-0.5 right-0.5 inline-block h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  ) : null}
                </div>
                <div>
                  <p className="text-base font-serif font-bold uppercase tracking-wide text-gray-900">{customer.name}</p>
                  <p className="text-xs italic text-gray-400">{customer.tier}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-700">{customer.email}</span>
                <span className="text-xs text-gray-400">{customer.phone}</span>
              </div>
              <div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-900">
                  {String(customer.orders).padStart(2, "0")}
                </span>
              </div>
              <div className="text-base font-bold text-[#D0021B]">{customer.totalSpent}</div>
              <div className="text-sm text-gray-600">{new Date(customer.joinedDate)
                .toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
                .toUpperCase()}</div>
              <div>
                <span
                  className={`inline-flex rounded-sm px-3 py-1.5 text-xs tracking-widest uppercase ${
                    customer.status === "ACTIVE"
                      ? "border border-green-400 bg-green-50 text-green-700"
                      : "border border-gray-300 bg-gray-50 text-gray-500"
                  }`}
                >
                  {customer.status}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button className="rounded p-1.5 text-gray-400 hover:bg-white/60 hover:text-gray-700 transition">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="rounded p-1.5 text-gray-400 hover:bg-white/60 hover:text-gray-700 transition">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="rounded p-1.5 text-gray-400 hover:bg-white/60 hover:text-[#D0021B] transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs tracking-[0.15em] text-gray-400 uppercase">SHOWING 1-4 OF 1,240 PATRONS</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="rounded border border-gray-300 bg-white p-2.5 text-gray-700 hover:bg-gray-100 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex h-10 w-10 items-center justify-center rounded text-sm font-medium ${
                currentPage === page ? "bg-gray-900 text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
            className="rounded border border-gray-300 bg-white p-2.5 text-gray-700 hover:bg-gray-100 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
