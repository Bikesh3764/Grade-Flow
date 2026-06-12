import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | GradeFlow',
  description: 'Get in touch with the GradeFlow team for support and university requests.',
};

export default function ContactPage() {
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
        <h1 className="text-4xl font-bold mb-4 text-primary">Contact Us</h1>
        <p className="text-on-surface-variant mb-8 text-lg">Have a question or want to request a new university? We'd love to hear from you.</p>
        
        <div className="bg-surface p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="text-2xl font-bold text-on-surface mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-on-surface mb-2">General Support & Feedback</h3>
              <p className="text-on-surface-variant">Email us directly at: <a href="mailto:bikeshray3764@gmail.com" className="text-primary hover:underline">bikeshray3764@gmail.com</a></p>
            </div>
            
            <div>
              <h3 className="font-bold text-on-surface mb-2">University Updates</h3>
              <p className="text-on-surface-variant">If you notice an incorrect formula for your university, please email us the official regulation PDF and we will update our database within 48 hours.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
