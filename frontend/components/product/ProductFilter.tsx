"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function ProductFilter({ onChange }: { onChange: (filters: Record<string, string | number>) => void }) {
  const [price, setPrice] = useState([8500]);
  return (
    <aside className="space-y-6 rounded-3xl border border-gold/20 bg-white p-5 shadow-glow">
      <div>
        <label className="mb-2 block text-sm font-medium">Search</label>
        <Input placeholder="Search products" onChange={(event) => onChange({ search: event.target.value })} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Category</label>
        <Select onChange={(event) => onChange({ category: event.target.value })}>
          <option value="">All</option>
          <option value="TSHIRT">T-Shirts</option>
          <option value="SHIRT">Shirts</option>
          <option value="SARONG">Sarongs</option>
          <option value="FROCK">Frocks</option>
          <option value="CROP_TOP">Crop Tops</option>
          <option value="SAREE">Sarees</option>
          <option value="LUNGI">Lungis</option>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Max Price</label>
        <Slider value={price} onValueChange={setPrice} />
        <div className="mt-2 text-sm text-cattleya-muted">Rs. {price[0].toLocaleString()}</div>
      </div>
      <Button onClick={() => onChange({ price: price[0] })}>Apply Filters</Button>
    </aside>
  );
}
