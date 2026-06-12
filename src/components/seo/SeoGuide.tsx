import React from "react";
import { GuideContent } from "@/lib/guides/content";
import { DynamicFAQ } from "./DynamicFAQ";
import { generalUniversity } from "@/lib/universities/registry";

export function SeoGuide({ guide, slug }: { guide: GuideContent, slug: string }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-background">
          {guide.title}
        </h1>
        <p className="text-xl text-on-surface-variant leading-relaxed">
          {guide.description}
        </p>
      </header>

      <article className="prose prose-lg prose-slate max-w-none text-on-surface">
        {guide.content}
      </article>

      <hr className="border-outline-variant/30 my-12" />

      <section>
        <DynamicFAQ university={generalUniversity} pageType={slug} />
      </section>
    </div>
  );
}
