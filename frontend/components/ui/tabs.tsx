"use client";

import * as React from "react";

export function Tabs({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex rounded-full border border-gold/20 bg-white p-1">{children}</div>;
}

export function TabsTrigger({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full px-4 py-2 text-sm ${active ? "bg-cattleya-black text-gold" : "text-cattleya-muted"}`}>
      {children}
    </button>
  );
}

export function TabsContent({ children, hidden }: { children: React.ReactNode; hidden?: boolean }) {
  return hidden ? null : <div>{children}</div>;
}
