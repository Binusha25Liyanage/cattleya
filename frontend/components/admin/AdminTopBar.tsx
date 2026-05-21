"use client";

import { Menu, Search, Bell, UserCircle } from "lucide-react";

export function AdminTopBar() {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center gap-4">
        <Menu className="h-5 w-5 text-gray-500 cursor-pointer" />
        <h1 className="font-serif text-2xl font-bold tracking-wide text-gray-900">ADMIN OVERVIEW</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search designs..."
            className="w-64 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 pl-9 text-sm text-gray-700 outline-none"
          />
        </div>
        <div className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 inline-flex h-2 w-2 rounded-full bg-[#D0021B]" />
        </div>
        <UserCircle className="h-6 w-6 text-gray-600" />
      </div>
    </div>
  );
}
