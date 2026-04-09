import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-cattleya-black py-12 text-gold">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <Image src="/images/logo.png" alt="CATTLEYA" width={80} height={80} className="h-20 w-20 rounded-full object-cover" />
        <div>
          <div className="font-heading text-2xl tracking-[0.2em]">CATTLEYA</div>
          <p className="mt-2 text-sm text-gold/80">Immense Beauty of Heaven</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gold/80">
          <Link href="/products">Products</Link>
          <Link href="/customize">Customize</Link>
          <Link href="/orders">Orders</Link>
        </div>
      </div>
    </footer>
  );
}
