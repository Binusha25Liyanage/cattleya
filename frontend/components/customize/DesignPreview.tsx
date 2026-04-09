import Image from "next/image";

export function DesignPreview({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-3xl border border-gold/20 bg-white">
      <Image src={imageUrl || "https://placehold.co/1024x1024/F5F0E8/0A0A0A.png?text=Design+Preview"} alt="AI design" fill className="object-cover" />
    </div>
  );
}
