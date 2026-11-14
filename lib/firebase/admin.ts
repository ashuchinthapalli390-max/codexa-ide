import { initializeApp, getApps, getApp, App, cert } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { assertSafeProjectId } from "./safeguards";

let adminApp: App | null = null;

export function getAdminApp(): App | null {
  if (adminApp) return adminApp;

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Enforce safeguard check
  if (projectId) {
    assertSafeProjectId(projectId);
  }

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (privateKey) {
    // Format escaped newlines in private key string
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  try {
    if (projectId && clientEmail && privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return adminApp;
    }

    // Fallback to Application Default Credentials if running in GCP or Emulator
    if (process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      adminApp = initializeApp({
        projectId: projectId || "codexa-studio-web",
      });
      return adminApp;
    }
  } catch (error) {
    console.error("[Firebase Admin Error] Failed to initialize Firebase Admin SDK:", error);
  }

  return null;
}

export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminFirestore(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}
