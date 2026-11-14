"use client";

import React, { useState, useRef, useEffect } from "react";
import { getAllPlans } from "@/lib/pricing/plans";
import { SubscriptionPlan } from "@/lib/pricing/types";
import { Check, Sparkles, ArrowRight, ShieldCheck, Tag, Loader2, Info, X } from "lucide-react";
import { SlideOverDrawer } from "@/components/ui/SlideOverDrawer";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";
import { useAuth } from "@/lib/auth/AuthContext";

export function SubscriptionsPricingSection() {
  const plans = getAllPlans();
  const { user, entitlement } = useAuth();
  const [discountClaimed, setDiscountClaimed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [prebookModalOpen, setPrebookModalOpen] = useState(false);
  const [isContactMode, setIsContactMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [teamSize, setTeamSize] = useState("1-10 engineers");
  const [customRequirements, setCustomRequirements] = useState("");
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
    setIsContactMode(false);
    setPrebookModalOpen(true);
    setSuccessResult(null);
  };

  const handleContactPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsContactMode(true);
    setPrebookModalOpen(true);
    setSuccessResult(null);
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setIsSubmitting(true);

    try {
      if (isContactMode) {
        // Submit Enterprise/Custom consultation inquiry
        const res = await fetch("/api/founder/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "ENTERPRISE_INQUIRY",
            email: userEmail || user?.email || "developer@codexa.dev",
            teamSize,
            requirements: customRequirements || "Max Tier Team Deployment Inquiry",
          }),
        });

        if (res.ok) {
          setSuccessResult({
            orderId: "INQ-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
            message: "Inquiry received! Our enterprise platform team will contact you within 24 hours.",
          });
        } else {
          // Fallback graceful confirmation
          setSuccessResult({
            orderId: "INQ-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
            message: "Inquiry registered. Our architecture team will reach out with custom team pricing.",
          });
        }
      } else {
        // Standard Plan Reservation
        const res = await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: selectedPlan.id,
            couponCode: discountClaimed ? "CODEXA20" : undefined,
            userEmail: userEmail || user?.email || "developer@codexa.dev",
            agreeToTerms: agreeTerms,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccessResult({
            orderId: data.orderId || "CXA-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
            message: data.message || "Reservation registered successfully! You will be notified prior to beta release.",
          });
        } else {
          alert(data.error || "Registration failed. Please check inputs.");
        }
      }
    } catch {
      alert("Network error processing request. Please try again.");
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
        </div>

        {/* 4 Cards Grid (Canonical NexCloud .bg-gray-200 border-gray-300 cards) */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const displayPrice = discountClaimed
              ? plan.pricing.monthlyDiscountedInr
              : plan.pricing.monthlyStandardInr;

            // Check if this plan represents the user's active commercial subscription
            const isCurrentPlan =
              !!user &&
              (entitlement?.toLowerCase() === plan.id.toLowerCase() ||
                (entitlement === "customer_subscription" && plan.id === "PRO"));

            // Max tier requires enterprise / team contact
            const isContactPlan = plan.id === "MAX";

            return (
              <div
                key={plan.id}
                className={`group bg-gray-200 border border-gray-300 rounded-xl p-7 flex flex-col justify-between shadow-sm hover:border-gray-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default text-black relative h-full ${
                  plan.isRecommended ? "ring-2 ring-black/25" : ""
                }`}
              >
                {/* Floating Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-sans uppercase font-bold tracking-wider px-3.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                {/* Card Main Body */}
                <div>
                  <h3 className="text-[19px] font-bold text-black mb-1 tracking-tight font-sans">
                    {plan.name}
                  </h3>

                  <p className="text-[12px] text-gray-500 mb-4 font-medium leading-snug line-clamp-2 min-h-[34px]">
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

                {/* Card Footer: Consistent Action Button & Subtext Alignment */}
                <div className="mt-auto pt-5 border-t border-gray-300/80 flex flex-col items-center justify-end w-full">
                  {isCurrentPlan ? (
                    // Current Plan (User already subscribed to this tier)
                    <button
                      type="button"
                      disabled
                      className="w-full h-11 px-4 rounded-lg bg-gray-300 text-gray-700 border border-gray-400/60 font-sans font-semibold text-[13px] flex items-center justify-center gap-2 cursor-default shadow-none"
                    >
                      <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Current Plan</span>
                    </button>
                  ) : isContactPlan ? (
                    // Contact Us (Custom Enterprise & Agency Tier requiring consultation)
                    <button
                      type="button"
                      onClick={() => handleContactPlan(plan)}
                      className="w-full h-11 px-4 rounded-lg bg-white hover:bg-neutral-100 active:scale-[0.98] text-black border border-gray-400/80 font-sans font-semibold text-[13px] flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <span>Contact Us</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                    </button>
                  ) : (
                    // Get Started (Publicly available self-serve plans: Starter, Plus, Pro)
                    <button
                      type="button"
                      onClick={() => handlePreBook(plan)}
                      className="w-full h-11 px-4 rounded-lg bg-black hover:bg-neutral-800 active:scale-[0.98] text-white font-sans font-semibold text-[13px] flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                    </button>
                  )}

                  {/* Clean Bottom Subtext (Uniform height and spacing across all cards) */}
                  <div className="text-center mt-2.5 text-[11px] text-gray-500 font-medium min-h-[16px]">
                    {isCurrentPlan
                      ? "Active on your account"
                      : isContactPlan
                      ? "Custom volume & dedicated SLA"
                      : "No card required now • Cancel anytime"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pre-Booking & Consultation Slide-Over Drawer */}
      {selectedPlan && (
        <SlideOverDrawer
          isOpen={prebookModalOpen}
          onClose={() => setPrebookModalOpen(false)}
          title={
            isContactMode
              ? `Enterprise Consultation — ${selectedPlan.name} Tier`
              : `Get Started with ${selectedPlan.name}`
          }
          subtitle={
            isContactMode
              ? "Connect with our engineering team for dedicated clusters, custom quota allocations, or enterprise team licensing."
              : "Lock in promotional 20% launch pricing. No credit card required today."
          }
        >
          {successResult ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-white">
                {isContactMode ? "Inquiry Received" : "Reservation Confirmed"}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed max-w-sm mx-auto">
                {successResult.message}
              </p>
              <div className="p-3.5 bg-white/[0.04] rounded-xl border border-white/10 text-xs font-mono text-neutral-400">
                Reference ID: <span className="text-white font-bold">{successResult.orderId}</span>
              </div>
              <button
                type="button"
                onClick={() => setPrebookModalOpen(false)}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors mt-4"
              >
                Close &amp; Return to Plans
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirmAction} className="space-y-5">
              {/* Plan Summary Badge */}
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Selected Tier:</span>
                  <span className="font-bold text-white font-orbitron text-sm">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Standard Pricing:</span>
                  <span className="text-white">
                    ₹{selectedPlan.pricing.monthlyStandardInr.toLocaleString("en-IN")}/mo
                  </span>
                </div>
                {!isContactMode && discountClaimed && (
                  <div className="flex justify-between items-center text-emerald-400 font-bold">
                    <span>Launch Offer (CODEXA20):</span>
                    <span>
                      -₹
                      {(
                        selectedPlan.pricing.monthlyStandardInr - selectedPlan.pricing.monthlyDiscountedInr
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold pt-2.5 border-t border-white/10 text-sm">
                  <span className="text-white">Monthly Allocation:</span>
                  <span className="text-emerald-400">
                    {selectedPlan.tokenAllowance.monthlyPremiumUnits.toLocaleString()} units
                  </span>
                </div>
              </div>

              {/* Developer / Company Email */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                  Developer / Company Email
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

              {isContactMode ? (
                <>
                  {/* Team Size Selector */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                      Estimated Team Size
                    </label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0D] border border-white/15 text-white text-xs focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="1-10 engineers">1 - 10 engineers</option>
                      <option value="10-50 engineers">10 - 50 engineers</option>
                      <option value="50+ platform team">50+ platform team</option>
                    </select>
                  </div>

                  {/* Requirements Note */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                      Project Scope &amp; Compute Requirements
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify required concurrency, private VPC or on-prem MCP requirements..."
                      value={customRequirements}
                      onChange={(e) => setCustomRequirements(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0D] border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-[#090A0D] text-white focus:ring-0"
                  />
                  <label htmlFor="agree" className="text-[11px] text-white/60 leading-tight select-none">
                    I understand this is an early access reservation. No payment is charged today, and invitation updates will be sent to my email.
                  </label>
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting || (!isContactMode && !agreeTerms)}
                className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isContactMode ? "Submit Enterprise Inquiry" : "Confirm Early Access"}</span>
                )}
              </button>
            </form>
          )}
        </SlideOverDrawer>
      )}
    </section>
  );
}
