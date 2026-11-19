"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Boxes, Command, Download, Key, LifeBuoy, Search, Signal } from "lucide-react";
import { DocArticle } from "@/lib/docs/articles";
import { siteConfig } from "@/lib/config/site";
import { Reveal, SectionHeading } from "./primitives";

const SHORTCUTS = [
  { action: "Quick open file", win: "Ctrl + P", mac: "⌘ + P" },
  { action: "Command palette", win: "Ctrl + Shift + P", mac: "⌘ + ⇧ + P" },
  { action: "Open CodeXa AI chat", win: "Ctrl + L", mac: "⌘ + L" },
  { action: "Inline agent", win: "Ctrl + I", mac: "⌘ + I" },
  { action: "Toggle terminal", win: "Ctrl + `", mac: "⌃ + `" },
  { action: "Accept AI diff", win: "Ctrl + Enter", mac: "⌘ + Return" },
  { action: "Reject / re-roll diff", win: "Ctrl + Backspace", mac: "⌘ + ⌫" },
  { action: "Toggle live preview", win: "Ctrl + Shift + V", mac: "⌘ + ⇧ + V" },
  { action: "Switch AI model", win: "Ctrl + M", mac: "⌘ + M" },
];

const MCP = `{
  "mcpServers": {
    "agencyPostgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."]
    }
  }
}`;

const TOPICS = [
  { id: "installation", label: "Install", icon: Download },
  { id: "licenses", label: "Licensing", icon: Key },
  { id: "shortcuts", label: "Shortcuts", icon: Command },
  { id: "mcp", label: "MCP servers", icon: Boxes },
  { id: "articles", label: "Articles", icon: ArrowRight },
  { id: "status", label: "Status", icon: Signal },
  { id: "support", label: "Support", icon: LifeBuoy },
];

