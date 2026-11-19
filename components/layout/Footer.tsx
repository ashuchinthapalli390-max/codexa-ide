"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CodeXaLogo } from "@/components/ui/CodeXaLogo";
import { siteConfig } from "@/lib/config/site";

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Workspace demo", href: "/workspace" },
      { label: "CodeXa AI", href: "/ai" },
      { label: "Model catalogue", href: "/models" },
      { label: "Integrations", href: "/integrations" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Release notes", href: "/releases" },
      { label: "Download", href: "/download" },
      { label: "Platforms", href: "/platforms" },
      { label: "Compare", href: "/compare" },
      { label: "Reviews", href: "/reviews" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "CodeXa Agency", href: siteConfig.links.agencyPortal, external: true },
      { label: "Internship portal", href: siteConfig.links.agencyApply, external: true },
      { label: "Security", href: "/security" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const wordY = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);
  const wordRotate = useTransform(scrollYProgress, [0, 1], [35, 0]);
  const wordOpacity = useTransform(scrollYProgress, [0.2, 1], [0, 1]);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-white/[0.07] bg-black text-white/60">
      <div className="mx-auto max-w-[1280px] px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <CodeXaLogo size="md" subtitle="STUDIO IDE" />
            <p className="mt-5 text-[14px] leading-relaxed text-white/50">{siteConfig.description}</p>
            <a
              href={siteConfig.links.agencyPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-[13px] font-medium text-white transition hover:border-white/35"
            >
              Join the Agency developer network <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/35">{c.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.external ? (
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[14px] transition hover:text-white">
                          {l.label} <ArrowUpRight className="h-3 w-3 opacity-50" />
                        </a>
                      ) : (
                        <Link href={l.href} className="text-[14px] transition hover:text-white">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.07] py-6 font-mono text-[11px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {siteConfig.agencyName}. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" /> Launched {siteConfig.officialLaunchDate}
          </span>
        </div>
      </div>

      {/* Oversized wordmark rising out of the floor */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden [perspective:900px]">
        <motion.p
          style={reduce ? undefined : { y: wordY, rotateX: wordRotate, opacity: wordOpacity, transformOrigin: "50% 100%" }}
          className="-mb-[0.18em] text-center text-[clamp(4.5rem,21vw,19rem)] font-semibold leading-none tracking-[-0.07em] text-transparent bg-gradient-to-b from-white/20 to-white/[0.02] bg-clip-text"
        >
          CODEXA
        </motion.p>
      </div>
    </footer>
  );
}
