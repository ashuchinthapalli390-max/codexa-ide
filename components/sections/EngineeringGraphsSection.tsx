"use client";

import React, { useState, useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";
import { 
  GitBranch, 
  Cpu, 
  Terminal, 
  Layers, 
  Play, 
  Pause, 
  FileCode2, 
  CheckCircle2, 
  Sparkles, 
  Network, 
  ArrowRight,
  ShieldAlert
} from "lucide-react";

interface WorkflowNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  icon: string;
  details: {
    title: string;
    description: string;
    specs: string[];
  };
}

const WORKFLOW_NODES: WorkflowNode[] = [
  {
    id: "files",
    label: "Project Files",
    sub: "Workspace Tree",
    x: 80,
    y: 160,
    icon: "file",
    details: {
      title: "Workspace File Indexer",
      description: "Monitors active directory trees, watching file changes and streaming AST chunks into memory.",
      specs: ["Incremental file watcher", "Symbol tree indexing", "Zero cloud telemetry"],
    },
  },
  {
    id: "editor",
    label: "AST Editor",
    sub: "Monaco Core",
    x: 230,
    y: 160,
    icon: "editor",
    details: {
      title: "Abstract Syntax Tree Editor",
      description: "GPU-accelerated text canvas maintaining real-time syntax trees for sub-50ms symbol navigation.",
      specs: ["60+ language grammars", "Multi-cursor coordinates", "AST token caching"],
    },
  },
  {
    id: "ai",
    label: "CodeXa AI",
    sub: "Dual-Agent Core",
    x: 390,
    y: 160,
    icon: "ai",
    details: {
      title: "Multi-Model Orchestrator",
      description: "Dispatches coding subtasks to Astra 6, Fabel 5.1, or Gemini based on latency and reasoning requirements.",
      specs: ["Deterministic task planner", "BYOK Keychain pass-through", "Weighted token metering"],
    },
  },
  {
    id: "diff",
    label: "Diff Review",
    sub: "Atomic Hunks",
    x: 550,
    y: 160,
    icon: "diff",
    details: {
      title: "Atomic Diff Inspector",
      description: "Generates clear side-by-side syntactic diffs. No code touches your disk without explicit developer approval.",
      specs: ["Hunk-by-hunk staging", "Rollback snapshots", "Conflict-free resolution"],
    },
  },
  {
    id: "preview",
    label: "Live Preview",
    sub: "DOM Inspector",
    x: 710,
    y: 160,
    icon: "preview",
    details: {
      title: "Synchronized Web Runtime",
      description: "Hot-reload container preview executing web components in isolated sandboxes side-by-side with code.",
      specs: ["Dual mobile/desktop viewports", "Console interceptor", "Zero-port configuration"],
    },
  },
  {
    id: "git",
    label: "Git Staging",
    sub: "Local Commits",
    x: 870,
    y: 160,
    icon: "git",
    details: {
      title: "Visual Source Control",
      description: "Integrated branch visualizer and cryptographic commit verification directly in the workspace shell.",
      specs: ["Visual branch graph", "GPG signature support", "Fast atomic commits"],
    },
  },
];

const ROTATING_PHRASES = [
  "Designed for Flow.",
  "Built for Focus.",
  "Powered by Intelligence.",
  "One Connected Workspace.",
];

