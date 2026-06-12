import { University } from "@/lib/universities/types";
import { BookOpen, GraduationCap, FileText, Scale } from "lucide-react";
import { DynamicFAQ } from "./DynamicFAQ";

export function SeoGradingSystem({ university }: { university: University }) {
  const regulation = university.regulations[0];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4 pb-8 border-b border-outline-variant/30">
        <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto mb-6 shadow-sm">
          <GraduationCap size={32} />
        </div>
        <h1 className="text-display-sm md:text-display-md font-bold tracking-tight text-on-background">
          {university.name} Grading System
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-3xl mx-auto">
          A complete guide to the official grading system, grade points, passing criteria, and SGPA/CGPA calculation rules at {university.shortName}.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* About the System */}
        <div className="glass-panel rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 text-title-lg font-bold text-on-surface">
            <BookOpen className="text-primary" />
            <h3>Overview</h3>
          </div>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            {university.name} ({university.shortName}), located in {university.location}, follows a standard credit-based semester system. 
            Students are evaluated based on their performance in various courses, which are assigned specific credit weights. 
            The university uses a {regulation.name} to assess academic performance.
          </p>
          <div className="p-4 rounded-xl bg-surface-variant/30 border border-outline-variant/20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-semibold">Current Regulation:</span>
              <span className="text-primary font-bold">{regulation.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-semibold">Highest Grade Point:</span>
              <span className="text-primary font-bold">
                {Math.max(...regulation.gradingScale.map(g => g.points))}
              </span>
            </div>
          </div>
        </div>

        {/* Formulas */}
        <div className="glass-panel rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 text-title-lg font-bold text-on-surface">
            <FileText className="text-tertiary" />
            <h3>Official Formulas</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30">
              <div className="text-label-sm font-bold text-outline uppercase tracking-wider mb-2">SGPA Calculation</div>
              <code className="text-body-sm font-mono text-primary break-all">{regulation.formulas.sgpa}</code>
            </div>
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30">
              <div className="text-label-sm font-bold text-outline uppercase tracking-wider mb-2">CGPA Calculation</div>
              <code className="text-body-sm font-mono text-primary break-all">{regulation.formulas.cgpa}</code>
            </div>
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30">
              <div className="text-label-sm font-bold text-outline uppercase tracking-wider mb-2">Percentage Conversion</div>
              <code className="text-body-sm font-mono text-tertiary break-all">{regulation.formulas.percentage}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Full Grading Scale */}
      <div className="space-y-6 pt-6 border-t border-outline-variant/30">
        <div className="flex items-center gap-3 text-title-lg font-bold text-on-surface mb-2">
          <Scale className="text-secondary" />
          <h2>{university.shortName} Grading Scale Table</h2>
        </div>
        <p className="text-body-md text-on-surface-variant max-w-3xl">
          Below is the official mapping of letter grades to grade points at {university.shortName}. Your SGPA and CGPA are calculated directly from these points.
        </p>

        <div className="overflow-hidden rounded-2xl border border-outline-variant/30 shadow-sm">
          <table className="w-full text-left border-collapse bg-surface-container-lowest">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="p-4 md:p-6 font-semibold text-on-surface border-b border-outline-variant/30">Letter Grade</th>
                <th className="p-4 md:p-6 font-semibold text-on-surface border-b border-outline-variant/30">Grade Points</th>
                <th className="p-4 md:p-6 font-semibold text-on-surface border-b border-outline-variant/30">Description</th>
              </tr>
            </thead>
            <tbody>
              {regulation.gradingScale.map((g, idx) => (
                <tr key={g.grade} className="border-b border-outline-variant/10 hover:bg-surface-variant/10 transition-colors">
                  <td className="p-4 md:p-6 font-bold text-primary text-title-md">{g.grade}</td>
                  <td className="p-4 md:p-6 text-on-surface font-mono text-lg">{g.points}</td>
                  <td className="p-4 md:p-6 text-on-surface-variant font-medium">{g.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DynamicFAQ university={university} pageType="grading-system" />
    </div>
  );
}
