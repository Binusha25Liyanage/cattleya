"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilter } from "@/components/product/ProductFilter";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products").then((response) => setProducts(response.data.data.items)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
      <ProductFilter onChange={async (filters) => {
        const response = await api.get("/products", { params: filters });
        setProducts(response.data.data.items);
      }} />
      <div>
        {loading ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-96 rounded-3xl" />)}</div> : <ProductGrid products={products} />}
      </div>
    </div>
  );
}
