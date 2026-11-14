"use client";

import React from "react";
import Link from "next/link";
import { CodeXaLogo } from "@/components/ui/CodeXaLogo";
import { ExternalLink, ArrowRight, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#000000] border-t border-white/5 text-white/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Callout Box (Matching NexCloud exact #1c1d21 community banner) */}
        <div className="w-full mb-14 bg-[#1C1D21] border border-white/5 rounded-lg p-5 md:px-8 md:py-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
          <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white text-base sm:text-[18px] font-orbitron font-semibold tracking-[0.9px] leading-[28px] mb-1">
                Join the CodeXa Agency Developer Network
              </h3>
              <p className="text-[14px] text-white/70 font-sans leading-[20px]">
                Get 24/7 technical support, CXA-DESK hardware key management, and insider canary builds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            <a
              href="https://codxa-agency.online"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-6 py-2.5 rounded-[4px] bg-[#22C55E] hover:bg-[#16a34a] text-black text-base font-sans font-semibold tracking-[-0.02em] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Agency Portal</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </a>
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5 font-sans">
          {/* Brand Identity Column (spans 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <CodeXaLogo size="md" subtitle="STUDIO IDE" />
            <p className="text-xs text-white/50 font-sans leading-relaxed max-w-sm">
              CodeXa Studio IDE is an autonomous, AI-driven development environment precision-engineered by CodeXa Agency for engineers who demand speed, control, and verifiable autonomy.
            </p>
            <div className="pt-2 flex flex-col space-y-1.5 text-xs font-sans">
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span>
                  Powered by <strong className="text-white">CodeXa Agency</strong>
                </span>
              </div>
              <p className="text-[11px] text-white/40">
                Single database &amp; cryptographic identity across Web, Mobile &amp; Desktop.
              </p>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-[12px] font-sans font-bold uppercase tracking-[0.1em] text-white mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-[13px] font-sans font-medium">
              <li>
                <Link href="/workspace" className="hover:text-white transition-colors">
                  Code Editor
                </Link>
              </li>
              <li>
                <Link href="/ai" className="hover:text-white transition-colors">
                  CodeXa AI Models
                </Link>
              </li>
              <li>
                <Link href="/workspace" className="hover:text-white transition-colors">
                  Live Preview Runtime
                </Link>
              </li>
              <li>
                <Link href="/models" className="hover:text-white transition-colors">
                  AI Model Catalogue
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-white transition-colors">
                  AI Provider Integrations
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Competitor Comparison
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Community Reviews
                </Link>
              </li>
              <li>
                <Link href="/#availability" className="hover:text-white transition-colors text-white font-semibold">
                  Platform Availability
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Docs */}
          <div>
            <h4 className="text-[12px] font-sans font-bold uppercase tracking-[0.1em] text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-[13px] font-sans font-medium">
              <li>
                <Link href="/docs" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/releases" className="hover:text-white transition-colors">
                  Release Notes
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/docs#shortcuts" className="hover:text-white transition-colors">
                  Keyboard Shortcuts
                </Link>
              </li>
              <li>
                <Link href="/docs#licenses" className="hover:text-white transition-colors">
                  Hardware Licensing (CXA-DESK)
                </Link>
              </li>
            </ul>
          </div>

          {/* Agency Ecosystem */}
          <div>
            <h4 className="text-[12px] font-sans font-bold uppercase tracking-[0.1em] text-white mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-[13px] font-sans font-medium">
              <li>
                <a
                  href="https://codxa-agency.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>CodeXa Agency Portal</span>
                  <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.codeaxisapply.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Internship Portal</span>
                  <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security Architecture
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
          <div>
            &copy; 2026 CodeXa Agency. All rights reserved. CodeXa Studio IDE is an official product of CodeXa Agency.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              Official Launch: 17 November 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
