"use client";

import { useEffect } from "react";
import { X, Download } from "lucide-react";

interface ImageLightboxProps {
  imageUrl: string;
  onClose: () => void;
}

export function ImageLightbox({ imageUrl, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[#111111] shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-[#D0021B] shadow">
          <X className="h-5 w-5" />
        </button>
        <a href={imageUrl} target="_blank" rel="noreferrer" className="absolute left-4 top-4 z-10 rounded-full bg-[#D0021B] p-2 text-white shadow">
          <Download className="h-5 w-5" />
        </a>
        <img src={imageUrl} alt="Chat attachment" className="h-[80vh] w-full object-contain" />
      </div>
    </div>
  );
}
