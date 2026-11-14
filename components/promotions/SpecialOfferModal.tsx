"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Copy,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Clock,
  Loader2,
} from "lucide-react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function SpecialOfferModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [expiryTimestamp, setExpiryTimestamp] = useState<string>("2026-11-17T00:00:00+05:30");
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  // Calculate remaining time against server-defined promotion deadline
  const calculateTimeRemaining = useCallback((targetIso: string): TimeRemaining => {
    const target = new Date(targetIso).getTime();
    const now = Date.now();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, isExpired: false };
  }, []);

  // Fetch campaign config from server
  useEffect(() => {
    fetch("/api/promotions")
      .then((res) => res.json())
      .then((data) => {
        if (data.campaign?.expiresAt) {
          setExpiryTimestamp(data.campaign.expiresAt);
          setTimeLeft(calculateTimeRemaining(data.campaign.expiresAt));
        }
      })
      .catch(() => {});
  }, [calculateTimeRemaining]);

  // Live countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(expiryTimestamp));
    }, 1000);
    return () => clearInterval(timer);
  }, [expiryTimestamp, calculateTimeRemaining]);

  // Handle appearance delay & scroll trigger
  useEffect(() => {
    // Check if dismissed recently (7-day suppression)
    try {
      const dismissedUntil = localStorage.getItem("codexa_offer_dismissed_until");
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        return;
      }
    } catch {}

    let hasOpened = false;

    // Time-based appearance delay (3.5s)
    const delayTimer = setTimeout(() => {
      if (!hasOpened) {
        hasOpened = true;
        setIsOpen(true);
      }
    }, 3800);

    // Scroll-based appearance trigger (after 400px scroll)
    const handleScroll = () => {
      if (!hasOpened && window.scrollY > 400) {
        hasOpened = true;
        setIsOpen(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(delayTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Listen for custom trigger to open from navbar pill
  useEffect(() => {
    const handleManualOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-codexa-offer", handleManualOpen);
    return () => window.removeEventListener("open-codexa-offer", handleManualOpen);
  }, []);

  // Dismissal handler
  const handleDismiss = () => {
    setIsOpen(false);
    try {
      // Suppress for 7 days
      localStorage.setItem(
        "codexa_offer_dismissed_until",
        (Date.now() + 7 * 24 * 60 * 60 * 1000).toString()
      );
    } catch {}
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Copy coupon handler
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText("CODEXA20");
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  // Claim discount action
  const handleClaimDiscount = async () => {
    setIsClaiming(true);
    try {
      const res = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "CODEXA20", planId: "PLUS" }),
      });
      const data = await res.json();
      if (data.valid) {
        setClaimSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          // Scroll smoothly to pricing section
          const pricingEl = document.getElementById("prebeta-pricing");
          if (pricingEl) {
            pricingEl.scrollIntoView({ behavior: "smooth" });
          }
        }, 800);
      }
    } catch {
    } finally {
      setIsClaiming(false);
    }
  };

  const handleExplorePlans = () => {
    setIsOpen(false);
    const pricingEl = document.getElementById("prebeta-pricing");
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="special-offer-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-300 select-none"
      onClick={handleDismiss}
    >
      {/* Modal Card Surface: NexCloud near-black, rounded-2xl, neutral border */}
      <div
        className="relative w-full max-w-[480px] bg-[#0B0C0E] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-250 cursor-default text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Close special offer dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Eyebrow Row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#A1A4AE]">
            PRE-BETA EXCLUSIVE
          </span>
        </div>

        {/* Heading */}
        <h2
          id="special-offer-title"
          className="text-2xl sm:text-[28px] font-orbitron font-bold tracking-tight text-white leading-tight mb-2"
        >
          Build Early. Save 20%.
        </h2>

        {/* Description */}
        <p className="text-[13.5px] text-white/70 font-sans leading-relaxed mb-4">
          Pre-book your CodeXa Studio IDE plan and unlock 20% off your first month. Get access to intelligent coding tools and a premium multi-model AI workspace.
        </p>

        {/* Highlight Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-sans font-semibold text-white/90 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          <span>20% OFF ALL FOUR PLANS</span>
        </div>

        {/* Real Countdown Clock (DAYS : HOURS : MINUTES : SECONDS) */}
        <div className="mb-6">
          <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-white/60" />
            <span>Offer Closes In (Launch Deadline IST)</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "DAYS", val: timeLeft.days },
              { label: "HOURS", val: timeLeft.hours },
              { label: "MINS", val: timeLeft.minutes },
              { label: "SECS", val: timeLeft.seconds },
            ].map((box, idx) => (
              <div
                key={idx}
                className="bg-[#121316] border border-white/10 rounded-xl p-2.5 text-center flex flex-col justify-center shadow-inner"
              >
                <span className="font-inter font-bold text-xl sm:text-2xl text-white tracking-tight tabular-nums">
                  {String(box.val).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono tracking-wider text-white/40 mt-0.5">
                  {box.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Code Field with Copy Button */}
        <div className="mb-6 p-2 rounded-xl bg-[#121316] border border-white/10 flex items-center justify-between">
          <div className="pl-2">
            <span className="text-[9px] font-mono uppercase text-white/40 block">
              OFFER CODE
            </span>
            <span className="font-mono font-bold text-sm tracking-wider text-white">
              CODEXA20
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-sans font-semibold text-white transition-colors"
            aria-label="Copy coupon code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white/70" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleClaimDiscount}
            disabled={isClaiming || timeLeft.isExpired}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-[#050506] text-sm font-sans font-semibold tracking-[-0.02em] flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isClaiming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Validating Offer...</span>
              </>
            ) : claimSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">20% Discount Activated!</span>
              </>
            ) : (
              <>
                <span>Claim Discount</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>

          <button
            onClick={handleExplorePlans}
            className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-white/5 text-white/70 hover:text-white text-xs font-sans font-medium transition-colors"
          >
            Explore Plans
          </button>
        </div>

        {/* Bottom Terms Note */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-sans">
          <span>*Applies to first month of subscription</span>
          <span>Official Launch Nov 17, 2026</span>
        </div>
      </div>
    </div>
  );
}

