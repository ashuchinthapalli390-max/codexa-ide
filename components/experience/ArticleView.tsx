"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, Copy } from "lucide-react";
import { DocArticle } from "@/lib/docs/articles";
import { EASE_EDITORIAL, Reveal } from "./primitives";

export function ArticleView({ article, related }: { article: DocArticle; related: DocArticle[] }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const [active, setActive] = useState(article.tableOfContents[0]?.id);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const els = article.sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [article]);

  const copy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(id);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="relative bg-black pb-24">
      <motion.div style={{ scaleX: progress }} className="fixed left-0 right-0 top-[var(--nav-offset)] z-[999] h-[2px] origin-left bg-[#22C55E]" />

      <header className="relative overflow-hidden border-b border-white/[0.07] pb-14 pt-12">
        <div aria-hidden className="absolute inset-0 bg-subtle-grid opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <Link href="/docs#articles" className="inline-flex items-center gap-2 font-mono text-[12px] text-white/45 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> All articles
          </Link>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_EDITORIAL }}>
            <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[11px] text-white/45">
              <span className="rounded-full bg-[#22C55E]/10 px-2.5 py-1 uppercase tracking-[0.14em] text-[#4ADE80]">{article.category}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.readTime}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {article.date}</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-[clamp(2rem,5vw,3.8rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-white">{article.title}</h1>
            <p className="mt-5 max-w-3xl font-inter text-[16px] leading-relaxed text-white/60 sm:text-[18px]">{article.excerpt}</p>
            <p className="mt-6 text-[13px] text-white/45">
              <span className="text-white">{article.author.name}</span> · {article.author.role}
            </p>
          </motion.div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 pt-14 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <nav className="sticky top-[calc(var(--nav-offset)+32px)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">On this page</p>
            <ul className="mt-4 grid gap-1 border-l border-white/[0.08]">
              {article.tableOfContents.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className={`-ml-px block border-l py-1.5 pl-4 text-[13px] transition ${active === t.id ? "border-[#22C55E] text-white" : "border-transparent text-white/45 hover:text-white"}`}
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl">
          {article.sections.map((s) => (
            <Reveal key={s.id}>
              <section id={s.id} className="scroll-mt-32 pb-12">
                <h2 className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold tracking-[-0.035em] text-white">{s.heading}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="mt-4 font-inter text-[15.5px] leading-[1.75] text-white/70">{p}</p>
                ))}
                {s.codeBlock && (
                  <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0B0B0D]">
                    <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#121217] px-4 py-2 font-mono text-[11px] text-white/45">
                      {s.codeBlock.language}
                      <button onClick={() => copy(s.id, s.codeBlock!.code)} className="flex items-center gap-1.5 hover:text-white">
                        {copied === s.id ? <Check className="h-3.5 w-3.5 text-[#4ADE80]" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied === s.id ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-white/85">
                      <code>{s.codeBlock.code}</code>
                    </pre>
                  </div>
                )}
              </section>
            </Reveal>
          ))}

          {related.length > 0 && (
            <div className="mt-8 border-t border-white/[0.07] pt-10">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40">Keep reading</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/docs/${r.slug}`} className="group rounded-2xl border border-white/[0.09] bg-[#0B0B0D] p-5 transition hover:-translate-y-1 hover:border-white/25">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">{r.category}</p>
                    <p className="mt-2 text-[15px] font-semibold leading-snug text-white">{r.title}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-white/70 group-hover:text-white">
                      Read <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
