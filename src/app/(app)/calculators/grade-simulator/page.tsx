"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { getActiveRegulation } from "@/lib/universities/registry";
import { calculateCGPA } from "@/lib/universities/engine";
import { TrendingUp, Plus, Trash2, ArrowRight } from "lucide-react";

export default function GradeSimulator() {
  const profile = useAppStore(state => state.profile);
  const { regulation, activeScale } = getActiveRegulation(profile);
  const maxPoints = activeScale.gradingScale.reduce((max, g) => Math.max(max, g.points), 0);

  const compatibleSemesters = profile.semesters.filter(
    sem => sem.sgpa !== undefined && Number.isFinite(sem.sgpa) && sem.totalCredits !== undefined && Number.isFinite(sem.totalCredits) && sem.totalCredits > 0 && sem.sgpa >= 0 && sem.sgpa <= maxPoints
  );

  const currentCgpa = compatibleSemesters.length > 0
    ? calculateCGPA(regulation, compatibleSemesters.map(sem => ({ sgpa: sem.sgpa as number, credits: sem.totalCredits as number })))
    : 0;
  const currentTotalCredits = compatibleSemesters.reduce((sum, sem) => sum + (sem.totalCredits as number), 0);

  const [simulatedSemesters, setSimulatedSemesters] = useState<{ id: string; name: string; sgpa: string; credits: string }[]>([
    { id: "1", name: `Semester ${compatibleSemesters.length + 1}`, sgpa: "", credits: "" }
  ]);

  const addInput = () => {
    setSimulatedSemesters([
      ...simulatedSemesters,
      { id: Date.now().toString(), name: `Semester ${compatibleSemesters.length + simulatedSemesters.length + 1}`, sgpa: "", credits: "" }
    ]);
  };

  const removeInput = (id: string) => {
    if (simulatedSemesters.length === 1) return;
    setSimulatedSemesters(simulatedSemesters.filter(input => input.id !== id));
  };

  const handleUpdate = (id: string, field: "sgpa" | "credits", value: string) => {
    setSimulatedSemesters(simulatedSemesters.map(input => input.id === id ? { ...input, [field]: value } : input));
  };

  const validSimulatedSemesters = simulatedSemesters
    .filter(i => {
      const s = Number(i.sgpa);
      const c = Number(i.credits);
      return i.sgpa !== "" && i.credits !== "" && Number.isFinite(s) && Number.isFinite(c) && s >= 0 && s <= maxPoints && c > 0;
    })
    .map(i => ({ sgpa: Number(i.sgpa), credits: Number(i.credits) }));

  const allSemesters = [
    ...compatibleSemesters.map(sem => ({ sgpa: sem.sgpa as number, credits: sem.totalCredits as number })),
    ...validSimulatedSemesters
  ];

  const simulatedCgpa = allSemesters.length > 0 ? calculateCGPA(regulation, allSemesters) : 0;
  const diff = (simulatedCgpa - currentCgpa).toFixed(2);
  const isPositive = Number(diff) >= 0;

  const hasSgpaError = simulatedSemesters.some(i => {
    const s = Number(i.sgpa);
    return i.sgpa !== "" && (!Number.isFinite(s) || s < 0 || s > maxPoints);
  });
  const hasCreditsError = simulatedSemesters.some(i => {
    const c = Number(i.credits);
    return i.credits !== "" && (!Number.isFinite(c) || c <= 0);
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-6 shadow-sm"><TrendingUp size={32} /></div>
        <h1 className="text-display-sm font-bold tracking-tight text-on-background">Future Grade Simulator</h1>
        <p className="text-body-lg text-on-surface-variant mt-3 max-w-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-center gap-1 sm:gap-4">
          <span>See exactly how future performance will impact your final CGPA.</span>
          <span className="hidden sm:inline-block text-outline-variant">•</span>
          <span>Scale: <strong className="text-secondary">{activeScale.name}</strong></span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-title-md font-bold text-on-surface">Simulate Semesters</h3>
              <button type="button" onClick={addInput} className="text-label-sm font-semibold text-primary flex items-center gap-1 hover:text-primary/80 transition-colors"><Plus size={16} /> Add Semester</button>
            </div>

            <div className="space-y-4">
              {simulatedSemesters.map((input) => (
                <div key={input.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest transition-all hover:border-outline-variant">
                  <div className="flex-1">
                    <label className="block text-label-sm text-outline font-semibold mb-1 uppercase tracking-wider">Expected SGPA</label>
                    <input type="number" step="0.01" min="0" max={maxPoints} value={input.sgpa} onChange={(e) => handleUpdate(input.id, "sgpa", e.target.value)} placeholder="e.g. 9.0" className="w-full h-10 px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-label-sm text-outline font-semibold mb-1 uppercase tracking-wider">Credits</label>
                    <input type="number" step="0.5" min="0.01" value={input.credits} onChange={(e) => handleUpdate(input.id, "credits", e.target.value)} placeholder="e.g. 22" className="w-full h-10 px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-sm" />
                  </div>
                  <div className="flex items-end pb-1 shrink-0">
                    <button type="button" aria-label={`Remove ${input.name || 'semester'}`} onClick={() => removeInput(input.id)} disabled={simulatedSemesters.length === 1} className="p-2 rounded-lg text-outline hover:text-error hover:bg-error-container/50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-outline"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>

            {(hasSgpaError || hasCreditsError) && (
              <div className="mt-4 p-3 rounded-lg bg-error-container/50 border border-error/20 text-error text-label-sm flex flex-col gap-1">
                {hasSgpaError && <div><span className="font-bold">Error:</span> SGPA must be between 0 and {maxPoints}.</div>}
                {hasCreditsError && <div><span className="font-bold">Error:</span> Credits must be valid positive numbers.</div>}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border-t-4 border-t-primary">
            <h3 className="text-title-lg font-bold text-on-surface mb-6">Impact Analysis</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/20"><span className="text-body-sm font-semibold text-outline">Current CGPA</span><span className="text-title-md font-bold text-on-surface">{currentCgpa > 0 ? currentCgpa.toFixed(2) : "0.00"}</span></div>
              <div className="flex justify-center text-outline-variant"><ArrowRight size={24} className="rotate-90 md:rotate-0" /></div>
              <div className="p-4 rounded-xl bg-primary-container text-on-primary-container border border-primary/20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full" />
                <div className="text-label-sm font-semibold uppercase tracking-wider mb-1 opacity-80">Simulated CGPA</div>
                <div className="flex items-baseline justify-center gap-2"><span className="text-display-lg font-bold">{simulatedCgpa.toFixed(2)}</span><span className="text-title-lg opacity-70">/ {maxPoints}</span></div>
                {validSimulatedSemesters.length > 0 && <div className={`mt-2 text-label-md font-bold ${isPositive ? 'text-primary' : 'text-error'}`}>{isPositive ? '+' : ''}{diff} impact</div>}
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 text-center"><div className="text-label-sm font-semibold text-outline uppercase tracking-wider mb-2">Total Credits Active</div><p className="text-display-md text-on-surface font-bold">{currentTotalCredits + validSimulatedSemesters.reduce((sum, s) => sum + s.credits, 0)}</p></div>
        </div>
      </div>
    </div>
  );
}
