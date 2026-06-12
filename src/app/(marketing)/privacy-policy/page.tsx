import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | GradeFlow',
  description: 'Privacy Policy and data protection guidelines for GradeFlow.',
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl font-bold mb-8 text-primary">Privacy Policy</h1>
        <div className="space-y-6 text-on-surface-variant leading-relaxed">
          <p>Last updated: June 2026</p>
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">1. Data Collection</h2>
            <p>At GradeFlow, we prioritize your privacy. We collect minimal analytics data to improve the user experience of our grading calculators. We do not store sensitive personal academic records without explicit consent.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">2. Cookies</h2>
            <p>We use essential cookies to maintain user sessions and preferences. By using GradeFlow, you consent to our use of functional cookies.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4">3. Third-Party Services</h2>
            <p>Our calculators run entirely locally in your browser. We do not share your entered grades or performance metrics with any third parties or universities.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
