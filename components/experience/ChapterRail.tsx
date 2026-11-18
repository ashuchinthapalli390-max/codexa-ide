"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { HOME_CHAPTERS } from "@/lib/content/home";

/** Top scroll-progress hairline plus a right-edge chapter navigator (desktop). */
export function ChapterRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const [active, setActive] = useState(HOME_CHAPTERS[0].id);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.45;
      let current = HOME_CHAPTERS[0].id;
      for (const c of HOME_CHAPTERS) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= mid) current = c.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
  };

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[1100] h-[2px] origin-left bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-white"
      />
      <nav
        aria-label="Page chapters"
        className="fixed right-5 top-1/2 z-[900] hidden -translate-y-1/2 flex-col gap-3 xl:flex"
      >
        {HOME_CHAPTERS.map((c) => {
          const on = c.id === active;
          return (
            <button key={c.id} onClick={() => go(c.id)} className="group flex items-center justify-end gap-3" aria-label={c.label}>
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${
                  on ? "text-white opacity-100" : "translate-x-1 text-white/40 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                {c.label}
              </span>
              <span
                className={`h-[2px] rounded-full transition-all duration-300 ${
                  on ? "w-6 bg-[#22C55E]" : "w-3 bg-white/25 group-hover:w-5 group-hover:bg-white/60"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
}
