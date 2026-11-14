"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface CodeXaLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  subtitle?: string;
  className?: string;
  href?: string;
}

export function CodeXaLogo({
  size = "md",
  showWordmark = true,
  subtitle = "STUDIO IDE",
  className = "",
  href = "/",
}: CodeXaLogoProps) {
  const [imgError, setImgError] = useState(false);

  const dimensionMap = {
    sm: { box: 28, img: 24, text: "text-sm", sub: "text-[9px]" },
    md: { box: 36, img: 30, text: "text-base", sub: "text-[10px]" },
    lg: { box: 48, img: 42, text: "text-xl", sub: "text-[11px]" },
    xl: { box: 72, img: 64, text: "text-2xl", sub: "text-xs" },
  };

  const dims = dimensionMap[size];

  const content = (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Official Emblem Container */}
      <div
        className="relative rounded-full flex items-center justify-center overflow-hidden border border-[#282A31] bg-[#0D0E11] transition-all duration-300 group-hover:border-[#D9354D]/60 shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        style={{ width: dims.box, height: dims.box }}
      >
        {!imgError ? (
          <Image
            src="/assets/brand/codexa-logo.png"
            alt="CodeXa Studio IDE Logo"
            width={dims.img}
            height={dims.img}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            priority
          />
        ) : (
          /* High-Fidelity SVG Brand Emblem with Stylized Geometric CX Vector */
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 h-4/5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="48" stroke="#D9354D" strokeWidth="2.5" strokeOpacity="0.4" />
            {/* Hexagonal facet */}
            <path
              d="M50 16L78 32V68L50 84L22 68V32L50 16Z"
              stroke="#D9354D"
              strokeWidth="2.5"
              fill="rgba(217, 53, 77, 0.08)"
            />
            {/* Geometric CX Monogram */}
            <path
              d="M38 36L48 50L38 64M48 50L62 36M48 50L62 64"
              stroke="#F5F5F6"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="50" r="3" fill="#D9354D" />
          </svg>
        )}

        {/* Ambient subtle rim reflection */}
        <div className="absolute inset-0 pointer-events-none rounded-full ring-1 ring-inset ring-white/10" />
      </div>

      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-orbitron font-extrabold tracking-wider text-[#F5F5F6] ${dims.text} transition-colors group-hover:text-white`}
            >
              CODEXA
            </span>
          </div>
          {subtitle && (
            <span
              className={`hidden sm:inline-block font-mono font-medium tracking-[0.2em] text-[#A5A6AE] uppercase ${dims.sub} group-hover:text-[#D9354D] transition-colors`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D9354D] rounded-md">
        {content}
      </Link>
    );
  }

  return content;
}
