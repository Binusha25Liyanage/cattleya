"use client";

import { Textarea } from "@/components/ui/textarea";

export function PromptInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder="blue lotus flowers on cream background" />;
}
