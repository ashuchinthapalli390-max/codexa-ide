"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Bell, Check, Loader2, Sparkles, Monitor, Laptop, Smartphone, Terminal } from "lucide-react";

interface ReleaseNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform?: string;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  windows: <Monitor className="w-4 h-4 text-white" />,
  macos: <Laptop className="w-4 h-4 text-white" />,
  linux: <Terminal className="w-4 h-4 text-white" />,
  android: <Smartphone className="w-4 h-4 text-white" />,
  ios: <Smartphone className="w-4 h-4 text-white" />,
};

export function ReleaseNotificationModal({
  isOpen,
  onClose,
  platform = "windows",
}: ReleaseNotificationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setErrorMsg(null);
    }
  }, [isOpen, platform]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, platform }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2200);
      } else {
        setErrorMsg(data.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const targetPlatform = platform.toUpperCase();
  const icon = PLATFORM_ICONS[platform.toLowerCase()] || <Bell className="w-4 h-4 text-white" />;

  const modalContent = (
    <div
      className="fixed inset-0 z-[10000] pointer-events-none flex items-end sm:items-end justify-center sm:justify-end p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-modal-title"
    >
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto sm:hidden"
        onClick={onClose}
      />

      {/* Floating Panel (Fixed bottom-right on desktop, bottom sheet on mobile) */}
      <div className="relative w-full sm:w-[400px] max-w-[calc(100vw-32px)] bg-[#0B0C0E] border border-white/15 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] pointer-events-auto animate-in slide-in-from-bottom-5 duration-250 text-white select-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Close notification panel"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#A1A4AE]">
            RELEASE NOTIFICATIONS
          </span>
        </div>

        {/* Heading */}
        <h3
          id="notification-modal-title"
          className="text-lg font-orbitron font-bold tracking-tight text-white mb-1.5"
        >
          Get Notified on Release
        </h3>

        {/* Description */}
        <p className="text-xs text-white/70 font-sans leading-relaxed mb-4">
          We&apos;ll let you know the moment the official{" "}
          <strong className="text-white">{targetPlatform}</strong> binary is ready for distribution.
        </p>

        {success ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-sans flex items-center gap-3">
            <Check className="w-5 h-5 shrink-0" />
            <span>You&apos;re confirmed! We&apos;ll notify {email} on release day.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="notif-email" className="sr-only">
                Email Address
              </label>
              <input
                id="notif-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121316] border border-white/15 text-white placeholder-white/40 text-xs font-sans focus:outline-none focus:border-white/40 transition-colors"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-[11px] text-red-400 font-sans">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 active:scale-[0.98] text-black font-sans font-semibold text-xs tracking-tight transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Notify Me</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
