"use client";

import React, { useState, useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";
import { CodeXaLogo } from "@/components/ui/CodeXaLogo";
import {
  FileCode2,
  GitBranch,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  Check,
  ChevronRight,
  FolderOpen,
  Folder,
  Sliders,
  ShieldCheck,
  Search,
  MessageSquare,
  ListTodo,
  Bot,
  Bug,
  Monitor,
  ExternalLink,
  Code2,
  Play,
  RotateCw,
} from "lucide-react";

type SceneKey =
  | "init"
  | "select_file"
  | "typing"
  | "ai_prompt"
  | "ai_plan"
  | "ai_agent"
  | "diff_review"
  | "diff_approve"
  | "terminal_run"
  | "preview_hotreload"
  | "git_stage"
  | "loop_settle";

interface FileItem {
  name: string;
  type: "file" | "folder";
  icon?: string;
  ext?: string;
  status?: string;
  isOpen?: boolean;
}

export function FloatingWorkspaceShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const floatingFrameRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  const [activeScene, setActiveScene] = useState<SceneKey>("init");
  const [typedLength, setTypedLength] = useState(0);
  const [diffApproved, setDiffApproved] = useState(false);
  const [activeAITab, setActiveAITab] = useState<"chat" | "plan" | "agent" | "debug">("chat");
  const [bottomTab, setBottomTab] = useState<"terminal" | "git" | "preview" | "problems">("terminal");
  const [activeTab, setActiveTab] = useState<string>("workflow.ts");
  const [isVisible, setIsVisible] = useState(true);

  // 24 lines of real, meaningful source code
  const codeLines = [
    { num: "01", text: '// CodeXa Studio IDE — Autonomous Multi-Model Pipeline' },
    { num: "02", text: 'import { GPT6Astra, Fabel5, ModelRouter } from "@codexa/ai";' },
    { num: "03", text: 'import { ASTIndexer } from "@codexa/ast-cache";' },
    { num: "04", text: '' },
    { num: "05", text: 'export interface OrchestrationSpec {' },
    { num: "06", text: '  taskGoal: string;' },
    { num: "07", text: '  strictVerification: boolean;' },
    { num: "08", text: '}' },
    { num: "09", text: '' },
    { num: "10", text: 'export async function orchestrateTask(spec: OrchestrationSpec) {' },
    { num: "11", text: '  // 1. In-memory AST symbol cache lookup (<0.02ms latency)' },
    { num: "12", text: '  const symbols = await ASTIndexer.cacheCurrentSymbols();' },
    { num: "13", text: '' },
    { num: "14", text: '  // 2. OpenAI GPT-6 Astra task decomposition & DAG formulation' },
    { num: "15", text: '  const plan = await GPT6Astra.generateAtomicPlan({' },
    { num: "16", text: '    goal: spec.taskGoal,' },
    { num: "17", text: '    context: symbols.getExportGraph(),' },
    { num: "18", text: '    modelId: "gpt-6-astra",' },
    { num: "19", text: '  });' },
    { num: "20", text: '' },
    { num: "21", text: '  // 3. Fabel 5.1 formal invariant verification' },
    { num: "22", text: '  const verifiedDiff = await Fabel5.verifyHunks(plan);' },
    { num: "23", text: '  return await verifiedDiff.stageHunks();' },
    { num: "24", text: '}' },
  ];

  // Pause when offscreen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsVisible(entry.isIntersecting));
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Continuous 12-Scene Choreographed Sequence (~36s full loop)
  useEffect(() => {
    if (!isVisible) return;

    const sequence: { scene: SceneKey; duration: number }[] = [
      { scene: "init", duration: 3200 },
      { scene: "select_file", duration: 2400 },
      { scene: "typing", duration: 3600 },
      { scene: "ai_prompt", duration: 3000 },
      { scene: "ai_plan", duration: 3400 },
      { scene: "ai_agent", duration: 3200 },
      { scene: "diff_review", duration: 3200 },
      { scene: "diff_approve", duration: 2600 },
      { scene: "terminal_run", duration: 3400 },
      { scene: "preview_hotreload", duration: 3200 },
      { scene: "git_stage", duration: 2800 },
      { scene: "loop_settle", duration: 2200 },
    ];

    let currentStep = 0;
    let timer: NodeJS.Timeout;

    const advanceStep = () => {
      const { scene, duration } = sequence[currentStep];
      setActiveScene(scene);

      // Contextual state updates
      if (scene === "init" || scene === "loop_settle") {
        setActiveAITab("chat");
        setBottomTab("terminal");
        setDiffApproved(false);
        setActiveTab("workflow.ts");
      } else if (scene === "select_file" || scene === "typing") {
        setActiveTab("workflow.ts");
      } else if (scene === "ai_prompt") {
        setActiveAITab("chat");
      } else if (scene === "ai_plan") {
        setActiveAITab("plan");
      } else if (scene === "ai_agent") {
        setActiveAITab("agent");
      } else if (scene === "diff_review") {
        setDiffApproved(false);
      } else if (scene === "diff_approve") {
        setDiffApproved(true);
      } else if (scene === "terminal_run") {
        setBottomTab("terminal");
      } else if (scene === "preview_hotreload") {
        setBottomTab("preview");
      } else if (scene === "git_stage") {
        setBottomTab("git");
      }

      currentStep = (currentStep + 1) % sequence.length;
      timer = setTimeout(advanceStep, duration);
    };

    advanceStep();
    return () => clearTimeout(timer);
  }, [isVisible]);

  // Floating & Scroll-Linked Motion
  useEffect(() => {
    if (isReduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    if (!containerRef.current || !floatingFrameRef.current) return;

    const frame = floatingFrameRef.current;

    const ctx = gsap.context(() => {
      // Entrance
      gsap.fromTo(
        frame,
        { opacity: 0, y: 35, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: MOTION_EASINGS.smoothOut,
        }
      );

      // Gentle vertical floating drift (3–5px) with soft shadow breathing
      const floatTween = gsap.to(frame, {
        y: -5,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Scroll observer
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        onEnter: () => floatTween.play(),
        onLeave: () => floatTween.pause(),
        onEnterBack: () => floatTween.play(),
        onLeaveBack: () => floatTween.pause(),
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isReduced]);

  return (
    <div id="live-ide-showcase" ref={containerRef} className="mt-8 sm:mt-12 w-full perspective-[1400px]">
      {/* Floating Glass IDE Outer Shell */}
      <div
        ref={floatingFrameRef}
        className="w-full rounded-2xl bg-[rgba(20,21,26,0.88)] backdrop-blur-xl border border-white/[0.12] shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(255,255,255,0.03)] overflow-hidden transition-all duration-500"
      >
        {/* Titlebar */}
        <div className="h-10 bg-[#111217]/95 border-b border-white/[0.08] px-4 flex items-center justify-between select-none">
          {/* Window dots & brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80 hover:bg-[#FF5F56] transition-colors inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 hover:bg-[#FFBD2E] transition-colors inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]/80 hover:bg-[#27C93F] transition-colors inline-block" />
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <CodeXaLogo size="sm" />
              <span className="text-xs font-semibold text-white/90">CodeXa Studio IDE</span>
            </div>
          </div>

          {/* Active File / Context path */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-white/50">
            <span>agency-core</span>
            <span>/</span>
            <span className="text-white/80">src/orchestration/workflow.ts</span>
          </div>

          {/* Real Status Indicators */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-white/60">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AST Cache:</span> 0.02ms
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="text-white/80 font-medium">GPT-6 Astra [OpenAI]</span>
          </div>
        </div>

        {/* IDE 3-Column Workspace Composition */}
        <div className="flex flex-col lg:flex-row min-h-[580px] sm:min-h-[620px] bg-[#0A0B0F] text-white">
          
          {/* -------------------------------------------------------------
              COLUMN 1: Left Sidebar (Project Explorer: 19% width)
              ------------------------------------------------------------- */}
          <div className="w-full lg:w-[19%] border-b lg:border-b-0 lg:border-r border-white/[0.07] bg-[#0E0F14] p-3 flex flex-col justify-between shrink-0 select-none">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 mb-3 px-1 flex items-center justify-between">
                <span>PROJECT EXPLORER</span>
                <span className="text-[9px] text-emerald-400 font-mono">AST READY</span>
              </div>

              {/* Folder structure */}
              <div className="space-y-1 text-xs font-mono">
                <div className="flex items-center gap-1.5 px-2 py-1 text-white/70">
                  <FolderOpen className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-semibold text-white/90">src</span>
                </div>

                <div className="pl-3 space-y-1">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 text-white/60">
                    <Folder className="w-3 h-3 text-neutral-400" />
                    <span>orchestration</span>
                  </div>

                  <div className="pl-3 space-y-0.5">
                    <div
                      className={`flex items-center justify-between px-2 py-1 rounded transition-colors ${
                        activeTab === "workflow.ts"
                          ? "bg-white/[0.10] text-white font-medium"
                          : "text-white/60 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FileCode2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">workflow.ts</span>
                      </div>
                      <span className="text-[9px] font-mono text-amber-400 font-bold">M</span>
                    </div>

                    <div className="flex items-center justify-between px-2 py-1 rounded text-white/50 hover:bg-white/5">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileCode2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">models.config.ts</span>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500">✓</span>
                    </div>

                    <div className="flex items-center justify-between px-2 py-1 rounded text-white/50 hover:bg-white/5">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileCode2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">ast-cache.ts</span>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500">✓</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 text-white/60 mt-1">
                    <Folder className="w-3 h-3 text-neutral-400" />
                    <span>preview</span>
                  </div>
                  <div className="pl-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded text-white/50 hover:bg-white/5">
                      <FileCode2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>live-dom.tsx</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Model & Keyring Information Card */}
            <div className="p-3 rounded-xl bg-black/50 border border-white/[0.08] text-[10.5px] font-mono space-y-1.5 mt-4">
              <div className="flex justify-between items-center text-white/50">
                <span>ACTIVE MODEL:</span>
                <span className="text-white font-bold">GPT-6 Astra</span>
              </div>
              <div className="flex justify-between items-center text-white/50">
                <span>PROVIDER:</span>
                <span className="text-emerald-400">OpenAI (Official)</span>
              </div>
              <div className="flex justify-between items-center text-white/50">
                <span>KEYRING:</span>
                <span className="text-neutral-300">Local OS Vault</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              COLUMN 2: Center Editor (DOMINANT WIDTH: ~55%)
              ------------------------------------------------------------- */}
          <div className="flex-1 min-w-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.07] bg-[#090A0D]">
            
            {/* Editor Tab Bar */}
            <div className="flex items-center bg-[#0C0D11] border-b border-white/[0.07] px-2 text-xs font-mono select-none overflow-x-auto">
              <button
                onClick={() => setActiveTab("workflow.ts")}
                className={`flex items-center gap-2 px-3.5 py-2.5 border-r border-white/[0.07] transition-colors ${
                  activeTab === "workflow.ts"
                    ? "bg-[#090A0D] text-white border-t-2 border-t-blue-400 font-medium"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                <span>workflow.ts</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </button>

              <button
                onClick={() => setActiveTab("models.config.ts")}
                className={`flex items-center gap-2 px-3.5 py-2.5 border-r border-white/[0.07] transition-colors ${
                  activeTab === "models.config.ts"
                    ? "bg-[#090A0D] text-white border-t-2 border-t-blue-400 font-medium"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
                <span>models.config.ts</span>
              </button>

              <button
                onClick={() => setActiveTab("ast-cache.ts")}
                className={`flex items-center gap-2 px-3.5 py-2.5 border-r border-white/[0.07] transition-colors ${
                  activeTab === "ast-cache.ts"
                    ? "bg-[#090A0D] text-white border-t-2 border-t-blue-400 font-medium"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ast-cache.ts</span>
              </button>
            </div>

            {/* Main Code Viewport (15-25 lines visible!) */}
            <div className="p-4 flex-1 overflow-y-auto ide-scroll font-mono text-[11.5px] leading-relaxed select-none">
              <div className="space-y-0.5">
                {codeLines.map((line, idx) => {
                  const isHighlightedLine = idx === 15 || idx === 16;
                  return (
                    <div
                      key={line.num}
                      className={`flex items-center gap-3 px-2 py-0.5 rounded transition-colors ${
                        isHighlightedLine ? "bg-white/[0.05]" : ""
                      }`}
                    >
                      <span className="w-6 text-right text-white/30 select-none text-[10.5px]">
                        {line.num}
                      </span>
                      <span className="text-neutral-300 flex-1">
                        {line.text.startsWith("//") ? (
                          <span className="text-[#5C6370] italic">{line.text}</span>
                        ) : line.text.includes("import ") ? (
                          <>
                            <span className="text-[#D9354D] font-semibold">import </span>
                            <span className="text-[#E5C07B]">
                              {line.text.substring(7, line.text.indexOf("from"))}
                            </span>
                            <span className="text-[#D9354D]">from </span>
                            <span className="text-[#98C379]">
                              {line.text.substring(line.text.indexOf("from") + 5)}
                            </span>
                          </>
                        ) : line.text.includes("export async function") ? (
                          <>
                            <span className="text-[#D9354D] font-semibold">export async function </span>
                            <span className="text-[#61AFEF]">orchestrateTask</span>
                            <span className="text-neutral-300">(spec: OrchestrationSpec) &#123;</span>
                          </>
                        ) : line.text.includes("const ") ? (
                          <>
                            <span className="text-[#D9354D] font-semibold">&nbsp;&nbsp;const </span>
                            <span className="text-[#E06C75]">
                              {line.text.substring(line.text.indexOf("const ") + 6, line.text.indexOf("="))}
                            </span>
                            <span className="text-[#56B6C2]">= </span>
                            <span className="text-neutral-200">
                              {line.text.substring(line.text.indexOf("=") + 1)}
                            </span>
                          </>
                        ) : (
                          <span>{line.text}</span>
                        )}

                        {/* Blinking cursor on active typing */}
                        {activeScene === "typing" && idx === 18 && (
                          <span className="inline-block w-1.5 h-3.5 bg-white ml-1 animate-pulse align-middle" />
                        )}
                      </span>
                    </div>
                  );
                })}

                {/* Inline Diff Review Hunks (Active in Scene 6 & 7) */}
                {(activeScene === "diff_review" || activeScene === "diff_approve") && (
                  <div className="my-2 p-2.5 rounded-xl border border-white/10 bg-[#121318] text-[11px] font-mono">
                    <div className="flex items-center justify-between text-[10px] text-white/50 mb-1.5 pb-1 border-b border-white/10">
                      <span className="text-amber-400 font-bold">Atomic Diff Hunk #1</span>
                      <span className="text-emerald-400">Fabel 5.1 Verified ✓</span>
                    </div>
                    <div className="bg-red-950/40 text-red-300 px-2 py-0.5 rounded mb-0.5">
                      - const plan = await Astra6.generateAtomicPlan(&#123; ... &#125;);
                    </div>
                    <div className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded">
                      + const plan = await GPT6Astra.generateAtomicPlan(&#123; goal: spec.taskGoal, modelId: &quot;gpt-6-astra&quot; &#125;);
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-white/10">
                      <button
                        onClick={() => setDiffApproved(true)}
                        className={`px-3 py-1 rounded text-[10.5px] font-semibold transition-all ${
                          diffApproved
                            ? "bg-emerald-500 text-black font-bold"
                            : "bg-white text-black hover:bg-neutral-200"
                        }`}
                      >
                        {diffApproved ? "Hunk Staged ✓" : "Accept Diff"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Panel (Terminal / Live Preview / Git / Problems) */}
            <div className="border-t border-white/[0.08] bg-[#0B0C10] select-none">
              <div className="flex items-center gap-1 px-3 border-b border-white/[0.06] text-[10.5px] font-mono">
                <button
                  onClick={() => setBottomTab("terminal")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 transition-colors ${
                    bottomTab === "terminal"
                      ? "border-b-blue-400 text-white font-medium"
                      : "border-b-transparent text-white/40 hover:text-white"
                  }`}
                >
                  <Terminal className="w-3 h-3 text-blue-400" />
                  <span>TERMINAL</span>
                </button>
                <button
                  onClick={() => setBottomTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 transition-colors ${
                    bottomTab === "preview"
                      ? "border-b-emerald-400 text-white font-medium"
                      : "border-b-transparent text-white/40 hover:text-white"
                  }`}
                >
                  <Monitor className="w-3 h-3 text-emerald-400" />
                  <span>LIVE PREVIEW</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </button>
                <button
                  onClick={() => setBottomTab("git")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 transition-colors ${
                    bottomTab === "git"
                      ? "border-b-purple-400 text-white font-medium"
                      : "border-b-transparent text-white/40 hover:text-white"
                  }`}
                >
                  <GitBranch className="w-3 h-3 text-purple-400" />
                  <span>GIT STAGING</span>
                  <span className="text-[9px] px-1 rounded bg-white/10 text-white">1</span>
                </button>
              </div>

              {/* Panel Content */}
              <div className="p-3 h-24 font-mono text-[11px] overflow-y-auto ide-scroll">
                {bottomTab === "terminal" && (
                  <div className="space-y-0.5 text-neutral-300">
                    <div className="text-white/60">$ codexa test --suite ast-pipeline</div>
                    <div className="text-emerald-400">✓ In-memory AST symbol cache: 0.02ms (Passed)</div>
                    <div className="text-emerald-400">✓ OpenAI GPT-6 Astra task router: 14ms (Passed)</div>
                    <div className="text-white font-semibold">
                      PASS: 18/18 test suites passed with 100% assertion coverage.
                    </div>
                  </div>
                )}

                {bottomTab === "preview" && (
                  <div className="flex items-center justify-between h-full bg-white/[0.02] border border-white/5 rounded-lg px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Local Hot-Reload Active</div>
                        <div className="text-[10px] text-white/40">http://localhost:3000 • AST Render Sync</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">0.016s delta</span>
                  </div>
                )}

                {bottomTab === "git" && (
                  <div className="flex items-center justify-between h-full">
                    <div className="space-y-0.5">
                      <div className="text-white/70">Staged Changes (Ready to commit):</div>
                      <div className="text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-3 h-3" />
                        <span>src/orchestration/workflow.ts (+4, -1)</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 rounded bg-white/10 hover:bg-white text-white hover:text-black text-[10px] font-bold transition-all">
                      Commit &amp; Push
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* -------------------------------------------------------------
              COLUMN 3: Right Sidebar (CodeXa AI Panel: ~26% width)
              ------------------------------------------------------------- */}
          <div className="w-full lg:w-[26%] bg-[#0D0E13] p-3 flex flex-col justify-between shrink-0 select-none">
            <div>
              {/* Header with Model Selector */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.07]">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-bold text-white">CodeXa AI</span>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/10 text-[9.5px] font-mono text-emerald-400">
                  GPT-6 Astra [OpenAI]
                </div>
              </div>

              {/* Navigation Tabs (Chat / Plan / Agent / Debug) */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg mb-3 text-[10px] font-mono">
                {(["chat", "plan", "agent", "debug"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveAITab(tab)}
                    className={`flex-1 py-1 rounded text-center uppercase tracking-wider transition-all ${
                      activeAITab === tab
                        ? "bg-white text-black font-bold shadow-sm"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Specification Prompt Box */}
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] mb-3 text-xs">
                <div className="text-[9.5px] font-mono text-white/40 uppercase tracking-wider mb-1">
                  DEVELOPER PROMPT
                </div>
                <p className="text-white/90 text-[11px] leading-snug">
                  &quot;Optimize symbol indexing cache and orchestrate GPT-6 Astra task decomposition.&quot;
                </p>
              </div>

              {/* Mode-specific content */}
              {activeAITab === "chat" && (
                <div className="space-y-2 text-[11px] font-sans">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-neutral-200">
                    <span className="font-semibold text-blue-400 block mb-0.5 font-mono text-[10px]">
                      GPT-6 Astra Response:
                    </span>
                    Analyzed 12 symbol dependencies in 0.02ms. Ready to formulate DAG execution plan.
                  </div>
                </div>
              )}

              {activeAITab === "plan" && (
                <div className="space-y-1.5 text-[10.5px] font-mono">
                  <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.04] text-white">
                    <span className="text-emerald-400 font-bold">01</span>
                    <span>Cache AST Export Graph</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.04] text-white">
                    <span className="text-emerald-400 font-bold">02</span>
                    <span>Decompose into atomic hunks</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.04] text-white">
                    <span className="text-emerald-400 font-bold">03</span>
                    <span>Verify with Fabel 5.1</span>
                  </div>
                </div>
              )}

              {activeAITab === "agent" && (
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5 text-[10.5px] font-mono">
                  <div className="flex justify-between text-white/60">
                    <span>STATUS:</span>
                    <span className="text-emerald-400 font-bold">Synthesizing Hunk #1</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>AST SOUNDNESS:</span>
                    <span className="text-white">100% Invariant Check</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>LATENCY:</span>
                    <span className="text-white">98ms</span>
                  </div>
                </div>
              )}

              {activeAITab === "debug" && (
                <div className="p-2.5 rounded-xl bg-white/[0.03] text-[10.5px] font-mono text-emerald-400">
                  Zero syntax violations or type errors detected.
                </div>
              )}
            </div>

            {/* Token Quota Meter */}
            <div className="pt-3 border-t border-white/[0.07] space-y-1 font-mono text-[10px]">
              <div className="flex justify-between text-white/50">
                <span>PREMIUM USAGE:</span>
                <span className="text-white font-bold">4,860 / 250,000 units</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-[2%]" />
              </div>
              <div className="flex justify-between text-[9px] text-white/40 pt-0.5">
                <span>Starter Plan</span>
                <span>Universal Model Access</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Status Bar */}
        <div className="h-7 bg-[#0E0F14] border-t border-white/[0.08] px-3 flex items-center justify-between text-[10px] font-mono text-white/60 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-white/80">
              <GitBranch className="w-3 h-3 text-purple-400" />
              <span>main*</span>
            </span>
            <span className="text-white/20">|</span>
            <span>TypeScript 5.8</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">UTF-8</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>AST Cache Active</span>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline text-white/80">OpenAI (gpt-6-astra)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
