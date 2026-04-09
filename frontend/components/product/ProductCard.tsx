import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatLkr } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(10,10,10,0.12)]">
        <div className="relative aspect-square bg-gold/5">
          <Image src={product.images?.[0] || "https://placehold.co/800x800/F5F0E8/0A0A0A.png"} alt={product.name} fill className="object-cover" />
        </div>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-lg text-cattleya-black">{product.name}</h3>
            {product.isFeatured ? <Badge>Featured</Badge> : null}
          </div>
          <p className="line-clamp-2 text-sm text-cattleya-muted">{product.description}</p>
          <div className="text-lg font-semibold text-gold-dark">{formatLkr(product.basePrice)}</div>
        </CardContent>
      </Card>
    </Link>
  );
}
