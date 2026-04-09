"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-gold/20 bg-white">
        <Image src={images[active] || images[0] || "https://placehold.co/1000x1000/F5F0E8/0A0A0A.png"} alt={name} fill className="object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button key={image} onClick={() => setActive(index)} className={`relative aspect-square overflow-hidden rounded-2xl border ${active === index ? "border-gold" : "border-gold/20"}`}>
            <Image src={image} alt={`${name} ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
