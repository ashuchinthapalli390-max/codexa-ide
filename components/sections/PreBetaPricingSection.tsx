"use client";

import React, { useState, useRef, useEffect } from "react";
import { SUBSCRIPTION_PLANS, getAllPlans } from "@/lib/pricing/plans";
import { PlanTier, SubscriptionPlan } from "@/lib/pricing/types";
import { Check, Sparkles, ArrowRight, ShieldCheck, Tag, Loader2, Info } from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

export function PreBetaPricingSection() {
  const plans = getAllPlans();
  const [discountApplied, setDiscountApplied] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [prebookModalOpen, setPrebookModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [successResult, setSuccessResult] = useState<any>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    if (!cardsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current!.children,
        { opacity: 0, y: 35, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: MOTION_EASINGS.smoothOut,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  const handlePreBookClick = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPrebookModalOpen(true);
  };

  const handleConfirmPrebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          couponCode: discountApplied ? "CODEXA20" : undefined,
          userEmail: userEmail || "dev@codxa-agency.online",
          agreeToTerms: agreeTerms,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessResult(data);
      } else {
        alert(data.error || "Pre-booking failed. Please check inputs.");
      }
    } catch {
      alert("Network error processing pre-booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="prebeta-pricing" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#000000] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#A1A4AE] block">
            PRE-BETA PRICING
          </span>
          <h2 className="text-4xl sm:text-5xl font-orbitron font-bold tracking-tight text-white leading-tight">
            Choose Your Plan
          </h2>
          <p className="text-[14px] font-sans font-normal text-white/70 max-w-2xl mx-auto leading-relaxed">
            Start with the tools you need. Unlock more AI models and premium usage as your projects grow.
          </p>

          {/* 20% Offer Toggle Pill */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-[#121316] border border-white/10 font-sans text-xs">
              <button
                type="button"
                onClick={() => setDiscountApplied(true)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  discountApplied
                    ? "bg-white text-black shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Pre-Beta Offer (20% Off 1st Mo)
              </button>
              <button
                type="button"
                onClick={() => setDiscountApplied(false)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  !discountApplied
                    ? "bg-white text-black shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Standard Pricing
              </button>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid in INR */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((card) => {
            const price = discountApplied
              ? card.pricing.monthlyDiscountedInr
              : card.pricing.monthlyStandardInr;

            return (
              <div
                key={card.id}
                className={`bg-[#0E0F12] border rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative group text-white cursor-default ${
                  card.isRecommended
                    ? "border-white/30 shadow-[0_12px_45px_rgba(255,255,255,0.06)] ring-1 ring-white/20"
                    : "border-white/10 hover:border-white/20 hover:bg-[#121317]"
                }`}
              >
                {card.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#050506] text-[10px] font-sans uppercase font-bold tracking-wider px-3.5 py-0.5 rounded-full shadow-md">
                    {card.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[19px] font-orbitron font-bold tracking-tight text-white">
                      {card.name}
                    </h3>
                    {discountApplied && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        20% OFF
                      </span>
                    )}
                  </div>

                  <p className="text-[12.5px] text-white/60 font-sans leading-relaxed mb-6 min-h-[38px]">
                    {card.tagline}
                  </p>

                  {/* Price Row (INR) */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold font-inter text-white tracking-tight tabular-nums">
                        ₹{price.toFixed(price % 1 === 0 ? 0 : 2)}
                      </span>
                      <span className="text-sm font-semibold text-white/50 font-sans">
                        /month
                      </span>
                    </div>

                    {discountApplied && (
                      <div className="mt-1 text-[11px] font-sans text-white/40 flex items-center gap-1.5">
                        <span className="line-through text-white/30">
                          ₹{card.pricing.monthlyStandardInr}
                        </span>
                        <span>• First month offer</span>
                      </div>
                    )}
                  </div>

                  {/* Token Allowance Badge */}
                  <div className="mb-6 p-3 rounded-xl bg-[#15161A] border border-white/5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                      MONTHLY PREMIUM TOKENS
                    </div>
                    <div className="text-base font-inter font-bold text-white tracking-tight">
                      {card.tokenAllowance.monthlyPremiumUnits.toLocaleString()} units
                    </div>
                    <div className="text-[11px] font-sans text-emerald-400 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>+ Unlimited NEXA &amp; CodeXa Core</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="border-t border-white/10 pt-5 mb-8">
                    <ul className="space-y-2.5">
                      {card.features.slice(0, 6).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start text-[12.5px] font-sans text-white/70">
                          <Check className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pre-Book Action Button */}
                <div className="mt-auto pt-4 border-t border-white/5">
                  <button
                    onClick={() => handlePreBookClick(card)}
                    className={`w-full py-2.5 px-4 rounded-xl text-[14px] font-sans font-semibold tracking-[-0.02em] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      card.isRecommended
                        ? "bg-white text-black hover:bg-neutral-200 shadow-sm"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/15"
                    }`}
                  >
                    <span>{card.prebookCtaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <p className="mt-2 text-[10px] text-center text-white/40 font-sans">
                    {card.pricing.renewalNotice}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pre-Booking Checkout Drawer / Modal */}
      {prebookModalOpen && selectedPlan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none text-white"
        >
          <div className="relative w-full max-w-[500px] bg-[#0B0C0E] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => {
                setPrebookModalOpen(false);
                setSuccessResult(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-white/50 hover:text-white bg-white/5"
            >
              ✕
            </button>

            {!successResult ? (
              <form onSubmit={handleConfirmPrebook} className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono uppercase text-white/80">
                    PRE-BETA RESERVATION
                  </span>
                  <span className="text-xs text-white/40">• Launch Nov 17, 2026</span>
                </div>

                <h3 className="text-2xl font-orbitron font-bold text-white">
                  Pre-Book CodeXa {selectedPlan.name}
                </h3>

                {/* Pricing Summary */}
                <div className="p-4 rounded-xl bg-[#121316] border border-white/10 space-y-2.5 font-sans text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Standard Monthly Price</span>
                    <span className="font-mono text-white">₹{selectedPlan.pricing.monthlyStandardInr}</span>
                  </div>

                  {discountApplied && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Pre-Beta 20% Discount [CODEXA20]</span>
                      <span className="font-mono">
                        -₹{(selectedPlan.pricing.monthlyStandardInr - selectedPlan.pricing.monthlyDiscountedInr).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/60">
                    <span>GST (18% itemized)</span>
                    <span className="font-mono text-white">
                      ₹{((selectedPlan.pricing.monthlyDiscountedInr * 0.18)).toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                    <span>Total Due at Launch</span>
                    <span className="font-mono text-base">
                      ₹{(selectedPlan.pricing.monthlyDiscountedInr * 1.18).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-sans">
                  <label className="text-white/70 block">CodeXa Agency Account Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121316] border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                  />
                  <p className="text-[11px] text-white/40">
                    Your entitlement will bind to your CodeXa Agency session &amp; CXA-DESK hardware key.
                  </p>
                </div>

                {/* Terms Agreement */}
                <label className="flex items-start gap-2.5 text-[11.5px] font-sans text-white/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-white"
                  />
                  <span>
                    I understand that the 20% pre-beta discount applies to the first month only, renewing at ₹{selectedPlan.pricing.monthlyStandardInr}/mo + GST. No charges will occur until official launch on 17 November 2026.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting || !agreeTerms}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Securing Pre-Beta Allocation...</span>
                    </>
                  ) : (
                    <span>Confirm Pre-Booking</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-orbitron font-bold text-white">
                  Pre-Booking Confirmed!
                </h4>
                <p className="text-xs font-sans text-white/70 max-w-sm mx-auto leading-relaxed">
                  {successResult.message} Your 20% discount is bound to your account.
                </p>
                <div className="p-3 bg-[#121316] rounded-xl text-left font-mono text-xs text-white/60 space-y-1">
                  <div>Reservation ID: {successResult.subscription.id}</div>
                  <div>Status: {successResult.subscription.status}</div>
                  <div>Launch Activation: 17 November 2026</div>
                </div>
                <button
                  onClick={() => {
                    setPrebookModalOpen(false);
                    setSuccessResult(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

