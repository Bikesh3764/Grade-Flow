import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | GradeFlow',
  description: 'Terms and Conditions for using GradeFlow calculators and services.',
};

export default function TermsConditionsPage() {
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
      <main className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-8 text-primary">Terms & Conditions</h1>
        <div className="space-y-6 text-on-surface-variant leading-relaxed">
          <p>Last updated: June 2026</p>
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using GradeFlow, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">2. Accuracy of Information</h2>
            <p>While we strive to provide the most accurate grading formulas based on official university regulations, GradeFlow is a tool for estimation. We do not guarantee absolute precision and our results should not be used as official academic records.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">3. User Responsibility</h2>
            <p>Users are responsible for verifying their calculated CGPA/SGPA with their respective university's official examination branch before submitting grades for placements or higher education.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
