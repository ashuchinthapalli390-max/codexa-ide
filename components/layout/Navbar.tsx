"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Menu, User, X } from "lucide-react";
import { CodeXaLogo } from "@/components/ui/CodeXaLogo";
import { AgencyAuthModal } from "@/components/auth/AgencyAuthModal";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { useAuth } from "@/lib/auth/AuthContext";
import { getRoleBadgeLabel } from "@/lib/auth/roles";
import { ANNOUNCEMENT_DATA } from "@/lib/navigation";

export const PRIMARY_LINKS = [
  { label: "Product", href: "/features" },
  { label: "AI", href: "/ai" },
  { label: "Models", href: "/models" },
  { label: "Pricing", href: "/pricing" },
  { label: "Compare", href: "/compare" },
  { label: "Platforms", href: "/platforms" },
  { label: "Docs", href: "/docs" },
];

const MORE_LINKS = [
  { label: "Workspace demo", href: "/workspace" },
  { label: "Integrations", href: "/integrations" },
  { label: "Download", href: "/download" },
  { label: "Releases", href: "/releases" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const pathname = usePathname() ?? "/";
  const { user, userProfile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(ANNOUNCEMENT_DATA.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: ignore */
    }
  };

  const displayName = userProfile?.displayName || user?.displayName || "CodeXa Developer";

  return (
    <>
      <header
        className={`sticky top-0 z-[1001] w-full border-b transition-[background,border-color] duration-300 ${
          scrolled || open ? "border-white/[0.09] bg-black/80 backdrop-blur-2xl" : "border-transparent bg-black/40 backdrop-blur-md"
        }`}
      >
        {/* Announcement strip (≥ sm) */}
        <div className="hidden h-9 items-center justify-center gap-3 border-b border-white/[0.06] px-4 text-[12px] text-white/60 sm:flex">
          <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#4ADE80]">
            Pre-beta
          </span>
          <span>{ANNOUNCEMENT_DATA.discountPercent}% off your first month on every plan</span>
          <button
            onClick={copyCoupon}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-0.5 font-mono text-[11px] text-white transition hover:border-white/30"
            aria-label={`Copy coupon ${ANNOUNCEMENT_DATA.couponCode}`}
          >
            {ANNOUNCEMENT_DATA.couponCode}
            {copied ? <Check className="h-3 w-3 text-[#4ADE80]" /> : <Copy className="h-3 w-3 text-white/50" />}
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-codexa-offer"))}
            className="text-white/80 underline-offset-4 hover:text-white hover:underline"
          >
            Claim offer
          </button>
        </div>

        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <CodeXaLogo size="sm" subtitle="STUDIO IDE" href="/" />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {PRIMARY_LINKS.map((l) => {
              const on = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                    on ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg border border-white/10 bg-white/[0.06]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              {user ? (
                <AccountMenu
                  user={{ name: displayName, email: user.email || undefined, photoURL: user.photoURL || undefined }}
                  profile={userProfile}
                  onSignOut={signOut}
                />
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <User className="h-3.5 w-3.5" /> Sign in
                </button>
              )}
            </div>
            <Link
              href="/pricing"
              className="hidden h-9 items-center gap-2 rounded-lg bg-white px-4 text-[13.5px] font-semibold tracking-[-0.02em] text-black transition hover:bg-[#E5E7EB] sm:inline-flex"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22C55E]" />
              Get early access
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={open ? "x" : "m"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-x-0 bottom-0 top-[var(--nav-offset)] z-[1000] overflow-y-auto bg-black lg:hidden"
          >
            <div aria-hidden className="absolute inset-0 bg-subtle-grid opacity-20" />
            <div className="relative flex min-h-full flex-col px-5 pb-10 pt-6">
              <nav aria-label="Mobile" className="flex flex-col">
                {PRIMARY_LINKS.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.04, duration: 0.4 }}
                  >
                    <Link
                      href={l.href}
                      className={`flex items-center justify-between border-b border-white/[0.07] py-4 text-[28px] font-semibold tracking-[-0.04em] ${
                        isActive(pathname, l.href) ? "text-white" : "text-white/60"
                      }`}
                    >
                      {l.label}
                      <ArrowUpRight className="h-5 w-5 text-white/30" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-6 grid grid-cols-2 gap-2">
                {MORE_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[14px] text-white/75">
                    {l.label}
                  </Link>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-auto space-y-3 pt-8">
                {user ? (
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[13px]">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{displayName}</p>
                      <p className="font-mono text-[10px] uppercase text-[#4ADE80]">{getRoleBadgeLabel(userProfile?.role || "customer")}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link href="/account" className="text-white/70 hover:text-white">
                        Account
                      </Link>
                      <button onClick={() => { signOut(); setOpen(false); }} className="text-rose-300">
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setOpen(false); setAuthOpen(true); }}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 text-[15px] font-medium text-white"
                  >
                    <User className="h-4 w-4" /> Sign in
                  </button>
                )}
                <Link href="/pricing" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-[15px] font-semibold text-black">
                  Get early access
                </Link>
                <button onClick={copyCoupon} className="w-full text-center font-mono text-[11px] text-white/45">
                  Tap to copy {ANNOUNCEMENT_DATA.couponCode} · {ANNOUNCEMENT_DATA.discountPercent}% off first month {copied ? "✓" : ""}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AgencyAuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onSuccess={() => setAuthOpen(false)} />
    </>
  );
}
