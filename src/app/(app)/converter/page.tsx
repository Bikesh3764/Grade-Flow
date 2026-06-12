"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { getActiveRegulation } from "@/lib/universities/registry";
import { calculatePercentage } from "@/lib/universities/engine";
import { Percent, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PercentageConverter() {
  const profile = useAppStore(state => state.profile);

  const { university, regulation, isGeneral, activeScale } = getActiveRegulation(profile);
  const maxPoints = activeScale.gradingScale.reduce((max, g) => Math.max(max, g.points), 0);

  const [cgpa, setCgpa] = useState("");
  
  const parsedCgpa = parseFloat(cgpa);
  const isValid = !isNaN(parsedCgpa) && parsedCgpa >= 0 && parsedCgpa <= maxPoints;
  const hasError = cgpa !== "" && (!isValid || parsedCgpa < 0 || parsedCgpa > maxPoints);
  
  const percentage = regulation && isValid ? calculatePercentage(regulation, parsedCgpa, activeScale) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Percent size={32} />
        </div>
        <h1 className="text-display-sm font-bold tracking-tight text-on-background">Percentage Converter</h1>
        <p className="text-body-lg text-on-surface-variant mt-3 max-w-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-center gap-1 sm:gap-4">
          <span>Convert your CGPA to an equivalent percentage using official formulas.</span>
          <span className="hidden sm:inline-block text-outline-variant">•</span>
          <span>Scale: <strong className="text-secondary">{activeScale.name}</strong></span>
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
                <span className="font-bold">Error:</span> CGPA cannot exceed {maxPoints} on the current scale.
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

      <div className="p-4 rounded-xl bg-surface-variant/30 text-body-sm text-on-surface-variant text-center max-w-2xl mx-auto">
        <strong>Formula Applied:</strong> <code className="bg-surface-container px-2 py-1 rounded border border-outline-variant/20">{activeScale.id !== 'university-default' ? `(CGPA / ${maxPoints}) * 100` : regulation.formulas.percentage}</code>
      </div>
    </div>
  );
}
