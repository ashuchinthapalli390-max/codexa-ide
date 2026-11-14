"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export function CinematicLoader() {
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(false);
      return;
    }

    // Check session storage to only run on the first visit per session
    try {
      const hasSeenIntro = sessionStorage.getItem("codexa_intro_shown_v7");
      if (hasSeenIntro) {
        setIsVisible(false);
        return;
      }
    } catch {
      // Fallback for storage restrictions
    }

    setShouldAnimate(true);

    // Sequence timing (target ~750ms total)
    const t1 = setTimeout(() => setStep(1), 100); // Reveal emblem
    const t2 = setTimeout(() => setStep(2), 350); // Animate luminous line
    const t3 = setTimeout(() => setStep(3), 550); // Reveal letterspaced title
    const t4 = setTimeout(() => {
      setStep(4); // Exit wipe
      try {
        sessionStorage.setItem("codexa_intro_shown_v7", "true");
      } catch {}
    }, 780);

    const t5 = setTimeout(() => {
      setIsVisible(false);
    }, 1050);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (!isVisible || !shouldAnimate) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#000000] flex flex-col items-center justify-center transition-all duration-300 pointer-events-none select-none ${
        step === 4 ? "opacity-0 scale-[1.02] filter blur-[2px]" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center relative">
        {/* Emblem Mask Reveal */}
        <div
          className={`relative transition-all duration-500 transform ${
            step >= 1
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-95"
          }`}
        >
          <div className="w-14 h-14 relative flex items-center justify-center">
            <Image
              src="/codexa-logo.png"
              alt="CodeXa Emblem"
              width={56}
              height={56}
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Thin Luminous Line */}
        <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden my-3">
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-500 ease-out ${
              step >= 2 ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
          />
        </div>

        {/* "CodeXa Studio IDE" with subtle letter-spacing animation */}
        <div
          className={`transition-all duration-500 tracking-[0.2em] uppercase font-orbitron text-[11px] font-bold text-white/90 text-center ${
            step >= 3
              ? "opacity-100 tracking-[0.22em] translate-y-0"
              : "opacity-0 tracking-[0.08em] translate-y-1"
          }`}
        >
          CodeXa Studio IDE
        </div>

        {/* Minimal Sub-tag */}
        <div
          className={`mt-1 transition-opacity duration-300 text-[9px] font-mono tracking-widest uppercase text-white/40 ${
            step >= 3 ? "opacity-100" : "opacity-0"
          }`}
        >
          Powered by CodeXa Agency
        </div>
      </div>
    </div>
  );
}

