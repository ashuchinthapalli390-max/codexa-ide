import React from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/experience/page-kit";
import { ProviderGrid, StepsList } from "@/components/experience/sections-extra";
import { FinalCTA } from "@/components/experience/FinalCTA";

export const metadata: Metadata = {
  title: "AI Provider Integrations",
  description: "How CodeXa connects to OpenAI, Google, CodeXa native models and your own provider keys through the BYOK keychain vault and MCP.",
};

const MCP = `// .codexa/mcp.json
{
  "mcpServers": {
    "agencyPostgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."]
    }
  }
}`;

export default function IntegrationsPage() {
  return (
    <div className="bg-black">
      <PageHero
        crumb="Integrations"
        eyebrow="Providers, keys & tools"
        title={
          <>
            Plug in any provider. <span className="text-white/40">Keep your keys.</span>
          </>
        }
        lead="CodeXa ships with a managed router across several providers, lets you bring your own API keys, and connects your own tools through Model Context Protocol."
      />
      <ProviderGrid index="01" />
      <StepsList
        index="02"
        eyebrow="Bring your own key"
        title={
          <>
            Your keys stay <span className="text-white/40">on your machine.</span>
          </>
        }
        steps={[
          { title: "Open Settings → AI providers", body: "Pick OpenAI, Anthropic, Google or xAI and paste your API key." },
          { title: "Stored in your OS keychain", body: "Windows Credential Manager, macOS Keychain or Linux Secret Service — never on CodeXa servers." },
          { title: "Route requests through your key", body: "Choose per model whether to use plan units or your own key. Switch any time." },
        ]}
      />
      <StepsList
        index="03"
        eyebrow="Model Context Protocol"
        title={
          <>
            Give the agent <span className="text-white/40">your tools.</span>
          </>
        }
        steps={[
          { title: "Add a server", body: "Declare MCP servers in .codexa/mcp.json at your project root." },
          { title: "Restart the agent", body: "CodeXa discovers the server's tools and lists them in the agent panel." },
          { title: "Ask in plain language", body: "The agent queries databases, reads logs or runs sanitised commands through those tools." },
        ]}
        code={{ label: "mcp.json", content: MCP }}
      />
      <FinalCTA />
    </div>
  );
}
