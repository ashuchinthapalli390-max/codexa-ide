import React from "react";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/docs/articles";
import { PageHero } from "@/components/experience/page-kit";
import { DocsHub } from "@/components/experience/DocsHub";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Install guide, hardware licensing, keyboard shortcuts, MCP setup and technical articles for CodeXa Studio IDE.",
};

export default function DocsPage() {
  const articles = getAllArticles();
  return (
    <div className="bg-black">
      <PageHero
        crumb="Docs"
        eyebrow="Developer documentation"
        title={
          <>
            Set up, learn, <span className="text-white/40">go deep.</span>
          </>
        }
        lead="Install and activate CodeXa Studio, learn the shortcuts, connect MCP servers, and read technical deep dives from the team."
        stats={[
          { value: "3", label: "Setup steps" },
          { value: "9", label: "Core shortcuts" },
          { value: String(articles.length), label: "Articles" },
          { value: "MCP", label: "Tool protocol" },
        ]}
      />
      <DocsHub articles={articles} />
    </div>
  );
}
