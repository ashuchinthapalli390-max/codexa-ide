"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { CodeXaLogo } from "@/components/ui/CodeXaLogo";
import { useAuth } from "@/lib/auth/AuthContext";
import { claimInvitation } from "@/lib/services/invitations";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { ShieldCheck, Lock, Key, ArrowRight, ExternalLink, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface AgencyAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AgencyAuthModal({ isOpen, onClose, onSuccess }: AgencyAuthModalProps) {
  const { signInWithGoogle, user, userProfile, isConfigured, error: authError } = useAuth();
  const [inviteToken, setInviteToken] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState<"signin" | "invite">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLocalError(null);
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      if (err?.message && err.message.includes("client is offline")) {
        onSuccess?.();
        onClose();
        return;
      }
      setLocalError(err.message || "Google sign-in was canceled or failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteToken.trim()) return;

    if (!user || !userProfile) {
      setClaimMessage({
        text: "Please sign in with Google first before claiming an invitation.",
        success: false,
      });
      return;
    }

    const db = getFirebaseFirestore();
    if (!db) {
      setClaimMessage({
        text: "Database is not connected. Please verify Firebase configuration.",
        success: false,
      });
      return;
    }

    setIsClaiming(true);
    setClaimMessage(null);

    try {
      const res = await claimInvitation(db, inviteToken, userProfile);
      setClaimMessage({
        text: res.message,
        success: res.success,
      });
      if (res.success) {
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setClaimMessage({
        text: err.message || "Failed to process invitation.",
        success: false,
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to CodeXa"
      subtitle="Sign in to access your Studio IDE workspace and account"
    >
      <div className="space-y-5">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center pt-1 pb-2">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-lg">
            <CodeXaLogo size="md" />
          </div>
        </div>

        {/* Tab Switching: Sign In vs Claim Invite */}
        <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === "signin"
                ? "bg-white/10 text-white font-bold shadow"
                : "text-white/50 hover:text-white"
            }`}
          >
            Google Sign-In
          </button>
          <button
            onClick={() => setActiveTab("invite")}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === "invite"
                ? "bg-white/10 text-white font-bold shadow"
                : "text-white/50 hover:text-white"
            }`}
          >
            Claim Invite / Token
          </button>
        </div>

        {/* TAB 1: GOOGLE SIGN-IN */}
        {activeTab === "signin" && (
          <div className="space-y-4">
            
            {/* Unconfigured Alert */}
            {!isConfigured && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-sans text-amber-200 space-y-1.5">
                <div className="flex items-center gap-2 font-orbitron font-bold text-white text-[11px]">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Firebase Configuration Required</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/80">
                  Awaiting project owner Firebase credentials. Follow{" "}
                  <code className="text-white bg-black/40 px-1 py-0.5 rounded font-mono">
                    FIREBASE_SETUP.md
                  </code>{" "}
                  to connect your new Firebase project.
                </p>
              </div>
            )}

            {/* Error Message */}
            {(localError || authError) && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                {localError || authError}
              </div>
            )}

            {/* Primary Google Login Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading || !isConfigured}
              className={`w-full py-3 px-4 rounded-xl font-sans font-semibold text-xs flex items-center justify-center gap-3 transition-all shadow-md ${
                isConfigured && !isLoading
                  ? "bg-white hover:bg-neutral-200 text-black cursor-pointer hover:scale-[1.01]"
                  : "bg-white/20 text-white/40 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
            </button>

            {/* Privacy and Policy Notes */}
            <div className="text-center text-[10.5px] font-sans text-white/40 pt-2 space-y-1">
              <p>
                By continuing, you agree to CodeXa Studio&apos;s{" "}
                <Link href="/terms" onClick={onClose} className="text-white/60 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" onClick={onClose} className="text-white/60 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[9.5px] font-mono text-white/30 pt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Isolated Firebase Database • No Legacy Overwrites</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLAIM INTERN / AGENCY INVITATION */}
        {activeTab === "invite" && (
          <form onSubmit={handleClaimInvite} className="space-y-4">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-sans text-white/70">
              <span className="block font-orbitron font-bold text-white text-[11px] mb-1">
                Intern or Agency Member?
              </span>
              Enter your invitation token issued by HR or Leadership to activate your specialized workspace role.
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                Invitation Token
              </label>
              <input
                type="text"
                value={inviteToken}
                onChange={(e) => setInviteToken(e.target.value)}
                placeholder="inv_xxxxxxxxxxxx"
                required
                className="w-full bg-[#12131A] border border-white/15 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-white/20 focus:outline-none"
              />
            </div>

            {claimMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-sans ${
                  claimMessage.success
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                    : "bg-red-500/10 border border-red-500/20 text-red-300"
                }`}
              >
                {claimMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isClaiming || !inviteToken.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              {isClaiming ? "Verifying..." : "Verify & Claim Invitation"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

      </div>
    </Modal>
  );
}
