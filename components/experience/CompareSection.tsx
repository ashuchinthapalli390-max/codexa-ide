"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import { COMPARISON_CATEGORIES, PRICING_COMPARISON_CARDS } from "@/lib/content/compare";
import { Reveal, SectionHeading } from "./primitives";

const COLS = [
  { key: "codexa", label: "CodeXa Studio" },
  { key: "cursor", label: "Cursor" },
  { key: "antigravity", label: "Antigravity" },
  { key: "vscode", label: "VS Code" },
] as const;

type ColKey = (typeof COLS)[number]["key"];

function Cell({ v, highlight }: { v: string | boolean; highlight?: boolean }) {
  if (v === true)
    return (
      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${highlight ? "bg-[#22C55E]/15" : "bg-white/[0.06]"}`}>
        <Check className={`h-3.5 w-3.5 ${highlight ? "text-[#4ADE80]" : "text-white/70"}`} />
      </span>
    );
  if (v === false)
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.03]">
        <X className="h-3.5 w-3.5 text-white/25" />
      </span>
    );
  if (!v) return <Minus className="h-3.5 w-3.5 text-white/20" />;
  return <span className={`text-[13px] leading-snug ${highlight ? "text-white" : "text-white/55"}`}>{v}</span>;
}

export function CompareSection({ index = "09" }: { index?: string }) {
  const [cat, setCat] = useState(0);
  const [mobileCol, setMobileCol] = useState<ColKey>("cursor");
  const category = COMPARISON_CATEGORIES[cat];

  return (
    <section id="compare" className="relative bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index={index}
          eyebrow="Side by side"
          title={
            <>
              How CodeXa compares, <span className="text-white/40">dimension by dimension.</span>
            </>
          }
          lead="A practical comparison of architecture, AI access, workflow and privacy against the editors developers use today."
        />

        <div className="mt-12 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {COMPARISON_CATEGORIES.map((c, i) => (
            <button
              key={c.category}
              onClick={() => setCat(i)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-[13px] transition ${
                i === cat ? "text-black" : "text-white/55 hover:text-white"
              }`}
            >
              {i === cat && <motion.span layoutId="cmp-tab" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              <span className="relative">{c.category.replace(/^[A-D] • /, "")}</span>
            </button>
          ))}
        </div>

        {/* Desktop table */}
        <Reveal className="mt-6 hidden overflow-hidden rounded-2xl border border-white/[0.09] md:block">
          <div className="grid grid-cols-[1.3fr_repeat(4,1fr)] border-b border-white/[0.07] bg-[#0B0B0D]">
            <div className="p-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Dimension</div>
            {COLS.map((c) => (
              <div
                key={c.key}
                className={`p-4 text-[13px] font-semibold ${c.key === "codexa" ? "bg-[#22C55E]/[0.06] text-white" : "text-white/60"}`}
              >
                {c.label}
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {category.rows.map((r, i) => (
                <motion.div
                  key={r.dimension}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-[1.3fr_repeat(4,1fr)] border-b border-white/[0.05] last:border-0 hover:bg-white/[0.015]"
                >
                  <div className="p-4 text-[13.5px] text-white/80">{r.dimension}</div>
                  {COLS.map((c) => (
                    <div key={c.key} className={`flex items-center p-4 ${c.key === "codexa" ? "bg-[#22C55E]/[0.04]" : ""}`}>
                      <Cell v={r[c.key]} highlight={c.key === "codexa"} />
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </Reveal>

        {/* Mobile: CodeXa vs one competitor */}
        <div className="mt-6 md:hidden">
          <div className="mb-3 flex gap-1.5">
            {COLS.filter((c) => c.key !== "codexa").map((c) => (
              <button
                key={c.key}
                onClick={() => setMobileCol(c.key)}
                className={`rounded-full border px-3 py-1.5 text-[12px] ${mobileCol === c.key ? "border-white/40 text-white" : "border-white/10 text-white/50"}`}
              >
                vs {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {category.rows.map((r) => (
              <div key={r.dimension} className="rounded-xl border border-white/[0.08] bg-[#0B0B0D] p-4">
                <p className="text-[13px] font-medium text-white">{r.dimension}</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#4ADE80]">CodeXa</p>
                    <Cell v={r.codexa} highlight />
                  </div>
                  <div>
                    <p className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">
                      {COLS.find((c) => c.key === mobileCol)?.label}
                    </p>
                    <Cell v={r[mobileCol]} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing comparison */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING_COMPARISON_CARDS.map((c, i) => (
            <Reveal key={c.product} delay={i * 0.06}>
              <div
                className={`h-full rounded-2xl border p-5 ${
                  c.highlight ? "border-[#22C55E]/30 bg-gradient-to-b from-[#0F1511] to-[#0A0A0C]" : "border-white/[0.08] bg-[#0B0B0D]"
                }`}
              >
                <p className={`text-[14px] font-semibold ${c.highlight ? "text-white" : "text-white/75"}`}>{c.product}</p>
                <dl className="mt-4 grid gap-3 text-[12.5px]">
                  <div>
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/35">Entry price</dt>
                    <dd className="mt-0.5 text-white/80">{c.starterPrice}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/35">Billing</dt>
                    <dd className="mt-0.5 text-white/60">{c.billingCurrency}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/35">AI usage</dt>
                    <dd className="mt-0.5 leading-snug text-white/60">{c.aiUsageStructure}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-[11.5px] text-white/35">
          Competitor details summarised from their public pricing pages; check each vendor for current terms.
        </p>
      </div>
    </section>
  );
}
