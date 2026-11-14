"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  ChevronRight,
  ChevronDown,
  Play,
  Terminal as TerminalIcon,
  Sparkles,
  Bot,
  ListTodo,
  Bug,
  Split,
  Maximize2,
  RefreshCw,
  GitBranch,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  Settings,
  X,
  Plus,
} from "lucide-react";
import { CodeXaLogo } from "@/components/ui/CodeXaLogo";

export type IDETheme =
  | "obsidian"
  | "pure-black"
  | "midnight-slate"
  | "tokyo-dark"
  | "monokai-pro"
  | "light-studio";

export interface IDEWorkbenchProps {
  initialFile?: string;
  initialMode?: "chat" | "plan" | "agent" | "debug";
  initialTheme?: IDETheme;
  showWindowControls?: boolean;
  className?: string;
  compact?: boolean;
}

interface ProjectFile {
  name: string;
  path: string;
  type: "file";
  fileType: "ts" | "tsx" | "json" | "md";
  content: string;
}

interface ProjectFolder {
  name: string;
  path: string;
  type: "folder";
  children: (ProjectFile | ProjectFolder)[];
}

const FILE_CONTENT_MAP: Record<string, string> = {
  "src/agents/autonomous_agent.ts": `import { ModelGateway, Astra6 } from "@codexa/ai";
import { LocalWorkspace } from "@codexa/core";

export class AutonomousAgent {
  private gateway: ModelGateway;
  private workspace: LocalWorkspace;

  constructor(workspacePath: string) {
    this.workspace = new LocalWorkspace(workspacePath);
    this.gateway = new ModelGateway({
      model: "Astra 6",
      temperature: 0.1,
      agencyVerified: true,
    });
  }

  /**
   * Plans and executes verifiable file modifications
   */
  async executeGoal(goalDescription: string) {
    const context = await this.workspace.indexActiveContext();
    const plan = await this.gateway.decomposeTask(goalDescription, context);
    
    console.log("[CodeXa Agent] Generated " + plan.steps.length + " verification steps");
    
    for (const step of plan.steps) {
      const diff = await this.gateway.synthesizeDiff(step);
      const isVerified = await this.workspace.dryRunLint(diff);
      
      if (isVerified) {
        await this.workspace.applyPatch(diff);
      }
    }
    
    return { success: true, timestamp: Date.now() };
  }
}`,
  "src/agents/planner.ts": `export interface ExecutionStep {
  id: string;
  action: "modify" | "create" | "test";
  targetFile: string;
  confidence: number;
}

export function buildExecutionGraph(spec: string): ExecutionStep[] {
  return [
    { id: "step-1", action: "create", targetFile: "src/components/MetricCard.tsx", confidence: 0.98 },
    { id: "step-2", action: "modify", targetFile: "src/app/page.tsx", confidence: 0.95 },
    { id: "step-3", action: "test", targetFile: "tests/suite.test.ts", confidence: 0.99 },
  ];
}`,
  "src/components/LiveEditor.tsx": `"use client";

import React, { useState } from "react";

export function LiveEditor() {
  const [accent, setAccent] = useState("#D9354D");
  const [headline, setHeadline] = useState("Code without limits");

  return (
    <div className="p-8 rounded-2xl bg-[#0D0E11] border border-[#282A31]">
      <h2 style={{ color: accent }} className="text-3xl font-bold tracking-tight">
        {headline}
      </h2>
      <p className="mt-3 text-neutral-400 text-sm">
        Reactive compile triggered from CodeXa Studio engine.
      </p>
      <div className="mt-6 flex gap-3">
        <button 
          style={{ backgroundColor: accent }} 
          className="px-4 py-2 rounded-lg text-white font-mono text-xs uppercase"
        >
          Active Workspace
        </button>
      </div>
    </div>
  );
}`,
  "src/config.json": `{
  "environment": "CodeXa Studio 1.0 Preview",
  "theme": "codexa-obsidian",
  "telemetry": "disabled",
  "localFirst": true,
  "defaultModel": "Astra 6",
  "agencyEngine": "enabled"
}`,
  "package.json": `{
  "name": "codexa-production-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@codexa/ai": "1.0.0-preview",
    "@codexa/core": "1.0.0-preview",
    "react": "^18.3.1"
  }
}`,
  "README.md": `# CodeXa Studio IDE Project
Powered by CodeXa Agency.

- Local-first architecture
- Multi-model reasoning (Astra 6, Fabel 5.1, Nexa)
- Unified CodeXa Agency account authentication
`,
};

