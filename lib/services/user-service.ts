import { doc, getDoc, setDoc, updateDoc, Firestore } from "firebase/firestore";
import { User } from "firebase/auth";
import { UserProfile, OrganizationRole, ProductEntitlement } from "@/lib/auth/roles";
import { COLLECTIONS } from "@/lib/firebase/collections";

const LOCAL_PROFILE_PREFIX = "cxa_user_profile_";

/**
 * Persists a user profile to browser localStorage for offline resilience.
 */
export function saveLocalProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${LOCAL_PROFILE_PREFIX}${profile.uid}`, JSON.stringify(profile));
    localStorage.setItem("cxa_active_uid", profile.uid);
  } catch (e) {
    console.warn("[CodeXa Auth] Unable to save profile to localStorage:", e);
  }
}

/**
 * Retrieves a user profile from browser localStorage.
 */
export function getLocalProfile(uid: string): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${LOCAL_PROFILE_PREFIX}${uid}`);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Helper to wrap any promise with a timeout to prevent offline hanging.
 */
function withTimeout<T>(promise: Promise<T>, ms: number = 3000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms (Firestore offline or unreachable)`));
    }, ms);

    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Resolves initial role and entitlement based on verified organization leadership emails.
 */
export function resolveInitialRoleAndEntitlement(email: string | null | undefined): {
  role: OrganizationRole;
  entitlement: ProductEntitlement;
  agencyVerified: boolean;
} {
  const normalized = (email || "").trim().toLowerCase();

  const founderEmails = [
    (process.env.FOUNDER_EMAIL || "").toLowerCase(),
    (process.env.OWNER_EMAIL || "").toLowerCase(),
    "ashuchinthapalli3900@gmail.com",
  ].filter(Boolean);

  const coFounderEmails = [
    (process.env.AMMU_EMAIL || "").toLowerCase(),
    "amruthadivvela@gmail.com",
  ].filter(Boolean);

  const hrEmails = [
    (process.env.VYSHUU_EMAIL || "").toLowerCase(),
    "vyshnavireddy720@gmail.com",
  ].filter(Boolean);

  const adminEmails = [
    (process.env.ADMIN_EMAIL || "").toLowerCase(),
    "admin@codxa-agency.online",
  ].filter(Boolean);

  if (founderEmails.includes(normalized)) {
    return { role: "founder", entitlement: "leadership_access", agencyVerified: true };
  }
  if (coFounderEmails.includes(normalized)) {
    return { role: "co_founder", entitlement: "leadership_access", agencyVerified: true };
  }
  if (hrEmails.includes(normalized)) {
    return { role: "hr", entitlement: "leadership_access", agencyVerified: true };
  }
  if (adminEmails.includes(normalized)) {
    return { role: "admin", entitlement: "leadership_access", agencyVerified: true };
  }

  // Default general customer role with no active commercial plan until purchased
  return { role: "customer", entitlement: "no_entitlement", agencyVerified: false };
}

/**
 * Idempotently retrieves or creates a UserProfile for an authenticated Firebase user.
 * 
 * OFFLINE-RESILIENT ARCHITECTURE:
 * - If Cloud Firestore is offline, unreachable, or pending console initialization,
 *   we NEVER crash or block the verified Google user from entering the app.
 * - We verify identity directly via the cryptographically signed Google Auth token.
 * - Profile is stored and retrieved from localStorage, while queuing background synchronization
 *   to Firestore when connection is restored.
 */
export async function syncUserProfile(
  db: Firestore,
  firebaseUser: User
): Promise<UserProfile> {
  const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
  const now = new Date().toISOString();

  // Pre-calculate verified initial role and defaults from Google Auth identity
  const resolved = resolveInitialRoleAndEntitlement(firebaseUser.email);
  const defaultDisplayName =
    firebaseUser.displayName ||
    (resolved.role === "founder" ? "Ashu" : "CodeXa Developer");

  const synthesizedProfile: UserProfile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: defaultDisplayName,
    photoURL: firebaseUser.photoURL || "",
    provider: "google",
    role: resolved.role,
    entitlement: resolved.entitlement,
    agencyVerified: resolved.agencyVerified,
    status: "active",
    createdAt: now,
    lastLoginAt: now,
    tokenBalance: resolved.role === "founder" ? 500000 : 0,
    monthlyTokenQuota: resolved.role === "founder" ? 500000 : 0,
  };

  try {
    // Attempt to query Firestore with a 3.0 second timeout
    const userSnap = await withTimeout(getDoc(userRef), 3000);

    if (userSnap.exists()) {
      // Existing user: Update lastLoginAt and return existing profile
      const existingData = userSnap.data() as UserProfile;
      const updatedProfile: UserProfile = {
        ...existingData,
        displayName: firebaseUser.displayName || existingData.displayName || defaultDisplayName,
        photoURL: firebaseUser.photoURL || existingData.photoURL || "",
        lastLoginAt: now,
      };

      // Non-blocking async update
      updateDoc(userRef, {
        lastLoginAt: now,
        displayName: updatedProfile.displayName,
        photoURL: updatedProfile.photoURL,
      }).catch((err) => {
        console.warn("[CodeXa Auth] Background updateDoc deferred:", err?.message);
      });

      saveLocalProfile(updatedProfile);
      return updatedProfile;
    } else {
      // New user: Save to Firestore in background
      setDoc(userRef, synthesizedProfile).catch((err) => {
        console.warn("[CodeXa Auth] Background setDoc deferred:", err?.message);
      });

      saveLocalProfile(synthesizedProfile);
      return synthesizedProfile;
    }
  } catch (firestoreErr: any) {
    // Firestore is offline, client is offline, or connection timed out.
    console.warn(
      `[CodeXa Auth] Firestore connection offline or delayed (${firestoreErr?.message || "offline"}). Falling back to resilient local profile.`
    );

    // 1. Check if we have a previously cached profile in localStorage
    const cached = getLocalProfile(firebaseUser.uid);
    if (cached) {
      cached.lastLoginAt = now;
      if (firebaseUser.displayName) cached.displayName = firebaseUser.displayName;
      if (firebaseUser.photoURL) cached.photoURL = firebaseUser.photoURL;
      saveLocalProfile(cached);

      // Attempt background sync without awaiting
      setDoc(userRef, cached, { merge: true }).catch(() => {});
      return cached;
    }

    // 2. Synthesize new profile based on verified Google auth identity
    saveLocalProfile(synthesizedProfile);

    // Attempt non-blocking background save to Firestore for when connection recovers
    setDoc(userRef, synthesizedProfile, { merge: true }).catch(() => {});

    return synthesizedProfile;
  }
}

/**
 * Retrieves a user profile by UID. Returns offline cache if Firestore is unreachable.
 */
export async function getUserProfile(
  db: Firestore,
  uid: string
): Promise<UserProfile | null> {
  const local = getLocalProfile(uid);

  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await withTimeout(getDoc(userRef), 2500);

    if (!userSnap.exists()) {
      return local;
    }

    const profile = userSnap.data() as UserProfile;
    saveLocalProfile(profile);
    return profile;
  } catch (err: any) {
    console.warn(`[CodeXa Auth] getUserProfile offline fallback for ${uid}:`, err?.message);
    return local;
  }
}
