import Image from "next/image";
import { ChevronDown, Heart, User, ShoppingCart, Paintbrush, Scissors, Star, Instagram, Facebook } from "lucide-react";

const newArrivals = [
  { id: 1, name: "MIDNIGHT ORCHID SHIRT", subtitle: "Individually hand-stitched silk", price: "LKR 12,500", image: "/images/product-shirt.jpg" },
  { id: 2, name: "CELESTIAL FLOW SAREE", subtitle: "Premium crisp art saree", price: "LKR 45,200", image: "/images/product-saree.jpg" },
  { id: 3, name: "EARTHY GEOMETRY CROP", subtitle: "Soft touch premium silk", price: "LKR 8,300", image: "/images/product-crop.jpg" },
];

const wardrobeItems = [
  { name: "T-SHIRTS", image: "/images/cat-tshirts.jpg", className: "col-span-2 row-span-1 h-[420px]" },
  { name: "SHIRTS", image: "/images/cat-shirts.jpg", className: "col-span-1 row-span-1 h-[204px]" },
  { name: "SARONGS", image: "/images/cat-sarongs.jpg", className: "col-span-1 row-span-2 h-[420px]" },
  { name: "FROCKS", image: "/images/cat-frocks.jpg", className: "col-span-1 row-span-1 h-[204px]" },
  { name: "CROP TOPS", image: "/images/cat-croptops.jpg", className: "col-span-1 row-span-2 h-[420px]" },
  { name: "SAREES", image: "/images/cat-sarees.jpg", className: "col-span-2 row-span-1 h-[204px]" },
  { name: "LUNGIS", image: "/images/cat-lungis.jpg", className: "col-span-1 row-span-1 h-[204px]" },
];

const processSteps = [
  {
    num: "01",
    icon: Paintbrush,
    title: "Concept & Design",
    desc: "Choose from our legacy collections or use our AI studio to craft a unique aesthetic vision.",
  },
  {
    num: "02",
    icon: Scissors,
    title: "Master Crafting",
    desc: "Our artisans apply hot wax and hand-draw in a multi-stage process that takes weeks to perfect.",
  },
  {
    num: "03",
    icon: Star,
    title: "Divine Quality",
    desc: "Each piece undergoes rigorous quality checks to ensure the 'Immense Beauty of Heaven' is realised.",
  },
];

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent px-6 py-5">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between text-white">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em]">
          <span className="font-serif text-xl font-bold">CATTLEYA</span>
          <span className="text-[#D0021B]">.</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-[0.35em] text-white">
          {['ARTISANAL', 'FORMULAS', 'NEW', 'WOMEN', 'REPORTS'].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="transition hover:text-[#D0021B]">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-5 text-white">
          <Heart className="h-5 w-5" />
          <User className="h-5 w-5" />
          <ShoppingCart className="h-5 w-5" />
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-model.jpg"
          alt="Hero model"
          fill
          className="object-cover opacity-60"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
          unoptimized
        />
      </div>

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-[#D0021B] text-xs tracking-[0.5em] uppercase">IMMENSE BEAUTY OF HEAVEN</p>
        <h1 className="mt-4 font-serif text-8xl tracking-[0.4em] text-white md:text-[10rem]">CATTLEYA</h1>
        <p className="mt-4 font-serif italic text-xl text-white/70">Immense Beauty of Heaven</p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#new-arrivals"
            className="rounded-none bg-[#D0021B] px-6 py-3 text-sm uppercase tracking-[0.35em] text-white transition"
          >
            SHOP COLLECTION
          </a>
          <a
            href="#design-studio"
            className="rounded-none border border-white px-6 py-3 text-sm uppercase tracking-[0.35em] text-white transition hover:bg-white hover:text-black"
          >
            DESIGN YOURS WITH AI
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-10 z-10 flex justify-center text-white">
        <ChevronDown className="h-8 w-8 animate-bounce" />
      </div>

      <span className="pointer-events-none absolute bottom-10 left-1/2 z-0 -translate-x-1/2 whitespace-nowrap text-8xl font-serif uppercase tracking-[0.35em] text-white/5 md:text-[12rem]">
        BATIK WOOL
      </span>
    </section>
  );
}

