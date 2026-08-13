import Metadata from 'next';
import Link from 'next/link';
import registryData from '@/../data/universities/registry.json';
import { Building2, GraduationCap, ChevronRight, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'All Universities CGPA & SGPA Calculators Directory | GradeFlow',
  description: 'Explore the complete directory of CGPA calculators, SGPA converters, and official grading systems for 1,000+ Indian universities including IITs, NITs, VIT, SRM, KTU, VTU, and more.',
  alternates: {
    canonical: 'https://cgpacalculator.xyz/directory',
  },
  openGraph: {
    title: 'All Universities CGPA & SGPA Calculators Directory | GradeFlow',
    description: 'Explore the complete directory of CGPA calculators and grading systems for 1,000+ Indian universities.',
    url: 'https://cgpacalculator.xyz/directory',
    siteName: 'GradeFlow',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Universities Directory | GradeFlow',
    description: 'Complete list of 1,000+ university CGPA calculators and grading systems.',
  },
};

interface University {
  id: string;
  name: string;
  shortName?: string;
  location: string;
  type?: string;
  nirfRanking?: string;
}

const universitiesList = registryData as University[];

// Group universities by category / type
const categories = [
  { name: 'IITs (Indian Institutes of Technology)', filter: (u: University) => u.type === 'IIT' },
  { name: 'NITs (National Institutes of Technology)', filter: (u: University) => u.type === 'NIT' },
  { name: 'IIITs (Indian Institutes of Information Technology)', filter: (u: University) => u.type === 'IIIT' },
  { name: 'GFTIs & Central Universities', filter: (u: University) => u.type === 'GFTI' },
  { name: 'State & Private Universities', filter: (u: University) => !['IIT', 'NIT', 'IIIT', 'GFTI'].includes(u.type || '') },
];

export default function UniversityDirectoryPage() {
  return (
    <div className="min-h-screen bg-background text-on-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm">
            <GraduationCap size={18} />
            <span>1,000+ Institutions Covered</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-on-background">
            University CGPA & SGPA Directory
          </h1>
          <p className="text-lg text-on-surface-variant max-w-3xl mx-auto">
            Browse our comprehensive index of university-specific academic calculators, grading scales, SGPA converters, and percentage formulas.
          </p>
        </div>

        {/* Categories & Links */}
        {categories.map((cat, catIdx) => {
          const unis = universitiesList.filter(cat.filter);
          if (unis.length === 0) return null;

          return (
            <section key={catIdx} className="space-y-6 bg-surface-container-low p-6 sm:p-8 rounded-3xl border border-outline-variant/30">
              <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
                <Building2 className="text-primary" size={24} />
                <h2 className="text-2xl font-bold text-on-surface">{cat.name}</h2>
                <span className="ml-auto text-xs font-bold px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full">
                  {unis.length} Colleges
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {unis.map((uni) => {
                  const slugPrefix = uni.shortName
                    ? uni.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    : uni.id;

                  return (
                    <div 
                      key={uni.id} 
                      className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-on-surface text-base line-clamp-1">
                            {uni.shortName || uni.name}
                          </h3>
                          {uni.nirfRanking && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-tertiary-container text-on-tertiary-container shrink-0">
                              #{uni.nirfRanking}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant line-clamp-1">{uni.name}</p>
                        <p className="text-[11px] text-outline mt-1">{uni.location}</p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-outline-variant/10 text-xs">
                        <Link 
                          href={`/${slugPrefix}-cgpa-calculator`}
                          className="flex items-center justify-between text-primary font-medium hover:underline"
                        >
                          <span>CGPA Calculator</span>
                          <ChevronRight size={14} />
                        </Link>
                        <Link 
                          href={`/${slugPrefix}-sgpa-calculator`}
                          className="flex items-center justify-between text-on-surface-variant hover:text-primary font-medium transition-colors"
                        >
                          <span>SGPA Calculator</span>
                          <ChevronRight size={14} />
                        </Link>
                        <Link 
                          href={`/${slugPrefix}-grading-system`}
                          className="flex items-center justify-between text-on-surface-variant hover:text-primary font-medium transition-colors"
                        >
                          <span>Grading System</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

      </div>
    </div>
  );
}
