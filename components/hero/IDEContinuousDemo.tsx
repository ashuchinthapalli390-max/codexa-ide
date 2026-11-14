"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Terminal,
  FileCode2,
  GitBranch,
  Layers,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Check,
  X,
  Maximize2,
  Minimize2,
  ShieldCheck,
} from "lucide-react";
import { CodeXaLogo } from "@/components/ui/CodeXaLogo";

interface DemoScene {
  id: number;
  name: string;
  badge: string;
  headline: string;
  description: string;
}

const DEMO_SCENES: DemoScene[] = [
  {
    id: 1,
    name: "01 Workspace",
    badge: "AST CORE",
    headline: "Fast In-Memory Syntax Indexing",
    description: "Opening workspace files with instant symbol graph caching and sub-50ms AST parsing.",
  },
  {
    id: 2,
    name: "02 Coding",
    badge: "LOCAL-FIRST",
    headline: "Real-time AST Code Synthesis",
    description: "Monaco editor canvas rendering reactive TypeScript with multi-cursor intelligence.",
  },
  {
    id: 3,
    name: "03 CodeXa AI",
    badge: "DUAL-AGENT",
    headline: "Autonomous Task Planner (Astra 6)",
    description: "Multi-model reasoning decomposing feature requirements into discrete atomic tasks.",
  },
  {
    id: 4,
    name: "04 Diff Review",
    badge: "ATOMIC DIFF",
    headline: "Side-by-Side Syntactic Review",
    description: "Line-by-line hunk inspection ensuring zero hallucinated code touches production files.",
  },
  {
    id: 5,
    name: "05 Terminal",
    badge: "GPU MATRIX",
    headline: "Accelerated Matrix Execution",
    description: "Native terminal running test suites and building container packages concurrently.",
  },
  {
    id: 6,
    name: "06 Live Preview",
    badge: "DUAL VIEWPORT",
    headline: "Synchronized Web Container",
    description: "Desktop and mobile DOM viewports updating in real time via hot-reload engine.",
  },
  {
    id: 7,
    name: "07 Git Staging",
    badge: "SOURCE CONTROL",
    headline: "Cryptographic Branch Staging",
    description: "Visual commit tree and atomic staging ready for deployment pipeline dispatch.",
  },
];

