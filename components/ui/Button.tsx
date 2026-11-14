"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "subtle" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      href,
      external = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3.5 py-1.5 text-xs font-sans font-semibold tracking-[-0.04em] gap-1.5 rounded-[8px]",
      md: "px-5 py-2.5 text-sm font-sans font-semibold tracking-[-0.045em] gap-2 rounded-[8px]",
      lg: "px-6 py-3 text-[16px] font-sans font-semibold tracking-[-0.045em] gap-2.5 rounded-[8px]",
    }[size];

    const variantClasses = {
      primary:
        "bg-white hover:bg-[#E5E7EB] text-[#050506] font-semibold border border-white active:scale-[0.98] shadow-sm transition-colors",
      secondary:
        "bg-[rgba(255,255,255,0.043)] hover:bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.2)] active:scale-[0.98] transition-colors",
      subtle:
        "bg-[rgba(34,197,94,0.1)] hover:bg-[rgba(34,197,94,0.2)] text-[#22C55E] border border-[rgba(34,197,94,0.2)] active:scale-[0.98] transition-colors",
      ghost:
        "bg-transparent hover:bg-white/[0.05] text-[#CBD5E1] hover:text-white border border-transparent transition-colors",
      outline:
        "bg-transparent hover:bg-white/[0.05] text-white border border-[rgba(255,255,255,0.2)] active:scale-[0.98] transition-colors",
    }[variant];

    const baseClasses =
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:pointer-events-none select-none";

    const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

    const content = (
      <>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-1 text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </>
    );

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClasses}
          >
            {content}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClasses}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

