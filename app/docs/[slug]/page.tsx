import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/docs/articles";
import { ArrowLeft, Clock, Calendar, User, ArrowRight, Share2, Copy } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found | CodeXa Docs" };

  return {
    title: `${article.title} — CodeXa Studio Docs`,
    description: article.excerpt,
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((art) => ({ slug: art.slug }));
}

export default async function DocArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getAllArticles();
  const related = allArticles.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <div className="pt-28 pb-24 bg-[#000000] text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Documentation Knowledge Base</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="space-y-4 border-b border-white/10 pb-8 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-400 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-orbitron font-bold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-2 pt-2 text-xs text-neutral-400">
            <User className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-white font-semibold">{article.author.name}</span>
            <span>•</span>
            <span>{article.author.role}</span>
          </div>
        </div>

        {/* Table of Contents */}
        {article.tableOfContents.length > 0 && (
          <div className="mb-12 p-6 rounded-2xl bg-[#111116] border border-white/10">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
              TABLE OF CONTENTS
            </div>
            <ul className="space-y-2">
              {article.tableOfContents.map((toc, idx) => (
                <li key={toc.id}>
                  <a
                    href={`#${toc.id}`}
                    className="text-xs text-neutral-300 hover:text-white font-mono flex items-center gap-2 transition-colors"
                  >
                    <span className="text-neutral-500">0{idx + 1}.</span>
                    <span>{toc.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Body Sections */}
        <article className="space-y-12">
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                  {p}
                </p>
              ))}

              {section.codeBlock && (
                <div className="mt-4 rounded-xl border border-white/10 bg-[#0C0D12] overflow-hidden">
                  <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span>{section.codeBlock.language}</span>
                    <span className="text-[10px]">Syntax Highlighted</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
                    <code>{section.codeBlock.code}</code>
                  </pre>
                </div>
              )}
            </section>
          ))}
        </article>

        {/* Related Articles Footer */}
        <div className="mt-20 pt-10 border-t border-white/10">
          <h3 className="text-lg font-orbitron font-bold text-white mb-6">
            Related Technical Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/docs/${rel.slug}`}
                className="p-5 rounded-xl bg-[#121217] border border-white/10 hover:border-white/25 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">
                    {rel.category}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-neutral-200 transition-colors mb-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white font-semibold mt-4">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}