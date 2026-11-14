"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  LogOut,
  Cpu,
  CreditCard,
  Settings,
  ChevronDown,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Shield,
  Layers,
  Crown,
  Sliders,
  Package,
  Download,
  Users,
  Key,
  Star,
  Bell,
} from "lucide-react";
import { UserProfile, OrganizationRole, getRoleBadgeLabel, isLeadershipRole, isFounderRole } from "@/lib/auth/roles";

interface AccountMenuProps {
  user: {
    name: string;
    email?: string;
    photoURL?: string;
  };
  profile: UserProfile | null;
  onSignOut: () => void;
}

export function AccountMenu({ user, profile, onSignOut }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const role: OrganizationRole = profile?.role || "customer";
  const roleLabel = getRoleBadgeLabel(role);
  const isLeadership = isLeadershipRole(role);
  const isFounder = isFounderRole(role);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative shrink-0" ref={menuRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-[13px] font-sans font-medium text-white transition-all select-none"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.name}
            width={18}
            height={18}
            className="w-4 h-4 rounded-full object-cover shrink-0"
          />
        ) : (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        )}
        <span className="max-w-[110px] truncate text-white/90 font-semibold">{user.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0C0D10] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] py-1.5 z-[100] animate-in fade-in zoom-in-95 duration-150 text-xs font-sans">
          
          {/* Header user identity */}
          <div className="px-3.5 py-2.5 border-b border-white/[0.08]">
            <p className="font-semibold text-white text-[13px] truncate">{user.name}</p>
            <p className="text-white/50 text-[11px] truncate mt-0.5">{user.email || "developer@codexa.dev"}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold uppercase">
                {roleLabel}
              </span>
              {profile?.agencyVerified && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Agency Verified</span>
                </span>
              )}
            </div>
          </div>

          {/* Role-Based Menu Items (Phase 24 Specification) */}
          <div className="py-1">
            
            {/* 1. FOUNDER MENU */}
            {isFounder ? (
              <>
                <Link
                  href="/founder"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-purple-300 hover:text-purple-200 hover:bg-purple-500/[0.1] transition-colors font-medium"
                >
                  <Crown className="w-3.5 h-3.5 text-purple-400" />
                  <span>Founder Dashboard</span>
                </Link>
                <Link
                  href="/founder/usage"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-white/50" />
                  <span>Usage Control</span>
                </Link>
                <Link
                  href="/founder/releases"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Package className="w-3.5 h-3.5 text-white/50" />
                  <span>Release Management</span>
                </Link>
                <Link
                  href="/founder/members"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-white/50" />
                  <span>Members &amp; Interns</span>
                </Link>
                <Link
                  href="/account/usage"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5 text-white/50" />
                  <span>My Usage</span>
                </Link>
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-white/50" />
                  <span>Settings</span>
                </Link>
              </>
            ) : isLeadership ? (
              /* 2. LEADERSHIP MENU (Co-Founder, CTO, HR, Admin, Team Lead) */
              <>
                <Link
                  href="/agency/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-amber-300 hover:text-amber-200 hover:bg-amber-500/[0.08] transition-colors font-medium"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Leadership Dashboard</span>
                </Link>
                <Link
                  href="/account/usage"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5 text-white/50" />
                  <span>My Usage</span>
                </Link>
                <Link
                  href="/download"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-white/50" />
                  <span>Internal Downloads</span>
                </Link>
                <Link
                  href="/agency"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5 text-white/50" />
                  <span>Approved Resources</span>
                </Link>
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-white/50" />
                  <span>Settings</span>
                </Link>
              </>
            ) : role === "intern" ? (
              /* 3. INTERN MENU */
              <>
                <Link
                  href="/intern"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/[0.08] transition-colors font-medium"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Intern Dashboard</span>
                </Link>
                <Link
                  href="/intern"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-white/50" />
                  <span>My Tasks &amp; Learning</span>
                </Link>
                <Link
                  href="/account/access"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Key className="w-3.5 h-3.5 text-white/50" />
                  <span>My IDE Access</span>
                </Link>
                <Link
                  href="/account/usage"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5 text-white/50" />
                  <span>My Usage</span>
                </Link>
                <Link
                  href="/download"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-white/50" />
                  <span>Allowed Downloads</span>
                </Link>
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-white/50" />
                  <span>Settings</span>
                </Link>
              </>
            ) : (
              /* 4. CUSTOMER / PUBLIC VISITOR MENU */
              <>
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors font-medium"
                >
                  <User className="w-3.5 h-3.5 text-white/50" />
                  <span>Account</span>
                </Link>
                <Link
                  href="/account/subscription"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-white/50" />
                  <span>Subscription</span>
                </Link>
                <Link
                  href="/account/usage"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5 text-white/50" />
                  <span>AI Usage</span>
                </Link>
                <Link
                  href="/reviews"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Star className="w-3.5 h-3.5 text-white/50" />
                  <span>Reviews</span>
                </Link>
                <Link
                  href="/download"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-white/50" />
                  <span>Release Updates</span>
                </Link>
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-white/50" />
                  <span>Settings</span>
                </Link>
              </>
            )}

          </div>

          {/* Footer with sign out */}
          <div className="pt-1 mt-1 border-t border-white/[0.08]">
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