export function DocsHub({ articles }: { articles: DocArticle[] }) {
  const [q, setQ] = useState("");
  const [mac, setMac] = useState(false);
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return articles;
    return articles.filter((a) => (a.title + a.excerpt + a.category).toLowerCase().includes(t));
  }, [q, articles]);

  return (
    <div className="relative bg-black">
      {/* Topic jump bar */}
      <div className="sticky top-[var(--nav-offset)] z-20 border-y border-white/[0.07] bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:px-6 lg:px-8">
          {TOPICS.map((t) => (
            <a key={t.id} href={`#${t.id}`} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-white/60 transition hover:bg-white/[0.05] hover:text-white">
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <section id="installation" className="scroll-mt-40 py-20">
          <SectionHeading index="01" eyebrow="Quickstart" title={<>Up and running <span className="text-white/40">in three steps.</span></>} />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { t: "Download a verified build", b: "Get the installer from the download center and confirm its SHA-256 checksum matches the published manifest.", c: "certutil -hashfile CodeXaStudio-Setup.exe SHA256" },
              { t: "Sign in with CodeXa Agency", b: "Launch the IDE and sign in with your Agency account or Google to sync your plan and settings across devices." },
              { t: "Activate your device", b: "Enter your CXA-DESK licence key, or request an evaluation key, to bind the seat to this workstation." },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 0.07} className="h-full">
                <div className="h-full rounded-2xl border border-white/[0.09] bg-[#0B0B0D] p-6">
                  <span className="font-mono text-[12px] text-[#22C55E]">0{i + 1}</span>
                  <h3 className="mt-3 text-[17px] font-semibold text-white">{s.t}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/55">{s.b}</p>
                  {s.c && <p className="mt-4 overflow-x-auto rounded-lg border border-white/[0.07] bg-black/50 p-3 font-mono text-[11.5px] text-white/70">{s.c}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="licenses" className="scroll-mt-40 py-20">
          <SectionHeading index="02" eyebrow="Hardware licensing" title={<>One key per seat, <span className="text-white/40">bound to your device.</span></>} lead="Each seat gets a key with the CXA-DESK- prefix, derived from your machine identifier and Agency token. Manage seats in the Agency portal under Dashboard → Device activations." />
          <Reveal className="mt-8 inline-block rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/[0.06] px-6 py-4 font-mono text-[14px] text-[#86EFAC]">
            CXA-DESK-PREVIEW-9842-8812-701A
            <span className="ml-3 text-[11px] text-white/40">sample format</span>
          </Reveal>
        </section>

        <section id="shortcuts" className="scroll-mt-40 py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading index="03" eyebrow="Keyboard shortcuts" title={<>Keep your hands <span className="text-white/40">on the keys.</span></>} />
            <div className="inline-flex shrink-0 rounded-full border border-white/10 p-1 text-[13px]">
              {["Windows / Linux", "macOS"].map((l, i) => (
                <button key={l} onClick={() => setMac(i === 1)} className={`rounded-full px-4 py-1.5 transition ${mac === (i === 1) ? "bg-white text-black" : "text-white/60"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SHORTCUTS.map((s, i) => (
              <Reveal key={s.action} delay={(i % 3) * 0.05}>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0B0B0D] px-4 py-3.5">
                  <span className="text-[14px] text-white/75">{s.action}</span>
                  <kbd className="shrink-0 rounded-md border border-white/15 bg-black px-2 py-1 font-mono text-[11.5px] text-white">{mac ? s.mac : s.win}</kbd>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="mcp" className="scroll-mt-40 py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <SectionHeading index="04" eyebrow="Model Context Protocol" title={<>Give the agent <span className="text-white/40">real tools.</span></>} lead="Define MCP servers in .codexa/mcp.json at your project root. The agent can then query local databases, inspect logs and run sanitised commands through them." />
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0B0B0D]">
                <div className="border-b border-white/[0.07] bg-[#121217] px-4 py-2.5 font-mono text-[11px] text-white/45">.codexa/mcp.json</div>
                <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-[#98C379]">
                  <code>{MCP}</code>
                </pre>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="articles" className="scroll-mt-40 py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading index="05" eyebrow="Technical articles" title={<>Deep dives <span className="text-white/40">from the team.</span></>} />
            <label className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-[#0B0B0D] px-4 sm:w-72">
              <Search className="h-4 w-4 text-white/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" className="h-11 w-full bg-transparent text-[14px] text-white placeholder:text-white/30 focus:outline-none" />
            </label>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 0.06} className="h-full">
                <Link href={`/docs/${a.slug}`} className="group flex h-full flex-col rounded-2xl border border-white/[0.09] bg-[#0B0B0D] p-6 transition hover:-translate-y-1 hover:border-white/25">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#4ADE80]">{a.category}</p>
                  <h3 className="mt-3 text-[17px] font-semibold leading-snug text-white">{a.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-white/55">{a.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between pt-6 font-mono text-[11px] text-white/40">
                    <span>{a.readTime} · {a.date}</span>
                    <ArrowRight className="h-4 w-4 text-white/50 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                </Link>
              </Reveal>
            ))}
            {filtered.length === 0 && <p className="text-white/50">No articles match “{q}”.</p>}
          </div>
        </section>

        <section className="grid gap-4 pb-24 md:grid-cols-2">
          <div id="status" className="scroll-mt-40 rounded-2xl border border-white/[0.09] bg-[#0B0B0D] p-6">
            <Signal className="h-5 w-5 text-[#4ADE80]" />
            <h3 className="mt-4 text-[17px] font-semibold text-white">Release status</h3>
            <p className="mt-2 text-[14px] text-white/55">Live build status per platform, versions and checksums.</p>
            <Link href="/release-status" className="mt-4 inline-flex items-center gap-1.5 text-[14px] text-white hover:underline">
              View status <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div id="support" className="scroll-mt-40 rounded-2xl border border-white/[0.09] bg-[#0B0B0D] p-6">
            <LifeBuoy className="h-5 w-5 text-[#4ADE80]" />
            <h3 className="mt-4 text-[17px] font-semibold text-white">Support</h3>
            <p className="mt-2 text-[14px] text-white/55">Priority support for Plus and above, and dedicated account managers on Max, through the Agency portal.</p>
            <a href={siteConfig.links.agencyPortal} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[14px] text-white hover:underline">
              Open the Agency portal <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
