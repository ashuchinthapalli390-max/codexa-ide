"use client";

import React from "react";
import { Star, ShieldCheck, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  quote: string;
  author: string;
  role: string;
  org: string;
  highlight: string;
}

// V16 Mandatory Compliance: No fabricated reviews.
const REVIEWS: Review[] = [];

export function DeveloperReviewsSection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#000000] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[2px] text-[#9CA3AF] block">
            VERIFIED FEEDBACK
          </span>
          <h2 className="text-3xl sm:text-5xl font-orbitron font-bold text-white tracking-tight">
            Built for Developers. Reviewed by You.
          </h2>
          <p className="text-sm sm:text-base text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed font-sans">
            Be among the first to share your CodeXa experience.
          </p>
        </div>

        {REVIEWS.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white/[0.02] border border-white/10 rounded-2xl max-w-lg mx-auto">
            <MessageSquare className="w-8 h-8 text-white/30 mx-auto mb-3" />
            <h3 className="text-lg font-orbitron font-bold text-white mb-2">
              Be among the first to share your CodeXa experience.
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Verified community reviews will appear here as users submit feedback.
            </p>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-md"
            >
              Write a Review
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#0A0B0E] border border-white/10 rounded-xl p-6 flex flex-col justify-between"
              >
                <p className="text-sm text-neutral-300 mb-4">&ldquo;{rev.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-white text-sm">{rev.author}</div>
                  <div className="text-xs text-neutral-500">{rev.role}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
