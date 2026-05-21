"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  MoreVertical,
  Search,
  SlidersHorizontal,
  UserCircle,
} from "lucide-react";

interface Patron {
  id: number;
  name: string;
  tier: string;
  email: string;
  orders: number;
  totalSpent: string;
  status: "ACTIVE" | "INACTIVE";
  avatar: string;
}

const patrons: Patron[] = [
  {
    id: 1,
    name: "Eleanor Vance",
    tier: "Diamond Member",
    email: "e.vance@celestial.com",
    orders: 24,
    totalSpent: "$14,250.00",
    status: "ACTIVE",
    avatar: "/images/patron-eleanor.jpg",
  },
  {
    id: 2,
    name: "Julian Thorne",
    tier: "Artisan Curator",
    email: "j.thorne@atelier.net",
    orders: 12,
    totalSpent: "$8,920.00",
    status: "ACTIVE",
    avatar: "/images/patron-julian.jpg",
  },
  {
    id: 3,
    name: "Clara Montaigne",
    tier: "Casual Patron",
    email: "clara.m@heritage.fr",
    orders: 2,
    totalSpent: "$1,100.00",
    status: "INACTIVE",
    avatar: "/images/patron-clara.jpg",
  },
  {
    id: 4,
    name: "Arthur Penhaligon",
    tier: "Legacy Collector",
    email: "a.p@estates.co.uk",
    orders: 45,
    totalSpent: "$32,400.00",
    status: "ACTIVE",
    avatar: "/images/patron-arthur.jpg",
  },
];

const patronStats = [
  { label: "TOTAL PATRONS", value: "1,284", highlight: false },
  { label: "ACTIVE THIS MONTH", value: "412", highlight: false },
  { label: "AESTHETIC TIER", value: "Gold", highlight: false },
  { label: "TOTAL REVENUE", value: "$124.5K", highlight: true },
];

const segments = [
  "All Patrons",
  "Diamond Members",
  "Artisan Curators",
  "Casual Patrons",
  "Legacy Collectors",
] as const;

const statuses = ["Any Status", "Active", "Inactive", "Suspended"] as const;

