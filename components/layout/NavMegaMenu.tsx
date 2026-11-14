"use client";

import React from "react";
import Link from "next/link";
import { MegaMenuConfig, NavSubItem } from "@/lib/navigation";
import {
  Code2,
  Zap,
  Layers,
  Laptop,
  Terminal,
  Boxes,
  Key,
  Cpu,
  BookOpen,
  FileCode,
  Sparkles,
  ShieldCheck,
  Globe,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface NavMegaMenuProps {
  config: MegaMenuConfig;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Zap,
  Layers,
  Laptop,
  Terminal,
  Boxes,
  Key,
  Cpu,
  BookOpen,
  FileCode,
  Sparkles,
  ShieldCheck,
  Globe,
};

export function NavMegaMenu({
  config,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: NavMegaMenuProps) {
  const renderIcon = (name: string) => {
    const IconComponent = ICON_MAP[name] || Sparkles;
    return <IconComponent className="w-5 h-5 text-white" />;
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed left-0 right-0 top-[102px] sm:top-[106px] z-[1000] w-full overflow-hidden border-b border-white/15 bg-[#0B0C0E] shadow-[0_40px_100px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-top-1 duration-150 select-none"
    >
      {/* Invisible hover bridge to prevent premature closing */}
      <div className="absolute -top-3 left-0 w-full h-3" />

      <div className="mx-auto max-w-[1360px] grid w-full min-h-[300px] grid-cols-1 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">
        {/* Left Featured Card (NexCloud matched layout, 100% solid dark surface) */}
        <div className="relative border-r border-white/10 py-8 pl-6 pr-8 lg:py-10 lg:pl-8 lg:pr-10 flex flex-col justify-between bg-[#0E0F13]">
          <div className="relative z-10 w-full max-w-[300px]">
            {config.featured.badge && (
              <span className="inline-block px-2.5 py-0.5 rounded bg-white/10 text-white/80 text-[10px] font-sans font-bold uppercase tracking-wider mb-4 border border-white/10">
                {config.featured.badge}
              </span>
            )}

            <h3 className="text-[20px] font-bold text-white tracking-tight leading-snug font-orbitron">
              {config.featured.title}
            </h3>

            <p className="mt-3 text-[13.5px] leading-relaxed text-white/70 font-sans">
              {config.featured.desc}
            </p>
          </div>

          <div className="mt-6">
            <Link
              href={config.featured.href}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:text-emerald-400 transition-colors group"
            >
              <span>{config.featured.ctaLabel}</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Right Categories Grid (100% solid dark surfaces to prevent bleed-through) */}
        <div className="flex flex-col justify-center w-full p-6 lg:p-8 bg-[#0B0C0E]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {config.categories.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 font-mono">
                  {cat.title}
                </div>

                <div className="space-y-2">
                  {cat.items.map((sub, sIdx) => {
                    const isExt = sub.isExternal;
                    const Component = isExt ? "a" : Link;
                    const extraProps = isExt
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : { onClick: onClose };

                    return (
                      <Component
                        key={sIdx}
                        href={sub.href}
                        {...(extraProps as any)}
                        className="group flex items-start gap-3.5 rounded-xl p-3 transition-all border border-white/5 bg-[#121316] hover:border-white/20 hover:bg-[#16171C]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] border border-white/10 bg-white/5 text-white group-hover:bg-white/10 group-hover:border-white/20 transition-colors mt-0.5">
                          {renderIcon(sub.iconName)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              {sub.title}
                            </span>
                            {isExt && <ExternalLink className="w-3 h-3 text-white/40 shrink-0" />}
                          </div>
                          <p className="mt-0.5 text-[12px] text-white/60 line-clamp-2 leading-relaxed font-sans">
                            {sub.desc}
                          </p>
                        </div>
                      </Component>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
