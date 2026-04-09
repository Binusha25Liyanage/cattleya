"use client";

import * as React from "react";

export function Slider({ value, onValueChange }: { value: number[]; onValueChange: (value: number[]) => void }) {
  return <input type="range" min={0} max={10000} value={value[0]} onChange={(event) => onValueChange([Number(event.target.value)])} className="w-full accent-gold" />;
}
