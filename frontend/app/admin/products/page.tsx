"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Settings2, ShoppingBag, SlidersHorizontal, Square } from "lucide-react";

const productRows = [
  {
    id: "PBT-001",
    name: "Celestial Bloom Gown",
    category: "Ready-to-wear",
    price: "$420",
    stock: 28,
    status: "Active",
  },
  {
    id: "PBT-002",
    name: "Luna Batik Blouse",
    category: "Topwear",
    price: "$230",
    stock: 12,
    status: "Active",
  },
  {
    id: "PBT-003",
    name: "Orchid Ensemble",
    category: "Custom",
    price: "$560",
    stock: 6,
    status: "Draft",
  },
  {
    id: "PBT-004",
    name: "Moonlit Sarong",
    category: "Bottomwear",
    price: "$160",
    stock: 18,
    status: "Hidden",
  },
  {
    id: "PBT-005",
    name: "Ethereal Wrap Dress",
    category: "Ready-to-wear",
    price: "$390",
    stock: 22,
    status: "Active",
  },
  {
    id: "PBT-006",
    name: "Petal Jacket",
    category: "Outerwear",
    price: "$310",
    stock: 9,
    status: "Draft",
  },
];

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showHidden, setShowHidden] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return productRows.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || product.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesHidden = showHidden || product.status !== "Hidden";
      return matchesSearch && matchesStatus && matchesHidden;
    });
  }, [searchQuery, statusFilter, showHidden]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const isSelectedAll = currentProducts.length > 0 && currentProducts.every((product) => selectedProducts.includes(product.id));

  const toggleSelectAll = () => {
    if (isSelectedAll) {
      setSelectedProducts((current) => current.filter((id) => !currentProducts.some((product) => product.id === id)));
      return;
    }

    setSelectedProducts((current) => [
      ...new Set([...current, ...currentProducts.map((product) => product.id)]),
    ]);
  };

  const toggleSelection = (id: string) => {
    setSelectedProducts((current) =>
      current.includes(id) ? current.filter((productId) => productId !== id) : [...current, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 pb-16 pt-8 text-white">
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#111111]/90 p-6 shadow-[0_50px_120px_-60px_rgba(0,0,0,0.8)]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.35em] text-[#8f8f8f]">Products Manager</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Manage your catalogue</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-400">
                Review product status, inventory, and catalogue details in one workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="inline-flex items-center gap-2 rounded-full bg-[#D0021B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-red-700">
                <Plus className="h-4 w-4" />
                New product
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-white/20 hover:bg-white/10">
                <Settings2 className="h-4 w-4" />
                Bulk actions
              </button>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-white/10 bg-[#0c0c0c] p-5 sm:grid-cols-[1fr_auto]">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_250px]">
              <label className="relative flex w-full items-center rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-sm text-white">
                <Search className="mr-3 h-4 w-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search products"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                />
              </label>
              <div className="flex items-center gap-3 sm:gap-4">
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-sm text-white">
                  <span>Status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent text-sm text-white outline-none"
                  >
                    <option>All</option>
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Hidden</option>
                  </select>
                </label>
                <button
                  onClick={() => setShowHidden((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition ${
                    showHidden ? "border-[#D0021B] bg-[#D0021B]/10 text-white" : "border-white/10 bg-[#151515] text-gray-300"
                  }`}
                >
                  <Square className="h-4 w-4" />
                  {showHidden ? "Showing hidden" : "Show hidden"}
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:justify-end sm:items-center sm:grid-cols-[auto_auto]">
              <div className="rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-sm text-gray-300">
                Showing <span className="font-semibold text-white">{filteredProducts.length}</span> products
              </div>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-sm text-white transition hover:border-white/20 hover:bg-white/10">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111111]/90 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)]">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">Product catalogue</h2>
              <p className="text-sm text-gray-400">Toggle visibility, update status, and manage your product inventory.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/20 hover:bg-white/10">
                Inventory view
              </button>
              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/20 hover:bg-white/10">
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b]">
            <div className="flex items-center gap-3 border-b border-white/10 bg-[#111111] px-5 py-4 text-xs uppercase tracking-[0.3em] text-gray-500">
              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isSelectedAll}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-white/20 bg-[#0b0b0b] text-[#D0021B] focus:ring-[#D0021B]"
                />
                Select all
              </label>
              <span className="ml-auto flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-gray-400" />
                SKU
              </span>
            </div>
            <div className="divide-y divide-white/10">
              {currentProducts.map((product) => (
                <div key={product.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-4 text-sm text-gray-200 hover:bg-white/5 sm:grid-cols-[auto_minmax(0,2fr)_140px_120px_120px]">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelection(product.id)}
                      className="h-4 w-4 rounded border-white/20 bg-[#0b0b0b] text-[#D0021B] focus:ring-[#D0021B]"
                    />
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#D0021B]/30 to-[#ffffff]/10 p-2 text-center text-[11px] uppercase tracking-[0.25em] text-white">
                      {product.name
                        .split(" ")
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")}
                    </div>
                  </label>
                  <div className="min-w-0">
                    <div className="font-medium text-white">{product.name}</div>
                    <div className="mt-1 text-xs text-gray-500">{product.category}</div>
                  </div>
                  <div className="font-semibold text-white">{product.price}</div>
                  <div className="text-gray-400">{product.stock} in stock</div>
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${
                        product.status === "Active"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : product.status === "Draft"
                          ? "bg-sky-500/10 text-sky-300"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>
              ))}
              {currentProducts.length === 0 ? (
                <div className="px-5 py-14 text-center text-sm text-gray-500">No products match your selected filters.</div>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#111111] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-400">
              Showing {currentProducts.length} of {filteredProducts.length} products across {pageCount} page{pageCount > 1 ? "s" : ""}.
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button
                onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-white/20 hover:bg-white/10"
              >
                Previous
              </button>
              <span className="px-3 text-sm text-gray-300">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage((current) => Math.min(pageCount, current + 1))}
                disabled={currentPage >= pageCount}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-white/20 hover:bg-white/10"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
