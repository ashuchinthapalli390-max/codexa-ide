import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllArticles, getArticleBySlug } from "@/lib/docs/articles";
import { ArticleView } from "@/components/experience/ArticleView";

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Article not found" };
  return { title: article.title, description: article.excerpt };
}

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export default function DocArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();
  const related = getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);
  return <ArticleView article={article} related={related} />;
}
