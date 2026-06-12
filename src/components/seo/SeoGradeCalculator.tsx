"use client";

import { useState } from "react";
import { University } from "@/lib/universities/types";
import { Calculator } from "lucide-react";
import { DynamicFAQ } from "./DynamicFAQ";

export function SeoGradeCalculator({ university }: { university: University }) {
  const regulation = university.regulations[0];
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  const gradeDetails = selectedGrade 
    ? regulation.gradingScale.find(g => g.grade === selectedGrade)
    : null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Calculator size={32} />
        </div>
        <h1 className="text-display-sm md:text-display-md font-bold tracking-tight text-on-background">
          {university.shortName} Grade Calculator
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Select a letter grade to find its equivalent points and official description according to <strong className="text-primary">{university.name}</strong> regulations.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 sm:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex-1 w-full space-y-6">
            <label className="block text-title-md font-bold text-on-surface">Select your Grade</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {regulation.gradingScale.map((g) => (
                <button
                  key={g.grade}
                  onClick={() => setSelectedGrade(g.grade)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all font-bold text-lg ${
                    selectedGrade === g.grade 
                      ? 'border-primary bg-primary-container text-on-primary-container' 
                      : 'border-outline-variant/30 hover:border-primary/50 text-on-surface'
                  }`}
                >
                  {g.grade}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full bg-surface-container-low p-6 sm:p-8 rounded-2xl border border-outline-variant/30 text-center min-h-[250px] flex flex-col justify-center">
            {gradeDetails ? (
              <div className="space-y-4 animate-in zoom-in-95 duration-200">
                <div className="text-display-lg font-bold text-primary">{gradeDetails.points}</div>
                <div className="text-title-md font-semibold text-on-surface uppercase tracking-widest text-outline">Grade Points</div>
                
                <div className="mt-6 pt-6 border-t border-outline-variant/20">
                  <div className="text-body-lg text-on-surface-variant">Description</div>
                  <div className="text-title-lg font-bold text-secondary">{gradeDetails.description}</div>
                </div>
              </div>
            ) : (
              <div className="text-on-surface-variant flex flex-col items-center gap-3">
                <Calculator size={48} className="opacity-20" />
                <p>Select a grade from the left to view its exact details and points.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-title-lg font-bold text-on-surface mb-6">Complete {university.shortName} Grading Table</h3>
        <div className="overflow-x-auto rounded-2xl border border-outline-variant/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="p-4 font-semibold text-on-surface border-b border-outline-variant/30">Letter Grade</th>
                <th className="p-4 font-semibold text-on-surface border-b border-outline-variant/30">Grade Points</th>
                <th className="p-4 font-semibold text-on-surface border-b border-outline-variant/30">Description</th>
              </tr>
            </thead>
            <tbody>
              {regulation.gradingScale.map((g) => (
                <tr key={g.grade} className="border-b border-outline-variant/10 hover:bg-surface-variant/10">
                  <td className="p-4 font-bold text-primary">{g.grade}</td>
                  <td className="p-4 text-on-surface font-mono">{g.points}</td>
                  <td className="p-4 text-on-surface-variant">{g.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DynamicFAQ university={university} pageType="grade-calculator" />
    </div>
  );
}
