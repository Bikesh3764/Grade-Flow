import React from "react";
import Link from "next/link";
import { University } from "@/lib/universities/types";
import { Link2 } from "lucide-react";

export function RelatedLinks({ university, currentPage }: { university: University, currentPage: string }) {
  const isGeneric = university.id === "general";
  const slugPrefix = university.shortName ? university.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : university.id;
  const prefix = isGeneric ? '' : `${slugPrefix}-`;
  const namePrefix = isGeneric ? '' : `${university.shortName} `;

  const tools = [
    { type: "cgpa-calculator", name: `${namePrefix}CGPA Calculator` },
    { type: "sgpa-calculator", name: `${namePrefix}SGPA Calculator` },
    { type: "cgpa-to-percentage", name: `${namePrefix}CGPA to Percentage` },
    { type: "percentage-to-cgpa-calculator", name: `${namePrefix}Percentage to CGPA` },
    { type: "sgpa-to-cgpa-calculator", name: `${namePrefix}SGPA to CGPA` },
    { type: "marks-to-cgpa-calculator", name: `${namePrefix}Marks to CGPA` },
    { type: "grading-system", name: `${namePrefix}Grading System` }
  ];

  const relatedTools = tools.filter(t => t.type !== currentPage);

  return (
    <div className="mt-16 pt-12 border-t border-outline-variant/20 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
          <Link2 size={20} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Related Tools & Calculators</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedTools.map((tool) => (
          <Link 
            key={tool.type} 
            href={`/${prefix}${tool.type}`}
            className="p-4 rounded-xl border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/5 transition-all text-on-surface group"
          >
            <span className="font-semibold text-body-lg group-hover:text-primary transition-colors">
              {tool.name}
            </span>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Use the {tool.name.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold text-on-surface mb-4">Helpful Educational Guides</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/what-is-cgpa" className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 text-body-sm font-medium">What is CGPA?</Link>
          <Link href="/how-to-calculate-cgpa" className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 text-body-sm font-medium">How to Calculate CGPA</Link>
          <Link href="/cgpa-vs-gpa" className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 text-body-sm font-medium">CGPA vs GPA</Link>
          <Link href="/is-8-cgpa-good" className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 text-body-sm font-medium">Is an 8.0 CGPA Good?</Link>
          <Link href="/cgpa-for-placements" className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 text-body-sm font-medium">CGPA for Placements</Link>
        </div>
      </div>
    </div>
  );
}