export function IDEContinuousDemo() {
  const [currentScene, setCurrentScene] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [typedCodeLength, setTypedCodeLength] = useState(0);
  const [aiTypingProgress, setAiTypingProgress] = useState(0);
  const [diffApproved, setDiffApproved] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const fullSampleCode = `// CodeXa Studio IDE — Local AST Pipeline
import { Astra6, Router } from "@codexa/ai";
import { ASTIndexer } from "@codexa/ast-cache";

export async function orchestrateWorkflow(task: string) {
  const ast = await ASTIndexer.cacheCurrentSymbols();
  const plan = await Astra6.generateAtomicPlan({
    prompt: task,
    context: ast.getReferences(),
    model: "astra-6-core",
  });

  return plan.synthesizeDiff();
}`;

  // Scene timing loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentScene((prev) => {
        if (prev >= DEMO_SCENES.length) {
          // Restart loop
          setDiffApproved(false);
          setTypedCodeLength(0);
          setAiTypingProgress(0);
          return 1;
        }
        return prev + 1;
      });
    }, 4200);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Code typing effect on Scene 2
  useEffect(() => {
    if (currentScene === 2) {
      setTypedCodeLength(0);
      const codeTimer = setInterval(() => {
        setTypedCodeLength((prev) => {
          if (prev >= fullSampleCode.length) {
            clearInterval(codeTimer);
            return prev;
          }
          return prev + 14;
        });
      }, 50);
      return () => clearInterval(codeTimer);
    }
  }, [currentScene]);

  // AI progress effect on Scene 3
  useEffect(() => {
    if (currentScene === 3) {
      setAiTypingProgress(0);
      const aiTimer = setInterval(() => {
        setAiTypingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(aiTimer);
            return 100;
          }
          return prev + 25;
        });
      }, 300);
      return () => clearInterval(aiTimer);
    }
  }, [currentScene]);

  const activeSceneData = DEMO_SCENES[currentScene - 1] || DEMO_SCENES[0];

  const handleStepSelect = (stepId: number) => {
    setCurrentScene(stepId);
    setUserInteracted(true);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    setUserInteracted(false);
  };

  const handleRestart = () => {
    setCurrentScene(1);
    setIsPlaying(true);
    setDiffApproved(false);
    setTypedCodeLength(0);
    setAiTypingProgress(0);
    setUserInteracted(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Demo Controls Bar */}
      <div className="w-full max-w-5xl mb-4 px-3 py-2 rounded-xl bg-[#121217] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Play/Pause & Restart */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono font-semibold transition-all"
            title={isPlaying ? "Pause Demo" : "Resume Demo"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </>
            )}
          </button>

          <button
            onClick={handleRestart}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Restart Demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10 text-[11px] font-mono text-white/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CONTINUOUS DEMO</span>
          </div>
        </div>

        {/* Step Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {DEMO_SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => handleStepSelect(scene.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all ${
                currentScene === scene.id
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {scene.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main IDE Demonstration Shell */}
      <div className="w-full max-w-5xl rounded-2xl border border-white/15 bg-[#0C0D12] shadow-2xl overflow-hidden text-white flex flex-col">
        
        {/* IDE Titlebar */}
        <div className="h-10 bg-[#14151B] border-b border-white/10 px-4 flex items-center justify-between select-none">
          {/* Window dots & logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <CodeXaLogo size="sm" />
              <span className="text-xs font-semibold text-white/80">CodeXa Studio IDE</span>
            </div>
          </div>

          {/* Active scene contextual badge */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
              {activeSceneData.badge}
            </span>
            <span className="text-xs font-mono text-neutral-400 hidden md:inline">
              {activeSceneData.headline}
            </span>
          </div>

          <div className="text-[11px] font-mono text-white/40">
            v1.0-prebeta
          </div>
        </div>

        {/* IDE Layout Body */}
        <div className="grid grid-cols-12 min-h-[460px] bg-[#0E0F14]">
          
          {/* Left Activity Bar + Explorer (3 cols on md) */}
          <div className="col-span-12 md:col-span-3 border-r border-white/10 bg-[#121319] p-3 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 mb-3 px-1 flex items-center justify-between">
                <span>EXPLORER</span>
                <span className="text-[9px] text-emerald-400 font-mono">AST INDEXED</span>
              </div>

              {/* File Tree */}
              <div className="space-y-1 text-xs font-mono">
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 text-white">
                  <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>workflow.ts</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded text-white/50 hover:bg-white/5">
                  <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>router.config.json</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded text-white/50 hover:bg-white/5">
                  <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>models.keychain.ts</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded text-white/50 hover:bg-white/5">
                  <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>preview.tsx</span>
                </div>
              </div>
            </div>

            {/* Platform & Model Status Pill */}
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-[10px] font-mono space-y-1">
              <div className="flex justify-between text-white/40">
                <span>MODEL:</span>
                <span className="text-white font-bold">Astra 6 AI Core</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>AST CACHE:</span>
                <span className="text-emerald-400">0.024ms (Local)</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>PRIVACY:</span>
                <span className="text-neutral-300">Air-Gapped BYOK</span>
              </div>
            </div>
          </div>

          {/* Center: Active Scene Dynamic View (6 cols on md) */}
          <div className="col-span-12 md:col-span-6 p-4 flex flex-col justify-between border-r border-white/10 bg-[#0A0B0E]">
            
            {/* SCENE 1 & 2: Editor Canvas */}
            {(currentScene === 1 || currentScene === 2) && (
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-2 text-xs font-mono text-white/40 border-b border-white/10 pb-2 mb-3">
                  <span className="text-white font-bold">src/orchestration/workflow.ts</span>
                  <span className="text-emerald-400 text-[10px]">• Ready</span>
                </div>
                <pre className="text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto flex-1 select-none">
                  <code>
                    {currentScene === 1
                      ? fullSampleCode
                      : fullSampleCode.slice(0, typedCodeLength)}
                    {currentScene === 2 && (
                      <span className="inline-block w-2 h-4 bg-white ml-0.5 animate-pulse align-middle" />
                    )}
                  </code>
                </pre>
              </div>
            )}

            {/* SCENE 3: CodeXa AI Prompt & Reasoning */}
            {currentScene === 3 && (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-white/40 border-b border-white/10 pb-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span className="text-white font-bold">CodeXa AI Task Planner</span>
                  </div>

                  {/* Task message */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-4 text-xs">
                    <div className="text-[10px] font-mono text-white/40 mb-1">TASK SPECIFICATION</div>
                    <div className="text-white font-medium">
                      "Refactor symbol resolution in AST indexer to support live multi-cursor coordinates without cache invalidation."
                    </div>
                  </div>

                  {/* AI Decomposition Progress */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Inspecting active symbol graph (34 nodes)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Dispatching subtask to Astra 6 planner</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Cpu className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Synthesizing atomic diff ({aiTypingProgress}%)</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[11px] font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Invariant verified: Zero breakages against test suite.</span>
                </div>
              </div>
            )}

            {/* SCENE 4: Side-by-Side Diff Review */}
            {currentScene === 4 && (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2 mb-3">
                    <span className="text-white font-bold">Atomic Diff Inspector</span>
                    <span className="text-[10px] text-amber-400 font-mono">1 Hunk Pending</span>
                  </div>

                  <div className="border border-white/10 rounded-lg overflow-hidden text-xs font-mono">
                    <div className="bg-red-950/40 text-red-300 px-3 py-1 border-b border-red-900/30">
                      - const symbols = await ast.sync();
                    </div>
                    <div className="bg-emerald-950/40 text-emerald-300 px-3 py-1 border-b border-emerald-900/30">
                      + const symbols = await ASTIndexer.cacheCurrentSymbols();
                    </div>
                    <div className="bg-emerald-950/40 text-emerald-300 px-3 py-1">
                      {"+ const plan = await Astra6.generateAtomicPlan({ ... });"}
                    </div>
                  </div>
                </div>

                {/* Accept / Reject Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setDiffApproved(true)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition-all ${
                      diffApproved
                        ? "bg-emerald-500 text-black font-bold"
                        : "bg-white text-black hover:bg-neutral-200"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{diffApproved ? "Hunk Approved" : "Accept Diff"}</span>
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-white/10 text-white/60 hover:text-white text-xs font-mono">
                    Reject
                  </button>
                </div>
              </div>
            )}

            {/* SCENE 5: Terminal Matrix */}
            {currentScene === 5 && (
              <div className="h-full flex flex-col justify-between font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2 text-white/40 border-b border-white/10 pb-2 mb-3">
                    <Terminal className="w-3.5 h-3.5 text-white" />
                    <span className="text-white font-bold">Terminal Matrix (PTY)</span>
                  </div>
                  <div className="space-y-1.5 text-neutral-300">
                    <div className="text-white/60">$ codexa test --suite ast-cache</div>
                    <div className="text-neutral-400">Running 12 unit suites...</div>
                    <div className="text-emerald-400">✓ AST indexer cache initialized (18ms)</div>
                    <div className="text-emerald-400">✓ Multi-model router dispatched (44ms)</div>
                    <div className="text-emerald-400">✓ Deterministic AST diff applied cleanly</div>
                    <div className="text-white font-bold mt-2">
                      PASS: 12/12 test suites passed (0 failed).
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-white/40">GPU Matrix Acceleration Active</div>
              </div>
            )}

            {/* SCENE 6: Live Preview */}
            {currentScene === 6 && (
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2 mb-3">
                  <span className="text-white font-bold">Synchronized Live DOM Preview</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Hot-Reload Active</span>
                </div>

                <div className="border border-white/10 rounded-xl bg-white/5 p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-xs mb-2">
                    CX
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Preview Component</h4>
                  <p className="text-xs text-white/60 max-w-xs">
                    Rendered hot-reload container responding to AST edits in zero milliseconds.
                  </p>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-white/40 pt-2 border-t border-white/10">
                  <span>Viewport: 390px Mobile & Desktop</span>
                  <span>Console: 0 Errors</span>
                </div>
              </div>
            )}

            {/* SCENE 7: Git Staging */}
            {currentScene === 7 && (
              <div className="h-full flex flex-col justify-between font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2 text-white/40 border-b border-white/10 pb-2 mb-3">
                    <GitBranch className="w-3.5 h-3.5 text-white" />
                    <span className="text-white font-bold">Git Staging Graph</span>
                  </div>

                  <div className="space-y-2 text-neutral-300">
                    <div className="p-2 rounded bg-white/5 border border-white/10 flex items-center justify-between">
                      <span>staged: src/orchestration/workflow.ts</span>
                      <span className="text-[10px] text-emerald-400">+12 -1</span>
                    </div>
                    <div className="text-white/60">Commit message:</div>
                    <div className="p-2 rounded bg-black/60 border border-white/10 text-white">
                      feat(ai): integrate Astra 6 atomic plan into AST indexing pipeline
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-3 border-t border-white/10">
                  <span className="text-emerald-400">Signed with GPG key</span>
                  <span className="text-white/40">branch: main</span>
                </div>
              </div>
            )}

          </div>

          {/* Right: Scene Guidance & Technical Context (3 cols on md) */}
          <div className="col-span-12 md:col-span-3 p-4 bg-[#121319] flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 mb-2">
                SCENE {activeSceneData.id} OF {DEMO_SCENES.length}
              </div>
              <h3 className="text-sm font-bold font-orbitron text-white mb-2 leading-snug">
                {activeSceneData.headline}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-sans mb-4">
                {activeSceneData.description}
              </p>
            </div>

            {/* Technical guarantee */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] font-mono text-white/50 space-y-1">
              <div className="text-white font-bold text-[10px] uppercase">
                DEMONSTRATION ENGINE
              </div>
              <div>• Seamless 28s Looping Cycle</div>
              <div>• Interactive Pause on Click</div>
              <div>• Local Deterministic AST State</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}