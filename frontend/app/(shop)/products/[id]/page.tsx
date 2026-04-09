"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { formatLkr } from "@/lib/utils";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [tab, setTab] = useState("description");

  useEffect(() => {
    api.get(`/products/${params.id}`).then((response) => setProduct(response.data.data));
  }, [params.id]);

  if (!product) return <div className="px-6 py-16">Loading...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-10 lg:px-8">
      <ProductImageGallery images={product.images} name={product.name} />
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gold-dark">{product.category}</p>
          <h1 className="mt-2 font-heading text-4xl">{product.name}</h1>
          <div className="mt-3 text-2xl text-gold-dark">{formatLkr(product.basePrice)}</div>
        </div>
        <div className="flex flex-wrap gap-3">
          {product.variants?.map((variant: any) => <button key={variant.id} className="rounded-full border border-gold px-4 py-2 text-sm">{variant.size} / {variant.color}</button>)}
        </div>
        <div className="flex gap-3">
          <Button>Add to Cart</Button>
          <Button variant="outline" className="bg-gradient-to-r from-cattleya-purple via-cattleya-pink to-cattleya-teal text-white">Customize with AI</Button>
        </div>
        <Tabs>
          <TabsList>
            <TabsTrigger active={tab === "description"} onClick={() => setTab("description")}>Description</TabsTrigger>
            <TabsTrigger active={tab === "size"} onClick={() => setTab("size")}>Size Guide</TabsTrigger>
            <TabsTrigger active={tab === "care"} onClick={() => setTab("care")}>Care Instructions</TabsTrigger>
          </TabsList>
          <TabsContent hidden={tab !== "description"}><p>{product.description}</p></TabsContent>
          <TabsContent hidden={tab !== "size"}><p>Sizes S, M, L with relaxed batik fit.</p></TabsContent>
          <TabsContent hidden={tab !== "care"}><p>Cold wash gently and dry in shade.</p></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
