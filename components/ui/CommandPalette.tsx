"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  Download,
  Terminal,
  Cpu,
  Sparkles,
  FileCode,
  Sliders,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  X,
  ArrowRight,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Action" | "Theme";
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenAuth }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const commands: CommandItem[] = [
    {
      id: "workspace",
      title: "Interactive Workspace",
      category: "Navigation",
      subtitle: "Open simulated IDE workbench with terminal & AI",
      icon: <Terminal className="w-4 h-4 text-[#D9354D]" />,
      action: () => {
        router.push("/workspace");
        onClose();
      },
    },
    {
      id: "download",
      title: "Download Center",
      category: "Navigation",
      subtitle: "Windows Preview, Android APK & release checksums",
      icon: <Download className="w-4 h-4 text-[#D9354D]" />,
      action: () => {
        router.push("/download");
        onClose();
      },
    },
    {
      id: "ai-models",
      title: "Multi-Model AI Suite",
      category: "Navigation",
      subtitle: "Inspect Astra 6, Fabel 5.1, and local NEXA profiles",
      icon: <Sparkles className="w-4 h-4 text-[#EB465D]" />,
      action: () => {
        router.push("/ai");
        onClose();
      },
    },
    {
      id: "features",
      title: "Architecture & Capabilities",
      category: "Navigation",
      subtitle: "AST caching, MCP tool integration, PTY multiplexing",
      icon: <Cpu className="w-4 h-4 text-blue-400" />,
      action: () => {
        router.push("/features");
        onClose();
      },
    },
    {
      id: "docs",
      title: "Documentation & Shortcuts",
      category: "Navigation",
      subtitle: "Keyboard shortcuts, quickstart, and configuration",
      icon: <FileCode className="w-4 h-4 text-emerald-400" />,
      action: () => {
        router.push("/docs");
        onClose();
      },
    },
    {
      id: "releases",
      title: "Release Notes & Changelog",
      category: "Navigation",
      subtitle: "Version history and upcoming notarization dates",
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
      action: () => {
        router.push("/releases");
        onClose();
      },
    },
    {
      id: "auth",
      title: "Sign In / Device Key Activation",
      category: "Action",
      subtitle: "Validate CodeXa Agency account & CXA-DESK license",
      icon: <Command className="w-4 h-4 text-[#D9354D]" />,
      action: () => {
        onClose();
        onOpenAuth?.();
      },
    },
    {
      id: "copy-sha",
      title: "Copy Windows SHA-256 Checksum",
      category: "Action",
      subtitle: "9a75d5f2a1b9c8d3e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8",
      icon: copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#A5A6AE]" />,
      action: () => {
        navigator.clipboard.writeText("9a75d5f2a1b9c8d3e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
    {
      id: "agency",
      title: "CodeXa Agency Portal",
      category: "Action",
      subtitle: "codxa-agency.online (Opens in new tab)",
      icon: <ExternalLink className="w-4 h-4 text-[#A5A6AE]" />,
      action: () => {
        window.open("https://codxa-agency.online", "_blank");
        onClose();
      },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(query.toLowerCase())) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled externally or trigger custom event
        }
      }
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIdx]) {
          filtered[selectedIdx].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIdx, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl bg-[#0D0E11] border border-[#282A31] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden z-10"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#282A31] bg-[#0A0B0E]">
              <Search className="w-4 h-4 text-[#71737D] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, page, or action..."
                autoFocus
                className="flex-1 bg-transparent text-sm text-[#F5F5F6] placeholder-[#555863] focus:outline-none font-mono"
              />
              <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#13151A] border border-[#282A31] text-[10px] font-mono text-[#71737D]">
                ESC
              </kbd>
            </div>

            {/* Command List */}
            <div className="max-h-80 overflow-y-auto ide-scroll p-2 space-y-1 font-mono text-xs">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-[#71737D] text-xs">
                  No matching commands found for "{query}".
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = selectedIdx === idx;
                  return (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[rgba(217,53,77,0.12)] border border-[#D9354D]/30 text-white"
                          : "text-[#A5A6AE] hover:bg-white/[0.02] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="shrink-0">{item.icon}</span>
                        <div className="min-w-0">
                          <div className="font-semibold truncate text-[#F5F5F6]">
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div className="text-[10px] text-[#71737D] truncate mt-0.5">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40 text-[#71737D] border border-white/5">
                          {item.category}
                        </span>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[#EB465D]" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-[#1F2127] bg-[#0A0B0E] text-[10px] font-mono text-[#71737D]">
              <div className="flex items-center gap-3">
                <span>Navigate: <kbd className="text-[#A5A6AE]">↑</kbd> <kbd className="text-[#A5A6AE]">↓</kbd></span>
                <span>Select: <kbd className="text-[#A5A6AE]">↵</kbd></span>
              </div>
              <div>
                <span>CodeXa Studio IDE &bull; Powered by CodeXa Agency</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

