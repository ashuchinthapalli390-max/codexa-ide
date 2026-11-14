import React from "react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Lock, Terminal, Cpu, Key } from "lucide-react";

export const metadata: Metadata = {
  title: "Security Architecture",
  description: "Cryptographic specifications and local-first sandbox architecture of CodeXa Studio IDE.",
};

export default function SecurityPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4">
          <Badge variant="accent" size="md">
            Security Architecture
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-black tracking-tight text-white">
            Cryptographic Rigor. <br />
            <span className="text-[#D9354D]">Hardened Workstation Runtime.</span>
          </h1>
          <p className="text-sm text-[#A5A6AE] leading-relaxed">
            Engineered by CodeXa Agency's cybersecurity engineering division.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="p-6 rounded-2xl bg-[#0D0E11] border border-[#282A31] space-y-3">
            <div className="flex items-center gap-2 text-[#D9354D] font-bold">
              <ShieldCheck className="w-4 h-4" /> SHA-256 Binary Integrity
            </div>
            <p className="text-[#A5A6AE] font-sans text-xs leading-relaxed">
              Every released installer is hashed and signed against the CodeXa Agency master public key. Checksums are published immutably on the release manifest.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D0E11] border border-[#282A31] space-y-3">
            <div className="flex items-center gap-2 text-[#D9354D] font-bold">
              <Lock className="w-4 h-4" /> Iron Session &amp; AES-256
            </div>
            <p className="text-[#A5A6AE] font-sans text-xs leading-relaxed">
              Unified authentication across CodeXa Agency Web, Mobile, and Studio IDE uses stateless AES-256 encrypted cookies with sealed cryptographic payloads.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D0E11] border border-[#282A31] space-y-3">
            <div className="flex items-center gap-2 text-[#D9354D] font-bold">
              <Key className="w-4 h-4" /> Hardware Binding
            </div>
            <p className="text-[#A5A6AE] font-sans text-xs leading-relaxed">
              CXA-DESK license tokens are salted with physical motherboard identifiers, mitigating credential sharing and unauthorized runtime duplication.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D0E11] border border-[#282A31] space-y-3">
            <div className="flex items-center gap-2 text-[#D9354D] font-bold">
              <Terminal className="w-4 h-4" /> PTY Sandbox Isolation
            </div>
            <p className="text-[#A5A6AE] font-sans text-xs leading-relaxed">
              Integrated terminal shells execute inside isolated sub-process namespaces, prohibiting unauthorized AI agent privilege escalation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

