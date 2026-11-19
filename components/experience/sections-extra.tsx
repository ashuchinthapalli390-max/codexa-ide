"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, Bot, Bug, Check, FileCode2, ListTodo, Minus } from "lucide-react";
import { AI_MODELS } from "@/lib/ai/models";
import { AIModelDefinition } from "@/lib/ai/types";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing/plans";
import { PlanTier } from "@/lib/pricing/types";
import { Pill, Reveal, SectionHeading } from "./primitives";

/* ================================================================== */
/* AIModes — Chat / Plan / Agent / Debug with a typed-out transcript    */
/* ================================================================== */

const MODES = [
  {
    id: "chat",
    label: "Chat",
    icon: Bot,
    model: "Gemini 3.8 Flash",
    blurb: "Ask about any symbol in your repo. Answers cite the exact files and lines they came from.",
    prompt: "Where is the session token refreshed?",
    lines: [
      "Found in src/auth/session.ts → refreshToken() (line 42).",
      "It is called from middleware.ts on every request older than 10 min.",
      "Related: tokenStore.ts caches the result for 60 s.",
    ],
  },
  {
    id: "plan",
    label: "Plan",
    icon: ListTodo,
    model: "GPT-6 Astra",
    blurb: "Break a feature into ordered, reviewable steps before a single file is touched.",
    prompt: "Add rate limiting to the public API.",
    lines: [
      "1. Add limiter.ts with a token-bucket per API key",
      "2. Wire it into router.ts before handlers run",
      "3. Return 429 with Retry-After header",
      "4. Add tests for burst and steady traffic",
    ],
  },
  {
    id: "agent",
    label: "Agent",
    icon: FileCode2,
    model: "OPUS 5.5",
    blurb: "Let the agent edit files, run commands and iterate until the tests pass — every diff is verified.",
    prompt: "Implement the plan and make the tests pass.",
    lines: [
      "✎ created src/api/limiter.ts (+48)",
      "✎ edited src/api/router.ts (+6 −1)",
      "$ codexa test  →  2 failing",
      "✎ fixed Retry-After header  →  18/18 passing ✓",
      "Fabel 5.1 verification passed ✓",
    ],
  },
  {
    id: "debug",
    label: "Debug",
    icon: Bug,
    model: "Fabel 5.1",
    blurb: "Paste a stack trace. CodeXa reproduces it, finds the root cause and proposes a typed fix.",
    prompt: "TypeError: Cannot read 'id' of undefined at checkout.ts:88",
    lines: [
      "Root cause: cart.user is undefined for guest checkouts.",
      "Reproduced with test guest-checkout.spec.ts ✓",
      "Fix: guard with cart.user?.id and fall back to guestId.",
      "Type check passes · 1 file changed",
    ],
  },
];