const THEME_CONFIGS: Record<
  IDETheme,
  {
    name: string;
    bgWindow: string;
    bgSidebar: string;
    bgEditor: string;
    bgTerminal: string;
    border: string;
    accent: string;
    text: string;
    textMuted: string;
    tabActiveBg: string;
    tabInactiveBg: string;
    activeLineBg: string;
  }
> = {
  obsidian: {
    name: "CodeXa Obsidian",
    bgWindow: "#15151A",
    bgSidebar: "#1F2024",
    bgEditor: "#17171C",
    bgTerminal: "#18181D",
    border: "rgba(255, 255, 255, 0.1)",
    accent: "#22C55E",
    text: "rgba(255, 255, 255, 0.96)",
    textMuted: "rgba(255, 255, 255, 0.64)",
    tabActiveBg: "rgba(255, 255, 255, 0.1)",
    tabInactiveBg: "transparent",
    activeLineBg: "rgba(255, 255, 255, 0.04)",
  },
  "pure-black": {
    name: "Pure Black (OLED)",
    bgWindow: "#000000",
    bgSidebar: "#050505",
    bgEditor: "#000000",
    bgTerminal: "#030303",
    border: "#1E1E22",
    accent: "#D9354D",
    text: "#FFFFFF",
    textMuted: "#666666",
    tabActiveBg: "#0C0C0D",
    tabInactiveBg: "#000000",
    activeLineBg: "rgba(255, 255, 255, 0.04)",
  },
  "midnight-slate": {
    name: "Midnight Slate",
    bgWindow: "#0B0F17",
    bgSidebar: "#0E131F",
    bgEditor: "#0B0F17",
    bgTerminal: "#080C14",
    border: "#1D2638",
    accent: "#38BDF8",
    text: "#E2E8F0",
    textMuted: "#64748B",
    tabActiveBg: "#141C2B",
    tabInactiveBg: "#0E131F",
    activeLineBg: "rgba(56, 189, 248, 0.05)",
  },
  "tokyo-dark": {
    name: "Tokyo Night Dark",
    bgWindow: "#16161E",
    bgSidebar: "#1A1B26",
    bgEditor: "#16161E",
    bgTerminal: "#13141C",
    border: "#292E42",
    accent: "#BB9AF7",
    text: "#C0CAF5",
    textMuted: "#565F89",
    tabActiveBg: "#1F2335",
    tabInactiveBg: "#16161E",
    activeLineBg: "rgba(187, 154, 247, 0.06)",
  },
  "monokai-pro": {
    name: "Monokai Minimal",
    bgWindow: "#19181A",
    bgSidebar: "#221F22",
    bgEditor: "#19181A",
    bgTerminal: "#141315",
    border: "#2D2A2E",
    accent: "#FFD866",
    text: "#FCFCFA",
    textMuted: "#727072",
    tabActiveBg: "#282528",
    tabInactiveBg: "#1E1B1E",
    activeLineBg: "rgba(255, 216, 102, 0.05)",
  },
  "light-studio": {
    name: "Studio Clean Light",
    bgWindow: "#F8FAFC",
    bgSidebar: "#F1F5F9",
    bgEditor: "#FFFFFF",
    bgTerminal: "#F1F5F9",
    border: "#CBD5E1",
    accent: "#D9354D",
    text: "#0F172A",
    textMuted: "#64748B",
    tabActiveBg: "#FFFFFF",
    tabInactiveBg: "#E2E8F0",
    activeLineBg: "rgba(217, 53, 77, 0.06)",
  },
};

