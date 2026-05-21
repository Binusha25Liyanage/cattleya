"use client";

import Image from "next/image";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface DesignCard {
  id: number;
  customerName: string;
  promptQuote: string;
  image: string;
  badge?: "PRIORITY" | "PREMIUM TIER";
  status: "pending" | "approved" | "rejected";
}

const initialDesigns: DesignCard[] = [
  {
    id: 1,
    customerName: "ELOWEN VANCE",
    promptQuote:
      '"Celestial motifs merged with traditional Parang patterns, focusing on nebula-like transitions in silk indigo and gold leaf."',
    image: "/images/design-elowen.jpg",
    badge: "PRIORITY",
    status: "pending",
  },
  {
    id: 2,
    customerName: "SOREN KAELO",
    promptQuote:
      '"A modern minimalist take on Megamendung clouds, using sharp geometric lines and a monochrome palette with blood-red accents."',
    image: "/images/design-soren.jpg",
    status: "pending",
  },
  {
    id: 3,
    customerName: "ARIANNA THORNE",
    promptQuote:
      '"Kawung patterns reimagined for high-fashion runway, emphasising the circular geometry with emerald dyes and metallic finishes."',
    image: "/images/design-arianna.jpg",
    status: "pending",
  },
  {
    id: 4,
    customerName: "MARCUS VALERIUS",
    promptQuote:
      '"An expansive narrative tapestry design representing the four seasons using traditional Indonesian flora and fauna. Earth tones with heavy crackle texture."',
    image: "/images/design-marcus.jpg",
    badge: "PREMIUM TIER",
    status: "pending",
  },
];

export default function AdminDesignReviewPage() {
  const [designs, setDesigns] = useState<DesignCard[]>(initialDesigns);

  const handleAction = (id: number, action: "approve" | "reject") => {
    setDesigns((current) =>
      current.map((design) =>
        design.id === id
          ? {
              ...design,
              status: action === "approve" ? "approved" : "rejected",
            }
          : design,
      ),
    );
  };

  const featuredDesign = designs.find((design) => design.id === 4)!;

  return (
    <div className="min-h-[calc(100vh-0px)] bg-[#f5f5f5] px-8 py-8 font-sans">
      <div>
        <p className="font-serif text-sm italic text-[#D0021B]">Pending Submissions</p>
        <h2 className="mt-1 text-4xl font-serif font-bold text-gray-900">AI DESIGN REVIEW</h2>
        <div className="mt-3 h-0.5 w-16 rounded bg-gray-800" />
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {designs.slice(0, 3).map((design) => {
          const isApproved = design.status === "approved";
          const isRejected = design.status === "rejected";
          return (
            <div
              key={design.id}
              className={`rounded-lg border p-0 shadow-sm overflow-hidden bg-white transition ${
                isApproved
                  ? "border-2 border-emerald-500"
                  : isRejected
                  ? "border border-gray-200 opacity-80"
                  : "border border-gray-100"
              }`}
            >
              <div className="relative h-48 w-full bg-gray-900">
                <Image src={design.image} alt={design.customerName} fill className="object-cover" />
                {design.badge ? (
                  <div
                    className={`absolute top-3 left-3 rounded px-2 py-1 text-[10px] tracking-widest ${
                      design.badge === "PRIORITY"
                        ? "bg-[#D0021B] text-white"
                        : "bg-black/70 text-white"
                    }`}
                  >
                    {design.badge}
                  </div>
                ) : null}
              </div>
              <div className="p-5">
                <p className="text-xs italic text-[#D0021B] font-serif">Customer</p>
                <h3 className="mt-1 text-xl font-serif font-bold uppercase text-gray-900">{design.customerName}</h3>
                <div className="mt-3 rounded border border-gray-100 bg-gray-50 p-3">
                  <p className="text-sm italic leading-relaxed text-gray-600">{design.promptQuote}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {design.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleAction(design.id, "reject")}
                        className="rounded border border-gray-800 px-5 py-2.5 text-xs tracking-widest text-gray-800 transition hover:bg-gray-100"
                      >
                        REJECT
                      </button>
                      <button
                        onClick={() => handleAction(design.id, "approve")}
                        className="rounded bg-[#D0021B] px-5 py-2.5 text-xs tracking-widest text-white transition hover:bg-red-800"
                      >
                        APPROVE
                      </button>
                    </>
                  ) : null}
                  {isApproved ? (
                    <span className="rounded bg-emerald-600 px-3 py-1 text-xs uppercase tracking-widest text-white">Approved</span>
                  ) : null}
                  {isRejected ? (
                    <span className="rounded bg-gray-500 px-3 py-1 text-xs uppercase tracking-widest text-white">Rejected</span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
          <div className="relative h-72 w-full bg-gray-900">
            <Image src={featuredDesign.image} alt={featuredDesign.customerName} fill className="object-cover" />
            {featuredDesign.badge ? (
              <div className="absolute top-3 left-3 rounded bg-black/70 px-2 py-1 text-[10px] tracking-widest text-white">
                {featuredDesign.badge}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs italic text-[#D0021B] font-serif">Customer</p>
          <h3 className="mt-1 text-xl font-serif font-bold uppercase text-gray-900">{featuredDesign.customerName}</h3>
          <div className="mt-3 rounded border border-gray-100 bg-gray-50 p-3">
            <p className="text-sm italic leading-relaxed text-gray-600">{featuredDesign.promptQuote}</p>
          </div>
          <div className="mt-6 grid gap-3">
            <button
              onClick={() => handleAction(featuredDesign.id, "reject")}
              className="rounded border border-gray-800 px-5 py-3 text-xs tracking-widest text-gray-800 transition hover:bg-gray-100"
            >
              REJECT DESIGN
            </button>
            <button
              onClick={() => handleAction(featuredDesign.id, "approve")}
              className="rounded bg-[#D0021B] px-5 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-800"
            >
              APPROVE FOR PRODUCTION
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-[#1e1e1e] p-6 text-white shadow-sm">
          <Sparkles className="h-8 w-8 text-[#D0021B]" />
          <h3 className="mt-4 text-xl font-serif">AI ANALYTICS</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            89% of current designs align with Summer '24 editorial themes.
          </p>
          <div className="mt-6 flex justify-between text-xs text-gray-400">
            <span>CONSISTENCY SCORE</span>
            <span>82/100</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded bg-gray-700">
            <div className="h-full w-[82%] rounded bg-[#D0021B]" />
          </div>
        </div>
      </div>

      <footer className="mt-10 rounded-lg bg-[#1e1e1e] px-12 py-10 text-white">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="font-serif text-2xl">CATTLEYA</div>
            <div className="mt-1 text-sm text-gray-500 italic">"The Immense Beauty of Heaven"</div>
          </div>
          <div className="text-right">
            <div className="text-xs tracking-widest text-gray-500">SYSTEM STATUS</div>
            <div className="mt-1 flex items-center justify-end gap-2 text-sm text-white">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>Design Core Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