export function EngineeringGraphsSection() {
  const [activeTab, setActiveTab] = useState<"workflow" | "router" | "topology">("workflow");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode>(WORKFLOW_NODES[1]);
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  // Cycling phrase interval
  useEffect(() => {
    if (isReduced) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isReduced]);

  // Workflow pulse step loop
  useEffect(() => {
    if (!isAutoPlaying || isReduced) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % WORKFLOW_NODES.length;
        setSelectedNode(WORKFLOW_NODES[next]);
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isReduced]);

  // Entrance animations
  useEffect(() => {
    if (isReduced) return;

    const { gsap } = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.65,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: rightColRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  return (
    <section
      ref={sectionRef}
      id="engineering"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-300 text-black select-none border-t border-gray-400/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Controls */}
          <div ref={leftColRef} className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 block font-sans">
                ENGINEERING ARCHITECTURE
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black font-orbitron leading-tight">
                Built for Engineers.
                <span className="block text-gray-700 transition-opacity duration-300">
                  {ROTATING_PHRASES[phraseIndex]}
                </span>
              </h2>

              <p className="text-[13.5px] text-gray-600 font-medium leading-relaxed mt-4">
                CodeXa fuses a local-first AST editing engine with an intelligent multi-model routing fabric. Every workflow step—from file indexing to atomic git staging—runs in deterministic synchronization.
              </p>

              {/* Mode Switcher Tabs */}
              <div className="flex flex-wrap gap-2 mt-8">
                <button
                  onClick={() => setActiveTab("workflow")}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-mono transition-all ${
                    activeTab === "workflow"
                      ? "bg-black text-white font-bold shadow-sm"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-400/40"
                  }`}
                >
                  01. Workflow Pipeline
                </button>
                <button
                  onClick={() => setActiveTab("router")}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-mono transition-all ${
                    activeTab === "router"
                      ? "bg-black text-white font-bold shadow-sm"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-400/40"
                  }`}
                >
                  02. Model Router
                </button>
                <button
                  onClick={() => setActiveTab("topology")}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-mono transition-all ${
                    activeTab === "topology"
                      ? "bg-black text-white font-bold shadow-sm"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-400/40"
                  }`}
                >
                  03. Feature Topology
                </button>
              </div>
            </div>

            {/* Selected Node Details Card */}
            <div className="mt-8 bg-gray-200 border border-gray-400/50 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                  NODE SPECIFICATION
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  ACTIVE
                </div>
              </div>

              <h4 className="text-[16px] font-bold text-black font-sans mb-1">
                {selectedNode.details.title}
              </h4>
              <p className="text-[12px] text-gray-600 leading-relaxed mb-3">
                {selectedNode.details.description}
              </p>

              <div className="border-t border-gray-300 pt-3 flex flex-wrap gap-2">
                {selectedNode.details.specs.map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10.5px] font-mono bg-white/60 text-gray-800 px-2.5 py-1 rounded border border-gray-300"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Rendered Diagram */}
          <div ref={rightColRef} className="lg:col-span-7 bg-gray-200 border border-gray-300 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[460px] relative overflow-hidden">
            
            {/* Diagram Header */}
            <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-black" />
                <span className="text-[12px] font-mono font-bold text-black">
                  {activeTab === "workflow" && "INTERACTIVE WORKFLOW PIPELINE"}
                  {activeTab === "router" && "MULTI-MODEL ORCHESTRATION FABRIC"}
                  {activeTab === "topology" && "WORKBENCH SYSTEM TOPOLOGY"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-gray-600 hover:text-black bg-gray-300/80 px-2.5 py-1 rounded transition-colors"
                  title={isAutoPlaying ? "Pause flow" : "Resume flow"}
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Play</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* TAB 1: Development Workflow Pipeline */}
            {activeTab === "workflow" && (
              <div className="relative w-full h-[320px] flex items-center justify-center overflow-x-auto py-4">
                <svg
                  viewBox="0 0 960 300"
                  className="w-full max-w-[960px] h-auto min-w-[700px] select-none"
                >
                  <defs>
                    <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="50%" stopColor="#000000" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>
                  </defs>

                  {/* Connecting Backing Line */}
                  <line
                    x1="80"
                    y1="150"
                    x2="870"
                    y2="150"
                    stroke="#cbd5e1"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Pulsing Animated Flow Line */}
                  <line
                    x1="80"
                    y1="150"
                    x2="870"
                    y2="150"
                    stroke="#000000"
                    strokeWidth="2.5"
                    strokeDasharray="16, 20"
                    strokeDashoffset={isAutoPlaying ? "-120" : "0"}
                    className="transition-all duration-1000 ease-linear"
                  />

                  {/* Render Pipeline Nodes */}
                  {WORKFLOW_NODES.map((node, idx) => {
                    const isActive = idx === activeStep;
                    const isSelected = selectedNode.id === node.id;

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, 150)`}
                        onClick={() => {
                          setSelectedNode(node);
                          setActiveStep(idx);
                        }}
                        className="cursor-pointer group"
                      >
                        {/* Glow halo on active */}
                        {isActive && (
                          <circle
                            r="32"
                            fill="rgba(0,0,0,0.06)"
                            className="animate-pulse"
                          />
                        )}

                        {/* Node Circle */}
                        <circle
                          r="22"
                          fill={isSelected ? "#000000" : "#ffffff"}
                          stroke={isSelected ? "#000000" : "#94a3b8"}
                          strokeWidth={isSelected ? "3" : "2"}
                          className="transition-all duration-200"
                        />

                        {/* Node Number */}
                        <text
                          y="4"
                          textAnchor="middle"
                          fill={isSelected ? "#ffffff" : "#000000"}
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {idx + 1}
                        </text>

                        {/* Top Label */}
                        <text
                          y="-32"
                          textAnchor="middle"
                          fill="#000000"
                          fontSize="12"
                          fontFamily="sans-serif"
                          fontWeight="bold"
                          className="group-hover:fill-black transition-colors"
                        >
                          {node.label}
                        </text>

                        {/* Sub Label */}
                        <text
                          y="42"
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize="10"
                          fontFamily="monospace"
                        >
                          {node.sub}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* TAB 2: Multi-Model Router Architecture */}
            {activeTab === "router" && (
              <div className="relative w-full h-[320px] flex items-center justify-center p-4">
                <div className="w-full max-w-lg grid grid-cols-3 gap-4 items-center text-center">
                  
                  {/* Left Column: Task Input */}
                  <div className="flex flex-col gap-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-300 shadow-sm">
                      <div className="text-[10px] font-mono text-gray-500 uppercase">Input</div>
                      <div className="text-[12px] font-bold text-black">User Coding Task</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-300 shadow-sm">
                      <div className="text-[10px] font-mono text-gray-500 uppercase">Context</div>
                      <div className="text-[12px] font-bold text-black">AST Symbol Graph</div>
                    </div>
                  </div>

                  {/* Center Column: CodeXa AI Router */}
                  <div className="p-5 bg-black text-white rounded-xl shadow-md border border-neutral-700 flex flex-col items-center">
                    <Cpu className="w-6 h-6 mb-2 text-white" />
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      ORCHESTRATOR
                    </div>
                    <div className="text-[13px] font-bold font-orbitron">CodeXa Router</div>
                    <div className="text-[10px] text-neutral-300 mt-2 font-mono">
                      Dynamic Model Dispatch
                    </div>
                  </div>

                  {/* Right Column: Model Providers */}
                  <div className="flex flex-col gap-2 text-left">
                    <div className="p-2.5 bg-white rounded-lg border border-gray-300 text-[11px] shadow-sm flex items-center justify-between">
                      <span className="font-bold text-black">Astra 6 AI Core</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/10">Plan</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-gray-300 text-[11px] shadow-sm flex items-center justify-between">
                      <span className="font-bold text-black">Fabel 5.1 Verification</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/10">Verify</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-gray-300 text-[11px] shadow-sm flex items-center justify-between">
                      <span className="font-bold text-black">Gemini 3.8 Flash</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/10">Fast</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-gray-300 text-[11px] shadow-sm flex items-center justify-between">
                      <span className="font-bold text-black">NEXA Local (Offline)</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Edge</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: Feature System Topology */}
            {activeTab === "topology" && (
              <div className="relative w-full h-[320px] flex items-center justify-center p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
                  {[
                    { name: "Monaco Editor", role: "AST Buffer Core", icon: <FileCode2 className="w-4 h-4 text-black" /> },
                    { name: "Terminal Matrix", role: "GPU Matrix PTY", icon: <Terminal className="w-4 h-4 text-black" /> },
                    { name: "Git Engine", role: "Hunk-level staging", icon: <GitBranch className="w-4 h-4 text-black" /> },
                    { name: "Live Preview", role: "DOM container", icon: <Layers className="w-4 h-4 text-black" /> },
                    { name: "Local Keyring", role: "Zero-cloud BYOK", icon: <CheckCircle2 className="w-4 h-4 text-black" /> },
                    { name: "Dual Agent", role: "Plan + Execute", icon: <Sparkles className="w-4 h-4 text-black" /> },
                    { name: "Diff Inspector", role: "Syntactic review", icon: <ArrowRight className="w-4 h-4 text-black" /> },
                    { name: "Extension API", role: "Open VSX compat", icon: <Network className="w-4 h-4 text-black" /> },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-500 hover:-translate-y-0.5 transition-all"
                    >
                      <div className="mb-2">{item.icon}</div>
                      <div className="text-[12px] font-bold text-black leading-tight">{item.name}</div>
                      <div className="text-[10px] font-mono text-gray-500 mt-1">{item.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diagram Footer */}
            <div className="pt-3 border-t border-gray-300 flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span>Interactive architectural simulation</span>
              <span>100% Deterministic Local State</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}