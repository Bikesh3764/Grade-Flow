import React from 'react';
import { AlertTriangle, FileText, Upload } from 'lucide-react';
import Link from 'next/link';

interface VerificationBannerProps {
  universityName: string;
}

export function VerificationBanner({ universityName }: VerificationBannerProps) {
  return (
    <div className="w-full bg-secondary-container text-on-secondary-container rounded-2xl p-6 mb-8 border border-outline-variant/30 flex flex-col md:flex-row gap-6 items-start shadow-sm">
      <div className="flex-shrink-0 bg-secondary/10 p-3 rounded-full">
        <AlertTriangle className="w-8 h-8 text-secondary" />
      </div>
      
      <div className="flex-grow space-y-3">
        <h3 className="text-xl font-bold tracking-tight">
          Algorithm Verification in Progress
        </h3>
        <p className="text-body-md opacity-90 leading-relaxed">
          We are currently verifying the official grading regulations for <strong>{universityName}</strong>. 
          While we verify, the calculators below are running on our highly accurate <strong>General 10-Point Algorithm</strong>, 
          which safely covers 95% of standard Indian university grading conversions.
        </p>
        
        <div className="pt-3 flex flex-col sm:flex-row gap-4">
          <Link 
            href={`mailto:bikeshray3764@gmail.com?subject=Official Regulations for ${universityName}&body=Hi GradeFlow team,%0A%0AAttached is the official PDF grading regulation for ${universityName}.`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-label-lg font-medium hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
          >
            <Upload className="w-4 h-4" />
            Submit Official Regulation PDF
          </Link>
          <Link 
            href="/faq#accuracy"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-surface text-primary border border-outline/20 rounded-full font-label-lg font-medium hover:bg-surface-variant/50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            How accurate is this?
          </Link>
        </div>
      </div>
    </div>
  );
}
