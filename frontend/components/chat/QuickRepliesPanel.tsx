"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkle } from "lucide-react";

const DEFAULT_QUICK_REPLIES = [
  "Thank you for contacting CATTLEYA!",
  "Your order has been processed.",
  "Your AI design has been approved!",
  "We'll get back to you shortly.",
  "Please share your order number.",
];

interface QuickRepliesPanelProps {
  onSelect: (text: string) => void;
}

export function QuickRepliesPanel({ onSelect }: QuickRepliesPanelProps) {
  const [customReplies, setCustomReplies] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("cattleya_quick_replies") : null;
    if (stored) {
      setCustomReplies(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cattleya_quick_replies", JSON.stringify(customReplies));
    }
  }, [customReplies]);

  const addReply = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setCustomReplies((state) => [trimmed, ...state.slice(0, 4)]);
    setDraft("");
  };

  return (
    <div className="rounded-3xl border border-[#E8E8E8] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
          <Sparkle className="h-4 w-4 text-[#D0021B]" />
          Quick replies
        </div>
        <div className="text-[12px] text-[#6B6B6B]">Tap to insert</div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {DEFAULT_QUICK_REPLIES.map((reply) => (
          <button key={reply} type="button" onClick={() => onSelect(reply)} className="rounded-2xl border border-[#E8E8E8] bg-[#F5F5F5] px-3 py-2 text-left text-sm text-[#1A1A1A] hover:border-[#D0021B] hover:text-[#D0021B]">
            {reply}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        <div className="italic text-sm text-[#6B6B6B]">Custom replies</div>
        {customReplies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8E8E8] bg-[#F9F9F9] p-3 text-sm text-[#6B6B6B]">Save your own quick responses here.</div>
        ) : (
          <div className="grid gap-2">
            {customReplies.map((reply) => (
              <button key={reply} type="button" onClick={() => onSelect(reply)} className="rounded-2xl border border-[#E8E8E8] bg-[#F5F5F5] px-3 py-2 text-left text-sm text-[#1A1A1A] hover:border-[#D0021B] hover:text-[#D0021B]">
                {reply}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add custom reply" className="flex-1 rounded-2xl border border-[#E8E8E8] bg-[#F5F5F5] px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#D0021B]" />
          <button type="button" onClick={addReply} className="inline-flex items-center gap-2 rounded-2xl bg-[#D0021B] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#b0011a]">
            <Plus className="h-4 w-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
