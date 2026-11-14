"use client";

import React, { useState, useEffect } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

const PHRASES = [
  "Powered by intelligence.",
  "Designed for flow.",
  "Build beyond limits.",
  "Create with confidence.",
  "One workspace. More possibilities.",
];

export function KineticHeadline() {
  const [index, setIndex] = useState(0);
  const [animState, setAnimState] = useState<"entering" | "idle" | "exiting">("idle");
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const timer = setInterval(() => {
      // Trigger exit
      setAnimState("exiting");

      setTimeout(() => {
        // Change phrase and trigger enter
        setIndex((prev) => (prev + 1) % PHRASES.length);
        setAnimState("entering");

        setTimeout(() => {
          setAnimState("idle");
        }, 400);
      }, 350);
    }, 3400);

    return () => clearInterval(timer);
  }, [isReduced]);

  const currentPhrase = PHRASES[index];
  const words = currentPhrase.split(" ");

  return (
    <div className="text-center max-w-4xl mx-auto space-y-4 select-none">
      <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-inter font-medium tracking-[-0.04em] text-white leading-[1.08]">
        {/* Stable Primary Headline */}
        <span className="block text-white">Code without limits.</span>

        {/* Dynamic Secondary Kinetic Phrase Container with Fixed Optical Height */}
        <span className="block h-[1.3em] relative mt-1 sm:mt-2 overflow-hidden flex items-center justify-center">
          <span
            className={`inline-flex items-center justify-center gap-x-[0.28em] transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              animState === "exiting"
                ? "-translate-y-4 opacity-0 blur-[4px] scale-[0.98]"
                : animState === "entering"
                ? "translate-y-4 opacity-0 blur-[3px] scale-[1.02]"
                : "translate-y-0 opacity-100 blur-0 scale-100"
            }`}
          >
            {words.map((word, wIdx) => (
              <span
                key={`${word}-${wIdx}`}
                className="inline-block bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-medium"
                style={{
                  transitionDelay: animState === "idle" ? `${wIdx * 30}ms` : "0ms",
                }}
              >
                {word}
              </span>
            ))}
          </span>
        </span>
      </h1>
    </div>
  );
}

