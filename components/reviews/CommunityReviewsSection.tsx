"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, ShieldCheck, PenLine, X, Loader2, MessageSquare, CheckCircle2 } from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";
import { SlideOverDrawer } from "@/components/ui/SlideOverDrawer";

interface ReviewItem {
  id: string;
  userName: string;
  userRole?: string;
  rating: number;
  title: string;
  content: string;
  verifiedCustomer: boolean;
  createdAt: string;
}

export function CommunityReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [consentPublish, setConsentPublish] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // GSAP Entrance
  useEffect(() => {
    if (isReduced || isLoading) return;

    const { gsap } = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, isReduced]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContent.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formName.trim() || "Developer",
          userRole: formRole.trim() || "Software Engineer",
          rating: formRating,
          title: formTitle.trim() || "CodeXa Studio Experience",
          content: formContent.trim(),
          verifiedCustomer: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.review) {
          setReviews((prev) => [data.review, ...prev]);
        }
        setSubmitSuccess(true);
        setTimeout(() => {
          setDrawerOpen(false);
          setSubmitSuccess(false);
          setFormName("");
          setFormRole("");
          setFormTitle("");
          setFormContent("");
          setFormRating(5);
        }, 1800);
      }
    } catch {
      // Network error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Split reviews into two distinct rows for opposite-direction marquee
  const mid = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, mid);
  const row2 = reviews.slice(mid);

  // Pad rows with copies for seamless marquee looping
  const marqueeRow1 = [...row1, ...row1, ...row1, ...row1];
  const marqueeRow2 = [...row2, ...row2, ...row2, ...row2];

  const renderReviewCard = (rev: ReviewItem, keyPrefix: string, idx: number) => (
    <div
      key={`${keyPrefix}-${rev.id}-${idx}`}
      className="w-[320px] sm:w-[380px] shrink-0 bg-[#E4E5EA] border border-black/[0.08] hover:border-black/25 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] group cursor-default"
    >
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= rev.rating
                    ? "fill-amber-500 text-amber-500"
                    : "text-neutral-300"
                }`}
              />
            ))}
          </div>
          {rev.verifiedCustomer && (
            <span className="inline-flex items-center gap-1 text-[9.5px] font-mono text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-600/20 font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              Verified Developer
            </span>
          )}
        </div>

        <h4 className="text-sm font-bold font-sans text-[#0A0B0E] mb-1.5 leading-snug">
          {rev.title}
        </h4>

        <p className="text-xs text-[#333540] font-sans leading-relaxed line-clamp-3">
          &ldquo;{rev.content}&rdquo;
        </p>
      </div>

      <div className="pt-4 mt-3 border-t border-black/[0.08] flex items-center justify-between text-xs font-sans">
        <div>
          <span className="font-bold text-[#0A0B0E] block">{rev.userName}</span>
          <span className="text-[10.5px] text-[#555866]">{rev.userRole || "Software Engineer"}</span>
        </div>
        <div className="text-[10px] font-mono text-[#666A78]">
          {new Date(rev.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="py-24 sm:py-32 bg-[#D0D3DA] text-[#0A0B0E] border-t border-black/10 relative overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        {/* Header (NexCloud light-gray palette match) */}
        <div ref={headerRef} className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#555866] mb-3 block font-sans">
            COMMUNITY FEEDBACK
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0A0B0E] font-orbitron">
            Built for Developers. Reviewed by You.
          </h2>
          <p className="text-[14px] text-[#333540] max-w-xl mx-auto leading-relaxed mt-3 font-sans">
            Share your experience with CodeXa Studio IDE and help shape its future.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A0B0E] text-white font-sans font-semibold text-xs hover:bg-[#1A1C24] transition-all shadow-md active:scale-95"
            >
              <PenLine className="w-3.5 h-3.5 text-white" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two-Row Moving Marquee or Empty State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-black/40 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 px-6 bg-[#E4E5EA] border border-black/10 rounded-2xl max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-4 border border-black/10">
            <MessageSquare className="w-6 h-6 text-black/50" />
          </div>
          <h3 className="text-xl font-orbitron font-bold text-[#0A0B0E] mb-2 tracking-tight">
            Built for Developers. Reviewed by You.
          </h3>
          <p className="text-sm text-[#555866] max-w-sm mx-auto mb-6 leading-relaxed">
            Be among the first to share your CodeXa experience.
          </p>
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A0B0E] text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-md active:scale-95"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5 overflow-hidden">
          {/* Row 1: MOVES RIGHT TO LEFT */}
          <div className="flex gap-5 w-max animate-marquee-left">
            {marqueeRow1.map((rev, idx) => renderReviewCard(rev, "r1", idx))}
          </div>

          {/* Row 2: MOVES LEFT TO RIGHT */}
          <div className="flex gap-5 w-max animate-marquee-right">
            {(marqueeRow2.length > 0 ? marqueeRow2 : marqueeRow1).map((rev, idx) =>
              renderReviewCard(rev, "r2", idx)
            )}
          </div>
        </div>
      )}

      {/* Write a Review Slide-Over Drawer */}
      <SlideOverDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Write a Developer Review"
        subtitle="Share your feedback on CodeXa Studio IDE AST indexing, workflows, and multi-model routing."
      >
        {submitSuccess ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-orbitron font-bold text-white">Review Submitted</h3>
            <p className="text-xs text-white/60">
              Thank you! Your verified feedback has been received and added to the community marquee.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Star Rating Select */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Overall Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFormRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= (hoverRating || formRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-600"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono text-white/60 ml-2">
                  {formRating} of 5 stars
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Review Headline
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AST indexing saves hours on monorepos"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0D] border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Your Detailed Experience
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your workflow with CodeXa Studio IDE, local-first performance, AST indexing, or multi-model features..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0D] border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors leading-relaxed"
              />
            </div>

            {/* Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                  Your Name / Handle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex M."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0D] border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                  Engineering Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Architect"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0D] border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="consent"
                checked={consentPublish}
                onChange={(e) => setConsentPublish(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-[#090A0D] text-white focus:ring-0"
              />
              <label htmlFor="consent" className="text-[11px] text-white/60 leading-tight select-none">
                I agree to publish this review on the official CodeXa Studio IDE community marquee.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !consentPublish}
              className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <span>Submit Verified Review</span>
              )}
            </button>
          </form>
        )}
      </SlideOverDrawer>
    </section>
  );
}
