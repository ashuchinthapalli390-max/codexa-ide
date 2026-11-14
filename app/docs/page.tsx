import React from "react";
import type { Metadata } from "next";
import {
  Download,
  Key,
  Command,
  Boxes,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation & Setup",
  description:
    "Installation guides, keyboard shortcuts, hardware license activation, and Model Context Protocol documentation for CodeXa Studio IDE.",
};

const SHORTCUTS = [
  { action: "Quick Open File", shortcut: "Ctrl + P", mac: "⌘ + P" },
  { action: "Command Palette", shortcut: "Ctrl + Shift + P", mac: "⌘ + ⇧ + P" },
  { action: "Open CodeXa AI Chat", shortcut: "Ctrl + L", mac: "⌘ + L" },
  { action: "Inline AI Agent Synthesis", shortcut: "Ctrl + I", mac: "⌘ + I" },
  { action: "Toggle Multiplex Terminal", shortcut: "Ctrl + `", mac: "⌃ + `" },
  { action: "Accept Proposed AI Diff", shortcut: "Ctrl + Enter", mac: "⌘ + Return" },
  { action: "Reject / Re-roll Diff", shortcut: "Ctrl + Backspace", mac: "⌘ + ⌫" },
  { action: "Toggle Live Preview Split", shortcut: "Ctrl + Shift + V", mac: "⌘ + ⇧ + V" },
  { action: "Switch Active AI Model", shortcut: "Ctrl + M", mac: "⌘ + M" },
];

export default function DocsPage() {
  return (
    <div className="pt-28 pb-20 bg-[#000000]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[2px] text-[#9CA3AF] block">
            DEVELOPER DOCUMENTATION
          </span>
          <h1 className="text-4xl sm:text-6xl font-orbitron font-bold tracking-tight text-white leading-tight">
            Architecture, Setup &amp; <span>Guides.</span>
          </h1>
          <p className="text-base text-white/70 max-w-2xl font-sans leading-relaxed">
            Everything you need to install, configure hardware licensing, and integrate Model Context Protocol servers into CodeXa Studio IDE.
          </p>
        </div>

        {/* Section 1: Quickstart & Installation */}
        <section id="installation" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2.5">
              <Download className="w-5 h-5 text-white" /> Installation &amp; Quickstart
            </h2>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-4">
              <span className="text-[10px] uppercase font-bold text-white">Step 1: Download Verified Binary</span>
              <p className="text-white/70 font-sans text-sm">
                Obtain the Windows preview installer executable (.exe) from the official Download Center. Always confirm the SHA-256 checksum matches the published manifest.
              </p>
              <div className="bg-[#18181D] p-3 rounded-xl border border-white/10 text-white flex items-center justify-between">
                <span>certutil -hashfile CodeXaStudio-Setup-1.0.0.exe SHA256</span>
                <span className="text-white/50">PowerShell</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-4">
              <span className="text-[10px] uppercase font-bold text-white">Step 2: Sign In with CodeXa Agency</span>
              <p className="text-white/70 font-sans text-sm">
                Launch the IDE. The onboarding dialog requests your CodeXa Agency account credentials to authenticate your member entitlements and cryptographic device seat.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Hardware Licensing (CXA-DESK) */}
        <section id="licenses" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2.5">
              <Key className="w-5 h-5 text-white" /> Hardware Licensing (CXA-DESK)
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#121316] border border-white/10 space-y-4">
            <p className="text-sm text-white/70 font-sans leading-relaxed">
              CodeXa Studio IDE enforces cryptographic device binding. Each developer seat is allocated a unique hardware key prefix (<code className="text-white bg-black/60 px-1.5 py-0.5 rounded border border-white/10">CXA-DESK-</code>) derived from your motherboard UUID and agency token.
            </p>
            <div className="p-4 rounded-xl bg-[#18181D] border border-white/10 font-mono text-xs text-white space-y-2">
              <div className="text-[10px] text-white/50 uppercase font-bold">Sample License Key Format:</div>
              <div className="text-emerald-400 font-bold">CXA-DESK-PREVIEW-9842-8812-701A</div>
              <p className="text-[11px] text-white/50">
                Manage seats in the CodeXa Agency Portal under Dashboard &rarr; Device Activations.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Keyboard Shortcuts */}
        <section id="shortcuts" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2.5">
              <Command className="w-5 h-5 text-white" /> Keyboard Shortcuts Reference
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121316] overflow-hidden">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#18181D] text-white/50 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-6">Command / Action</th>
                  <th className="py-3.5 px-6">Windows / Linux</th>
                  <th className="py-3.5 px-6">macOS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/70">
                {SHORTCUTS.map((sc, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-6 font-bold text-white">{sc.action}</td>
                    <td className="py-3.5 px-6">
                      <kbd className="px-2 py-1 rounded bg-[#18181D] border border-white/10 text-white text-[11px]">
                        {sc.shortcut}
                      </kbd>
                    </td>
                    <td className="py-3.5 px-6">
                      <kbd className="px-2 py-1 rounded bg-[#18181D] border border-white/10 text-white text-[11px]">
                        {sc.mac}
                      </kbd>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Model Context Protocol (MCP) Integration */}
        <section id="mcp" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2.5">
              <Boxes className="w-5 h-5 text-white" /> Model Context Protocol (MCP) Setup
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#121316] border border-white/10 space-y-4 font-mono text-xs">
            <p className="text-sm text-white/70 font-sans leading-relaxed">
              Define MCP sidecars in <code className="text-white bg-black/60 px-1 py-0.5 rounded border border-white/10">.codexa/mcp.json</code> at your project root. The AI agent gains structured tool capabilities to query local databases, inspect logs, and execute sanitized commands.
            </p>
            <div className="bg-[#18181D] p-4 rounded-xl border border-white/10 text-white/80 space-y-1">
              <div className="text-white font-bold">&#123;</div>
              <div className="pl-4 text-white">"mcpServers": &#123;</div>
              <div className="pl-8 text-white">"agencyPostgres": &#123;</div>
              <div className="pl-12 text-[#98C379]">"command": "npx",</div>
              <div className="pl-12 text-[#98C379]">"args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."]</div>
              <div className="pl-8 text-white">&#125;</div>
              <div className="pl-4 text-white">&#125;</div>
              <div className="text-white font-bold">&#125;</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
