"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ChevronDown,
  Terminal,
  Play,
  Check,
  Split,
  FileCode,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import {
  OpenAILogo,
  ClaudeLogo,
  GrokLogo,
  GeminiLogo,
  CodeXaNativeLogo,
} from "@/components/icons/ProviderLogos";

export function UnifiedWorkspacePreview() {
  const [selectedModel, setSelectedModel] = useState("GPT-6 Astra (OpenAI)");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const modelOptions = [
    { name: "GPT-6 Astra (OpenAI)", provider: "OpenAI", logo: <OpenAILogo className="w-3.5 h-3.5 text-white" /> },
    { name: "Claude 3.7 Sonnet (Anthropic)", provider: "Anthropic", logo: <ClaudeLogo className="w-3.5 h-3.5 text-[#FAF7F2]" /> },
    { name: "Gemini 2.0 Flash (Google)", provider: "Google", logo: <GeminiLogo className="w-3.5 h-3.5 text-cyan-400" /> },
    { name: "Grok 3 (xAI)", provider: "xAI", logo: <GrokLogo className="w-3.5 h-3.5 text-white" /> },
    { name: "NEXA-7B Fast (Local Offline)", provider: "CodeXa Native", logo: <CodeXaNativeLogo size={14} className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#090A0D] border border-white/15 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
      {/* IDE Window Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D0E12] border-b border-white/10 select-none">
        {/* macOS Style Window Controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          <span className="text-xs font-mono text-neutral-400 ml-3">
            CodeXa Studio IDE — workspace: <code>agency-core</code>
          </span>
        </div>

        {/* Universal Model Selector Dropdown in Window Header */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 border border-white/15 text-xs text-white font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{selectedModel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-[#12141A] border border-white/20 shadow-2xl p-1.5 z-50 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-2 py-1">
                Universal Model Switcher
              </div>
              {modelOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => {
                    setSelectedModel(opt.name);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedModel === opt.name
                      ? "bg-white/10 text-white font-semibold"
                      : "text-neutral-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {opt.logo}
                    <span>{opt.name}</span>
                  </div>
                  {selectedModel === opt.name && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor & AI Panel Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[340px]">
        {/* Left: Code Editor Pane */}
        <div className="lg:col-span-7 p-4 sm:p-5 font-mono text-xs leading-relaxed border-b lg:border-b-0 lg:border-r border-white/10 bg-[#090A0D]">
          {/* File Tab Strip */}
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/5 text-[11px] text-neutral-400">
            <span className="px-2 py-1 rounded bg-white/10 text-white flex items-center gap-1.5 border border-white/10">
              <FileCode className="w-3 h-3 text-[#E11D48]" />
              router.rs
            </span>
            <span className="px-2 py-1 rounded hover:bg-white/5 transition-colors cursor-pointer">
              planner.ts
            </span>
            <span className="px-2 py-1 rounded hover:bg-white/5 transition-colors cursor-pointer">
              ast_cache.rs
            </span>
          </div>

          {/* Syntax Highlighted Code Lines */}
          <div className="space-y-1 text-neutral-300">
            <div className="text-neutral-500">// CodeXa Multi-Model Autonomous Dispatcher</div>
            <div>
              <span className="text-purple-400">pub async fn</span>{" "}
              <span className="text-yellow-300">dispatch_task</span>(
              <span className="text-blue-300">ctx</span>: &amp;
              <span className="text-emerald-300">ExecutionContext</span>,{" "}
              <span className="text-blue-300">model</span>:{" "}
              <span className="text-emerald-300">ModelFamily</span>) -&gt;{" "}
              <span className="text-emerald-300">Result</span>&lt;
              <span className="text-blue-300">ASTDiff</span>&gt; &#123;
            </div>
            <div className="pl-4">
              <span className="text-purple-400">let</span> plan = ctx.
              <span className="text-yellow-300">decompose_dag</span>().
              <span className="text-purple-400">await</span>?;
            </div>
            <div className="pl-4 text-emerald-400/90 bg-emerald-500/10 px-1 rounded">
              + match model.route_optimal_enclave(&amp;plan) &#123;
            </div>
            <div className="pl-8 text-emerald-400/90 bg-emerald-500/10 px-1 rounded">
              + ModelFamily::OpenAI =&gt; ctx.invoke_astra(&amp;plan).await?,
            </div>
            <div className="pl-8 text-emerald-400/90 bg-emerald-500/10 px-1 rounded">
              + ModelFamily::Claude =&gt; ctx.invoke_sonnet_ast(&amp;plan).await?,
            </div>
            <div className="pl-8 text-emerald-400/90 bg-emerald-500/10 px-1 rounded">
              + ModelFamily::Native =&gt; ctx.nexa_local_exec(&amp;plan)?,
            </div>
            <div className="pl-4 text-emerald-400/90 bg-emerald-500/10 px-1 rounded">
              + &#125;;
            </div>
            <div className="pl-4">
              ctx.verify_symbol_table_integrity().
              <span className="text-purple-400">await</span>
            </div>
            <div>&#125;</div>
          </div>
        </div>

        {/* Right: CodeXa AI Agent Panel */}
        <div className="lg:col-span-5 p-4 sm:p-5 bg-[#0C0D12] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E11D48]" />
                <span className="text-xs font-semibold text-white">CodeXa AI Agent</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            {/* Agent Status Card */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 mb-3">
              <div className="text-[11px] text-neutral-300 font-sans">
                <strong>Autonomous Action:</strong> Refactored multi-provider routing table with in-memory AST check.
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400">
                <span>Diff: +4 / -0</span>
                <span>•</span>
                <span>Latency: 142ms</span>
                <span>•</span>
                <span className="text-emerald-400">AST Passed</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-[11px] text-neutral-400 font-sans">
              <div className="text-neutral-300 font-medium">Active Capabilities:</div>
              <ul className="space-y-1 list-disc list-inside">
                <li>Zero-telemetry local key execution</li>
                <li>Instant tab-based model switching</li>
                <li>Unified diff staging with atomic rollback</li>
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>Quota Used: 0.04%</span>
            <span>Plan: All Tiers Supported</span>
          </div>
        </div>
      </div>

      {/* IDE Status Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-1.5 bg-[#08090C] border-t border-white/10 text-[10px] font-mono text-neutral-400 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            CodeXa Engine v2.4
          </span>
          <span>git(main)</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>In-Memory AST: 18ms</span>
          <span className="text-white">Active: {selectedModel}</span>
        </div>
      </div>
    </div>
  );
}
