"use client";

import React from "react";
import { HIGHLIGHTS } from "@/lib/content/home";
import { SectionHeading } from "./primitives";
import { StackCards } from "./page-kit";

export function HighlightsStack({ index = "04" }: { index?: string }) {
  return (
    <section id="highlights" className="relative bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index={index}
          eyebrow="What makes it different"
          title={
            <>
              Five reasons developers <span className="text-white/40">switch to CodeXa.</span>
            </>
          }
          lead="Keep scrolling — each card stacks on the last."
        />
        <div className="mt-12">
          <StackCards items={HIGHLIGHTS} />
        </div>
      </div>
    </section>
  );
}
