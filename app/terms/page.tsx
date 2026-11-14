import React from "react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service and software license agreement for CodeXa Studio IDE.",
};

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4">
          <Badge variant="neutral" size="md">
            Legal Terms
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-black tracking-tight text-white">
            Terms of <span className="text-[#D9354D]">Service.</span>
          </h1>
          <p className="text-sm text-[#A5A6AE] leading-relaxed">
            Effective Date: November 2026 &bull; CodeXa Agency
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0D0E11] border border-[#282A31] space-y-6 text-sm text-[#A5A6AE] font-sans leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-orbitron font-bold text-white">1. Software License Grant</h2>
            <p>
              CodeXa Agency grants you a non-exclusive, revocable, non-transferable license to install and execute CodeXa Studio IDE on verified devices under your assigned CXA-DESK entitlement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-orbitron font-bold text-white">2. Acceptable Use</h2>
            <p>
              You agree not to reverse engineer the binary distribution, circumvent cryptographic entitlement checks, or exploit AI synthesis endpoints beyond your authorized tier token quotas.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-orbitron font-bold text-white">3. Intellectual Property</h2>
            <p>
              All code and digital products authored by you using CodeXa Studio IDE remain your exclusive intellectual property. CodeXa Agency claims no ownership over generated code.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

