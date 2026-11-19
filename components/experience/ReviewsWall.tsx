"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, CheckCircle2, Loader2, PenLine, Star, X } from "lucide-react";
import { CountUp, Reveal, SectionHeading } from "./primitives";

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

function Stars({ value, size = "h-3.5 w-3.5" }: { value: number; size?: string }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${size} ${i <= value ? "fill-[#FCD34D] text-[#FCD34D]" : "text-white/15"}`} />
      ))}
    </span>
  );
}

export function ReviewsWall({ index = "01" }: { index?: string }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : { reviews: [] }))
      .then((d) => setReviews(d.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const breakdown = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => Math.round(r.rating) === n).length }));

  return (
    <section id="reviews" className="relative bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index={index}
            eyebrow="Community"
            title={
              <>
                What developers say, <span className="text-white/40">unfiltered.</span>
              </>
            }
            lead="Reviews come straight from pre-beta developers. Signed-in reviewers are marked verified."
          />
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-white px-5 text-[14px] font-semibold text-black hover:bg-[#E5E7EB]"
          >
            <PenLine className="h-4 w-4" /> Write a review
          </button>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[320px_1fr]">
          <Reveal className="h-fit rounded-3xl border border-white/[0.09] bg-[#0B0B0D] p-6 lg:sticky lg:top-[calc(var(--nav-offset)+24px)]">
            <p className="text-[clamp(3rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.06em] text-white">
              {total ? <CountUp to={avg} decimals={1} /> : "—"}
            </p>
            <div className="mt-3">
              <Stars value={Math.round(avg)} size="h-4 w-4" />
            </div>
            <p className="mt-2 text-[13px] text-white/45">
              {total} {total === 1 ? "review" : "reviews"}
            </p>
            <div className="mt-6 grid gap-2">
              {breakdown.map((b) => (
                <div key={b.n} className="flex items-center gap-3 text-[12px] text-white/50">
                  <span className="w-3">{b.n}</span>
                  <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.span
                      className="absolute inset-y-0 left-0 rounded-full bg-[#FCD34D]"
                      initial={{ width: 0 }}
                      whileInView={{ width: total ? `${(b.count / total) * 100}%` : "0%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9 }}
                    />
                  </span>
                  <span className="w-6 text-right">{b.count}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-40 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                ))}
              </div>
            ) : total === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] p-10 text-center text-white/55">
                No reviews yet. Be the first to share your experience.
              </div>
            ) : (
              <div className="columns-1 gap-4 sm:columns-2 [&>*]:mb-4">
                {reviews.map((r, i) => (
                  <motion.article
                    key={r.id}
                    initial={{ opacity: 0, y: 40, rotateX: -12 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                    transition={{ duration: 0.6, delay: (i % 4) * 0.05 }}
                    style={{ transformPerspective: 1000 }}
                    className="break-inside-avoid rounded-2xl border border-white/[0.08] bg-[#0B0B0D] p-5 transition-colors hover:border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <Stars value={r.rating} />
                      <span className="font-mono text-[10.5px] text-white/35">
                        {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[15px] font-semibold text-white">{r.title}</h3>
                    <p className="mt-2 font-inter text-[14px] leading-relaxed text-white/60">{r.content}</p>
                    <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-3 text-[12px]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] font-semibold text-white">
                        {r.userName.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-white/80">{r.userName}</span>
                      {r.userRole && <span className="text-white/35">· {r.userRole}</span>}
                      {r.verifiedCustomer && (
                        <span className="ml-auto flex items-center gap-1 text-[#4ADE80]">
                          <BadgeCheck className="h-3.5 w-3.5" /> Verified
                        </span>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ReviewDialog open={open} onClose={() => setOpen(false)} onPosted={(rev) => setReviews((p) => [rev, ...p])} />
    </section>
  );
}

function ReviewDialog({
  open,
  onClose,
  onPosted,
}: {
  open: boolean;
  onClose: () => void;
  onPosted: (r: ReviewItem) => void;
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (open) {
      setState("idle");
      setMsg("");
    }
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: name.trim() || undefined, rating, title: title.trim(), content: content.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not post your review.");
      if (data.review) onPosted(data.review);
      setState("done");
      setMsg(data.message || "Thanks — your review is live.");
      setName("");
      setTitle("");
      setContent("");
      setRating(5);
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Network error.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/70 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Write a review"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0, rotateX: -15 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            style={{ transformPerspective: 1200 }}
            className="relative max-h-[92svh] w-full overflow-y-auto rounded-t-3xl border border-white/[0.12] bg-[#0B0B0D] p-6 sm:max-w-lg sm:rounded-3xl sm:p-8"
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-lg p-2 text-white/50 hover:bg-white/[0.06] hover:text-white">
              <X className="h-4 w-4" />
            </button>
            {state === "done" ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#4ADE80]" />
                <p className="mt-4 text-[15px] text-white/80">{msg}</p>
                <button onClick={onClose} className="mt-6 h-11 w-full rounded-lg bg-white font-semibold text-black">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">Share your experience</h3>
                <div className="mt-5 flex gap-1" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} type="button" onMouseEnter={() => setHover(i)} onClick={() => setRating(i)} aria-label={`${i} stars`}>
                      <Star className={`h-7 w-7 transition ${i <= (hover || rating) ? "fill-[#FCD34D] text-[#FCD34D]" : "text-white/20"}`} />
                    </button>
                  ))}
                </div>
                {[
                  { label: "Your name (optional)", value: name, set: setName, required: false },
                  { label: "Title", value: title, set: setTitle, required: true },
                ].map((f) => (
                  <label key={f.label} className="mt-4 block">
                    <span className="text-[13px] text-white/55">{f.label}</span>
                    <input
                      value={f.value}
                      required={f.required}
                      maxLength={100}
                      onChange={(e) => f.set(e.target.value)}
                      className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/50 px-3.5 text-[14px] text-white focus:border-white/35 focus:outline-none"
                    />
                  </label>
                ))}
                <label className="mt-4 block">
                  <span className="text-[13px] text-white/55">Review</span>
                  <textarea
                    required
                    maxLength={1000}
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 p-3 text-[14px] text-white focus:border-white/35 focus:outline-none"
                  />
                </label>
                <p className="mt-3 text-[12px] text-white/40">Your review is published publicly on this page.</p>
                {state === "error" && <p className="mt-3 text-[13px] text-rose-300">{msg}</p>}
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white text-[15px] font-semibold text-black hover:bg-[#E5E7EB] disabled:opacity-60"
                >
                  {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />} Publish review
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
