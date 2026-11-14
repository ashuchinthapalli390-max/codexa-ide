"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  Firestore,
  connectFirestoreEmulator,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getFirebaseClientConfig, isFirebaseConfigured } from "./config";
import { assertSafeProjectId } from "./safeguards";

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseFirestore: Firestore | null = null;
let firebaseAnalytics: Analytics | null = null;
let emulatorsConnected = false;

/**
 * Initializes and returns the Firebase Client app singleton.
 * Returns null gracefully if credentials have not yet been configured.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") {
    // Client SDK should only be initialized on the client side
    return null;
  }

  if (firebaseApp) return firebaseApp;

  if (!isFirebaseConfigured()) {
    return null;
  }

  const config = getFirebaseClientConfig();

  // Safeguard check
  assertSafeProjectId(config.projectId);

  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseApp = getApp();
  } else {
    firebaseApp = initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
      measurementId: config.measurementId,
    });
  }

  return firebaseApp;
}

/**
 * Returns the Firebase Auth instance singleton.
 */
export function getFirebaseAuth(): Auth | null {
  if (firebaseAuth) return firebaseAuth;

  const app = getFirebaseApp();
  if (!app) return null;

  firebaseAuth = getAuth(app);

  // Optional local emulator support
  if (
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" &&
    !emulatorsConnected
  ) {
    try {
      const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || "http://127.0.0.1:9099";
      connectAuthEmulator(firebaseAuth, authHost, { disableWarnings: true });
    } catch {}
  }

  return firebaseAuth;
}

/**
 * Returns the Cloud Firestore instance singleton with HTTP long-polling and multi-tab persistent cache.
 * Long-polling eliminates WebSocket connection drops and prevents "client is offline" errors.
 */
export function getFirebaseFirestore(): Firestore | null {
  if (firebaseFirestore) return firebaseFirestore;

  const app = getFirebaseApp();
  if (!app) return null;

  try {
    // 1. Prefer HTTP long-polling with persistent IndexedDB multi-tab cache
    firebaseFirestore = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    try {
      // 2. Fallback to long-polling without explicit cache if IndexedDB is restricted
      firebaseFirestore = initializeFirestore(app, {
        experimentalForceLongPolling: true,
      });
    } catch {
      try {
        // 3. Fallback to standard getFirestore if already initialized
        firebaseFirestore = getFirestore(app);
      } catch {
        return null;
      }
    }
  }

  // Optional local emulator support
  if (
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" &&
    !emulatorsConnected &&
    firebaseFirestore
  ) {
    try {
      connectFirestoreEmulator(firebaseFirestore, "127.0.0.1", 8080);
      emulatorsConnected = true;
    } catch {}
  }

  return firebaseFirestore;
}

/**
 * Returns the Firebase Analytics singleton (client-side only).
 * Automatically verifies browser environment support.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (firebaseAnalytics) return firebaseAnalytics;

  const app = getFirebaseApp();
  if (!app) return null;

  try {
    const supported = await isSupported();
    if (supported) {
      firebaseAnalytics = getAnalytics(app);
      return firebaseAnalytics;
    }
  } catch (err) {
    console.warn("[CodeXa Firebase] Analytics initialization deferred:", err);
  }

  return null;
}
