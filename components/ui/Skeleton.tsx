import React from "react";

export function Skeleton({
  className = "",
  variant = "rectangular",
}: {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}) {
  const baseClasses =
    "animate-pulse bg-white/[0.04] border border-white/5 relative overflow-hidden";
  const roundedClasses =
    variant === "circular"
      ? "rounded-full"
      : variant === "text"
      ? "rounded-md h-4"
      : "rounded-xl";

  return (
    <div className={`${baseClasses} ${roundedClasses} ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  );
}

export function PricingCardSkeleton() {
  return (
    <div className="bg-[#0E0F12] border border-white/10 rounded-2xl p-7 flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-16 h-4" />
        </div>
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-full h-16 rounded-xl" />
        <div className="space-y-2 pt-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
          <Skeleton className="w-4/6 h-4" />
        </div>
      </div>
      <Skeleton className="w-full h-10 rounded-xl" />
    </div>
  );
}

