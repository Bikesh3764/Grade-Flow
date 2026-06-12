"use client";

import { useState } from "react";
import { RefreshCw, ArrowRight, Globe } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getActiveRegulation } from "@/lib/universities/registry";

export default function GPAConverter() {
  const profile = useAppStore(state => state.profile);
  const { activeScale } = getActiveRegulation(profile);
  const maxPoints = activeScale.gradingScale.reduce((max, g) => Math.max(max, g.points), 0);

  const [cgpa, setCgpa] = useState("");
  
  const parsedCgpa = parseFloat(cgpa);
  const isValid = !isNaN(parsedCgpa) && parsedCgpa >= 0 && parsedCgpa <= maxPoints;
  const hasError = cgpa !== "" && (!isValid || parsedCgpa < 0 || parsedCgpa > maxPoints);
  
  const gpa4Scale = isValid ? ((parsedCgpa / maxPoints) * 4).toFixed(2) : "0.00";
  
  let usGrade = "-";
  if (isValid) {
    if (parsedCgpa >= 9) usGrade = "A";
    else if (parsedCgpa >= 8) usGrade = "B";
    else if (parsedCgpa >= 7) usGrade = "C";
    else if (parsedCgpa >= 6) usGrade = "D";
    else usGrade = "F";
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Globe size={32} />
        </div>
        <h1 className="text-display-sm font-bold tracking-tight text-on-background">US GPA Converter</h1>
        <p className="text-body-lg text-on-surface-variant mt-3 max-w-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-center gap-1 sm:gap-4">
          <span>Convert your current CGPA to a standard US 4.0 GPA scale.</span>
          <span className="hidden sm:inline-block text-outline-variant">•</span>
          <span>Scale: <strong className="text-secondary">{activeScale.name}</strong></span>
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-tertiary to-secondary" />
        
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
              className="w-full h-12 pl-4 pr-16 rounded-xl bg-surface-container border border-outline-variant/30 text-title-lg font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
              <div className="text-label-md text-outline font-semibold uppercase tracking-wider mb-2">US 4.0 Scale</div>
              <div className="flex items-baseline gap-2">
                <span className="text-display-lg font-bold text-primary">{isValid ? gpa4Scale : "0.00"}</span>
                <span className="text-title-lg text-on-surface-variant">/ 4.0</span>
              </div>
            </div>

            <div className="w-full h-px bg-outline-variant/30" />

            <div>
              <div className="text-label-md text-outline font-semibold uppercase tracking-wider mb-2">Est. Letter Grade</div>
              <span className="text-display-md font-bold text-tertiary">{isValid ? usGrade : "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center max-w-lg mx-auto">
        <p className="text-label-sm text-outline">
          <strong>Note:</strong> This uses a standard linear conversion factor `(CGPA / {maxPoints}) * 4`. Official conversion guidelines may vary depending on the target university or evaluation service (like WES).
        </p>
      </div>
    </div>
  );
}