export function AIModes({ index = "01" }: { index?: string }) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const mode = MODES[active];

  useEffect(() => {
    setShown(0);
    const t = setInterval(() => setShown((n) => (n < mode.lines.length ? n + 1 : n)), 520);
    return () => clearInterval(t);
  }, [active, mode.lines.length]);

  return (
    <section id="modes" className="relative bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index={index}
          eyebrow="Four ways to work"
          title={
            <>
              Chat, plan, delegate, debug. <span className="text-white/40">Same workspace.</span>
            </>
          }
          lead="Pick a mode to see how CodeXa responds. Each mode routes to the model that fits the job."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {MODES.map((m, i) => {
              const Icon = m.icon;
              const on = i === active;
              return (
                <button
                  key={m.id}
                  onClick={() => setActive(i)}
                  className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                    on ? "border-white/30 bg-white/[0.06]" : "border-white/[0.07] hover:border-white/20"
                  }`}
                >
                  {on && <motion.span layoutId="mode-glow" className="absolute inset-0 bg-[radial-gradient(300px_circle_at_0%_0%,rgba(34,197,94,0.15),transparent)]" />}
                  <span className="relative flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${on ? "text-[#4ADE80]" : "text-white/50"}`} />
                    <span className="text-[15px] font-semibold text-white">{m.label}</span>
                    <span className="ml-auto font-mono text-[10px] text-white/40">{m.model}</span>
                  </span>
                  <span className="relative mt-2 block text-[13px] leading-snug text-white/55">{m.blurb}</span>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[380px] overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0B0B0D]">
            <div className="flex h-10 items-center gap-2 border-b border-white/[0.07] bg-[#121217] px-4 font-mono text-[11px] text-white/45">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" /> CodeXa · {mode.label} mode · {mode.model}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4 p-5 sm:p-7"
              >
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md border border-white/10 bg-white/[0.06] px-4 py-3 text-[14px] text-white">
                  {mode.prompt}
                </div>
                <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-[#22C55E]/20 bg-[#22C55E]/[0.05] px-4 py-3 font-mono text-[12.5px] leading-relaxed text-white/80">
                  {mode.lines.slice(0, shown).map((l) => (
                    <motion.p key={l} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      {l}
                    </motion.p>
                  ))}
                  {shown < mode.lines.length && (
                    <motion.span className="inline-block h-4 w-2 bg-[#22C55E]" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* ThemeShowcase — click a palette and the editor recolours live        */
/* ================================================================== */

const THEMES = [
  { name: "Obsidian Dark", bg: "#0B0B0D", panel: "#121217", text: "#E5E7EB", kw: "#D9354D", fn: "#61AFEF", str: "#98C379", accent: "#22C55E" },
  { name: "Pure Black OLED", bg: "#000000", panel: "#050505", text: "#F5F5F5", kw: "#FF6B81", fn: "#7DD3FC", str: "#A3E635", accent: "#FFFFFF" },
  { name: "Midnight Slate", bg: "#0F172A", panel: "#1E293B", text: "#E2E8F0", kw: "#F472B6", fn: "#60A5FA", str: "#34D399", accent: "#38BDF8" },
  { name: "Tokyo Night", bg: "#1A1B26", panel: "#16161E", text: "#C0CAF5", kw: "#BB9AF7", fn: "#7AA2F7", str: "#9ECE6A", accent: "#7DCFFF" },
  { name: "Clean Light", bg: "#FAFAFA", panel: "#F0F0F0", text: "#1F2937", kw: "#B91C1C", fn: "#1D4ED8", str: "#047857", accent: "#16A34A" },
];

export function ThemeShowcase({ index = "04" }: { index?: string }) {
  const [t, setT] = useState(0);
  const th = THEMES[t];
  return (
    <section id="themes" className="relative bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading index={index} eyebrow="Theme engine" title={<>Make it yours. <span className="text-white/40">Five built-in themes.</span></>} />
        <div className="mt-10 flex flex-wrap gap-2">
          {THEMES.map((x, i) => (
            <button
              key={x.name}
              onClick={() => setT(i)}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] transition ${i === t ? "border-white/40 text-white" : "border-white/10 text-white/55 hover:text-white"}`}
            >
              <span className="h-3.5 w-3.5 rounded-full border border-white/20" style={{ background: `linear-gradient(135deg, ${x.bg} 50%, ${x.accent} 50%)` }} />
              {x.name}
            </button>
          ))}
        </div>
        <Reveal className="mt-6">
          <motion.div
            animate={{ backgroundColor: th.bg, color: th.text }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-3xl border border-white/[0.12] shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
          >
            <motion.div animate={{ backgroundColor: th.panel }} transition={{ duration: 0.5 }} className="flex h-10 items-center gap-2 px-4 font-mono text-[11px] opacity-80">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-3">theme.ts — {th.name}</span>
            </motion.div>
            <div className="p-6 font-mono text-[12.5px] leading-[1.9] sm:p-8 sm:text-[14px]">
              <p><motion.span animate={{ color: th.kw }}>export const</motion.span> theme = <motion.span animate={{ color: th.fn }}>defineTheme</motion.span>({"{"}</p>
              <p className="pl-6">name: <motion.span animate={{ color: th.str }}>&quot;{th.name}&quot;</motion.span>,</p>
              <p className="pl-6">accent: <motion.span animate={{ color: th.str }}>&quot;{th.accent}&quot;</motion.span>,</p>
              <p className="pl-6">contrast: <motion.span animate={{ color: th.fn }}>wcag</motion.span>(<motion.span animate={{ color: th.str }}>&quot;AA&quot;</motion.span>),</p>
              <p>{"});"}</p>
              <motion.div animate={{ backgroundColor: th.accent }} className="mt-5 h-1 w-24 rounded-full" />
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/* ModelTable — sortable full catalogue                                 */
/* ================================================================== */

type SortKey = "name" | "provider" | "context" | "unitWeight";

function ctxNum(c: string) {
  const n = parseFloat(c);
  return /m/i.test(c) ? n * 1e6 : /k/i.test(c) ? n * 1e3 : n;
}

export function ModelTable({ index = "02" }: { index?: string }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "unitWeight", dir: 1 });
  const rows = useMemo(() => {
    const list = AI_MODELS.filter((m) => m.enabled);
    return [...list].sort((a, b) => {
      const va = sort.key === "context" ? ctxNum(a.contextWindow) : (a[sort.key] as string | number);
      const vb = sort.key === "context" ? ctxNum(b.contextWindow) : (b[sort.key] as string | number);
      return (va > vb ? 1 : va < vb ? -1 : 0) * sort.dir;
    });
  }, [sort]);

  const Th = ({ k, children, className = "" }: { k: SortKey; children: React.ReactNode; className?: string }) => (
    <th className={`p-4 text-left ${className}`}>
      <button
        onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? ((s.dir * -1) as 1 | -1) : 1 }))}
        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45 hover:text-white"
      >
        {children}
        {sort.key === k && (sort.dir === 1 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      </button>
    </th>
  );

  return (
    <section id="catalogue" className="relative bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading index={index} eyebrow="Full catalogue" title={<>Every model, <span className="text-white/40">side by side.</span></>} lead="Tap a column to sort." />
        <Reveal className="mt-10 overflow-x-auto rounded-2xl border border-white/[0.09]">
          <table className="w-full min-w-[720px] text-[13.5px]">
            <thead className="border-b border-white/[0.07] bg-[#0B0B0D]">
              <tr>
                <Th k="name">Model</Th>
                <Th k="provider">Provider</Th>
                <Th k="context">Context</Th>
                <Th k="unitWeight">Weight</Th>
                <th className="p-4 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {rows.map((m: AIModelDefinition) => (
                  <motion.tr layout key={m.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                    <td className="p-4">
                      <p className="font-medium text-white">{m.name}</p>
                      <p className="mt-0.5 text-[12px] text-white/40">{m.capabilities[0]}</p>
                    </td>
                    <td className="p-4 text-white/60">{m.provider}</td>
                    <td className="p-4 font-mono text-white/80">{m.contextWindow}</td>
                    <td className="p-4 font-mono text-white/80">{m.type === "FREE_UNLIMITED" ? <span className="text-[#4ADE80]">Free</span> : `${m.unitWeight.toFixed(1)}×`}</td>
                    <td className="p-4">
                      <Pill tone={m.availability === "RETIRING_SOON" ? "amber" : m.type === "FREE_UNLIMITED" ? "green" : "blue"}>
                        {m.availability === "RETIRING_SOON" ? "Retiring" : m.type === "FREE_UNLIMITED" ? "Local" : "Available"}
                      </Pill>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/* PlanMatrix — plan-by-plan comparison                                 */
/* ================================================================== */

const TIERS: PlanTier[] = ["STARTER", "PLUS", "PRO", "MAX"];

function concurrency(t: PlanTier): string {
  const f = SUBSCRIPTION_PLANS[t].features.find((x) => /concurrent/i.test(x));
  const m = f?.match(/(\d+)/);
  return m ? m[1] : "—";
}

export function PlanMatrix({ index = "03" }: { index?: string }) {
  const rows: { label: string; value: (t: PlanTier) => React.ReactNode }[] = [
    { label: "Standard price / month", value: (t) => `₹${SUBSCRIPTION_PLANS[t].pricing.monthlyStandardInr.toLocaleString("en-IN")}` },
    { label: "First month with CODEXA20", value: (t) => `₹${SUBSCRIPTION_PLANS[t].pricing.monthlyDiscountedInr.toLocaleString("en-IN")}` },
    { label: "Premium units / month", value: (t) => SUBSCRIPTION_PLANS[t].tokenAllowance.monthlyPremiumUnits.toLocaleString("en-IN") },
    { label: "Concurrent premium requests", value: (t) => concurrency(t) },
    { label: "Premium models included", value: (t) => SUBSCRIPTION_PLANS[t].modelAccess.premiumModels.length },
    { label: "Unlimited NEXA & CodeXa models", value: () => <Check className="h-4 w-4 text-[#4ADE80]" /> },
    { label: "GPT 6.1 SOL", value: (t) => (SUBSCRIPTION_PLANS[t].modelAccess.premiumModels.includes("GPT 6.1 SOL") ? <Check className="h-4 w-4 text-[#4ADE80]" /> : <Minus className="h-4 w-4 text-white/20" />) },
  ];

  return (
    <section id="plan-matrix" className="relative bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading index={index} eyebrow="Plan matrix" title={<>Every detail, <span className="text-white/40">plan by plan.</span></>} />
        <Reveal className="mt-10 overflow-x-auto rounded-2xl border border-white/[0.09]">
          <table className="w-full min-w-[680px] text-[13.5px]">
            <thead className="border-b border-white/[0.07] bg-[#0B0B0D]">
              <tr>
                <th className="p-4 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">Plan</th>
                {TIERS.map((t) => (
                  <th key={t} className={`p-4 text-left text-[14px] font-semibold ${SUBSCRIPTION_PLANS[t].isRecommended ? "text-white" : "text-white/70"}`}>
                    {SUBSCRIPTION_PLANS[t].name}
                    {SUBSCRIPTION_PLANS[t].isRecommended && <span className="ml-2 rounded-full bg-white px-2 py-0.5 font-mono text-[9px] text-black">POPULAR</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <motion.tr
                  key={r.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/[0.05] last:border-0"
                >
                  <td className="p-4 text-white/60">{r.label}</td>
                  {TIERS.map((t) => (
                    <td key={t} className={`p-4 font-mono text-white ${SUBSCRIPTION_PLANS[t].isRecommended ? "bg-white/[0.025]" : ""}`}>
                      {r.value(t)}
                    </td>
                  ))}
                </motion.tr>
              ))}
              <tr>
                <td className="p-4 align-top text-white/60">Plan extras</td>
                {TIERS.map((t) => (
                  <td key={t} className="p-4 align-top">
                    <ul className="grid gap-1.5">
                      {SUBSCRIPTION_PLANS[t].features.slice(2).map((f) => (
                        <li key={f} className="text-[12px] leading-snug text-white/55">{f}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/* ProviderGrid — models grouped by provider                            */
/* ================================================================== */

export function ProviderGrid({ index = "01" }: { index?: string }) {
  const groups = useMemo(() => {
    const map = new Map<string, AIModelDefinition[]>();
    AI_MODELS.filter((m) => m.enabled).forEach((m) => map.set(m.provider, [...(map.get(m.provider) ?? []), m]));
    return Array.from(map.entries());
  }, []);
  return (
    <section id="providers" className="relative bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading index={index} eyebrow="Providers" title={<>{groups.length} providers. <span className="text-white/40">One router.</span></>} />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {groups.map(([provider, models], i) => (
            <Reveal key={provider} delay={(i % 2) * 0.06} className="h-full">
              <div className="h-full rounded-2xl border border-white/[0.09] bg-[#0B0B0D] p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-white">{provider}</h3>
                  <span className="font-mono text-[11px] text-white/40">{models.length} {models.length === 1 ? "model" : "models"}</span>
                </div>
                <ul className="mt-5 grid gap-2">
                  {models.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] text-white">{m.name}</p>
                        <p className="truncate text-[12px] text-white/40">{m.capabilities.join(" · ")}</p>
                      </div>
                      <div className="shrink-0 text-right font-mono text-[11px]">
                        <p className="text-white/70">{m.contextWindow}</p>
                        <p className={m.type === "FREE_UNLIMITED" ? "text-[#4ADE80]" : "text-white/40"}>
                          {m.type === "FREE_UNLIMITED" ? "free" : `${m.unitWeight.toFixed(1)}×`}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-white/45">
          Want the details per model? See the <Link href="/models" className="text-white underline-offset-4 hover:underline">model catalogue</Link>.
        </p>
      </div>
    </section>
  );
}

/* ================================================================== */
/* StepsScroll — numbered steps whose connector fills as you scroll     */
/* ================================================================== */

export function StepsList({
  index,
  eyebrow,
  title,
  steps,
  code,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  steps: { title: string; body: string }[];
  code?: { label: string; content: string };
}) {
  return (
    <section className="relative bg-black py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading index={index} eyebrow={eyebrow} title={title} />
          <ol className="mt-10 grid gap-3">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.06}>
                <div className="flex gap-4 rounded-2xl border border-white/[0.08] bg-[#0B0B0D] p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/15 font-mono text-[12px] text-[#4ADE80]">{i + 1}</span>
                  <div>
                    <p className="text-[15px] font-semibold text-white">{s.title}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-white/55">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        {code && (
          <Reveal className="lg:sticky lg:top-[calc(var(--nav-offset)+32px)] lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0B0B0D]">
              <div className="border-b border-white/[0.07] bg-[#121217] px-4 py-2.5 font-mono text-[11px] text-white/45">{code.label}</div>
              <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-white/80">
                <code>{code.content}</code>
              </pre>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
