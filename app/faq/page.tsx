import React from "react";
import type { Metadata } from "next";
import { FAQSection } from "@/components/sections/FAQSection";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HelpCircle, ExternalLink, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions regarding CodeXa Studio IDE architecture, licensing, local-first security, and releases.",
};

export default function FAQPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <Badge variant="accent" size="md">
          Knowledge Base &amp; FAQ
        </Badge>
      </div>

      <FAQSection />

      {/* Direct Contact Strip */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="p-8 rounded-2xl bg-[#0D0E11] border border-[#282A31] text-center space-y-4">
          <h3 className="text-xl font-orbitron font-bold text-white">
            Have a custom inquiry or enterprise requirement?
          </h3>
          <p className="text-xs text-[#A5A6AE] max-w-md mx-auto leading-relaxed">
            Reach out to the CodeXa Agency core engineering staff for tailored seat provisioning, custom model integrations, or dedicated security audits.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="secondary"
              size="md"
              href="https://codxa-agency.online"
              external={true}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              Contact CodeXa Agency
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