function ProductCard({ name, subtitle, price, image }: { name: string; subtitle: string; price: string; image: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm shadow-black/5">
      <div className="relative h-80 overflow-hidden rounded-3xl bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
          unoptimized
        />
      </div>
      <h3 className="mt-4 font-serif text-lg text-black">{name}</h3>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
      <p className="mt-1 font-medium text-sm text-gray-900">{price}</p>
    </div>
  );
}

function NewArrivalsSection() {
  return (
    <section id="new-arrivals" className="bg-white py-20 px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">NEW ARRIVALS</p>
          <h2 className="mt-3 font-serif text-4xl text-black">ARTISANAL MASTERPIECES</h2>
        </div>
        <a href="#" className="text-sm underline underline-offset-4 text-black">VIEW ALL</a>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}

function WardrobeSection() {
  return (
    <section className="bg-[#E8E8E8] py-20 px-6">
      <div className="mx-auto max-w-[1200px] text-center">
        <h2 className="font-serif text-4xl text-black">THE WARDROBE</h2>
        <div className="mx-auto mt-3 h-0.5 w-12 bg-[#D0021B]" />
      </div>

      <div className="mx-auto mt-12 grid max-w-[1200px] grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gray-700 col-span-2 row-span-1 h-[420px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/cat-tshirts.jpg')" }} />
          <div className="absolute inset-0 bg-black/30" />
          <span className="absolute bottom-3 left-3 font-serif text-lg text-white">T-SHIRTS</span>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gray-700 h-[204px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/cat-shirts.jpg')" }} />
          <div className="absolute inset-0 bg-black/30" />
          <span className="absolute bottom-3 left-3 font-serif text-lg text-white">SHIRTS</span>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gray-700 h-[420px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/cat-sarongs.jpg')" }} />
          <div className="absolute inset-0 bg-black/30" />
          <span className="absolute bottom-3 left-3 font-serif text-lg text-white">SARONGS</span>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gray-700 h-[204px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/cat-frocks.jpg')" }} />
          <div className="absolute inset-0 bg-black/30" />
          <span className="absolute bottom-3 left-3 font-serif text-lg text-white">FROCKS</span>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gray-700 h-[420px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/cat-croptops.jpg')" }} />
          <div className="absolute inset-0 bg-black/30" />
          <span className="absolute bottom-3 left-3 font-serif text-lg text-white">CROP TOPS</span>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gray-700 col-span-2 h-[204px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/cat-sarees.jpg')" }} />
          <div className="absolute inset-0 bg-black/30" />
          <span className="absolute bottom-3 left-3 font-serif text-lg text-white">SAREES</span>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gray-700 h-[204px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/cat-lungis.jpg')" }} />
          <div className="absolute inset-0 bg-black/30" />
          <span className="absolute bottom-3 left-3 font-serif text-lg text-white">LUNGIS</span>
        </div>
      </div>
    </section>
  );
}

function DesignStudioSection() {
  return (
    <section id="design-studio" className="py-24 px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-16 lg:flex-row lg:items-center">
        <div className="flex-1 rounded-3xl bg-[#1a0a0a] p-10 text-white">
          <p className="text-xs uppercase tracking-[0.5em] text-[#D0021B]">CONTEMPORARY BATIK COLLECTION</p>
          <h2 className="mt-6 whitespace-pre-line font-serif text-5xl leading-tight text-white md:text-6xl">
            DESIGN
            <br />
            YOUR OWN
            <br />
            BATIK
          </h2>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-gray-400">
            Describe your dream pattern, and our bespoke AI will generate a unique batik blueprint tailored to your style. Hand-crafted by masters, envisioned by you.
          </p>
          <a
            href="#"
            className="mt-6 inline-block rounded-none bg-[#D0021B] px-8 py-3 text-sm uppercase tracking-[0.35em] text-white"
          >
            ENTER STUDIO
          </a>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-3xl bg-black">
          <Image
            src="/images/ai-studio-preview.jpg"
            alt="AI studio preview"
            width={900}
            height={900}
            className="h-full w-full object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
            unoptimized
          />
          <div className="absolute bottom-6 left-6 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
            AI MOCKUP: RASPBERRY DUB
          </div>
        </div>
      </div>
    </section>
  );
}

function CelestialProcessSection() {
  return (
    <section className="bg-white py-20 px-6 text-center">
      <div className="mx-auto max-w-[900px]">
        <p className="text-xs uppercase tracking-[0.5em] text-gray-400">THE CELESTIAL PROCESS</p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-3">
        {processSteps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.num} className="mx-auto max-w-sm rounded-3xl bg-white px-6 py-10 shadow-sm shadow-black/5">
              <Icon className="mx-auto h-8 w-8 text-[#D0021B]" />
              <p className="mt-6 font-serif text-6xl text-gray-100 -tracking-[0.05em]">{step.num}</p>
              <h3 className="mt-4 font-serif text-xl text-gray-800">{step.title}</h3>
              <p className="mt-2 mx-auto max-w-xs text-sm leading-relaxed text-gray-500">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TestimonialNewsletterSection() {
  return (
    <section className="bg-[#F9F5F0] py-20 px-6">
      <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2">
        <div>
          <p className="text-[6rem] font-serif leading-none text-[#D0021B]">“</p>
          <p className="mt-6 max-w-xl font-serif text-xl italic leading-relaxed text-gray-700">
            The intricate details on the silk sarong are unlike anything I've ever seen. Cattleya doesn't just sell clothes; they sell wearable pieces of art.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.35em] text-gray-400">— SARAH J., LUXURY CUSTOMER</p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8">
          <h3 className="font-serif text-2xl text-black">JOIN THE INNER CIRCLE</h3>
          <p className="mt-2 text-sm text-gray-500">Receive exclusive access to seasonal drops and artisan stories.</p>
          <div className="mt-6">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="w-full border-b border-gray-300 bg-transparent py-2 text-sm text-black outline-none placeholder:text-gray-400"
            />
            <button className="mt-4 w-full rounded-none bg-[#D0021B] px-6 py-3 text-sm uppercase tracking-[0.35em] text-white">
              SUBSCRIBE TO INSPIRE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white py-16 px-12">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">CATTLEYA</p>
          <p className="mt-3 max-w-xs text-xs text-gray-500">
            A modern batik atelier where couture meets divine craftsmanship and every design is a story of timeless luxury.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-gray-500">NAVIGATION</p>
          <div className="mt-4 space-y-2 text-sm text-gray-400">
            {['ARTISANAL', 'FORMULAS', 'NEW ARRIVALS', 'CONTACT US', 'PRIVACY POLICY'].map((link) => (
              <a key={link} href="#" className="block transition hover:text-white">
                {link}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-gray-500">SOCIAL</p>
          <div className="mt-4 flex items-center gap-4 text-white">
            <Instagram className="h-5 w-5" />
            <Facebook className="h-5 w-5" />
          </div>
          <div className="mt-8 space-y-2 text-sm text-gray-400">
            {['WISHLIST', 'CART', 'PROFILE SETTINGS'].map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-800 pt-8 text-center text-xs uppercase tracking-[0.5em] text-gray-600">
        IMMENSE BEAUTY OF HEAVEN.
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="font-sans text-black">
      <Navbar />
      <HeroSection />
      <NewArrivalsSection />
      <WardrobeSection />
      <DesignStudioSection />
      <CelestialProcessSection />
      <TestimonialNewsletterSection />
      <Footer />
    </main>
  );
}
