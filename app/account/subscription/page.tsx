"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, ShieldCheck, Tag, Check, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { getAllPlans } from "@/lib/pricing/plans";
import { useAuth } from "@/lib/auth/AuthContext";
import { isLeadershipRole, getRoleBadgeLabel } from "@/lib/auth/roles";

export default function AccountSubscriptionPage() {
  const plans = getAllPlans();
  const { role, entitlement } = useAuth();
  const isLeadership = isLeadershipRole(role);
  const [discountClaimed, setDiscountClaimed] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )cxa_discount_claimed=([^;]*)/);
    if (match && match[1] === "true") {
      setDiscountClaimed(true);
    }
  }, []);

  return (
    <div className="pt-28 pb-24 bg-[#000000] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account Overview</span>
          </Link>

          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A4AE] font-bold block mb-1">
            BILLING &amp; MEMBERSHIP
          </span>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-white">
            Subscription &amp; Pre-Beta Plans
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-sans mt-2 max-w-xl">
            Review your pre-beta reservation status, canonical INR pricing tiers, and promotional discount entitlements.
          </p>
        </div>

        {/* Current Active Plan Status Banner */}
        {isLeadership ? (
          <div className="p-6 rounded-2xl bg-[#0C1412] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold">LEADERSHIP ACCESS:</span>
                <span className="text-sm font-bold font-orbitron text-white">CODEXA AGENCY LEADERSHIP</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  POLICY ACTIVE
                </span>
              </div>
              <p className="text-xs text-white/60">
                Your CodeXa Agency access is managed separately under agency leadership governance. Commercial subscription purchase is not required.
              </p>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold font-orbitron text-emerald-400">
                {getRoleBadgeLabel(role)}
              </div>
              <span className="text-[10px] font-mono text-white/50">
                Assigned Leadership Policy
              </span>
            </div>
          </div>
        ) : entitlement === "no_entitlement" || entitlement === "free" ? (
          <div className="p-6 rounded-2xl bg-[#111218] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-white/40">CURRENT SELECTION:</span>
                <span className="text-sm font-bold font-orbitron text-white">NO ACTIVE SUBSCRIPTION</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/60 font-bold">
                  PRE-BETA RESERVATION OPEN
                </span>
              </div>
              <p className="text-xs text-white/60">
                Select a tier below to reserve your pre-beta access and secure launch pricing.
              </p>
            </div>

            <div className="text-right">
              <Link
                href="/pricing"
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors inline-block"
              >
                Choose a Plan
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#111218] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-white/40">CURRENT SELECTION:</span>
                <span className="text-sm font-bold font-orbitron text-white">
                  {entitlement.toUpperCase()} TIER (PRE-BETA)
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  RESERVED
                </span>
              </div>
              <p className="text-xs text-white/60">
                Frontier model access enabled • 18% GST itemized at checkout
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold font-sans text-white">
                {discountClaimed ? "Discount Applied" : "Pre-Beta Tier"}
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                Reservation Active
              </span>
            </div>
          </div>
        )}

        {/* Available Tiers Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-orbitron font-bold text-white">
              Available Subscription Tiers
            </h2>
            {isLeadership && (
              <span className="text-xs font-mono text-emerald-400">
                *Leadership accounts are exempted from plan purchases
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => {
              const price = discountClaimed
                ? plan.pricing.monthlyDiscountedInr
                : plan.pricing.monthlyStandardInr;

              return (
                <div
                  key={plan.id}
                  className="p-6 rounded-2xl bg-[#0E0F14] border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold font-orbitron text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-white/50 mb-4 line-clamp-2">{plan.tagline}</p>

                    <div className="mb-4">
                      <span className="text-2xl font-bold text-white">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-white/40 font-mono"> / mo</span>
                    </div>

                    <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-4 text-[10.5px] font-mono space-y-1">
                      <div className="text-white font-bold">
                        {plan.tokenAllowance.monthlyPremiumUnits.toLocaleString()} units
                      </div>
                      <div className="text-emerald-400">All Models Accessible</div>
                    </div>
                  </div>

                  {isLeadership ? (
                    <div className="w-full py-2.5 rounded-lg bg-white/5 text-white/40 text-xs font-mono font-semibold text-center border border-white/5">
                      Leadership Exempt
                    </div>
                  ) : (
                    <Link
                      href="/pricing"
                      className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>{entitlement === plan.id.toLowerCase() ? "Current Reservation" : "Select Tier"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
