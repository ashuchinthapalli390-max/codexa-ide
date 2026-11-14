import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "accent" | "outline" | "subtle";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
  icon,
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-[#18181D] text-white/70 border-white/10",
    accent: "bg-white/10 text-white border-white/20",
    outline: "bg-transparent text-white border-white/20",
    subtle: "bg-white/5 text-white/50 border-white/10",
  }[variant];

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-md border font-medium ${variantStyles} ${sizeStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
