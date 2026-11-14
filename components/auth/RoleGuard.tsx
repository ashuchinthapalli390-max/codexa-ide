"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { OrganizationRole, Permission, hasPermission, getRoleBadgeLabel } from "@/lib/auth/roles";
import { ShieldAlert, Lock, ArrowLeft, LogIn } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: OrganizationRole[];
  requiredPermission?: Permission;
  fallbackMessage?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  requiredPermission,
  fallbackMessage,
}: RoleGuardProps) {
  const { user, userProfile, role, isLoading, isConfigured } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-4" />
        <span className="text-xs font-mono text-white/50">Verifying security clearances...</span>
      </div>
    );
  }

  // Not authenticated
  if (!user || !userProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0D0E13] border border-white/10 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-orbitron font-bold text-white">
            Authentication Required
          </h2>
          <p className="text-xs text-white/60 font-sans leading-relaxed">
            {fallbackMessage || "You must be signed in with a verified account to access this workspace."}
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono font-semibold text-white transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check role authorization
  let isAuthorized = true;

  if (allowedRoles && allowedRoles.length > 0) {
    isAuthorized = allowedRoles.includes(role);
  }

  if (isAuthorized && requiredPermission) {
    isAuthorized = hasPermission(userProfile, requiredPermission);
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0D0E13] border border-red-500/20 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-orbitron font-bold text-white">
            Access Restricted
          </h2>
          <p className="text-xs text-white/60 font-sans leading-relaxed">
            Your current account tier is{" "}
            <span className="font-mono text-emerald-400 font-bold">
              {getRoleBadgeLabel(role)}
            </span>
            . This portal requires higher organizational clearance.
          </p>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] font-mono text-white/40">
            Current UID: {user.uid.slice(0, 8)}... • Contact HR / Admin for invitation
          </div>
          <div className="pt-2">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
