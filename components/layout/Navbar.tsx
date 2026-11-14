"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CodeXaLogo } from "@/components/ui/CodeXaLogo";
import { AgencyAuthModal } from "@/components/auth/AgencyAuthModal";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { NavMegaMenu } from "@/components/layout/NavMegaMenu";
import { MAIN_NAV_ITEMS, NavItemConfig } from "@/lib/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getRoleBadgeLabel } from "@/lib/auth/roles";
import {
  Download,
  Menu,
  X,
  User,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, userProfile, signOut } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll position listener for dynamic opacity & border illumination
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setMobileExpandedSection(null);
  }, [pathname]);

  // Clean timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (item: NavItemConfig) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (item.isMega && item.megaConfig) {
      setActiveDropdown(item.label);
    } else {
      setActiveDropdown(null);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const activeMegaItem = MAIN_NAV_ITEMS.find(
    (item) => item.label === activeDropdown && item.isMega && item.megaConfig
  );

  return (
    <>
      <header className={`sticky top-0 z-[1001] w-full border-b transition-all duration-300 ${
        isScrolled
          ? "border-white/[0.12] bg-[#020203]/98 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.85)]"
          : "border-white/[0.06] bg-[#020203]/85 backdrop-blur-xl"
      }`}>
        {/* LEVEL 1: Minimal Announcement Bar */}
        <AnnouncementBar />

        {/* LEVEL 2: Main Navigation Bar (~70px height) */}
        <div className="mx-auto flex h-[70px] max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-8 select-none">
          {/* Left: CodeXa Studio IDE Logo & Wordmark (Strictly links to Home) */}
          <div className="flex items-center shrink-0">
            <CodeXaLogo size="md" subtitle="STUDIO IDE" href="/" />
          </div>

          {/* Center: Desktop Navigation (5 Primary Destinations) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0">
            {MAIN_NAV_ITEMS.map((item) => {
              const isCurrent = pathname === item.href || activeDropdown === item.label;
              const hasDropdown = Boolean(item.isMega && item.megaConfig);

              return (
                <div
                  key={item.label}
                  className="relative shrink-0"
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={`px-3 py-1.5 rounded-[8px] text-[13.5px] font-sans font-medium transition-all whitespace-nowrap inline-flex items-center gap-1.5 select-none ${
                      isCurrent
                        ? "text-white bg-white/[0.08]"
                        : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 text-white/50 shrink-0 ${
                          activeDropdown === item.label ? "rotate-180 text-white" : ""
                        }`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right Actions: Single Sign In + Single-Line Download CodeXa CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <AccountMenu
                user={{
                  name: userProfile?.displayName || user.displayName || "CodeXa Developer",
                  email: user.email || undefined,
                  photoURL: user.photoURL || undefined,
                }}
                profile={userProfile}
                onSignOut={signOut}
              />
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-2 rounded-[8px] text-[13.5px] font-sans font-medium text-white/75 hover:text-white hover:bg-white/[0.06] transition-colors whitespace-nowrap inline-flex items-center gap-1.5 shrink-0"
              >
                <User className="w-3.5 h-3.5 text-white/60 shrink-0" />
                <span className="whitespace-nowrap">Sign In</span>
              </button>
            )}

            <Link
              href="/#availability"
              className="h-[40px] px-4 xl:px-5 rounded-[8px] bg-white/10 hover:bg-white text-white hover:text-black text-[13.5px] font-sans font-semibold tracking-[-0.02em] inline-flex items-center gap-2 transition-all border border-white/15 hover:border-white shadow-sm shrink-0 whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="whitespace-nowrap">Available Soon</span>
            </Link>
          </div>

          {/* Mobile / Tablet Compact Actions */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <Link
              href="/#availability"
              className="h-[36px] px-3 rounded-[8px] bg-white/10 text-white text-[12px] font-sans font-semibold inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap border border-white/15"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available Soon</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-[8px] text-white/70 hover:text-white bg-white/[0.05] border border-white/10 focus:outline-none shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {activeMegaItem && activeMegaItem.megaConfig && (
          <NavMegaMenu
            config={activeMegaItem.megaConfig}
            onClose={() => setActiveDropdown(null)}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleMouseLeave}
          />
        )}

        {/* Backdrop overlay for mega-menu */}
        {activeDropdown && (
          <div
            className="fixed inset-0 top-[102px] sm:top-[106px] bg-black/85 backdrop-blur-md z-[995]"
            onClick={() => setActiveDropdown(null)}
          />
        )}

        {/* Mobile / Tablet Slide-Down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#070709] px-4 pt-4 pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-106px)] overflow-y-auto">
            {/* Primary Nav Links */}
            <nav className="flex flex-col space-y-1">
              {MAIN_NAV_ITEMS.map((item) => {
                const hasSub = Boolean(item.isMega && item.megaConfig);
                const isExpanded = mobileExpandedSection === item.label;

                if (hasSub && item.megaConfig) {
                  return (
                    <div key={item.label} className="border-b border-white/[0.05] pb-1">
                      <button
                        onClick={() =>
                          setMobileExpandedSection(isExpanded ? null : item.label)
                        }
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[14px] font-sans font-medium text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-white/50 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-4 pr-2 py-2 space-y-2 bg-white/[0.02] rounded-lg mt-1">
                          {item.megaConfig.categories.flatMap((c) =>
                            c.items.map((sub, idx) => (
                              <Link
                                key={idx}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-1.5 text-xs text-white/70 hover:text-white"
                              >
                                <span className="font-semibold block text-white/90">
                                  {sub.title}
                                </span>
                                <span className="text-[11px] text-white/50 block line-clamp-1">
                                  {sub.desc}
                                </span>
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-[8px] text-[14px] font-sans font-medium text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Account / Action Area */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              {user ? (
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-2 text-xs font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold truncate max-w-[150px]">
                      {userProfile?.displayName || user.displayName || "CodeXa Developer"}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 uppercase font-bold">
                      {getRoleBadgeLabel(userProfile?.role || "customer")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.08]">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/70 hover:text-white font-mono text-[11px]"
                    >
                      Account Dashboard →
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="text-red-400 hover:text-red-300 text-[11px] font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-[8px] text-[13px] font-sans font-medium text-white/80 hover:text-white hover:bg-white/[0.06] border border-white/10 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-white/60" />
                  <span>Sign In</span>
                </button>
              )}

              <Link
                href="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-[8px] bg-white text-[#050506] text-xs font-sans font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CodeXa Studio IDE</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hardware Key / Agency Authentication Modal */}
      <AgencyAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </>
  );
}
