"use client";

import { useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  CheckCircle,
  Heart,
  Instagram,
  Pencil,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  UserCircle,
  Waves,
  Wind,
  LayoutTemplate,
  Shirt,
  Sparkles,
} from "lucide-react";

const canvasOptions = [
  { id: "tshirt", label: "T-SHIRT", icon: Shirt },
  { id: "sarong", label: "SARONG", icon: Waves },
  { id: "scarf", label: "SCARF", icon: Wind },
  { id: "wall-tapestry", label: "WALL TAPESTRY", icon: LayoutTemplate },
  { id: "canvas-bag", label: "CANVAS BAG", icon: ShoppingBag },
];

const promptHints = ["MIDNIGHT GARDEN", "PHOENIX RISING", "FLORAL FRACTAL"];

const progressSteps = [
  { num: "01", label: "VISION", step: 1 },
  { num: "02", label: "ENHANCEMENT", step: 2 },
  { num: "03", label: "GENERATION", step: 3 },
  { num: "04", label: "PREVIEW", step: 4 },
];

const canvasDisplayNames: Record<string, string> = {
  tshirt: "T-SHIRT",
  sarong: "SARONG",
  scarf: "SCARF",
  "wall-tapestry": "WALL TAPESTRY",
  "canvas-bag": "CANVAS BAG",
};

