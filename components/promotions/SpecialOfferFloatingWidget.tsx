"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Clock, Copy, Loader2, Sparkles, Tag, X } from "lucide-react";

interface SpecialOfferFloatingWidgetProps {
  onClaimSuccess?: () => void;
  isHidden?: boolean; // controlled by the floating-widget collision manager
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function remaining(targetIso: string): TimeRemaining {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (!Number.isFinite(diff) || diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
  };
}

/**
 * Floating "Claim 20% off" pill + panel. Opens from the pill or from any
 * `open-codexa-offer` window event (dispatched by the navbar).
 */
export function SpecialOfferFloatingWidget({ onClaimSuccess, isHidden = false }: SpecialOfferFloatingWidgetProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<string | null>(null);
  const [left, setLeft] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    try {
      const until = localStorage.getItem("codexa_floating_offer_dismissed");
      if (until && Number(until) > Date.now()) setDismissed(true);
    } catch {
      /* storage unavailable */
    }
    if (document.cookie.includes("cxa_discount_claimed=true")) setClaimed(true);
  }, []);

  useEffect(() => {
    fetch("/api/promotions")
      .then((r) => r.json())
      .then((d) => d.campaign?.expiresAt && setExpiry(d.campaign.expiresAt))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!expiry) return;
    setLeft(remaining(expiry));
    const t = setInterval(() => setLeft(remaining(expiry)), 1000);
    return () => clearInterval(t);
  }, [expiry]);

  // The navbar "Claim offer" button opens this panel, even if the pill was dismissed.
  useEffect(() => {
    const onOpen = () => {
      setDismissed(false);
      setOpen(true);
    };
    window.addEventListener("open-codexa-offer", onOpen);
    return () => window.removeEventListener("open-codexa-offer", onOpen);
  }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("CODEXA20");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }, []);

  const claim = async () => {
    setClaiming(true);
    setError(null);
    try {
      const res = await fetch("/api/promotions/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "CODEXA20", planId: "PLUS" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not claim the offer.");
      setClaimed(true);
      window.dispatchEvent(new CustomEvent("codexa-discount-claimed"));
      onClaimSuccess?.();
      setTimeout(() => {
        setOpen(false);
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      }, 1100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setClaiming(false);
    }
  };

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    setOpen(false);
    try {
      localStorage.setItem("codexa_floating_offer_dismissed", String(Date.now() + 7 * 86_400_000));
    } catch {
      /* storage unavailable */
    }
  };

  if (isHidden || dismissed) return null;

  return (
    <div className="fixed bottom-5 right-4 z-[950] select-none sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96, rotateX: -12 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            style={{ transformPerspective: 1000, transformOrigin: "100% 100%" }}
            className="absolute bottom-14 right-0 w-[min(380px,calc(100vw-32px))] overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0B0B0D] p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
          >
            <div aria-hidden className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#22C55E]/15 blur-3xl" />
            <button onClick={() => setOpen(false)} aria-label="Close offer" className="absolute right-4 top-4 rounded-lg p-1.5 text-white/50 hover:bg-white/[0.06] hover:text-white">
              <X className="h-4 w-4" />
            </button>
            <p className="relative flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#4ADE80]">
              <Sparkles className="h-3.5 w-3.5" /> Pre-beta offer
            </p>
            <h3 className="relative mt-3 text-2xl font-semibold tracking-[-0.04em]">20% off your first month</h3>
            <p className="relative mt-2 text-[13.5px] leading-relaxed text-white/60">Works on Starter, Plus, Pro and Max. Claim it now and it applies when you pre-book.</p>

            <div className="relative mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-black/50 p-3 font-mono text-[13px]">
              <span className="flex items-center gap-2 font-semibold tracking-wider">
                <Tag className="h-4 w-4 text-[#4ADE80]" /> CODEXA20
              </span>
              <button onClick={copy} className="flex items-center gap-1.5 rounded-lg bg-white/[0.08] px-2.5 py-1 text-[11.5px] hover:bg-white/[0.14]">
                {copied ? <Check className="h-3 w-3 text-[#4ADE80]" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {left && !left.isExpired && (
              <div className="relative mt-4">
                <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                  <Clock className="h-3 w-3" /> Offer closes in
                </p>
                <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                  {(["days", "hours", "minutes", "seconds"] as const).map((k) => (
                    <div key={k} className="rounded-lg border border-white/[0.06] bg-black/40 p-2">
                      <p className="text-[15px] font-semibold tabular-nums">{String(left[k]).padStart(2, "0")}</p>
                      <p className="text-[9px] uppercase text-white/35">{k.slice(0, 3)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative mt-5">
              {claimed ? (
                <p className="flex items-center justify-center gap-2 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 py-3 text-[13.5px] font-semibold text-[#86EFAC]">
                  <Check className="h-4 w-4" /> Discount claimed — it applies when you pre-book
                </p>
              ) : (
                <button
                  onClick={claim}
                  disabled={claiming}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-[14px] font-semibold text-black hover:bg-[#E5E7EB] disabled:opacity-60"
                >
                  {claiming ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {claiming ? "Activating…" : "Claim discount"}
                </button>
              )}
              {error && <p className="mt-2 text-[12.5px] text-rose-300">{error}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex items-center gap-1 rounded-full border border-white/15 bg-black/80 p-1.5 pl-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl transition hover:border-white/30"
      >
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-[12.5px] font-semibold text-white" aria-expanded={open}>
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#22C55E]" />
          {claimed ? "20% off claimed" : "Claim 20% off"}
        </button>
        <button onClick={dismiss} aria-label="Dismiss offer" className="ml-1 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white">
          <X className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </div>
  );
}
