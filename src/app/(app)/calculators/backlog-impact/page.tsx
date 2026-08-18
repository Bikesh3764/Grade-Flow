"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { getActiveRegulation } from "@/lib/universities/registry";
import { FileBarChart, AlertTriangle, RefreshCw } from "lucide-react";

export default function BacklogImpact() {
  const profile = useAppStore(state => state.profile);
  const { university, activeScale } = getActiveRegulation(profile);
  const maxPoints = activeScale.gradingScale.reduce((max, g) => Math.max(max, g.points), 0);

  const [subjectCredits, setSubjectCredits] = useState("3");
  const [expectedGrade, setExpectedGrade] = useState("");
  const [clearedGrade, setClearedGrade] = useState("");
  const [otherCredits, setOtherCredits] = useState("18");
  const [otherSgpa, setOtherSgpa] = useState("8.0");

  const failGradeDef = activeScale.gradingScale.find(g => g.points === 0);
  const failPoints = failGradeDef ? failGradeDef.points : 0;
  const expectedGradeDef = activeScale.gradingScale.find(g => g.grade.toUpperCase() === expectedGrade.toUpperCase());
  const clearedGradeDef = activeScale.gradingScale.find(g => g.grade.toUpperCase() === clearedGrade.toUpperCase());

  const sc = Number(subjectCredits);
  const oc = Number(otherCredits);
  const os = Number(otherSgpa);

  const hasSubjectCreditsError = subjectCredits !== "" && (!Number.isFinite(sc) || sc <= 0);
  const hasOtherCreditsError = otherCredits !== "" && (!Number.isFinite(oc) || oc < 0);
  const hasOtherSgpaError = otherSgpa !== "" && (!Number.isFinite(os) || os < 0 || os > maxPoints);
  const isValidInputs = !hasSubjectCreditsError && !hasOtherCreditsError && !hasOtherSgpaError && subjectCredits !== "" && otherCredits !== "" && otherSgpa !== "";

  let initialSgpa = 0;
  if (expectedGradeDef && isValidInputs && oc + sc > 0) {
    initialSgpa = ((os * oc) + (expectedGradeDef.points * sc)) / (oc + sc);
  }

  let backlogSgpa = 0;
  if (isValidInputs && oc + sc > 0) {
    backlogSgpa = ((os * oc) + (failPoints * sc)) / (oc + sc);
  }

  let clearedSgpa = 0;
  if (clearedGradeDef && isValidInputs && oc + sc > 0) {
    clearedSgpa = ((os * oc) + (clearedGradeDef.points * sc)) / (oc + sc);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-6 shadow-sm"><FileBarChart size={32} /></div>
        <h1 className="text-display-sm font-bold tracking-tight text-on-background">Backlog Impact</h1>
        <p className="text-body-lg text-on-surface-variant mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span>Compare the effect of a fail, an expected grade, and a later clearance using the active grading scale for <strong className="text-primary">{university?.shortName || 'your profile'}</strong>.</span>
          <span className="hidden sm:inline-block text-outline-variant">•</span>
          <span>Scale: <strong className="text-secondary">{activeScale.name}</strong></span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-6 space-y-6">
          <h3 className="text-title-md font-bold text-on-surface mb-2">Subject Details</h3>
          <div>
            <label className="block text-label-sm font-semibold text-outline uppercase tracking-wider mb-2">Subject Credits</label>
            <input type="number" step="0.5" min="0.01" value={subjectCredits} onChange={(e) => setSubjectCredits(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-surface-container border border-outline-variant/30 text-body-lg focus:outline-none focus:border-error transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm font-semibold text-outline uppercase tracking-wider mb-2">Expected Grade</label>
              <select value={expectedGrade} onChange={(e) => setExpectedGrade(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-surface-container border border-outline-variant/30 focus:outline-none focus:border-error text-body-sm font-semibold">
                <option value="">Select</option>
                {activeScale.gradingScale.filter(g => g.points > 0).map(scale => <option key={scale.grade} value={scale.grade}>{scale.grade}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label-sm font-semibold text-outline uppercase tracking-wider mb-2">Cleared Grade</label>
              <select value={clearedGrade} onChange={(e) => setClearedGrade(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-surface-container border border-outline-variant/30 focus:outline-none focus:border-error text-body-sm font-semibold">
                <option value="">Select</option>
                {activeScale.gradingScale.filter(g => g.points > 0).map(scale => <option key={scale.grade} value={scale.grade}>{scale.grade}</option>)}
              </select>
            </div>
          </div>

          <div className="h-px w-full bg-outline-variant/20 my-4" />
          <h3 className="text-title-md font-bold text-on-surface mb-2">Rest of the Semester</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm font-semibold text-outline uppercase tracking-wider mb-2">Other Credits</label>
              <input type="number" step="0.5" min="0" value={otherCredits} onChange={(e) => setOtherCredits(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-surface-container border border-outline-variant/30 text-body-lg focus:outline-none focus:border-error transition-all" />
            </div>
            <div>
              <label className="block text-label-sm font-semibold text-outline uppercase tracking-wider mb-2">Other SGPA</label>
              <input type="number" step="0.01" min="0" max={maxPoints} value={otherSgpa} onChange={(e) => setOtherSgpa(e.target.value)} placeholder={`e.g. ${(maxPoints * 0.8).toFixed(1)}`} className="w-full h-11 px-4 rounded-xl bg-surface-container border border-outline-variant/30 text-body-lg focus:outline-none focus:border-error transition-all" />
            </div>
          </div>

          {(hasSubjectCreditsError || hasOtherCreditsError || hasOtherSgpaError) && (
            <div className="mt-4 p-3 rounded-lg bg-error-container/50 border border-error/20 text-error text-label-sm flex flex-col gap-1">
              {hasOtherSgpaError && <div><span className="font-bold">Error:</span> Other SGPA must be between 0 and {maxPoints}.</div>}
              {(hasSubjectCreditsError || hasOtherCreditsError) && <div><span className="font-bold">Error:</span> Credits must be valid non-negative numbers, with subject credits greater than 0.</div>}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
            <h3 className="text-title-sm font-semibold text-outline uppercase tracking-wider mb-4">Original Expectation</h3>
            <div className="flex items-end gap-3"><span className="text-display-lg font-bold text-on-surface">{initialSgpa > 0 ? initialSgpa.toFixed(2) : "-"}</span><span className="text-title-md text-on-surface-variant pb-1">SGPA</span></div>
            <p className="text-body-sm text-on-surface-variant mt-2">If you passed with your expected grade ({expectedGrade || "?"}).</p>
          </div>

          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border-error/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full" />
            <h3 className="text-title-sm font-semibold text-error uppercase tracking-wider mb-4 flex items-center gap-2"><AlertTriangle size={18} /> Failed Semester</h3>
            <div className="flex items-end gap-3"><span className="text-display-lg font-bold text-error">{backlogSgpa > 0 ? backlogSgpa.toFixed(2) : "-"}</span><span className="text-title-md text-error/70 pb-1">SGPA</span></div>
            <p className="text-body-sm text-error/80 mt-2">With an F grade (0 points) in this subject.</p>
          </div>

          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border-tertiary/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-bl-full" />
            <h3 className="text-title-sm font-semibold text-tertiary uppercase tracking-wider mb-4 flex items-center gap-2"><RefreshCw size={18} /> Cleared Transcript</h3>
            <div className="flex items-end gap-3"><span className="text-display-lg font-bold text-tertiary">{clearedSgpa > 0 ? clearedSgpa.toFixed(2) : "-"}</span><span className="text-title-md text-tertiary/70 pb-1">SGPA</span></div>
            <p className="text-body-sm text-tertiary/80 mt-2">Effective SGPA if the subject is represented with the cleared grade ({clearedGrade || "?"}).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
