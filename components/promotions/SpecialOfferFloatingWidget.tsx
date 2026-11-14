"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tag, Sparkles, Copy, Check, X, ArrowRight, Clock, Loader2 } from "lucide-react";

interface SpecialOfferFloatingWidgetProps {
  onClaimSuccess?: () => void;
  isHidden?: boolean; // Controlled by collision manager
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function SpecialOfferFloatingWidget({
  onClaimSuccess,
  isHidden = false,
}: SpecialOfferFloatingWidgetProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [expiryTimestamp, setExpiryTimestamp] = useState<string>("2026-11-17T00:00:00+05:30");
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

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

  // Check dismissal
  useEffect(() => {
    try {
      const dismissedUntil = localStorage.getItem("codexa_floating_offer_dismissed");
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        setIsDismissed(true);
      }
      // Also check if already claimed
      const claimedCookie = document.cookie.includes("cxa_discount_claimed=true");
      if (claimedCookie) {
        setClaimSuccess(true);
      }
    } catch {}
  }, []);

  // Fetch campaign config
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

  // Live ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(expiryTimestamp));
    }, 1000);
    return () => clearInterval(timer);
  }, [expiryTimestamp, calculateTimeRemaining]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText("CODEXA20");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleClaimDiscount = async () => {
    setIsClaiming(true);
    try {
      const res = await fetch("/api/promotions/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "CODEXA20", planId: "PLUS" }),
      });

      const data = await res.json();
      if (res.ok) {
        setClaimSuccess(true);
        // Dispatch global event for instant reactivity across all pricing cards
        window.dispatchEvent(new CustomEvent("codexa-discount-claimed"));
        if (onClaimSuccess) onClaimSuccess();
        setTimeout(() => {
          setPanelOpen(false);
          // Scroll to pricing so user sees the discounted prices
          const pricingEl = document.getElementById("pricing");
          if (pricingEl) pricingEl.scrollIntoView({ behavior: "smooth" });
        }, 1200);
      } else {
        alert(data.error || "Failed to claim coupon.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleDismissPill = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    setPanelOpen(false);
    try {
      localStorage.setItem(
        "codexa_floating_offer_dismissed",
        (Date.now() + 7 * 24 * 60 * 60 * 1000).toString()
      );
    } catch {}
  };

  if (isDismissed || isHidden) return null;

  return (
    <div className="fixed right-4 sm:right-6 bottom-6 z-40 select-none">
      {/* Expanded Popover Panel (Anchored above button) */}
      {panelOpen && (
        <div className="absolute right-0 bottom-14 w-[360px] sm:w-[390px] max-w-[calc(100vw-32px)] bg-[#0B0C0E] border border-white/15 rounded-2xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-white animate-in slide-in-from-bottom-3 duration-200">
          {/* Close Panel Button */}
          <button
            onClick={() => setPanelOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close discount panel"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#A1A4AE]">
              PRE-BETA EXCLUSIVE
            </span>
          </div>

          {/* Heading */}
          <h3 className="text-xl font-orbitron font-bold tracking-tight text-white mb-1.5">
            Unlock 20% Off
          </h3>

          <p className="text-xs text-white/70 font-sans leading-relaxed mb-4">
            Claim your pre-beta offer and save 20% on your first CodeXa subscription payment across all four plans.
          </p>

          {/* Coupon Code Block */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#121316] border border-white/10 mb-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-bold tracking-wider">CODEXA20</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-sans font-medium transition-colors flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-white/60" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Countdown Clock */}
          <div className="mb-5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>Offer Closes In (Launch IST)</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
              {[
                { label: "DAYS", val: timeLeft.days },
                { label: "HRS", val: timeLeft.hours },
                { label: "MIN", val: timeLeft.minutes },
                { label: "SEC", val: timeLeft.seconds },
              ].map((t) => (
                <div key={t.label} className="p-2 rounded-lg bg-[#141519] border border-white/5">
                  <div className="text-sm font-bold text-white tabular-nums">
                    {String(t.val).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] text-white/40">{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Claim Button */}
          {claimSuccess ? (
            <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-sans font-semibold text-xs flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>20% Discount Claimed! Check Plans Below</span>
            </div>
          ) : (
            <button
              onClick={handleClaimDiscount}
              disabled={isClaiming}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 active:scale-[0.98] text-black font-sans font-semibold text-xs tracking-tight transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Activating Discount...</span>
                </>
              ) : (
                <>
                  <span>Claim Discount</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Floating Offer Pill Trigger */}
      <div className="flex items-center gap-1 bg-[#0E0F12] border border-white/15 hover:border-white/30 rounded-full p-1.5 pl-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.8)] transition-all hover:scale-[1.02]">
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="flex items-center gap-2 text-xs font-sans font-medium text-white focus:outline-none"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Tag className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold tracking-tight">Claim 20% Off</span>
        </button>

        <button
          onClick={handleDismissPill}
          className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors ml-1 focus:outline-none"
          title="Dismiss offer"
          aria-label="Dismiss offer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
