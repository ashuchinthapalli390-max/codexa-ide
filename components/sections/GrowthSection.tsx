"use client";

import React, { useState, useRef, useEffect } from "react";
import { Zap, Cpu, Key, Laptop } from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

export function GrowthSection() {
  const [activeStat, setActiveStat] = useState<number>(3);
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [stat1Val, setStat1Val] = useState("0");
  const [stat4Val, setStat4Val] = useState("0");
  const isReduced = useReducedMotion();

  const capabilities = [
    {
      value: `${stat1Val}+`,
      label: "Frontier Models",
      desc: "Gemini, Astra, Fabel, GPT & Ollama",
      icon: <Cpu className="w-5 h-5 text-black" />,
      height: "h-24 sm:h-28",
    },
    {
      value: "Local",
      label: "In-Memory AST",
      desc: "Fast syntax graphs cached on-device",
      icon: <Zap className="w-5 h-5 text-black" />,
      height: "h-32 sm:h-36",
    },
    {
      value: "BYOK",
      label: "Private Keychain",
      desc: "Direct provider keys stored locally",
      icon: <Key className="w-5 h-5 text-black" />,
      height: "h-40 sm:h-44",
    },
    {
      value: stat4Val,
      label: "Target Platforms",
      desc: "Windows, macOS, Linux & Android",
      icon: <Laptop className="w-5 h-5 text-black" />,
      height: "h-48 sm:h-52",
    },
  ];

  useEffect(() => {
    if (isReduced) {
      setStat1Val("7");
      setStat4Val("4");
      return;
    }

    const { gsap, ScrollTrigger } = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Left column text entrance
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Stepped Cards Entrance
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 82%",
              once: true,
              onEnter: () => {
                // Count-up numbers
                const countObj = { n1: 0, n4: 0 };
                gsap.to(countObj, {
                  n1: 7,
                  n4: 4,
                  duration: 1.4,
                  ease: "power2.out",
                  onUpdate: () => {
                    setStat1Val(Math.round(countObj.n1).toString());
                    setStat4Val(Math.round(countObj.n4).toString());
                  },
                });
              },
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
      className="growth-section bg-gray-300 relative overflow-hidden text-left border-t border-gray-300/80 py-24 sm:py-32 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Heading & Authentic Engineering Statement */}
          <div ref={leftColRef} className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 block font-sans">
              ENGINEERING ARCHITECTURE
            </span>
            <h2 className="font-orbitron text-[32px] sm:text-[40px] lg:text-[46px] font-bold tracking-tight text-[#1A1A1A] leading-[1.1]">
              Built for Engineers.
              <span className="block text-gray-500 font-medium">Designed for Flow_</span>
            </h2>

            <blockquote className="mt-7 pl-4 border-l-2 border-gray-400 text-gray-700">
              <p className="text-[15px] font-medium leading-relaxed m-0 font-sans">
                “CodeXa Studio IDE unifies syntax reasoning, multi-model intelligence, and deterministic diff synthesis — prioritizing developer control and local-first execution.”
              </p>
              <cite className="block mt-3 text-[14px] font-semibold text-[#1A1A1A] not-italic font-sans">
                Engineering Directorate, CodeXa Agency
              </cite>
            </blockquote>
          </div>

          {/* Right Column: Stepped Geometric Growth Cards */}
          <div className="lg:col-span-7">
            <div ref={cardsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
              {capabilities.map((s, idx) => {
                const isActive = activeStat >= idx;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveStat(idx)}
                    className={`bg-gray-200 border border-gray-300 rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-md ${
                      isActive
                        ? "border-gray-400 bg-gray-100/90 shadow-md transform -translate-y-1"
                        : "opacity-80"
                    }`}
                  >
                    <div className="mb-4 w-9 h-9 rounded-lg bg-black/10 flex items-center justify-center">
                      {s.icon}
                    </div>

                    <div>
                      <div className="font-orbitron text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                        {s.value}
                      </div>
                      <div className="mt-1 text-xs font-bold text-gray-800 font-sans">
                        {s.label}
                      </div>
                      <div className="mt-1 text-[11px] text-gray-500 font-sans leading-tight">
                        {s.desc}
                      </div>
                    </div>

                    {/* Stepped progress bar footer */}
                    <div className="mt-5 w-full bg-gray-300/80 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-black transition-all duration-500 ${
                          isActive ? "w-full" : "w-1/3"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
