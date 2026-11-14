import React from "react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Architecture",
  description: "Privacy commitments and local-first data isolation policy for CodeXa Studio IDE.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4">
          <Badge variant="accent" size="md">
            Security &amp; Privacy Policy
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-black tracking-tight text-white">
            Privacy by Design: <br />
            <span className="text-[#D9354D]">Zero Code Telemetry.</span>
          </h1>
          <p className="text-sm text-[#A5A6AE] leading-relaxed">
            Effective Date: November 2026 &bull; Published by CodeXa Agency
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0D0E11] border border-[#282A31] space-y-6 text-sm text-[#A5A6AE] font-sans leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-orbitron font-bold text-white">1. Local-First Principle</h2>
            <p>
              CodeXa Studio IDE operates locally on your physical workstation. Your source code, file contents, git histories, and local secrets remain within your storage boundaries and are never uploaded to CodeXa Agency or third-party servers for training or surveillance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-orbitron font-bold text-white">2. AI Inference &amp; Context Transmission</h2>
            <p>
              When invoking cloud-backed reasoning models (such as Astra 6 or Fabel 5.1), only minimal, cryptographically sanitized symbol contexts necessary for synthesis are passed through TLS encrypted channels. When using the on-device NEXA engine, zero network traffic is emitted.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-orbitron font-bold text-white">3. Device Entitlement Verification</h2>
            <p>
              Workstation activation validates your CXA-DESK license token against the central CodeXa Agency identity database. Hardware fingerprints are hashed using SHA-256 and stored strictly for seat limit verification.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

