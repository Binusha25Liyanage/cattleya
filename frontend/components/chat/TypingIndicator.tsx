"use client";

export function TypingIndicator() {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-[16px_16px_16px_4px] bg-white p-3 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D0021B] bg-white text-[#D0021B]">S</div>
      <div>
        <div className="text-[12px] font-medium text-[#6B6B6B]">Support is typing...</div>
        <div className="mt-2 flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#D0021B] animate-bounce"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-[#D0021B] animate-bounce [animation-delay:150ms]"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-[#D0021B] animate-bounce [animation-delay:300ms]"></span>
        </div>
      </div>
    </div>
  );
}
