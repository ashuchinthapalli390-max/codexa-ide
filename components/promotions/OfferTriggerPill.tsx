"use client";

import React, { useState } from "react";
import { Sparkles, Tag } from "lucide-react";

export function OfferTriggerPill() {
  const triggerOfferModal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-codexa-offer"));
    }
  };

  return (
    <button
      onClick={triggerOfferModal}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-sans font-semibold text-white transition-all shadow-sm group cursor-pointer"
      title="Open Pre-Beta 20% Discount Offer"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
      <span className="text-white/90">Pre-Beta: 20% Off</span>
      <span className="text-white/40 font-mono text-[10px] hidden sm:inline">[CODEXA20]</span>
    </button>
  );
}

