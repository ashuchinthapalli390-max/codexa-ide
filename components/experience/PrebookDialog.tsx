"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Tag, X } from "lucide-react";
import { SubscriptionPlan } from "@/lib/pricing/types";
import { useAuth } from "@/lib/auth/AuthContext";

/** Reads the promo cookie set by the special-offer flow and listens for new claims. */
export function useDiscountClaimed(): boolean {
  const [claimed, setClaimed] = useState(false);
  useEffect(() => {
    if (/(?:^|; )cxa_discount_claimed=true/.test(document.cookie)) setClaimed(true);
    const on = () => setClaimed(true);
    window.addEventListener("codexa-discount-claimed", on);
    return () => window.removeEventListener("codexa-discount-claimed", on);
  }, []);
  return claimed;
}

export type PrebookMode = "prebook" | "contact";

/**
 * Pre-book (Starter / Plus / Pro) or team inquiry (Max).
 * Same endpoints and payloads as the original pricing section.
 */
export function PrebookDialog({
  plan,
  mode,
  onClose,
}: {
  plan: SubscriptionPlan | null;
  mode: PrebookMode;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const discountClaimed = useDiscountClaimed();
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState("1-10 engineers");
  const [requirements, setRequirements] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; message: string } | null>(null);

  useEffect(() => {
    if (plan) {
      setEmail(user?.email || "");
      setError(null);
      setDone(null);
      setAgree(false);
    }
  }, [plan, user?.email]);

  useEffect(() => {
    if (!plan) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [plan, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "contact") {
        const res = await fetch("/api/founder/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "ENTERPRISE_INQUIRY",
            email,
            teamSize,
            requirements: requirements || `${plan.name} tier team deployment inquiry`,
          }),
        });
        if (!res.ok) throw new Error("Could not send your inquiry. Please try again.");
        setDone({ id: "", message: "Inquiry received. The CodeXa platform team will contact you within 24 hours." });
      } else {
        const res = await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: plan.id,
            couponCode: discountClaimed ? "CODEXA20" : undefined,
            userEmail: email,
            agreeToTerms: agree,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Reservation failed. Please check your details.");
        setDone({
          id: data.orderId || "",
          message: data.message || "Reservation registered. You will be notified before your beta wave opens.",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {plan && (
        <motion.div
          className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="prebook-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, rotateX: -18, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, rotateX: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            style={{ transformPerspective: 1200 }}
            className="relative max-h-[92svh] w-full overflow-y-auto rounded-t-3xl border border-white/[0.12] bg-[#0B0B0D] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.8)] sm:max-w-lg sm:rounded-3xl sm:p-8"
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-lg p-2 text-white/50 hover:bg-white/[0.06] hover:text-white">
              <X className="h-4 w-4" />
            </button>

            {done ? (
              <div className="py-6 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]/15">
                  <CheckCircle2 className="h-8 w-8 text-[#4ADE80]" />
                </motion.div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">
                  {mode === "contact" ? "Inquiry sent" : `${plan.name} reserved`}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/60">{done.message}</p>
                {done.id && <p className="mt-4 font-mono text-[12px] text-white/45">Reference {done.id}</p>}
                <button onClick={onClose} className="mt-7 h-11 w-full rounded-lg bg-white text-[14px] font-semibold text-black hover:bg-[#E5E7EB]">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#4ADE80]">
                  {mode === "contact" ? "Team & agency inquiry" : "Pre-book · no payment today"}
                </p>
                <h3 id="prebook-title" className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                  {mode === "contact" ? `Talk to us about ${plan.name}` : `Reserve ${plan.name}`}
                </h3>

                {mode === "prebook" && (
                  <div className="mt-5 flex items-baseline justify-between rounded-xl border border-white/[0.08] bg-black/40 p-4">
                    <div>
                      <p className="text-[12px] text-white/45">First month</p>
                      <p className="text-2xl font-semibold tracking-[-0.04em] text-white">
                        ₹{(discountClaimed ? plan.pricing.monthlyDiscountedInr : plan.pricing.monthlyStandardInr).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="text-right text-[12px] text-white/45">
                      then ₹{plan.pricing.monthlyStandardInr.toLocaleString("en-IN")}/mo
                      <br />
                      {plan.tokenAllowance.monthlyPremiumUnits.toLocaleString("en-IN")} units
                    </p>
                  </div>
                )}
                {mode === "prebook" && (
                  <p className={`mt-3 flex items-center gap-2 text-[12px] ${discountClaimed ? "text-[#4ADE80]" : "text-white/45"}`}>
                    <Tag className="h-3.5 w-3.5" />
                    {discountClaimed
                      ? `CODEXA20 applied: ${plan.pricing.discountPercent}% off your first month`
                      : "Claim the CODEXA20 offer from the top bar to lock in 20% off."}
                  </p>
                )}

                <label className="mt-6 block">
                  <span className="text-[13px] text-white/55">Email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/50 px-3.5 text-[14px] text-white placeholder:text-white/25 focus:border-white/35 focus:outline-none"
                  />
                </label>

                {mode === "contact" && (
                  <>
                    <label className="mt-4 block">
                      <span className="text-[13px] text-white/55">Team size</span>
                      <select
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/50 px-3 text-[14px] text-white focus:border-white/35 focus:outline-none"
                      >
                        {["1-10 engineers", "11-50 engineers", "51-200 engineers", "200+ engineers"].map((o) => (
                          <option key={o} value={o} className="bg-black">
                            {o}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="mt-4 block">
                      <span className="text-[13px] text-white/55">What do you need? (optional)</span>
                      <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        rows={3}
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 p-3 text-[14px] text-white focus:border-white/35 focus:outline-none"
                      />
                    </label>
                  </>
                )}

                {mode === "prebook" && (
                  <label className="mt-5 flex items-start gap-3 text-[13px] leading-snug text-white/60">
                    <input type="checkbox" required checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#22C55E]" />
                    <span>
                      I agree to the{" "}
                      <a href="/terms" target="_blank" className="text-white underline underline-offset-2">
                        Terms
                      </a>{" "}
                      and understand no payment is collected until launch. {plan.pricing.taxNotice}
                    </span>
                  </label>
                )}

                {error && <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-[13px] text-rose-200">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white text-[15px] font-semibold text-black transition hover:bg-[#E5E7EB] disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === "contact" ? "Send inquiry" : "Reserve my spot"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