export default function CustomizeStudioPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [selectedCanvas, setSelectedCanvas] = useState<"tshirt" | "sarong" | "scarf" | "wall-tapestry" | "canvas-bag">("sarong");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [designId, setDesignId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [progressLabel, setProgressLabel] = useState("INITIALISING PROCESS INTEGRATION");

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000", {
      withCredentials: true,
    });

    s.on("design:ready", (data: { designId: string; imageUrl: string }) => {
      if (data.designId === designId) {
        setGeneratedImageUrl(data.imageUrl);
        setIsGenerating(false);
        setGenerationProgress(100);
        setStep(4);
      }
    });

    s.on("design:progress", (data: { designId: string; progress: number; label: string }) => {
      if (data.designId === designId) {
        setGenerationProgress(data.progress);
        setProgressLabel(data.label);
      }
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [designId]);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;

    setIsEnhancing(true);
    setStep(2);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customize/enhance-prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ prompt, canvas: selectedCanvas }),
      });

      const data = await res.json();
      if (data.success) {
        setEnhancedPrompt(data.data.enhancedPrompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!enhancedPrompt) return;

    setIsGenerating(true);
    setGenerationProgress(5);
    setStep(3);
    setProgressLabel("INITIALISING PROCESS INTEGRATION");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customize/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ enhancedPrompt, canvas: selectedCanvas }),
      });

      const data = await res.json();
      if (data.success) {
        setDesignId(data.data.designId);
      }
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  const handleDiscard = () => {
    setStep(1);
    setPrompt("");
    setEnhancedPrompt("");
    setIsEnhancing(false);
    setIsGenerating(false);
    setGeneratedImageUrl(null);
    setDesignId(null);
    setGenerationProgress(0);
    setProgressLabel("INITIALISING PROCESS INTEGRATION");
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const canvasLabel = canvasDisplayNames[selectedCanvas];
  const heroNavLinks = useMemo(
    () => ["COLLECTIONS", "ARTISANAL", "HERITAGE", "MEN", "WOMEN", "BESPOKE"],
    []
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="bg-[#0a0a0a] border-b border-white/10 px-8 py-5">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6">
          <div className="font-serif text-xl font-bold tracking-widest text-white">CATTLEYA</div>
          <nav className="hidden items-center gap-8 text-xs uppercase tracking-widest text-gray-400 md:flex">
            {heroNavLinks.map((link) => {
              const isActive = link === "BESPOKE";
              return (
                <button
                  type="button"
                  key={link}
                  className={`transition ${
                    isActive ? "text-[#D0021B] border-b border-[#D0021B] pb-0.5" : "hover:text-white"
                  }`}
                >
                  {link}
                </button>
              );
            })}
          </nav>
          <div className="flex items-center gap-4 text-gray-400">
            <Heart className="h-4 w-4" />
            <ShoppingBag className="h-4 w-4" />
            <UserCircle className="h-4 w-4" />
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[#0a0a0a] text-center py-14">
          <div className="mx-auto max-w-5xl px-6">
            <h1 className="font-serif text-6xl font-light tracking-[0.2em] text-white md:text-8xl">AI DESIGN STUDIO</h1>
            <p className="mt-3 font-serif italic text-gray-400 text-base">
              Powered by Claude & Stable Diffusion
            </p>
          </div>
        </section>

        <section className="bg-[#0a0a0a] pb-8">
          <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 px-6">
            {progressSteps.map((item, index) => {
              const status = item.step === step ? "active" : item.step < step ? "completed" : "upcoming";
              return (
                <div key={item.step} className="flex items-center gap-0">
                  <div
                    className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs uppercase tracking-widest ${
                      status === "active"
                        ? "bg-[#D0021B] text-white"
                        : status === "completed"
                        ? "border border-[#D0021B] text-[#D0021B] bg-transparent"
                        : "border border-gray-700 text-gray-600 bg-transparent"
                    }`}
                  >
                    <span>{item.num}</span>
                    <span>{item.label}</span>
                  </div>
                  {index < progressSteps.length - 1 ? <ChevronRight className="h-4 w-4 text-gray-600" /> : null}
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[#0d0d0d] px-8 py-10">
          <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[1.35fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-gray-400">
                  <span>DESCRIBE YOUR VISION</span>
                  <Pencil className="h-4 w-4 text-gray-600" />
                </div>
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder='e.g., "Peacock feathers on indigo silk, weaving into golden celestial mandalas with a hint of morning dew..."'
                  className="mt-4 h-32 w-full rounded-3xl border border-[#2a2a2a] bg-[#111111] px-4 py-4 text-sm font-serif italic text-gray-300 outline-none placeholder:text-gray-600 focus:border-[#D0021B]/50"
                />

                <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] tracking-widest text-gray-600">
                  <span>PROMPT HINTS:</span>
                  {promptHints.map((hint) => (
                    <button
                      key={hint}
                      type="button"
                      onClick={() => setPrompt(hint)}
                      className="rounded-full border border-[#2a2a2a] bg-[#111111] px-3 py-1.5 text-gray-500 transition hover:border-[#D0021B]/50 hover:text-gray-300"
                    >
                      {hint}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!prompt.trim() || isEnhancing}
                  onClick={handleEnhancePrompt}
                  className="mt-5 w-full rounded-3xl bg-[#D0021B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isEnhancing ? "ENHANCING..." : "ENHANCE WITH AI →"}
                </button>
              </div>

              <div className="rounded-3xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                <div className="text-xs uppercase tracking-[0.2em] text-gray-400">SELECT CANVAS</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {canvasOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedCanvas === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedCanvas(option.id as any)}
                        className={`flex min-w-[96px] flex-col items-center gap-3 rounded-3xl border p-4 text-xs uppercase tracking-[0.25em] transition ${
                          isSelected
                            ? "border-[#D0021B] bg-[#D0021B]/10 text-[#D0021B]"
                            : "border-[#2a2a2a] bg-[#111111] text-gray-400 hover:border-gray-600"
                        }`}
                      >
                        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isSelected ? "bg-[#D0021B]/15" : "bg-[#121212]"}`}>
                          <Icon className="h-6 w-6" />
                        </span>
                        <span className="text-[10px] text-center leading-tight">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D0021B]">
                  <Sparkles className="h-4 w-4" />
                  <span>AI ENHANCEMENT ENGINE</span>
                </div>

                {step === 1 ? (
                  <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-[#111111] px-5 py-12 text-center text-sm text-gray-500">
                    Describe your vision and click Enhance to see Claude's interpretation...
                  </div>
                ) : (
                  <div className="mt-6 space-y-5">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-gray-600">ORIGINAL:</div>
                      <p className="mt-2 font-serif italic text-sm text-gray-500">
                        {prompt ? `"${prompt.slice(0, 80)}${prompt.length > 80 ? "..." : ""}"` : "—"
                        }
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <ChevronRight className="h-5 w-5 text-[#D0021B]" />
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-[#D0021B]">ENHANCED GLOBAL PROMPT:</div>
                      {isEnhancing ? (
                        <div className="space-y-2 mt-3">
                          {[0, 1, 2].map((index) => (
                            <div key={index} className="h-3 rounded-full bg-[#2a2a2a] animate-pulse" style={{ width: `${85 - index * 15}%` }} />
                          ))}
                        </div>
                      ) : enhancedPrompt ? (
                        <p className="mt-3 font-serif italic text-sm text-[#D0021B]/80 leading-relaxed">
                          {enhancedPrompt}
                        </p>
                      ) : (
                        <p className="mt-3 text-sm text-gray-500">Your enhanced prompt will appear here once AI processing completes.</p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={!enhancedPrompt || isGenerating}
                      onClick={handleGenerate}
                      className="mt-5 w-full rounded-3xl bg-[#D0021B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      GENERATE DESIGN →
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 min-h-[320px]">
                {step < 3 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-sm text-gray-500">
                    <p className="font-serif italic">Generation output will appear here...</p>
                  </div>
                ) : step === 3 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-6 py-12 text-center">
                    <div className="relative flex h-16 w-16 items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-[#D0021B]/20" />
                      <div className="absolute inset-0 rounded-full border-t-2 border-[#D0021B] animate-spin" />
                      <div className="relative flex h-full w-full items-center justify-center">
                        <span className="font-serif text-2xl text-[#D0021B]">C</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-serif italic text-lg text-white">Weaving your design...</p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gray-600">
                        ORCHESTRATING PIXELS AND HERITAGE
                      </p>
                    </div>
                    <div className="w-full max-w-sm space-y-3">
                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span>{progressLabel}</span>
                        <span>{generationProgress}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-[#2a2a2a]">
                        <div
                          className="h-1 rounded-full bg-[#D0021B] transition-all duration-500"
                          style={{ width: `${generationProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
                    <CheckCircle className="h-10 w-10 text-emerald-400" />
                    <div className="font-serif italic text-xl text-white">Design generated!</div>
                    <p className="text-sm text-gray-500">Scroll down to preview your bespoke studio creation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0d0d0d] border-t border-[#1a1a1a] px-8 py-5">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.3em] text-gray-400">
              <button
                type="button"
                onClick={handleDiscard}
                className="inline-flex items-center gap-2 text-gray-500 transition hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
                DISCARD
              </button>
              <button type="button" className="inline-flex items-center gap-2 text-gray-500 transition hover:text-white">
                <Bookmark className="h-4 w-4" />
                SAVE TO ATELIER
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={step < 3}
                onClick={handleGenerate}
                className="rounded-full border border-gray-600 px-6 py-3 text-xs uppercase tracking-[0.25em] text-gray-300 transition hover:border-gray-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                REGENERATE ALTERNATIVE
              </button>
              <button
                type="button"
                disabled={step < 4}
                onClick={() => console.log("Generate high-res for", designId)}
                className="rounded-full bg-[#D0021B] px-6 py-3 text-xs uppercase tracking-[0.25em] text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                GENERATE FINAL HIGH-RES
              </button>
            </div>
          </div>
        </section>

        {step === 4 && generatedImageUrl ? (
          <section className="bg-[#0a0a0a] px-8 py-16">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">BESPOKE STUDIO</p>
              <h2 className="mt-4 font-serif text-4xl text-white tracking-[0.2em]">STUDIO PREVIEW</h2>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
              <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-6">
                <div className="aspect-square overflow-hidden rounded-3xl bg-black">
                  <img src={generatedImageUrl} alt="Generated design" className="h-full w-full object-cover" />
                </div>
                <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-white">
                  SOURCE: AI PATTERN GENERATION
                </div>
              </div>

              <div className="rounded-3xl bg-[#8B1A1A] p-6 text-white">
                <div className="flex h-full flex-col justify-between gap-6">
                  <div className="flex min-h-[220px] items-center justify-center rounded-3xl bg-white/5 p-6 text-center">
                    <div>
                      <div className="font-serif text-2xl opacity-70">{canvasLabel}</div>
                      <div className="mt-3 text-white/60">MOCKUP</div>
                      <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/30">BESPOKE EDITION</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.3em] text-white/80">THE AZURE HERITAGE {canvasLabel}</div>
                    <h3 className="mt-4 font-serif text-3xl font-bold leading-tight text-white">A bespoke manifestation of your vision.</h3>
                    <p className="mt-3 text-xs text-white/70 leading-relaxed">
                      A bespoke manifestation of your vision, tailored in premium Javanese silk.
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div />
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">ESTIMATED PRICE</p>
                      <p className="mt-2 font-serif text-3xl font-bold text-white">$420.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-[#0a0a0a] py-10">
          <div className="mx-auto flex justify-center px-8">
            <button
              type="button"
              disabled={step < 4}
              onClick={() => console.log("Add to cart:", designId)}
              className="inline-flex items-center gap-3 rounded-full bg-[#D0021B] px-16 py-5 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingCart className="h-5 w-5" />
              ADD TO CART WITH THIS DESIGN
            </button>
          </div>
        </section>

        <footer className="bg-[#0a0a0a] border-t border-white/10 px-12 py-16">
          <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-3">
            <div>
              <div className="font-serif text-3xl tracking-widest text-white">CATTLEYA</div>
              <p className="mt-3 max-w-xs font-serif italic text-[#D0021B]">Immense beauty of heaven.</p>
              <div className="mt-8 text-[10px] uppercase tracking-[0.2em] text-gray-600">JOIN THE INNER CIRCLE</div>
              <div className="mt-3 flex items-center gap-3 border-b border-gray-700 pb-2">
                <input
                  type="email"
                  placeholder="YOUR EMAIL ADDRESS"
                  className="w-full bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-600"
                />
                <button type="button" className="text-gray-600 transition hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#D0021B]">THE HOUSE</div>
              <div className="mt-4 flex flex-col gap-3 text-xs uppercase tracking-[0.2em] text-gray-500">
                {['CRAFTSMANSHIP', 'SUSTAINABILITY', 'BOUTIQUES', 'THE ATELIER'].map((link) => (
                  <button key={link} type="button" className="text-left transition hover:text-white">
                    {link}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#D0021B]">CONCIERGE</div>
              <div className="mt-4 flex flex-col gap-3 text-xs uppercase tracking-[0.2em] text-gray-500">
                {['CONTACT US', 'SHIPPING & RETURNS', 'PRIVACY POLICY', 'TERMS OF SERVICE'].map((link) => (
                  <button key={link} type="button" className="text-left transition hover:text-white">
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.2em] text-gray-700 lg:flex-row">
            <div>© 2024 CATTLEYA. IMMENSE BEAUTY OF HEAVEN.</div>
            <div className="flex items-center gap-4 text-gray-600">
              <button type="button" className="transition hover:text-white">
                <Instagram className="h-4 w-4" />
              </button>
              <button type="button" className="transition hover:text-white">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
