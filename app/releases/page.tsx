import React from "react";
import type { Metadata } from "next";
import { releaseManifest } from "@/lib/releases/manifest";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  Tag,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Releases & Changelog",
  description:
    "Official release notes, changelog history, and version milestones for CodeXa Studio IDE.",
};

export default function ReleasesPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4 mb-16">
          <Badge variant="accent" size="md">
            Product Changelog
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-orbitron font-black tracking-tight text-white">
            Release Notes &amp; <span className="text-[#D9354D]">Versions.</span>
          </h1>
          <p className="text-base text-[#A5A6AE] max-w-2xl font-sans leading-relaxed">
            Track incremental improvements, AST compiler enhancements, multi-model additions, and bug fixes across CodeXa Studio IDE builds.
          </p>
        </div>

        {/* Release Timeline */}
        <div className="space-y-12 relative before:absolute before:inset-0 before:left-4 sm:before:left-6 before:w-0.5 before:bg-[#282A31]">
          {releaseManifest.history.map((rel, idx) => (
            <div key={rel.version} className="relative pl-10 sm:pl-16 space-y-6">
              {/* Timeline marker */}
              <div className="absolute left-2.5 sm:left-4.5 -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-[#08090B] border-2 border-[#D9354D] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D9354D]" />
              </div>

              {/* Release Header Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0E11] border border-[#282A31] space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-orbitron font-extrabold text-white">
                        v{rel.version}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-[rgba(217,53,77,0.15)] text-[#EB465D] border border-[#D9354D]/30 text-xs font-mono font-bold uppercase">
                        {rel.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#71737D]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{rel.date}</span>
                      <span>&bull;</span>
                      <span>CodeXa Agency Verified</span>
                    </div>
                  </div>

                  <Button variant="secondary" size="sm" href="/download" leftIcon={<Download className="w-3.5 h-3.5" />}>
                    Download Build
                  </Button>
                </div>

                {/* Highlights */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D9354D]" /> Key Capabilities &amp; Features
                  </h3>
                  <ul className="space-y-2 text-xs font-mono text-[#A5A6AE]">
                    {rel.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fixes */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#A5A6AE] font-bold flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-[#71737D]" /> Engine Optimizations &amp; Bug Fixes
                  </h3>
                  <ul className="space-y-2 text-xs font-mono text-[#71737D]">
                    {rel.fixes.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-[#D9354D] font-bold">&bull;</span>
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Known Issues if any */}
                {rel.knownIssues && rel.knownIssues.length > 0 && (
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                    <span className="text-[10px] uppercase font-bold text-[#EB465D] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Staging Disclosures
                    </span>
                    <ul className="space-y-1 text-[#71737D] text-[11px]">
                      {rel.knownIssues.map((k, i) => (
                        <li key={i}>&bull; {k}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

