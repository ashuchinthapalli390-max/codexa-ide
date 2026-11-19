"use client";

import React, { useEffect, useState } from "react";
import { Reveal } from "./primitives";
import { PageHero } from "./page-kit";

export interface LegalSection {
  id: string;
  title: string;
  body: string[];
}

/** Shared layout for privacy / terms / security: 3D hero, sticky contents, revealed sections. */
export function LegalPage({
  crumb,
  eyebrow,
  title,
  lead,
  updated,
  sections,
}: {
  crumb: string;
  eyebrow: string;
  title: React.ReactNode;
  lead: string;
  updated: string;
  sections: LegalSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), {
      rootMargin: "-35% 0px -55% 0px",
    });
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  return (
    <>
      <PageHero crumb={crumb} eyebrow={eyebrow} title={title} lead={lead} />
      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <nav className="sticky top-[calc(var(--nav-offset)+32px)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Contents</p>
            <ul className="mt-4 grid gap-1 border-l border-white/[0.08]">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`-ml-px block border-l py-1.5 pl-4 text-[13px] transition ${active === s.id ? "border-[#22C55E] text-white" : "border-transparent text-white/45 hover:text-white"}`}
                  >
                    {String(i + 1).padStart(2, "0")} {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-mono text-[11px] text-white/35">Updated {updated}</p>
          </nav>
        </aside>
        <div className="grid max-w-3xl gap-4">
          {sections.map((s, i) => (
            <Reveal key={s.id}>
              <section id={s.id} className="scroll-mt-32 rounded-2xl border border-white/[0.08] bg-[#0B0B0D] p-6 sm:p-8">
                <p className="font-mono text-[11px] text-[#22C55E]">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-white">{s.title}</h2>
                {s.body.map((p, j) => (
                  <p key={j} className="mt-3 font-inter text-[15px] leading-[1.75] text-white/65">{p}</p>
                ))}
              </section>
            </Reveal>
          ))}
          <p className="mt-2 text-[13px] text-white/40 lg:hidden">Updated {updated}</p>
        </div>
      </div>
    </>
  );
}
