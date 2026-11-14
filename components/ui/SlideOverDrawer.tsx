"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}

export function SlideOverDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "sm:w-[460px]",
}: SlideOverDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex justify-end">
      {/* Restrained subtle dim overlay (NO heavy blackout, NO excessive blur) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div
        className={`relative z-10 w-full ${width} h-full bg-[#111217] text-white border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col animate-in slide-in-from-right duration-300`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-start justify-between gap-4 shrink-0 bg-[#0E0F14]">
          <div>
            <h2 id="drawer-title" className="text-lg font-orbitron font-bold text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-white/60 font-sans mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 ide-scroll">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
