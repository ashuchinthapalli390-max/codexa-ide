import type { Metadata } from "next";
import { LegalPage } from "@/components/experience/LegalPage";

export const metadata: Metadata = {
  title: "Security",
  description: "Binary integrity, session encryption, hardware binding and terminal sandboxing in CodeXa Studio IDE.",
};

export default function SecurityPage() {
  return (
    <LegalPage
      crumb="Security"
      eyebrow="Security architecture"
      title={
        <>
          Hardened by default, <span className="text-white/40">verifiable by you.</span>
        </>
      }
      lead="How CodeXa Studio IDE protects installers, sessions, licences and your terminal."
      updated="November 2026"
      sections={[
        {
          id: "integrity",
          title: "SHA-256 binary integrity",
          body: [
            "Every released installer is hashed and signed against the CodeXa Agency master key. Checksums are published on the release manifest so you can verify each download yourself.",
          ],
        },
        {
          id: "sessions",
          title: "Encrypted sessions",
          body: [
            "Sign-in across CodeXa Agency web, mobile and Studio IDE uses stateless AES-256 encrypted cookies with sealed payloads.",
          ],
        },
        {
          id: "binding",
          title: "Hardware binding",
          body: [
            "CXA-DESK licence tokens are salted with machine identifiers, which prevents credential sharing and unauthorised duplicate installs.",
          ],
        },
        {
          id: "sandbox",
          title: "Terminal sandbox isolation",
          body: [
            "Integrated terminal shells run in isolated sub-process namespaces, so an AI agent cannot escalate its privileges on your machine.",
          ],
        },
      ]}
    />
  );
}
