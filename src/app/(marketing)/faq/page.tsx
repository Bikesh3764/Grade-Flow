import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { DynamicFAQ } from '@/components/seo/DynamicFAQ';
import { generalUniversity } from '@/lib/universities/registry';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | GradeFlow',
  description: 'Answers to common questions about calculating CGPA, SGPA, percentage conversions, and using GradeFlow academic tools.',
  alternates: { canonical: 'https://cgpacalculator.xyz/faq' },
  openGraph: {
    title: 'Frequently Asked Questions | GradeFlow',
    description: 'Answers to common questions about calculating CGPA, SGPA, percentage conversions, and using GradeFlow academic tools.',
    url: 'https://cgpacalculator.xyz/faq',
    siteName: 'GradeFlow',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions | GradeFlow',
    description: 'Answers to common questions about calculating CGPA, SGPA, percentage conversions, and using GradeFlow academic tools.',
  },
};

export default function FAQPage() {
  return (
    <div className="bg-background text-on-surface font-sans min-h-screen">
      <nav className="bg-surface/80 dark:bg-on-background/80 backdrop-blur-xl w-full top-0 sticky border-b border-outline-variant/30 z-50">
        <div className="flex justify-between items-center w-full px-8 max-w-7xl mx-auto h-20">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="text-primary w-8 h-8" />
            <span className="font-headline-md font-bold text-primary">GradeFlow</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4 text-primary text-center">Frequently Asked Questions</h1>
        <p className="text-on-surface-variant mb-12 text-center text-lg max-w-2xl mx-auto">Everything you need to know about academic grading systems and how to use GradeFlow effectively.</p>
        
        <div className="bg-surface rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
          <DynamicFAQ university={generalUniversity} pageType="home" />
        </div>
      </main>
    </div>
  );
}
