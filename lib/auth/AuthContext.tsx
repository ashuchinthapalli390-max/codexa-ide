"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseAnalytics } from "@/lib/firebase/client";
import { isFirebaseConfigured, validateFirebaseConfig } from "@/lib/firebase/config";
import { UserProfile, OrganizationRole, ProductEntitlement, Permission, ROLE_PERMISSIONS } from "./roles";
import {
  syncUserProfile,
  getUserProfile,
  getLocalProfile,
  resolveInitialRoleAndEntitlement,
} from "@/lib/services/user-service";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  role: OrganizationRole;
  entitlement: ProductEntitlement;
  permissions: Permission[];
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  role: "public_visitor",
  entitlement: "free",
  permissions: ROLE_PERMISSIONS.public_visitor,
  isLoading: true,
  isConfigured: false,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const activeUid = localStorage.getItem("cxa_active_uid");
      if (activeUid) {
        return getLocalProfile(activeUid);
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    const configured = isFirebaseConfigured();
    setIsConfigured(configured);

    if (!configured) {
      validateFirebaseConfig();
      setIsLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    const db = getFirebaseFirestore();

    // Initialize analytics if supported
    getFirebaseAnalytics().catch(() => {});

    if (!auth) {
      setIsLoading(false);
      return;
    }

    // Check for any pending redirect result
    getRedirectResult(auth)
      .then(async (redirectResult) => {
        if (redirectResult?.user && db) {
          try {
            const profile = await syncUserProfile(db, redirectResult.user);
            setUserProfile(profile);
            setError(null);
          } catch (e) {
            console.warn("[Auth Context] Redirect sync deferred:", e);
          }
        }
      })
      .catch((err) => {
        console.warn("[Auth Context] Redirect check:", err?.message);
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (typeof document !== "undefined") {
          const sessionData = {
            uid: currentUser.uid,
            email: currentUser.email || "",
            displayName: currentUser.displayName || "",
          };
          document.cookie = `cxa_session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=2592000; SameSite=Lax`;
        }
        if (db) {
          try {
            // Idempotently load or create Firestore profile (with offline fallback built-in)
            const profile = await syncUserProfile(db, currentUser);
            setUserProfile(profile);
            setError(null);
          } catch (err: any) {
            console.warn("[Auth Context] Error syncing user profile:", err);
            // Even if an unexpected error occurs, fall back to cached profile or synthesis
            const cached = getLocalProfile(currentUser.uid);
            if (cached) {
              setUserProfile(cached);
            } else {
              const res = resolveInitialRoleAndEntitlement(currentUser.email);
              const fallback: UserProfile = {
                uid: currentUser.uid,
                email: currentUser.email || "",
                displayName: currentUser.displayName || "CodeXa Developer",
                photoURL: currentUser.photoURL || "",
                provider: "google",
                role: res.role,
                entitlement: res.entitlement,
                agencyVerified: res.agencyVerified,
                status: "active",
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
              };
              setUserProfile(fallback);
            }
            // Do NOT display offline Firestore errors to user since identity is valid
            setError(null);
          }
        }
      } else {
        setUserProfile(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("cxa_active_uid");
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      const msg = "Firebase is not yet configured with real API credentials. Please see FIREBASE_SETUP.md to connect your Firebase project.";
      setError(msg);
      throw new Error(msg);
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error("Firebase Auth client could not be initialized.");
    }

    setIsLoading(true);
    setError(null);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      // 1. Attempt Popup Sign-In first
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);

      const db = getFirebaseFirestore();
      if (db) {
        try {
          const profile = await syncUserProfile(db, result.user);
          setUserProfile(profile);
        } catch (profileErr: any) {
          console.warn("[Auth Context] Profile sync fallback after popup:", profileErr?.message);
        }
      }
      setError(null);
    } catch (popupErr: any) {
      // Suppress client offline errors because user is already authenticated
      if (popupErr.message && popupErr.message.includes("client is offline")) {
        console.warn("[Auth Context] Suppressed offline error during sign-in:", popupErr);
        setError(null);
        return;
      }

      // If popup is blocked by browser restrictions, fallback to redirect
      if (
        popupErr.code === "auth/popup-blocked" ||
        popupErr.code === "auth/cancelled-popup-request"
      ) {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr: any) {
          setError(redirectErr.message);
          throw redirectErr;
        }
      } else if (popupErr.code !== "auth/popup-closed-by-user") {
        setError(popupErr.message || "Google authentication failed.");
        throw popupErr;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        await firebaseSignOut(auth);
      }
      setUser(null);
      setUserProfile(null);
      setError(null);

      if (typeof window !== "undefined") {
        localStorage.removeItem("cxa_active_uid");
      }

      // Clean up any legacy cookies
      if (typeof document !== "undefined") {
        document.cookie = "cxa_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    const db = getFirebaseFirestore();
    if (!db) return;

    try {
      const fresh = await getUserProfile(db, user.uid);
      if (fresh) {
        setUserProfile(fresh);
      }
    } catch (err: any) {
      console.warn("[Auth Context] Error refreshing profile:", err);
    }
  };

  const role: OrganizationRole = userProfile?.role || "public_visitor";
  const entitlement: ProductEntitlement = userProfile?.entitlement || "free";
  const permissions: Permission[] = useMemo(() => {
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.public_visitor;
  }, [role]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        role,
        entitlement,
        permissions,
        isLoading,
        isConfigured,
        error,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
