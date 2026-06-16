import Link from 'next/link';
import { GraduationCap, ArrowLeft, BookOpen, MessageCircle, FileQuestion } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center | GradeFlow',
  description: 'Support, guides, and resources for using GradeFlow CGPA, SGPA, and percentage calculators effectively.',
  alternates: { canonical: 'https://cgpacalculator.xyz/help-center' },
  openGraph: {
    title: 'Help Center | GradeFlow',
    description: 'Support, guides, and resources for using GradeFlow CGPA, SGPA, and percentage calculators effectively.',
    url: 'https://cgpacalculator.xyz/help-center',
    siteName: 'GradeFlow',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help Center | GradeFlow',
    description: 'Support, guides, and resources for using GradeFlow CGPA, SGPA, and percentage calculators effectively.',
  },
};

export default function HelpCenterPage() {
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
        <h1 className="text-4xl font-bold mb-4 text-primary text-center">GradeFlow Help Center</h1>
        <p className="text-on-surface-variant mb-12 text-center text-lg max-w-2xl mx-auto">How can we help you today? Choose a category below to find the answers you need.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/faq" className="bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
            <FileQuestion className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-on-surface mb-2">Frequently Asked Questions</h2>
            <p className="text-on-surface-variant">Find quick answers about grading formulas, calculations, and general GradeFlow usage.</p>
          </Link>
          
          <Link href="/contact" className="bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
            <MessageCircle className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-on-surface mb-2">Contact Support</h2>
            <p className="text-on-surface-variant">Can't find what you're looking for? Reach out to our support team directly or request a new university.</p>
          </Link>
          
          <Link href="/cgpa-calculator" className="bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group md:col-span-2">
            <BookOpen className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-on-surface mb-2">Calculator Guides</h2>
            <p className="text-on-surface-variant">Jump straight into our core tools and learn how to use the CGPA, SGPA, and Percentage converters effectively to track your academic progress.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
