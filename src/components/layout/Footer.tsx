import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest  w-full border-t border-outline-variant/30 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter px-margin-desktop py-xl max-w-max-width mx-auto">
        <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col gap-md">
          <div className="flex items-center gap-2 mb-sm">
            <GraduationCap className="text-primary  w-8 h-8" />
            <span className="font-headline-md text-headline-md font-bold text-primary ">GradeFlow</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant  max-w-xs">
            Your personal academic strategist. Precision tracking for ambitious students.
          </p>
          <div className="font-label-sm text-label-sm text-on-surface-variant  mt-auto pt-md">
            © {new Date().getFullYear()} GradeFlow Intelligence. All rights reserved.
          </div>
        </div>
        <div className="flex flex-col gap-sm">
          <h4 className="font-label-md text-label-md text-on-surface  font-bold mb-xs uppercase tracking-wider">Tools</h4>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/cgpa-calculator">CGPA Calculator</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/sgpa-calculator">SGPA Calculator</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/cgpa-to-percentage">CGPA to Percentage</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/percentage-to-cgpa-calculator">Percentage to CGPA</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/sgpa-to-cgpa-calculator">SGPA to CGPA</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/gpa-to-cgpa-calculator">GPA to CGPA</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/marks-to-cgpa-calculator">Marks to CGPA</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/grade-calculator">Grade Calculator</Link>
        </div>
        <div className="flex flex-col gap-sm">
          <h4 className="font-label-md text-label-md text-on-surface  font-bold mb-xs uppercase tracking-wider">Resources</h4>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/directory">All Universities Directory</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/university-hub">University Hub</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/help-center">Help Center</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/what-is-cgpa">Guides</Link>
        </div>
        <div className="flex flex-col gap-sm">
          <h4 className="font-label-md text-label-md text-on-surface  font-bold mb-xs uppercase tracking-wider">Legal</h4>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/privacy-policy">Privacy Policy</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/terms-and-conditions">Terms</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/faq">FAQ</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
