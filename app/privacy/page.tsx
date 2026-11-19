import type { Metadata } from "next";
import { LegalPage } from "@/components/experience/LegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy commitments and local-first data isolation policy for CodeXa Studio IDE.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      crumb="Privacy"
      eyebrow="Privacy by design"
      title={
        <>
          Your code <span className="text-white/40">stays yours.</span>
        </>
      }
      lead="Effective November 2026 · Published by CodeXa Agency."
      updated="November 2026"
      sections={[
        {
          id: "local-first",
          title: "Local-first principle",
          body: [
            "CodeXa Studio IDE runs on your own workstation. Your source code, file contents, Git history and local secrets stay within your storage and are never uploaded to CodeXa Agency or third-party servers for training or surveillance.",
          ],
        },
        {
          id: "ai-context",
          title: "AI inference and context",
          body: [
            "When you use a cloud model such as GPT-6 Astra or Fabel 5.1, only the minimal, sanitised context needed for the request is sent, over TLS-encrypted connections. When you use the on-device NEXA engine, no network traffic is sent at all.",
          ],
        },
        {
          id: "device",
          title: "Device entitlement verification",
          body: [
            "Workstation activation checks your CXA-DESK licence against the CodeXa Agency identity database. Hardware fingerprints are hashed with SHA-256 and stored only to enforce seat limits.",
          ],
        },
      ]}
    />
  );
}
