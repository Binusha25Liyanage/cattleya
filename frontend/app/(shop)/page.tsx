import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";

async function getFeatured() {
  const response = await api.get("/products/featured");
  return response.data.data;
}

export default async function HomePage() {
  const products = await getFeatured().catch(() => []);
  const categories = ["T-Shirts", "Shirts", "Sarongs", "Frocks", "Crop Tops", "Sarees", "Lungis"];
  return (
    <div>
      <section className="cattleya-bg flex min-h-[92vh] items-center justify-center px-4 py-16 text-center text-gold">
        <div className="mx-auto max-w-4xl">
          <Image src="/images/logo.png" alt="CATTLEYA" width={220} height={220} className="mx-auto h-52 w-52 rounded-full object-cover sm:h-56 sm:w-56" />
          <h1 className="mt-8 font-heading text-5xl tracking-[0.14em] sm:text-7xl">CATTLEYA</h1>
          <p className="mt-4 font-heading text-xl sm:text-2xl">Immense Beauty of Heaven</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/products" className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-cattleya-black">Shop Collection</Link>
            <Link href="/customize" className="rounded-full border border-gold px-6 py-3 text-sm font-medium text-gold">Design Yours</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl">Featured Collection</h2>
            <p className="text-cattleya-muted">Handpicked batik pieces with timeless color stories.</p>
          </div>
          <Link href="/products" className="text-sm text-gold-dark">View all</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.slice(0, 6).map((product: any) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl">Categories</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
            {categories.map((category) => (
              <div key={category} className="rounded-3xl border border-gold/20 bg-cattleya-black p-6 text-center text-gold shadow-glow">{category}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl">How AI Customization Works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ["1", "Describe your vision", "Tell us the mood, palette, and motifs."],
            ["2", "Enhance and generate", "Claude refines the prompt and SDXL creates the pattern."],
            ["3", "Review and order", "Approve the design and add it to production."],
          ].map(([number, title, description]) => (
            <div key={title} className="rounded-3xl border border-gold/20 bg-white p-6 shadow-glow">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-cattleya-black">{number}</div>
              <h3 className="mt-4 font-heading text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-cattleya-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cattleya-black py-20 text-gold">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl">Testimonials</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              "The batik quality feels luxurious and modern.",
              "The AI studio made my custom design easy to imagine.",
              "Fast checkout and elegant packaging."
            ].map((quote) => <div key={quote} className="rounded-3xl border border-gold/20 p-6">{quote}</div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl">Newsletter</h2>
        <p className="mt-2 text-cattleya-muted">Receive new releases and customization updates.</p>
        <div className="mt-6 flex gap-3">
          <input className="w-full rounded-full border border-gold/20 bg-white px-5 py-3" placeholder="Enter your email" />
          <button className="rounded-full bg-cattleya-black px-6 py-3 text-gold">Subscribe</button>
        </div>
      </section>
    </div>
  );
}
