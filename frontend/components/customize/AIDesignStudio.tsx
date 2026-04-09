"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { getSocket, useSocket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PromptInput } from "./PromptInput";
import { DesignPreview } from "./DesignPreview";
import { ProductMockup } from "./ProductMockup";

export function AIDesignStudio() {
  const [promptText, setPromptText] = useState("lotus flowers on cream silk");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [designId, setDesignId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [productType, setProductType] = useState<"tshirt" | "sarong">("tshirt");
  const { socket } = useSocket();

  useEffect(() => {
    socket.on("design:ready", (payload: { designId: string; imageUrl: string }) => {
      if (payload.designId === designId) {
        setImageUrl(payload.imageUrl);
        setLoading(false);
        toast.success("Design ready");
      }
    });
    socket.on("design:failed", () => {
      setLoading(false);
      toast.error("Design generation failed");
    });
    return () => {
      socket.off("design:ready");
      socket.off("design:failed");
    };
  }, [designId, socket]);

  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(async () => {
      const response = await api.get(`/customize/status/${jobId}`);
      if (response.data.data?.imageUrl) {
        setImageUrl(response.data.data.imageUrl);
        setLoading(false);
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [jobId]);

  const hints = useMemo(() => ["Try: peacock feathers on indigo background", "Try: geometric triangles in earth tones", "Try: lotus flowers on cream silk"], []);

  async function enhancePrompt() {
    const response = await api.post("/customize/enhance-prompt", { promptText });
    setEnhancedPrompt(response.data.data.enhancedPrompt);
  }

  async function generateDesign() {
    setLoading(true);
    const response = await api.post("/customize/generate", { promptText, enhancedPrompt, styleParams: { productType } });
    setJobId(response.data.data.jobId);
    setDesignId(response.data.data.designId);
    toast("Weaving your design... this takes about 20 seconds");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardContent className="space-y-6">
          <div>
            <h2 className="font-heading text-3xl">AI Design Studio</h2>
            <p className="mt-2 text-sm text-cattleya-muted">Designs reviewed within 24-48 hours before printing.</p>
          </div>
          <div className="rounded-3xl bg-gold/10 p-4 text-sm text-cattleya-muted">
            {hints.map((hint) => <div key={hint}>{hint}</div>)}
          </div>
          <PromptInput value={promptText} onChange={setPromptText} />
          <div className="flex flex-wrap gap-3">
            <Button onClick={enhancePrompt}>Enhance Prompt</Button>
            <Button variant="outline" onClick={generateDesign}>Generate Design</Button>
            <Button variant="outline" onClick={() => setProductType((value) => (value === "tshirt" ? "sarong" : "tshirt"))}>Toggle Mockup</Button>
          </div>
          <textarea className="min-h-28 w-full rounded-2xl border border-gold/20 bg-white p-4 text-sm" value={enhancedPrompt} onChange={(event) => setEnhancedPrompt(event.target.value)} placeholder="Enhanced prompt" />
          {loading ? <div className="rounded-3xl bg-gradient-to-r from-cattleya-teal via-cattleya-purple to-cattleya-pink p-6 text-center text-white">Weaving your design... this takes about 20 seconds</div> : null}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <ProductMockup>
            <DesignPreview imageUrl={imageUrl} />
          </ProductMockup>
          <div className="flex gap-3">
            <Button variant="outline">Regenerate</Button>
            <Button>Add to Cart</Button>
            <Button variant="outline">Save Design</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
