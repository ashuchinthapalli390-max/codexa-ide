"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ANNOUNCEMENT_DATA } from "@/lib/navigation";
import { Tag, Check, Copy, ExternalLink } from "lucide-react";

export function AnnouncementBar() {
  const [copied, setCopied] = useState(false);

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ANNOUNCEMENT_DATA.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openOfferModal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-codexa-offer"));
    }
  };

  return (
    <div className="w-full h-8 sm:h-9 bg-[#040405] border-b border-white/[0.07] text-xs select-none relative z-50">
      <div className="mx-auto flex h-full max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Pre-Beta Discount Announcement */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={openOfferModal}
            className="group inline-flex items-center gap-2 text-left focus:outline-none"
            title="Click to view Pre-Beta 20% Discount details"
          >
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-400 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Pre-Beta
            </span>

            <span className="text-[12px] font-sans font-medium text-white/90 group-hover:text-white transition-colors truncate">
              Save 20% on all subscription plans
            </span>
          </button>

          {/* Compact Coupon Badge with One-Click Copy */}
          <button
            onClick={handleCopyCoupon}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-mono text-[11px] font-semibold transition-colors shrink-0"
            title="Click to copy coupon code"
          >
            <Tag className="w-2.5 h-2.5 text-white/60" />
            <span>{ANNOUNCEMENT_DATA.couponCode}</span>
            {copied ? (
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            ) : (
              <Copy className="w-2.5 h-2.5 text-white/40" />
            )}
          </button>
        </div>

        {/* Right: Minimal Essential Utility Links */}
        <div className="hidden md:flex items-center gap-5 text-[12px] font-sans text-white/60 shrink-0">
          <Link
            href="/docs"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Documentation
          </Link>

          <Link
            href="/releases"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Release Notes
          </Link>

          <div className="flex items-center gap-1.5 text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-medium text-white/80">Systems Nominal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

