"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, HelpCircle, Sparkles, ShieldCheck } from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

export type FAQCategory = "all" | "product" | "models" | "presale" | "billing" | "platforms";

export interface FAQItem {
  id: string;
  category: FAQCategory | FAQCategory[];
  number: string;
  question: string;
  answer: string;
}

export const ALL_FAQS: FAQItem[] = [
  // --- PRE-SALE & SUBSCRIPTION FAQS (18 Required Questions) ---
  {
    id: "q01-what-is-reservation",
    category: "presale",
    number: "01",
    question: "What is the CodeXa pre-beta reservation?",
    answer:
      "The pre-beta reservation lets developers register interest and lock in the 20% discount (coupon CODEXA20) before public distribution. It secures your position in early invite waves and guarantees your promotional first-month rate.",
  },
  {
    id: "q02-payment-required",
    category: "presale",
    number: "02",
    question: "Is a payment required to reserve early access?",
    answer:
      "No. Zero payment is collected today. Reserving early access only records your developer email and plan preference in our priority waitlist store. Billing begins only when you choose to activate your account upon official binary release.",
  },
  {
    id: "q03-when-available",
    category: "presale",
    number: "03",
    question: "When will CodeXa Studio IDE become available?",
    answer:
      "Pre-beta canary builds roll out to early registrants in scheduled waves. The official release targets Windows x64/ARM64, macOS Apple Silicon/Intel, and Linux AppImage/.deb distributions. You will receive an email invitation when your batch opens.",
  },
  {
    id: "q04-discount-details",
    category: "presale",
    number: "04",
    question: "What does the CODEXA20 discount include?",
    answer:
      "Coupon CODEXA20 deducts 20% from the first month of any chosen plan (Starter ₹262.40, Plus ₹621.60, Pro ₹1,372.80, Max ₹2,540.80). It activates full access to all supported AI models, AST indexers, and weighted premium token quotas.",
  },
  {
    id: "q05-renewal-discount",
    category: "presale",
    number: "05",
    question: "Does the 20% discount apply to every renewal?",
    answer:
      "The CODEXA20 promotional code applies to your initial subscription billing cycle. Subsequent monthly renewals bill at standard plan rates (Starter ₹328, Plus ₹777, Pro ₹1,716, Max ₹3,176). You can cancel or change tiers at any time before renewal.",
  },
  {
    id: "q06-change-plan",
    category: "presale",
    number: "06",
    question: "Can I change from Starter to Plus, Pro or Max?",
    answer:
      "Yes. You can upgrade or downgrade between Starter, Plus, Pro, and Max directly from your account dashboard. Upgrades take effect immediately with prorated token allowances; downgrades apply at the end of your active billing period.",
  },
  {
    id: "q07-cancel-subscription",
    category: "presale",
    number: "07",
    question: "Can I cancel my subscription?",
    answer:
      "Yes. Subscriptions can be canceled at any time with one click from your account settings. There are no lock-in contracts or cancellation penalties. You retain full access to your plan until the end of your paid billing period.",
  },
  {
    id: "q08-non-renewal",
    category: "presale",
    number: "08",
    question: "What happens if I don't renew?",
    answer:
      "If your subscription expires without renewal, your account transitions to the free local-first tier. You retain indefinite access to CodeXa on-device NEXA models, the Monaco editor, local terminal matrix, and personal BYOK API key pass-through.",
  },
  {
    id: "q09-models-on-starter",
    category: ["presale", "models"],
    number: "09",
    question: "Are all supported AI models available on Starter?",
    answer:
      "Yes! Under our Universal Model Access policy, all supported models — including OpenAI GPT-6 Astra, Claude OPUS 5.5, Gemini 3.8 Flash, and Fabel 5.1 — are unlocked on every paid plan, starting at ₹328/mo. Plans differ strictly by monthly token quotas (250k on Starter vs 750k on Plus, 2M on Pro, 5M on Max).",
  },
  {
    id: "q10-unlimited-coding-meaning",
    category: ["presale", "models"],
    number: "10",
    question: "What does unlimited CodeXa AI coding mean?",
    answer:
      "Unlimited coding refers to CodeXa Native AST caching and on-device NEXA Edge models. These run 100% locally on your machine, consume zero cloud tokens, and have no monthly caps. Cloud frontier models (GPT-6 Astra, Claude, Gemini) consume weighted units from your monthly subscription quota.",
  },
  {
    id: "q11-token-calculation",
    category: ["presale", "models"],
    number: "11",
    question: "How are premium AI usage allowances calculated?",
    answer:
      "Premium token units are weighted deterministically based on model compute. Standard models consume 1.0x units, GPT-6 Astra consumes 1.5x units, and high-frontier models consume up to 2.0x units. Input tokens and cached AST symbols receive discounted weightings.",
  },
  {
    id: "q12-usage-limit-reached",
    category: ["presale", "models"],
    number: "12",
    question: "What happens when I reach my premium usage limit?",
    answer:
      "When your monthly premium allowance is reached, we never bill surprise overage fees. You can seamlessly switch to unlimited local NEXA Edge models, purchase supplemental top-up units, or activate your personal API keys via our local OS Keychain BYOK vault.",
  },
  {
    id: "q13-refund-policy",
    category: ["presale", "billing"],
    number: "13",
    question: "Can I request a refund?",
    answer:
      "Because pre-beta reservations collect zero money today, there are no charges to refund. Once paid subscriptions commence upon launch, refunds are evaluated within 7 days of initial charge if you experience irremediable technical defects on supported hardware.",
  },
  {
    id: "q14-invoice-receipt",
    category: ["presale", "billing"],
    number: "14",
    question: "Will I receive an invoice or receipt?",
    answer:
      "Yes. Every completed transaction generates an itemized GST-compliant tax invoice in INR, downloadable directly from your account dashboard with full company PAN/GSTIN documentation for business expense reimbursement.",
  },
  {
    id: "q15-release-updates",
    category: ["presale", "platforms"],
    number: "15",
    question: "How will I receive release updates?",
    answer:
      "You will receive email notifications with download links and SHA-256 binary checksums as soon as your platform binary is verified. You can also monitor real-time build status at our /release-status portal.",
  },
  {
    id: "q16-existing-agency-account",
    category: ["presale", "product"],
    number: "16",
    question: "Can I use my existing CodeXa Agency account?",
    answer:
      "Yes. CodeXa Studio IDE shares single sign-on with the CodeXa Agency ecosystem (codxa-agency.online). You can sign in with your verified Agency credentials or Google OAuth to synchronize subscriptions and settings across desktop and mobile.",
  },
  {
    id: "q17-payment-methods",
    category: ["presale", "billing"],
    number: "17",
    question: "Which payment methods will be supported?",
    answer:
      "We support direct Indian payments via UPI (Google Pay, PhonePe, Paytm, BHIM), Indian RuPay/Visa/MasterCard debit and credit cards, Net Banking across major banks, and international cards via Stripe.",
  },
  {
    id: "q18-immediate-access",
    category: "presale",
    number: "18",
    question: "Does pre-booking guarantee immediate access?",
    answer:
      "Pre-booking guarantees your early access queue position and locks in your 20% discount. It does not provide immediate executable software downloads, as binaries undergo strict internal cryptographic audits prior to distribution.",
  },

  // --- CORE PRODUCT & TECH FAQS ---
  {
    id: "q19-offline-mode",
    category: "product",
    number: "19",
    question: "Can I use CodeXa Studio IDE completely offline with local models?",
    answer:
      "Yes. CodeXa Studio IDE features full air-gapped offline operation with native Ollama runtime detection. In offline mode, zero telemetry or source code context leaves your machine. Abstract Syntax Tree parsing and symbol resolution execute entirely on-device.",
  },
  {
    id: "q20-byok-keychain",
    category: "platforms",
    number: "20",
    question: "What is Bring-Your-Own-Key (BYOK) and how are API keys stored?",
    answer:
      "BYOK allows you to supply your own provider API keys for OpenAI, Anthropic, Google, and Grok. Keys are stored exclusively inside your operating system's native secure credential manager (Windows Credential Manager / macOS Keychain / Linux SecretService) and are never transmitted to CodeXa servers.",
  },
];

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("all");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ "q01-what-is-reservation": true });
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs =
    activeCategory === "all"
      ? ALL_FAQS
      : ALL_FAQS.filter((f) =>
          Array.isArray(f.category)
            ? f.category.includes(activeCategory)
            : f.category === activeCategory
        );

  // GSAP Entrance
  useEffect(() => {
    if (isReduced) return;

    const { gsap } = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCategory, isReduced]);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-20 sm:py-28 bg-[#000000] text-white border-t border-white/[0.06] relative select-none"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A1A4AE] font-bold block mb-2">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-orbitron tracking-tight text-white">
            Answers &amp; Verification
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-white/60 font-sans leading-relaxed max-w-xl mx-auto">
            Everything you need to know about CodeXa Studio IDE, universal model access, and the pre-beta reservation terms.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-10 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 max-w-2xl mx-auto">
          {[
            { id: "all", label: "All Questions" },
            { id: "presale", label: "Pre-Sale & Subscription" },
            { id: "models", label: "Models & Quotas" },
            { id: "product", label: "Product Core" },
            { id: "billing", label: "Billing & Taxes" },
            { id: "platforms", label: "Platforms & BYOK" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as FAQCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeCategory === cat.id
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Compact Accordion with Real CSS Grid Row Height Animation */}
        <div ref={listRef} className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#0E0F14] border-white/20 shadow-lg"
                    : "bg-[#08090C] border-white/[0.08] hover:border-white/15"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 select-none focus:outline-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-emerald-400 font-bold shrink-0">
                      {faq.number}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white tracking-tight leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-white/10" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </div>
                </button>

                {/* Smooth Animated Height Grid Expansion */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1 text-xs text-white/70 font-sans leading-relaxed border-t border-white/[0.04]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