export function IDEWorkbench({
  initialFile = "src/agents/autonomous_agent.ts",
  initialMode = "agent",
  initialTheme = "obsidian",
  showWindowControls = true,
  className = "",
  compact = false,
}: IDEWorkbenchProps) {
  const [theme, setTheme] = useState<IDETheme>(initialTheme);
  const [activeFile, setActiveFile] = useState<string>(initialFile);
  const [openTabs, setOpenTabs] = useState<string[]>([
    "src/agents/autonomous_agent.ts",
    "src/components/LiveEditor.tsx",
    "src/config.json",
  ]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    "src/agents": true,
    "src/components": true,
  });

  const [aiMode, setAiMode] = useState<"chat" | "plan" | "agent" | "debug">(initialMode);
  const [selectedModel, setSelectedModel] = useState("Astra 6");
  const [activeBottomTab, setActiveBottomTab] = useState<"terminal" | "preview" | "git">("terminal");
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "CodeXa Studio IDE v1.0.0-Preview (x64-win32)",
    "Engine: Local-First Hardware Accelerated Workspace",
    "Agency Session: Connected (cxa_session verified)",
    "Type 'help', 'models', 'build', or 'run' for simulated execution.",
    "codexa@workspace:~$ ",
  ]);

  // Preview interactive controls
  const [previewHeadline, setPreviewHeadline] = useState("Code without limits");
  const [previewAccent, setPreviewAccent] = useState("#D9354D");
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isCopied, setIsCopied] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Helper to find file content
  const findFileContent = (path: string): string => {
    return FILE_CONTENT_MAP[path] || "// File loaded into CodeXa Studio editor";
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const openFile = (path: string) => {
    setActiveFile(path);
    if (!openTabs.includes(path)) {
      setOpenTabs((prev) => [...prev, path]);
    }
  };

  const closeTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    const remaining = openTabs.filter((t) => t !== path);
    setOpenTabs(remaining);
    if (activeFile === path && remaining.length > 0) {
      setActiveFile(remaining[remaining.length - 1]);
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const newLogs = [...terminalLogs];
    newLogs[newLogs.length - 1] = `codexa@workspace:~$ ${terminalInput}`;

    if (cmd === "help") {
      newLogs.push("Available showcase commands:");
      newLogs.push("  help             - Show this help summary");
      newLogs.push("  models           - List registered CodeXa AI models");
      newLogs.push("  build            - Simulate zero-latency AST compilation");
      newLogs.push("  run / dev        - Trigger live preview reactive refresh");
      newLogs.push("  git status       - Show active branch & staged changes");
      newLogs.push("  cxa --version    - Print CodeXa engine and kernel build");
      newLogs.push("  clear            - Clear terminal output");
    } else if (cmd === "models") {
      newLogs.push("Active Model Lineup:");
      newLogs.push("  • Astra 6         (Default / General Reasoning)");
      newLogs.push("  • Fabel 5.1       (High-Precision Logic & Architecture)");
      newLogs.push("  • GPT 5.6 SOL     (Synthesizer & Refactoring)");
      newLogs.push("  • GPT 6.1 SOL     (Large Context Cross-Repository Search)");
      newLogs.push("  • OPUS 5.5        (Autonomous Agentic Execution)");
      newLogs.push("  • NEXA            (Edge Embedded Local Inference)");
    } else if (cmd === "build") {
      newLogs.push("[CodeXa Compiler] Parsing 14 project modules...");
      newLogs.push("[CodeXa Compiler] Type validation: 0 errors, 0 warnings");
      newLogs.push("[CodeXa Compiler] Build completed in 84ms (Cached AST).");
    } else if (cmd === "run" || cmd === "dev" || cmd === "npm run dev") {
      newLogs.push("[Live Engine] Hot Module Replacement active on http://localhost:3000");
      newLogs.push("[Live Engine] Preview synchronized with LiveEditor.tsx");
      setActiveBottomTab("preview");
    } else if (cmd === "git status") {
      newLogs.push("On branch main");
      newLogs.push("Your branch is up to date with 'origin/main'.");
      newLogs.push("Changes staged for commit:");
      newLogs.push("  modified: src/agents/autonomous_agent.ts");
      newLogs.push("  modified: src/components/LiveEditor.tsx");
    } else if (cmd === "cxa --version" || cmd === "version") {
      newLogs.push("CodeXa Studio IDE v1.0.0-Preview (Build 20261117-CXA)");
      newLogs.push("Ecosystem: CodeXa Agency Central Network");
    } else if (cmd === "clear") {
      setTerminalLogs(["codexa@workspace:~$ "]);
      setTerminalInput("");
      return;
    } else {
      newLogs.push(`Command not recognized: '${cmd}'. Type 'help' for commands.`);
    }

    newLogs.push("codexa@workspace:~$ ");
    setTerminalLogs(newLogs);
    setTerminalInput("");
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const currentTheme = THEME_CONFIGS[theme];
  const activeContent = findFileContent(activeFile);
  const lines = activeContent.split("\n");

  const copyCode = () => {
    navigator.clipboard.writeText(activeContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-ide-window transition-all duration-300 font-sans select-none flex flex-col w-full max-w-full min-w-0 ${className}`}
      style={{
        backgroundColor: currentTheme.bgWindow,
        borderColor: currentTheme.border,
      }}
    >
      {/* 1. Window Header / Title Bar */}
      <div
        className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b text-xs font-mono select-none w-full max-w-full min-w-0 overflow-hidden"
        style={{
          backgroundColor: currentTheme.bgSidebar,
          borderColor: currentTheme.border,
        }}
      >
        {/* Left: Window controls & Logo */}
        <div className="flex items-center gap-3">
          {showWindowControls && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80 hover:bg-[#FF5F56] transition-colors inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 hover:bg-[#FFBD2E] transition-colors inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]/80 hover:bg-[#27C93F] transition-colors inline-block" />
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
            <CodeXaLogo size="sm" showWordmark={false} href="" />
            <span className="text-[11px] font-bold text-[#F5F5F6] tracking-wider font-orbitron">
              CODEXA STUDIO
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(217,53,77,0.12)] text-[#D9354D] font-mono">
              v1.0 Preview
            </span>
          </div>
        </div>

        {/* Center: Active File Path */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-[#A5A6AE] bg-black/20 px-3 py-1 rounded-md border border-white/5">
          <FileCode className="w-3.5 h-3.5 text-[#D9354D]" />
          <span>{activeFile}</span>
          <span className="text-[10px] text-[#71737D]">&bull; CodeXa Engine</span>
        </div>

        {/* Right: Theme & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Selector */}
          <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-lg border border-white/10">
            <Sliders className="w-3 h-3 text-[#A5A6AE]" />
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as IDETheme)}
              className="bg-transparent text-[10px] font-mono text-[#F5F5F6] focus:outline-none cursor-pointer"
            >
              <option value="obsidian" className="bg-[#0D0E11] text-white">Obsidian Dark</option>
              <option value="pure-black" className="bg-[#000000] text-white">Pure Black OLED</option>
              <option value="midnight-slate" className="bg-[#0E131F] text-white">Midnight Slate</option>
              <option value="tokyo-dark" className="bg-[#1A1B26] text-white">Tokyo Night</option>
              <option value="monokai-pro" className="bg-[#221F22] text-white">Monokai Pro</option>
              <option value="light-studio" className="bg-[#FFFFFF] text-black">Clean Light</option>
            </select>
          </div>

          <button
            onClick={copyCode}
            className="p-1.5 rounded hover:bg-white/10 text-[#A5A6AE] hover:text-white transition-colors"
            title="Copy current file contents"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Main Workbench Body (Explorer + Editor + AI Panel) */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px] md:min-h-[520px] divide-y md:divide-y-0 md:divide-x divide-[#282A31] w-full max-w-full min-w-0 overflow-hidden">
        {/* 2A. Explorer Sidebar (3 cols on MD) */}
        {!compact && (
          <div
            className="md:col-span-3 lg:col-span-2 p-3 flex flex-col text-xs font-mono min-w-0 w-full max-w-full overflow-hidden"
            style={{
              backgroundColor: currentTheme.bgSidebar,
              borderColor: currentTheme.border,
            }}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-[10px] uppercase tracking-wider text-[#71737D]">
              <span className="font-bold flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-[#D9354D]" /> Explorer
              </span>
              <span>Project</span>
            </div>

            {/* Tree Items */}
            <div className="space-y-0.5 overflow-y-auto ide-scroll max-h-[160px] md:max-h-none">
              {/* Folder: src */}
              <div>
                <button
                  onClick={() => toggleFolder("src")}
                  className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left text-[#A5A6AE] hover:text-white hover:bg-white/5 transition-colors"
                >
                  {expandedFolders["src"] ? (
                    <ChevronDown className="w-3 h-3 text-[#71737D]" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-[#71737D]" />
                  )}
                  {expandedFolders["src"] ? (
                    <FolderOpen className="w-3.5 h-3.5 text-[#D9354D]" />
                  ) : (
                    <Folder className="w-3.5 h-3.5 text-[#A5A6AE]" />
                  )}
                  <span>src</span>
                </button>

                {expandedFolders["src"] && (
                  <div className="pl-4 space-y-0.5 border-l border-white/5 ml-2 mt-0.5">
                    {/* Subfolder: agents */}
                    <div>
                      <button
                        onClick={() => toggleFolder("src/agents")}
                        className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left text-[#A5A6AE] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {expandedFolders["src/agents"] ? (
                          <ChevronDown className="w-3 h-3 text-[#71737D]" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-[#71737D]" />
                        )}
                        <Folder className="w-3.5 h-3.5 text-amber-500/80" />
                        <span>agents</span>
                      </button>

                      {expandedFolders["src/agents"] && (
                        <div className="pl-4 space-y-0.5 border-l border-white/5 ml-2 mt-0.5">
                          <button
                            onClick={() => openFile("src/agents/autonomous_agent.ts")}
                            className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-colors ${
                              activeFile === "src/agents/autonomous_agent.ts"
                                ? "bg-[rgba(217,53,77,0.15)] text-[#EB465D] font-semibold"
                                : "text-[#A5A6AE] hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <FileCode className="w-3.5 h-3.5 text-blue-400" />
                            <span className="truncate">autonomous_agent.ts</span>
                          </button>
                          <button
                            onClick={() => openFile("src/agents/planner.ts")}
                            className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-colors ${
                              activeFile === "src/agents/planner.ts"
                                ? "bg-[rgba(217,53,77,0.15)] text-[#EB465D] font-semibold"
                                : "text-[#A5A6AE] hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <FileCode className="w-3.5 h-3.5 text-blue-400" />
                            <span className="truncate">planner.ts</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Subfolder: components */}
                    <div>
                      <button
                        onClick={() => toggleFolder("src/components")}
                        className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left text-[#A5A6AE] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {expandedFolders["src/components"] ? (
                          <ChevronDown className="w-3 h-3 text-[#71737D]" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-[#71737D]" />
                        )}
                        <Folder className="w-3.5 h-3.5 text-emerald-500/80" />
                        <span>components</span>
                      </button>

                      {expandedFolders["src/components"] && (
                        <div className="pl-4 space-y-0.5 border-l border-white/5 ml-2 mt-0.5">
                          <button
                            onClick={() => openFile("src/components/LiveEditor.tsx")}
                            className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-colors ${
                              activeFile === "src/components/LiveEditor.tsx"
                                ? "bg-[rgba(217,53,77,0.15)] text-[#EB465D] font-semibold"
                                : "text-[#A5A6AE] hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="truncate">LiveEditor.tsx</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Root file inside src: config.json */}
                    <button
                      onClick={() => openFile("src/config.json")}
                      className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-colors ${
                        activeFile === "src/config.json"
                          ? "bg-[rgba(217,53,77,0.15)] text-[#EB465D] font-semibold"
                          : "text-[#A5A6AE] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <FileJson className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="truncate">config.json</span>
                    </button>
                  </div>
                )}
              </div>

              {/* package.json */}
              <button
                onClick={() => openFile("package.json")}
                className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-colors ${
                  activeFile === "package.json"
                    ? "bg-[rgba(217,53,77,0.15)] text-[#EB465D] font-semibold"
                    : "text-[#A5A6AE] hover:text-white hover:bg-white/5"
                }`}
              >
                <FileJson className="w-3.5 h-3.5 text-yellow-500" />
                <span className="truncate">package.json</span>
              </button>

              {/* README.md */}
              <button
                onClick={() => openFile("README.md")}
                className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-colors ${
                  activeFile === "README.md"
                    ? "bg-[rgba(217,53,77,0.15)] text-[#EB465D] font-semibold"
                    : "text-[#A5A6AE] hover:text-white hover:bg-white/5"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span className="truncate">README.md</span>
              </button>
            </div>
          </div>
        )}

        {/* 2B. Center Code Editor (6 cols on MD, 7 on LG) */}
        <div
          className={`${
            compact ? "md:col-span-8" : "md:col-span-5 lg:col-span-6"
          } flex flex-col min-w-0 w-full max-w-full overflow-hidden`}
          style={{ backgroundColor: currentTheme.bgEditor }}
        >
          {/* Editor Tabs */}
          <div
            className="flex items-center overflow-x-auto min-w-0 max-w-full border-b text-xs font-mono select-none"
            style={{
              backgroundColor: currentTheme.bgSidebar,
              borderColor: currentTheme.border,
            }}
          >
            {openTabs.map((tabPath) => {
              const fileName = tabPath.split("/").pop() || tabPath;
              const isActive = activeFile === tabPath;
              return (
                <div
                  key={tabPath}
                  onClick={() => setActiveFile(tabPath)}
                  className={`flex items-center gap-2 px-3 py-2 border-r cursor-pointer transition-colors group ${
                    isActive
                      ? "border-t-2 font-medium"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: isActive ? currentTheme.tabActiveBg : currentTheme.tabInactiveBg,
                    borderTopColor: isActive ? currentTheme.accent : "transparent",
                    borderColor: currentTheme.border,
                    color: isActive ? currentTheme.text : currentTheme.textMuted,
                  }}
                >
                  <FileCode className="w-3.5 h-3.5 text-[#D9354D]" />
                  <span className="truncate max-w-[130px]">{fileName}</span>
                  {openTabs.length > 1 && (
                    <button
                      onClick={(e) => closeTab(e, tabPath)}
                      className="p-0.5 rounded hover:bg-white/10 text-white/40 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Code Lines Container */}
          <div className="flex-1 p-3 sm:p-4 font-mono text-[11px] sm:text-xs overflow-y-auto overflow-x-auto ide-scroll max-h-[340px] md:max-h-[380px] leading-relaxed w-full max-w-full">
            {lines.map((line, idx) => (
              <div
                key={idx}
                className="flex items-start group hover:bg-white/[0.02] py-0.5 rounded px-1"
                style={{
                  backgroundColor: idx === 9 ? currentTheme.activeLineBg : "transparent",
                }}
              >
                <span
                  className="w-8 text-right pr-3 select-none text-[10px] shrink-0 font-mono"
                  style={{ color: currentTheme.textMuted }}
                >
                  {idx + 1}
                </span>
                <span className="flex-1 whitespace-pre break-all font-mono" style={{ color: currentTheme.text }}>
                  {line.includes("AutonomousAgent") || line.includes("executeGoal") ? (
                    <span className="token-function">{line}</span>
                  ) : line.includes("import") || line.includes("export") || line.includes("class") || line.includes("async") || line.includes("return") || line.includes("for") || line.includes("const") ? (
                    <span className="token-keyword">{line}</span>
                  ) : line.includes("//") || line.includes("/**") || line.includes("*") ? (
                    <span className="token-comment">{line}</span>
                  ) : line.includes('"') || line.includes("'") ? (
                    <span className="token-string">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2C. Right AI Panel (4 cols on MD / LG) */}
        <div
          className={`${
            compact ? "md:col-span-4" : "md:col-span-4 lg:col-span-4"
          } flex flex-col border-t md:border-t-0 min-w-0 w-full max-w-full overflow-hidden`}
          style={{
            backgroundColor: currentTheme.bgSidebar,
            borderColor: currentTheme.border,
          }}
        >
          {/* AI Panel Header & Mode Switcher */}
          <div
            className="p-3 border-b space-y-2.5"
            style={{ borderColor: currentTheme.border }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D9354D]" />
                <span className="text-xs font-orbitron font-bold tracking-wider text-[#F5F5F6]">
                  CODEXA AI
                </span>
              </div>

              {/* Model Selector */}
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-black/40 border border-white/10 rounded px-2 py-0.5 text-[10px] font-mono text-[#F5F5F6] focus:outline-none cursor-pointer"
              >
                <option value="Astra 6">Astra 6 (Default)</option>
                <option value="Fabel 5.1">Fabel 5.1</option>
                <option value="GPT 5.6 SOL">GPT 5.6 SOL</option>
                <option value="GPT 6.1 SOL">GPT 6.1 SOL</option>
                <option value="OPUS 5.5">OPUS 5.5</option>
                <option value="NEXA">NEXA (Local)</option>
              </select>
            </div>

            {/* AI Modes: CHAT, PLAN, AGENT, DEBUG */}
            <div className="grid grid-cols-4 p-1 bg-black/40 rounded-lg border border-white/5 text-[10px] font-mono uppercase tracking-wider text-center">
              {(["chat", "plan", "agent", "debug"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAiMode(mode)}
                  className={`py-1 rounded font-medium transition-all ${
                    aiMode === mode
                      ? "bg-[#D9354D] text-white shadow-sm font-bold"
                      : "text-[#71737D] hover:text-[#A5A6AE]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* AI Mode Dynamic Content */}
          <div className="flex-1 p-3 overflow-y-auto ide-scroll text-xs font-mono space-y-3 max-h-[300px] md:max-h-[340px]">
            {aiMode === "chat" && (
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#71737D]">
                    <span className="font-bold text-[#A5A6AE]">User Query</span>
                    <span>12:04</span>
                  </div>
                  <p className="text-[#F5F5F6] text-[11px]">
                    "Can you optimize the task graph verification step for high-throughput workspaces?"
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[rgba(217,53,77,0.06)] border border-[#D9354D]/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#EB465D] font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>{selectedModel} &bull; Response</span>
                  </div>
                  <p className="text-[#A5A6AE] text-[11px] leading-relaxed">
                    Indexed 14 workspace files. Added batching to <code className="text-white bg-black/40 px-1 py-0.5 rounded">dryRunLint()</code> to parallelize AST validation across 4 worker threads.
                  </p>
                </div>
              </div>
            )}

            {aiMode === "plan" && (
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-[#71737D] font-bold">
                  Task Execution Decomposition
                </div>
                {[
                  { text: "Analyze local workspace AST for reactive dependencies", status: "done" },
                  { text: "Synthesize batch diff across LiveEditor.tsx", status: "done" },
                  { text: "Verify type safety with strict compiler passes", status: "active" },
                  { text: "Commit changes with cryptographic verification", status: "pending" },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded bg-black/30 border border-white/5 text-[11px]"
                  >
                    {step.status === "done" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : step.status === "active" ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#D9354D] border-t-transparent animate-spin shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        step.status === "done"
                          ? "text-[#A5A6AE] line-through"
                          : step.status === "active"
                          ? "text-[#F5F5F6] font-semibold"
                          : "text-[#71737D]"
                      }
                    >
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {aiMode === "agent" && (
              <div className="space-y-2.5">
                <div className="p-2 rounded bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#EB465D] font-bold">PROPOSED DIFF</span>
                    <span className="text-emerald-400">+12 lines / -3 lines</span>
                  </div>
                  <div className="text-[10px] font-mono leading-tight bg-black/50 p-2 rounded border border-white/5 overflow-x-auto">
                    <div className="text-emerald-400">+ const context = await this.workspace.index();</div>
                    <div className="text-emerald-400">+ const plan = await this.gateway.decomposeTask();</div>
                    <div className="text-red-400">- const sync = await directExecute();</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 rounded bg-[#D9354D] hover:bg-[#EB465D] text-white text-[10px] font-bold uppercase tracking-wider transition-colors">
                    Approve Patch
                  </button>
                  <button className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[#A5A6AE] text-[10px] font-mono uppercase tracking-wider transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            )}

            {aiMode === "debug" && (
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-[rgba(217,53,77,0.1)] border border-[#D9354D]/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#EB465D] font-bold text-[10px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>AST Memory Warning at line 18</span>
                  </div>
                  <p className="text-[11px] text-[#A5A6AE]">
                    Potential memory leak in continuous workspace file index watcher.
                  </p>
                </div>

                <div className="p-2 rounded bg-black/30 border border-white/5 text-[11px] text-neutral-300">
                  <div className="text-[10px] text-emerald-400 font-bold mb-1">
                    AI Auto-Fix Ready:
                  </div>
                  Wrap subscription in <code className="text-white bg-black/40 px-1 py-0.5 rounded">DisposableStore.add()</code>.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Workbench Bar (Terminal / Live Preview / Git status) */}
      <div
        className="border-t flex flex-col text-xs font-mono min-w-0 w-full max-w-full overflow-hidden"
        style={{
          backgroundColor: currentTheme.bgTerminal,
          borderColor: currentTheme.border,
        }}
      >
        {/* Sub-tabs: Terminal vs Preview vs Git */}
        <div
          className="flex items-center justify-between px-3 border-b text-[11px]"
          style={{ borderColor: currentTheme.border }}
        >
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveBottomTab("terminal")}
              className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 font-mono transition-colors ${
                activeBottomTab === "terminal"
                  ? "border-[#D9354D] text-[#F5F5F6] font-bold"
                  : "border-transparent text-[#71737D] hover:text-[#A5A6AE]"
              }`}
            >
              <TerminalIcon className="w-3 h-3" /> Terminal
            </button>
            <button
              onClick={() => setActiveBottomTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 font-mono transition-colors ${
                activeBottomTab === "preview"
                  ? "border-[#D9354D] text-[#F5F5F6] font-bold"
                  : "border-transparent text-[#71737D] hover:text-[#A5A6AE]"
              }`}
            >
              <Eye className="w-3 h-3 text-[#D9354D]" /> Live Preview
            </button>
            <button
              onClick={() => setActiveBottomTab("git")}
              className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 font-mono transition-colors ${
                activeBottomTab === "git"
                  ? "border-[#D9354D] text-[#F5F5F6] font-bold"
                  : "border-transparent text-[#71737D] hover:text-[#A5A6AE]"
              }`}
            >
              <GitBranch className="w-3 h-3" /> Source Control (Git)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[10px] text-[#71737D]">
            <span>UTF-8</span>
            <span>TypeScript 5.6</span>
            <span className="text-emerald-400">&bull; Local Sandbox</span>
          </div>
        </div>

        {/* Dynamic bottom content */}
        {activeBottomTab === "terminal" ? (
          <div className="p-3 h-32 overflow-y-auto ide-scroll font-mono text-[11px] space-y-1">
            {terminalLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.startsWith("codexa@")
                    ? "text-[#F5F5F6]"
                    : log.includes("Error")
                    ? "text-[#EB465D]"
                    : log.includes("Completed") || log.includes("Synchronized")
                    ? "text-emerald-400"
                    : "text-[#A5A6AE]"
                }
              >
                {log}
              </div>
            ))}
            <div ref={terminalEndRef} />

            {/* Terminal Input */}
            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-1">
              <span className="text-[#D9354D] font-bold">&gt;</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type 'run', 'build', 'models', or 'help'..."
                className="flex-1 bg-transparent text-[#F5F5F6] focus:outline-none text-[11px] font-mono placeholder-[#555863]"
              />
            </form>
          </div>
        ) : activeBottomTab === "preview" ? (
          <div className="p-4 space-y-3">
            {/* Viewport & Live Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-[#71737D] uppercase font-bold text-[10px]">Viewport:</span>
                <div className="flex items-center bg-black/40 rounded p-0.5 border border-white/5">
                  <button
                    onClick={() => setPreviewViewport("desktop")}
                    className={`p-1 rounded ${previewViewport === "desktop" ? "bg-white/10 text-white" : "text-[#71737D]"}`}
                    title="Desktop 1440px"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewViewport("tablet")}
                    className={`p-1 rounded ${previewViewport === "tablet" ? "bg-white/10 text-white" : "text-[#71737D]"}`}
                    title="Tablet 768px"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewViewport("mobile")}
                    className={`p-1 rounded ${previewViewport === "mobile" ? "bg-white/10 text-white" : "text-[#71737D]"}`}
                    title="Mobile 375px"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Live Interactive Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#71737D] text-[10px]">Accent:</span>
                  <div className="flex items-center gap-1">
                    {["#D9354D", "#38BDF8", "#BB9AF7", "#22C55E"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setPreviewAccent(color)}
                        className={`w-3.5 h-3.5 rounded-full border ${previewAccent === color ? "border-white scale-110" : "border-transparent"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#71737D] text-[10px]">Title:</span>
                  <input
                    type="text"
                    value={previewHeadline}
                    onChange={(e) => setPreviewHeadline(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded px-2 py-0.5 text-[10px] text-white w-32 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* The Actual Rendered Output Container */}
            <div className="flex justify-center">
              <div
                className={`transition-all duration-300 p-6 rounded-xl border border-white/10 bg-[#08090B] shadow-lg text-center ${
                  previewViewport === "desktop"
                    ? "w-full max-w-xl"
                    : previewViewport === "tablet"
                    ? "w-80"
                    : "w-64"
                }`}
              >
                <div className="text-[10px] font-mono text-[#71737D] uppercase tracking-wider mb-2">
                  Reactive Live Preview &bull; Local Render
                </div>
                <h3
                  className="text-lg sm:text-xl font-orbitron font-extrabold tracking-wide transition-colors"
                  style={{ color: previewAccent }}
                >
                  {previewHeadline}
                </h3>
                <p className="mt-2 text-xs text-[#A5A6AE] leading-relaxed">
                  Real-time visual synthesis compiled from <code className="text-white">LiveEditor.tsx</code>.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    style={{ backgroundColor: previewAccent }}
                    className="px-3.5 py-1.5 rounded-lg text-white font-mono text-xs uppercase font-bold shadow-md active:scale-95 transition-transform"
                  >
                    Launch Build
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-2 font-mono text-xs text-[#A5A6AE]">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <GitBranch className="w-3.5 h-3.5" />
              <span>branch: main &bull; 0 uncommitted merge conflicts</span>
            </div>
            <div className="text-[11px] text-[#71737D]">
              Clean working tree. Changes verified against CodeXa Agency internal remote.
            </div>
          </div>
        )}
      </div>

      {/* 4. IDE Status Bar (Footer) */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-t text-[10px] font-mono select-none"
        style={{
          backgroundColor: currentTheme.bgSidebar,
          borderColor: currentTheme.border,
          color: currentTheme.textMuted,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#F5F5F6]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            CodeXa Kernel: Ready
          </span>
          <span className="hidden sm:inline">Spaces: 2</span>
          <span className="hidden sm:inline">LF</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hover:text-white cursor-pointer" onClick={() => setActiveBottomTab("terminal")}>
            Terminal
          </span>
          <span className="text-[#D9354D] font-bold">CXA-DESK (Verified)</span>
        </div>
      </div>
    </div>
  );
}
