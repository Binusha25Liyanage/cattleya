"use client";

interface OnlineIndicatorProps {
  isOnline: boolean;
  pulse?: boolean;
}

export function OnlineIndicator({ isOnline, pulse = false }: OnlineIndicatorProps) {
  return (
    <span className={`relative inline-flex h-3.5 w-3.5 rounded-full ${isOnline ? "bg-[#00C853]" : "bg-[#9A9A9A]"} ${pulse && isOnline ? "animate-pulse" : ""}`}>
      {isOnline ? <span className="absolute inset-0 rounded-full opacity-70" /> : null}
    </span>
  );
}