export default function AdminPatronsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<(typeof segments)[number]>("All Patrons");
  const [selectedStatus, setSelectedStatus] = useState<(typeof statuses)[number]>("Any Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const pageSize = 4;

  const filteredPatrons = useMemo(() => {
    return patrons.filter((patron) => {
      const matchesSearch =
        searchQuery === "" ||
        patron.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patron.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "Any Status" || patron.status === selectedStatus.toUpperCase();

      const matchesSegment =
        selectedSegment === "All Patrons" ||
        (selectedSegment === "Diamond Members" && patron.tier.includes("Diamond")) ||
        (selectedSegment === "Artisan Curators" && patron.tier.includes("Artisan")) ||
        (selectedSegment === "Casual Patrons" && patron.tier.includes("Casual")) ||
        (selectedSegment === "Legacy Collectors" && patron.tier.includes("Legacy"));

      return matchesSearch && matchesStatus && matchesSegment;
    });
  }, [searchQuery, selectedSegment, selectedStatus]);

  const pageCount = Math.max(1, Math.ceil(filteredPatrons.length / pageSize));
  const paginatedPatrons = filteredPatrons.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const displayStart = filteredPatrons.length ? (currentPage - 1) * pageSize + 1 : 0;
  const displayEnd = Math.min(currentPage * pageSize, filteredPatrons.length);

  return (
    <div className="flex min-h-screen font-sans">
      <div className="ml-52 flex-1 bg-[#f5f3f0] p-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Menu className="h-5 w-5 text-gray-400 cursor-pointer" />
            <h1 className="font-serif text-2xl font-bold tracking-wide text-[#D0021B]">ADMIN OVERVIEW</h1>
          </div>
          <div className="flex items-center gap-5 text-gray-400">
            <Search className="h-4 w-4" />
            <Bell className="h-4 w-4" />
            <UserCircle className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="mt-8 max-w-3xl">
          <p className="font-serif italic text-[#D0021B] text-base">Curating Excellence</p>
          <h2 className="mt-1 text-5xl font-serif font-bold text-gray-900">Valued Patrons</h2>
        </div>

        <div className="grid grid-cols-4 gap-0 mt-8">
          {patronStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`border border-gray-300 bg-[#ebebeb] p-6 ${index === 0 ? "border-l-4 border-l-[#D0021B]" : ""} ${
                index === patronStats.length - 1 ? "rounded-r-lg" : ""
              } ${index === 0 ? "rounded-l-lg" : ""}`}
            >
              <p className="text-xs tracking-[0.2em] text-gray-500 uppercase">{stat.label}</p>
              <p className={`mt-2 font-serif text-4xl font-bold ${stat.highlight ? "text-[#D0021B]" : "text-gray-900"}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-gray-100 bg-white p-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 min-w-0">
            <label className="mb-1.5 block text-[10px] tracking-widest text-gray-400 uppercase">SEARCH DIRECTORY</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Name, email or ID..."
                className="w-full rounded border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-700 outline-none"
              />
            </div>
          </div>

          <div className="w-full max-w-xs min-w-0">
            <label className="mb-1.5 block text-[10px] tracking-widest text-gray-400 uppercase">SEGMENT</label>
            <div className="relative">
              <select
                value={selectedSegment}
                onChange={(event) => {
                  setSelectedSegment(event.target.value as typeof segments[number]);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none"
              >
                {segments.map((segment) => (
                  <option key={segment} value={segment}>
                    {segment}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="w-full max-w-[11rem] min-w-0">
            <label className="mb-1.5 block text-[10px] tracking-widest text-gray-400 uppercase">STATUS</label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(event) => {
                  setSelectedStatus(event.target.value as typeof statuses[number]);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <button className="ml-auto flex h-12 w-12 items-center justify-center rounded bg-gray-900 text-white transition hover:bg-gray-800">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-gray-100 bg-white">
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_0.3fr] gap-4 bg-[#f0ede9] px-6 py-4">
            <div className="text-xs tracking-[0.15em] text-gray-500 uppercase font-medium">PATRON</div>
            <div className="text-xs tracking-[0.15em] text-gray-500 uppercase font-medium">EMAIL</div>
            <div className="text-xs tracking-[0.15em] text-gray-500 uppercase font-medium">ORDERS</div>
            <div className="text-xs tracking-[0.15em] text-gray-500 uppercase font-medium">TOTAL SPENT</div>
            <div className="text-xs tracking-[0.15em] text-gray-500 uppercase font-medium">STATUS</div>
            <div />
          </div>
          <div className="divide-y divide-gray-100">
            {paginatedPatrons.map((patron) => (
              <div
                key={patron.id}
                className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_0.3fr] gap-4 px-6 py-5 items-center hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full bg-gray-300">
                    <Image src={patron.avatar} alt={patron.name} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{patron.name}</p>
                    <p className="text-xs italic text-gray-400 font-serif">{patron.tier}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{patron.email}</div>
                <div className="text-sm font-medium text-gray-900">{patron.orders}</div>
                <div className="text-sm font-semibold text-[#D0021B]">{patron.totalSpent}</div>
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs tracking-widest uppercase ${
                      patron.status === "ACTIVE"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {patron.status}
                  </span>
                </div>
                <div className="relative flex justify-end">
                  <button
                    className="text-gray-400 hover:text-gray-700"
                    onClick={() => setOpenMenuId(openMenuId === patron.id ? null : patron.id)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {openMenuId === patron.id ? (
                    <div className="absolute right-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">View Profile</button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Edit Details</button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Deactivate</button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Delete</button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between px-2">
          <p className="font-serif italic text-sm text-gray-400">Displaying {displayStart}–{displayEnd} of 1,284 patrons</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded border border-gray-300 bg-white px-6 py-2.5 text-xs tracking-widest text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
            >
              PREVIOUS
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
              className="rounded bg-gray-900 px-6 py-2.5 text-xs tracking-widest text-white transition hover:bg-gray-700 disabled:opacity-40"
            >
              NEXT PAGE
            </button>
          </div>
        </div>

        <div className="mt-20 pb-8 flex justify-center overflow-hidden">
          <div className="select-none pointer-events-none text-[10rem] font-serif font-bold uppercase tracking-widest text-gray-200 leading-none">
            CATTLEYA
          </div>
        </div>
      </div>
    </div>
  );
}
