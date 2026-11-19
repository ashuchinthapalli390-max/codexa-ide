import type { Metadata } from "next";
import { LegalPage } from "@/components/experience/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service and software license agreement for CodeXa Studio IDE.",
};

export default function TermsPage() {
  return (
    <LegalPage
      crumb="Terms"
      eyebrow="Legal"
      title={
        <>
          Terms of <span className="text-white/40">service.</span>
        </>
      }
      lead="Effective November 2026 · CodeXa Agency."
      updated="November 2026"
      sections={[
        {
          id: "license",
          title: "Software licence grant",
          body: [
            "CodeXa Agency grants you a non-exclusive, revocable, non-transferable licence to install and run CodeXa Studio IDE on verified devices under your assigned CXA-DESK entitlement.",
          ],
        },
        {
          id: "acceptable-use",
          title: "Acceptable use",
          body: [
            "You agree not to reverse engineer the binary distribution, circumvent entitlement checks, or use AI endpoints beyond the token allowance of your plan.",
          ],
        },
        {
          id: "ip",
          title: "Intellectual property",
          body: [
            "All code and products you create with CodeXa Studio IDE remain your exclusive intellectual property. CodeXa Agency claims no ownership over generated code.",
          ],
        },
      ]}
    />
  );
}
