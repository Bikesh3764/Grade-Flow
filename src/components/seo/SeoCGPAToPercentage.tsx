"use client";

import { useState } from "react";
import { University } from "@/lib/universities/types";
import { calculatePercentage } from "@/lib/universities/engine";
import { Percent, ArrowRight, Edit2, Check } from "lucide-react";
import { DynamicFAQ } from "./DynamicFAQ";

export function SeoCGPAToPercentage({ university }: { university: University }) {
  const regulation = university.regulations[0];
  const activeScale = {
    id: "seo-default",
    name: regulation.name,
    gradingScale: regulation.gradingScale
  };
  const maxPoints = activeScale.gradingScale.reduce((max, g) => Math.max(max, g.points), 0);

  const [cgpa, setCgpa] = useState("");
  const [customFormula, setCustomFormula] = useState(regulation.formulas.percentage);
  const [isEditingFormula, setIsEditingFormula] = useState(false);
  
  const parsedCgpa = parseFloat(cgpa);
  const isValid = !isNaN(parsedCgpa) && parsedCgpa >= 0 && parsedCgpa <= maxPoints;
  const hasError = cgpa !== "" && (!isValid || parsedCgpa < 0 || parsedCgpa > maxPoints);
  
  const percentage = regulation && isValid ? calculatePercentage(regulation, parsedCgpa, activeScale, customFormula) : 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Percent size={32} />
        </div>
        <h1 className="text-display-sm md:text-display-md font-bold tracking-tight text-on-background">
          {university.shortName} CGPA to Percentage
        </h1>
        <p className="text-body-lg text-on-surface-variant mt-3 max-w-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-center gap-1 sm:gap-4">
          <span>Convert your {university.name} CGPA to an equivalent percentage.</span>
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-tertiary" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          <div className="flex-1 w-full text-center md:text-left">
            <label className="block text-label-lg font-bold text-outline uppercase tracking-widest mb-4">Your CGPA (out of {maxPoints})</label>
            <input 
              type="number"
              step="0.01"
              min="0"
              max={maxPoints}
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder={`e.g. ${(maxPoints * 0.85).toFixed(1)}`}
              className="w-full text-center md:text-left text-display-lg font-bold bg-transparent border-b-2 border-outline-variant/50 focus:border-primary focus:outline-none transition-colors pb-2 placeholder:text-outline-variant"
            />
            {hasError && (
              <div className="mt-4 p-3 rounded-lg bg-error-container/50 border border-error/20 text-error text-label-sm text-left flex items-center gap-2">
                <span className="font-bold">Error:</span> CGPA cannot exceed {maxPoints} on the {university.shortName} scale.
              </div>
            )}
          </div>

          <div className="shrink-0 text-outline-variant hidden md:block">
            <ArrowRight size={48} />
          </div>

          <div className="flex-1 w-full flex flex-col items-center md:items-start gap-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <div>
              <div className="text-label-md text-outline font-semibold uppercase tracking-wider mb-2">Equivalent Percentage</div>
              <div className="flex items-baseline gap-2">
                <span className="text-display-lg font-bold text-primary">{isValid ? percentage.toFixed(2) : "0.00"}</span>
                <span className="text-title-lg text-on-surface-variant">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-surface-variant/30 text-body-sm text-on-surface-variant text-center max-w-2xl mx-auto flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <strong>Applied Formula:</strong> 
          {!isEditingFormula ? (
            <code className="bg-surface-container px-2 py-1 rounded border border-outline-variant/20">{customFormula}</code>
          ) : (
            <input 
              type="text" 
              value={customFormula} 
              onChange={(e) => setCustomFormula(e.target.value)}
              className="bg-surface-container px-2 py-1 rounded border border-primary/50 focus:outline-none w-48 text-center"
            />
          )}
          <button 
            onClick={() => setIsEditingFormula(!isEditingFormula)}
            className="p-1.5 rounded-full hover:bg-surface-variant text-outline hover:text-primary transition-colors ml-1"
            title={isEditingFormula ? "Save formula" : "Edit formula"}
          >
            {isEditingFormula ? <Check size={14} /> : <Edit2 size={14} />}
          </button>
        </div>
        {isEditingFormula && (
          <div className="text-xs text-outline-variant">
            Use <code className="bg-surface-container px-1 rounded">cgpa</code> as the variable (e.g., <code className="bg-surface-container px-1 rounded">cgpa * 9.5</code>)
          </div>
        )}
      </div>

      <DynamicFAQ university={university} pageType="cgpa-to-percentage" />
    </div>
  );
}
