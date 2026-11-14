"use client";

import React, { useState, useRef, useEffect } from "react";
import { getAllPlans } from "@/lib/pricing/plans";
import { SubscriptionPlan } from "@/lib/pricing/types";
import { Check, Sparkles, ArrowRight, ShieldCheck, Tag, Loader2, Info, X, ShieldAlert } from "lucide-react";
import { SlideOverDrawer } from "@/components/ui/SlideOverDrawer";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";
import { useAuth } from "@/lib/auth/AuthContext";
import { isLeadershipRole } from "@/lib/auth/roles";

export function SubscriptionsPricingSection({
  initialIsLeadership = false,
}: {
  initialIsLeadership?: boolean;
} = {}) {
  const plans = getAllPlans();
  const { role } = useAuth();
  const isLeadership = initialIsLeadership || isLeadershipRole(role);
  const [discountClaimed, setDiscountClaimed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [prebookModalOpen, setPrebookModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [successResult, setSuccessResult] = useState<{ orderId?: string; message?: string } | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  // Check discount claimed cookie & listen for claim events
  useEffect(() => {
    const checkClaimStatus = () => {
      const match = document.cookie.match(/(?:^|; )cxa_discount_claimed=([^;]*)/);
      if (match && match[1] === "true") {
        setDiscountClaimed(true);
      }
    };

    checkClaimStatus();

    const handleClaimEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ code?: string; discountPercent?: number }>;
      setDiscountClaimed(true);
    };

    window.addEventListener("codexa-discount-claimed", handleClaimEvent);
    return () => {
      window.removeEventListener("codexa-discount-claimed", handleClaimEvent);
    };
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    if (isReduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.1,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  const handlePreBook = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPrebookModalOpen(true);
    setSuccessResult(null);
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
          couponCode: discountClaimed ? "CODEXA20" : undefined,
          userEmail: userEmail || "developer@codexa.dev",
          agreeToTerms: agreeTerms,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessResult({
          orderId: data.orderId || "CXA-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
          message: data.message || "Pre-booking registered successfully! You will be notified prior to beta launch.",
        });
      } else {
        alert(data.error || "Pre-booking registration failed.");
      }
    } catch {
      alert("Network error processing pre-booking request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-300 text-black select-none relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header matching exact NexCloud typography reference */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 block font-sans">
            SUBSCRIPTIONS
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-orbitron">
            Choose Your Plan.
          </h2>
          <p className="text-[13.5px] text-gray-600 max-w-2xl mx-auto leading-relaxed mt-3 font-medium">
            Find the right CodeXa experience for your development workflow, from essential coding tools to advanced multi-model AI assistance.
          </p>

          {/* Claimed Offer Banner */}
          {discountClaimed ? (
            <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full bg-black/10 border border-black/15 text-[12px] font-mono text-black font-semibold animate-in fade-in zoom-in-95 duration-200">
              <Tag className="w-3.5 h-3.5 text-black" />
              <span>CODEXA20 APPLIED: 20% DISCOUNT ACTIVE</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-gray-200/80 border border-gray-400/40 text-[11px] text-gray-600 font-medium">
              <span>Standard pre-beta pricing shown. Claim the floating offer to apply 20% off.</span>
            </div>
          )}

          {/* Agency Leadership Notice */}
          {isLeadership && (
            <div className="mt-6 max-w-2xl mx-auto p-4 rounded-xl bg-emerald-900/10 border border-emerald-600/30 text-emerald-950 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2.5 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Agency Leadership:</strong> Your CodeXa Agency access is managed separately. Commercial subscription purchase is not required.
                </span>
              </div>
              <a
                href="/account"
                className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-sans font-bold hover:bg-emerald-800 transition-colors shrink-0 ml-3"
              >
                Account
              </a>
            </div>
          )}
        </div>

        {/* 4 Cards Grid (Canonical NexCloud .bg-gray-200 border-gray-300 cards) */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const displayPrice = discountClaimed
              ? plan.pricing.monthlyDiscountedInr
              : plan.pricing.monthlyStandardInr;

            return (
              <div
                key={plan.id}
                className={`group bg-gray-200 border border-gray-300 rounded-xl p-7 flex flex-col justify-between shadow-sm hover:border-gray-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default text-black relative ${
                  plan.isRecommended ? "ring-2 ring-black/25" : ""
                }`}
              >
                {/* Floating Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-sans uppercase font-bold tracking-wider px-3.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-[19px] font-bold text-black mb-1 tracking-tight font-sans">
                    {plan.name}
                  </h3>

                  <p className="text-[12px] text-gray-500 mb-4 font-medium leading-snug line-clamp-2">
                    {plan.tagline}
                  </p>

                  {/* Pricing block */}
                  <div className="mb-6 pb-5 border-b border-gray-300/80">
                    <div className="text-[11px] text-gray-500 font-medium mb-1">
                      {discountClaimed ? "Discounted price" : "Starting at"}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[2.35rem] font-bold text-black tracking-tight leading-none font-sans">
                        ₹{displayPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-gray-500 font-bold">/month</span>
                    </div>

                    {discountClaimed && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[12px] text-gray-500 line-through">
                          ₹{plan.pricing.monthlyStandardInr.toLocaleString("en-IN")}/mo
                        </span>
                        <span className="text-[10px] uppercase font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-700/10 text-emerald-800">
                          Save 20%
                        </span>
                      </div>
                    )}

                    <div className="text-[10.5px] text-gray-500 mt-2">
                      {plan.pricing.taxNotice}
                    </div>
                  </div>

                  {/* Token & Model Allowance Highlights */}
                  <div className="mb-5 bg-white/40 border border-gray-300/60 rounded-lg p-3">
                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                      MONTHLY TOKEN QUOTA
                    </div>
                    <div className="text-[12.5px] font-bold text-black">
                      {plan.tokenAllowance.monthlyPremiumUnits.toLocaleString()} units
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                      {plan.modelAccess.notes}
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="mb-6">
                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                      INCLUDED CAPABILITIES
                    </div>
                    <ul className="flex flex-col gap-2.5 text-[12px] text-gray-700">
                      {plan.features.slice(0, 5).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-3 border-t border-gray-300/70">
                  {isLeadership ? (
                    <div className="w-full py-3 px-4 rounded-lg bg-emerald-800/10 border border-emerald-800/20 text-emerald-900 text-[12px] font-mono font-bold text-center">
                      Leadership Exempt
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePreBook(plan)}
                      className="w-full py-3 px-4 rounded-lg bg-black hover:bg-neutral-800 active:scale-[0.98] text-white text-[12.5px] font-sans font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <span>Pre-Book Interest</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  )}
                  <div className="text-center mt-2 text-[10px] text-gray-500">
                    {isLeadership ? "Managed via CodeXa Agency governance" : "No card required now • Cancel anytime"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pre-Booking Early Access Slide-Over Drawer */}
      {selectedPlan && (
        <SlideOverDrawer
          isOpen={prebookModalOpen}
          onClose={() => setPrebookModalOpen(false)}
          title={`Reserve ${selectedPlan.name} Tier`}
          subtitle="Join the pre-beta waitlist and lock in promotional rate. No payment charged today."
        >
          {successResult ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-white">Reservation Confirmed</h3>
              <p className="text-xs text-white/70 leading-relaxed max-w-sm mx-auto">{successResult.message}</p>
              <div className="p-3.5 bg-white/[0.04] rounded-xl border border-white/10 text-xs font-mono text-neutral-400">
                Reservation Reference: <span className="text-white font-bold">{successResult.orderId}</span>
              </div>
              <button
                onClick={() => setPrebookModalOpen(false)}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors mt-4"
              >
                Close &amp; Return to Plans
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirmPrebook} className="space-y-5">
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Selected Tier:</span>
                  <span className="font-bold text-white font-orbitron text-sm">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Monthly Standard:</span>
                  <span className="text-white">₹{selectedPlan.pricing.monthlyStandardInr.toLocaleString("en-IN")}</span>
                </div>
                {discountClaimed && (
                  <div className="flex justify-between items-center text-emerald-400 font-bold">
                    <span>Pre-Beta Discount (CODEXA20):</span>
                    <span>-₹{(selectedPlan.pricing.monthlyStandardInr - selectedPlan.pricing.monthlyDiscountedInr).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold pt-2.5 border-t border-white/10 text-sm">
                  <span className="text-white">First Month Total:</span>
                  <span className="text-emerald-400">
                    ₹{(discountClaimed ? selectedPlan.pricing.monthlyDiscountedInr : selectedPlan.pricing.monthlyStandardInr).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                  Your Developer Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="developer@company.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0D] border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-[#090A0D] text-white focus:ring-0"
                />
                <label htmlFor="agree" className="text-[11px] text-white/60 leading-tight select-none">
                  I understand this is a pre-beta early access reservation. No payment is charged today, and invitation updates will be sent to my email.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !agreeTerms}
                className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Reserving Early Access...</span>
                  </>
                ) : (
                  <span>Reserve Early Access</span>
                )}
              </button>
            </form>
          )}
        </SlideOverDrawer>
      )}
    </section>
  );
}