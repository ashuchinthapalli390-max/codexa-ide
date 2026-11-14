"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Official OpenAI Logo (Geometric 6-petal spiral bloom)
 */
export function OpenAILogo({ className = "w-8 h-8", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-label="OpenAI Official Logo"
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.6069 1.4997-2.602-1.4997z" />
    </svg>
  );
}

/**
 * Official Anthropic / Claude Logo (Radiant asterism starburst)
 */
export function ClaudeLogo({ className = "w-8 h-8", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-label="Anthropic Claude Official Logo"
    >
      <path d="M13.827 2.219a1.053 1.053 0 0 0-1.654 0L9.742 5.372a.263.263 0 0 1-.295.076L5.59 4.227a1.053 1.053 0 0 0-1.338.972l.068 3.998a.263.263 0 0 1-.137.234L.73 11.233a1.053 1.053 0 0 0 0 1.654l3.453 2.431a.263.263 0 0 1 .137.234l-.068 3.998a1.053 1.053 0 0 0 1.338.972l3.857-1.221a.263.263 0 0 1 .295.076l2.431 3.153a1.053 1.053 0 0 0 1.654 0l2.431-3.153a.263.263 0 0 1 .295-.076l3.857 1.221a1.053 1.053 0 0 0 1.338-.972l-.068-3.998a.263.263 0 0 1 .137-.234l3.453-2.431a1.053 1.053 0 0 0 0-1.654l-3.453-2.431a.263.263 0 0 1-.137-.234l.068-3.998a1.053 1.053 0 0 0-1.338-.972l-3.857 1.221a.263.263 0 0 1-.295-.076L13.827 2.219z" />
    </svg>
  );
}

/**
 * Official Google Gemini 4-Point Star Spark
 */
export function GeminiLogo({ className = "w-8 h-8", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-label="Google Gemini Official Logo"
    >
      <path d="M12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24Z" />
    </svg>
  );
}

/**
 * Official xAI / Grok Logo
 */
export function GrokLogo({ className = "w-8 h-8", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-label="xAI Grok Official Logo"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * Official CodeXa Native Emblem (Transparent background, no white square!)
 */
export function CodeXaNativeLogo({ className = "w-8 h-8", size = 32 }: LogoProps) {
  return (
    <div
      className={`relative rounded-full flex items-center justify-center overflow-hidden border border-white/20 bg-[#0E0F14] shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/assets/brand/codexa-logo.png"
        alt="CodeXa Native AI Logo"
        width={Math.round(size * 0.85)}
        height={Math.round(size * 0.85)}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );
}
