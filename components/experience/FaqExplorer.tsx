"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { ALL_FAQS, FAQCategory } from "@/lib/content/faq";
import { Reveal, SectionHeading } from "./primitives";

const CATS: { id: FAQCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "product", label: "Product" },
  { id: "models", label: "Models" },
  { id: "presale", label: "Pre-sale" },
  { id: "billing", label: "Billing" },
  { id: "platforms", label: "Platforms" },
];

const INITIAL = 8;

export function FaqExplorer({
  index = "11",
  initialCategory = "all",
  expanded = false,
  showPageLink = true,
}: {
  index?: string;
  initialCategory?: FAQCategory;
  expanded?: boolean;
  showPageLink?: boolean;
}) {
  const [cat, setCat] = useState<FAQCategory>(initialCategory);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(ALL_FAQS[0]?.id ?? null);
  const [showAll, setShowAll] = useState(expanded);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return ALL_FAQS.filter((f) => {
      const cats = Array.isArray(f.category) ? f.category : [f.category];
      const inCat = cat === "all" || cats.includes(cat);
      const inQ = !term || f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term);
      return inCat && inQ;
    });
  }, [cat, q]);

  const visible = showAll || q ? filtered : filtered.slice(0, INITIAL);

  return (
    <section id="faq" className="relative bg-black py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            index={index}
            eyebrow="Questions"
            title={
              <>
                Answers, <span className="text-white/40">before you ask.</span>
              </>
            }
            lead={`${ALL_FAQS.length} answers on plans, models, billing and platforms. Search or filter to find yours.`}
          />
          <Reveal delay={0.1}>
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B0B0D] px-4 focus-within:border-white/30">
              <Search className="h-4 w-4 text-white/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search e.g. offline, refund, UPI"
                className="h-12 w-full bg-transparent text-[14px] text-white placeholder:text-white/30 focus:outline-none"
                aria-label="Search frequently asked questions"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {CATS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`rounded-full border px-3 py-1.5 text-[12px] transition ${
                    cat === c.id ? "border-white bg-white text-black" : "border-white/10 text-white/55 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {showPageLink && (
              <Link href="/faq" className="mt-6 inline-block text-[13px] text-white/50 underline-offset-4 hover:text-white hover:underline">
                Open the full FAQ page
              </Link>
            )}
          </Reveal>
        </div>

        <div>
          <motion.ul layout className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {visible.map((f) => {
                const isOpen = open === f.id;
                return (
                  <motion.li
                    layout
                    key={f.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`overflow-hidden rounded-xl border transition-colors ${
                      isOpen ? "border-white/20 bg-[#0E0E11]" : "border-white/[0.07] bg-[#0A0A0C] hover:border-white/15"
                    }`}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : f.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-mono text-[11px] text-white/30">{f.number}</span>
                      <span className="flex-1 text-[14.5px] font-medium text-white/90">{f.question}</span>
                      <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-white/50">
                        <Plus className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="px-5 pb-5 pl-[3.25rem] font-inter text-[14px] leading-relaxed text-white/60">{f.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
          {filtered.length === 0 && (
            <p className="rounded-xl border border-white/[0.07] p-6 text-[14px] text-white/50">No answers match “{q}”.</p>
          )}
          {!q && filtered.length > INITIAL && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-[13px] text-white/70 hover:border-white/35 hover:text-white"
            >
              {showAll ? "Show fewer" : `Show all ${filtered.length}`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
