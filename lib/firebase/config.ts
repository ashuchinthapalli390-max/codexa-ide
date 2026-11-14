import { assertSafeProjectId } from "./safeguards";

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

/**
 * Returns client-side Firebase configuration from NEXT_PUBLIC environment variables.
 */
export function getFirebaseClientConfig(): FirebaseClientConfig {
  const config: FirebaseClientConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Enforce safeguard check against legacy agency database
  if (config.projectId) {
    assertSafeProjectId(config.projectId);
  }

  return config;
}

/**
 * Checks whether the essential client-side Firebase configuration values are present.
 */
export function isFirebaseConfigured(): boolean {
  const config = getFirebaseClientConfig();
  return Boolean(
    config.apiKey &&
    config.apiKey.trim() !== "" &&
    config.apiKey !== "AIzaSy_YOUR_NEW_WEB_API_KEY" &&
    config.authDomain &&
    config.projectId &&
    config.appId
  );
}

/**
 * Validates configuration at application startup and logs clear diagnostics in development.
 * DOES NOT crash unrelated public website pages if credentials are not yet configured.
 */
export function validateFirebaseConfig(): {
  isConfigured: boolean;
  missingKeys: string[];
  usingEmulator: boolean;
} {
  const config = getFirebaseClientConfig();
  const missingKeys: string[] = [];

  if (!config.apiKey || config.apiKey === "AIzaSy_YOUR_NEW_WEB_API_KEY") missingKeys.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!config.authDomain) missingKeys.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!config.projectId) missingKeys.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!config.appId) missingKeys.push("NEXT_PUBLIC_FIREBASE_APP_ID");

  const usingEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";

  if (process.env.NODE_ENV === "development" && missingKeys.length > 0) {
    // Helpful developer diagnostic notice without throwing fatal crash
    console.info(
      `[CodeXa Firebase Info] Firebase is running in unconfigured standby mode. ` +
      `Missing keys: ${missingKeys.join(", ")}. See FIREBASE_SETUP.md to connect your new Firebase project.`
    );
  }

  return {
    isConfigured: missingKeys.length === 0,
    missingKeys,
    usingEmulator,
  };
}
