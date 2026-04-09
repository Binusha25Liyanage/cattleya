"use client";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { border: "1px solid #C9A84C", background: "#0A0A0A", color: "#F5F0E8" },
        }}
      />
    </>
  );
}
