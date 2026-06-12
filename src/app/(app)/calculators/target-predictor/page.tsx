"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { getActiveRegulation } from "@/lib/universities/registry";
import { calculateCGPA } from "@/lib/universities/engine";
import { Target, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TargetPredictor() {
  const profile = useAppStore(state => state.profile);
  const { regulation, activeScale } = getActiveRegulation(profile);
  const maxPoints = activeScale.gradingScale.reduce((max, g) => Math.max(max, g.points), 0);

  const semestersWithSgpa = profile.semesters.filter(sem => sem.sgpa !== undefined);
  
  const [mode, setMode] = useState<'auto' | 'manual' | null>(
    semestersWithSgpa.length > 0 ? 'auto' : null
  );

  const [manualCurrentCgpa, setManualCurrentCgpa] = useState("");
  const [manualCompletedCredits, setManualCompletedCredits] = useState("");
  
  const [targetCgpa, setTargetCgpa] = useState(profile.targetCgpa ? profile.targetCgpa.toString() : "");
  const [remainingCredits, setRemainingCredits] = useState("");

  const currentSgpaObj = profile.semesters
    .filter(sem => sem.sgpa !== undefined && sem.totalCredits && sem.sgpa >= 0 && sem.sgpa <= maxPoints && sem.totalCredits > 0)
    .map(sem => ({ sgpa: sem.sgpa as number, credits: sem.totalCredits as number }));
    
  const autoCurrentCgpa = regulation && currentSgpaObj.length > 0 
    ? calculateCGPA(regulation, currentSgpaObj) 
    : 0;

  const autoCurrentTotalCredits = currentSgpaObj.reduce((sum, sem) => sum + (sem.credits || 0), 0);
  
  // Calculate required SGPA
  const calculateRequiredSgpa = () => {
    const target = parseFloat(targetCgpa);
    const remCredits = parseFloat(remainingCredits);
    
    let currentCgpaVal = 0;
    let completedCreditsVal = 0;
    
    if (mode === 'auto') {
      currentCgpaVal = autoCurrentCgpa;
      completedCreditsVal = autoCurrentTotalCredits;
    } else {
      currentCgpaVal = parseFloat(manualCurrentCgpa);
      completedCreditsVal = parseFloat(manualCompletedCredits);
    }
    
    if (isNaN(target) || isNaN(remCredits) || remCredits <= 0 || isNaN(currentCgpaVal) || isNaN(completedCreditsVal) || completedCreditsVal < 0) return null;
    
    const finalTotalCredits = completedCreditsVal + remCredits;
    
    const currentPoints = currentCgpaVal * completedCreditsVal;
    const targetPoints = target * finalTotalCredits;
    
    const requiredFuturePoints = targetPoints - currentPoints;
    const requiredSgpa = requiredFuturePoints / remCredits;
    
    return requiredSgpa.toFixed(2);
  };

  const requiredSgpa = calculateRequiredSgpa();
  const reqSgpaNum = requiredSgpa ? parseFloat(requiredSgpa) : 0;
  const isAchievable = reqSgpaNum <= maxPoints && reqSgpaNum >= 0;
  
  const isImpossible = reqSgpaNum > maxPoints;
  const isAlreadyAchieved = reqSgpaNum < 0;

  const targetNum = parseFloat(targetCgpa);
  const hasTargetError = targetCgpa !== "" && (isNaN(targetNum) || targetNum < 0 || targetNum > maxPoints);
  const remCreditsNum = parseFloat(remainingCredits);
  const hasRemCreditsError = remainingCredits !== "" && (isNaN(remCreditsNum) || remCreditsNum <= 0);



  if (mode === null) {
    return (
      <div className="p-8 text-center space-y-6 max-w-lg mx-auto mt-12 glass-panel rounded-2xl border border-outline-variant/30">
        <h2 className="text-title-lg font-bold text-on-surface">Choose Prediction Method</h2>
        <p className="text-body-md text-on-surface-variant">How would you like to predict your target?</p>
        <div className="flex flex-col gap-3 mt-4">
          <Link href="/calculators/cgpa" className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors">
            Use Saved Academic Data
          </Link>
          <button onClick={() => setMode('manual')} className="w-full px-6 py-3 rounded-xl bg-surface-container-high border border-outline-variant/50 text-on-surface font-medium hover:bg-surface-container-highest transition-colors">
            Enter Data Manually
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Target size={32} />
        </div>
        <h1 className="text-display-sm font-bold tracking-tight text-on-background">Target Predictor</h1>
        <p className="text-body-lg text-on-surface-variant mt-3 max-w-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-center gap-1 sm:gap-4">
          <span>Find out exactly what you need to score in your remaining credits.</span>
          <span className="hidden sm:inline-block text-outline-variant">•</span>
          <span>Scale: <strong className="text-secondary">{activeScale.name}</strong></span>
        </p>
      </div>

      <div className="flex justify-center mb-2">
        <div className="flex p-1 bg-surface-container-low rounded-lg border border-outline-variant/20">
          <button 
            onClick={() => setMode('auto')}
            disabled={semestersWithSgpa.length === 0}
            className={`px-4 py-2 text-label-md font-semibold rounded-md transition-all ${
              mode === 'auto' ? 'bg-white dark:bg-surface-container-high shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-on-surface disabled:opacity-50'
            }`}
          >
            Auto (Saved Data)
          </button>
          <button 
            onClick={() => setMode('manual')}
            className={`px-4 py-2 text-label-md font-semibold rounded-md transition-all ${
              mode === 'manual' ? 'bg-white dark:bg-surface-container-high shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Manual Entry
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="text-label-sm font-semibold text-outline uppercase tracking-wider mb-4">Current Status</div>
          
          {mode === 'auto' ? (
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-display-sm font-bold text-on-surface">{autoCurrentCgpa.toFixed(2)}</span>
                <span className="text-title-md text-on-surface-variant">CGPA</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">Based on {semestersWithSgpa.length} semesters ({autoCurrentTotalCredits} credits)</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label-sm font-semibold text-on-surface-variant mb-2">Current CGPA</label>
                <input 
                  type="number" 
                  step="0.01" min="0" max={maxPoints}
                  value={manualCurrentCgpa}
                  onChange={(e) => setManualCurrentCgpa(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container border border-outline-variant/30 text-body-lg focus:outline-none focus:border-tertiary transition-all"
                  placeholder="e.g. 7.2"
                />
              </div>
              <div>
                <label className="block text-label-sm font-semibold text-on-surface-variant mb-2">Completed Credits</label>
                <input 
                  type="number" min="0"
                  value={manualCompletedCredits}
                  onChange={(e) => setManualCompletedCredits(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container border border-outline-variant/30 text-body-lg focus:outline-none focus:border-tertiary transition-all"
                  placeholder="e.g. 80"
                />
              </div>
            </div>
          )}
        </div>

        <div className="glass-panel p-6 rounded-2xl bg-surface-container-low">
          <label className="block text-label-sm font-semibold text-outline uppercase tracking-wider mb-4">Your Goal CGPA</label>
          <div className="relative">
            <input 
              type="number" 
              step="0.01"
              min="0"
              max={maxPoints}
              value={targetCgpa}
              onChange={(e) => setTargetCgpa(e.target.value)}
              className="w-full h-12 pl-4 pr-16 rounded-xl bg-surface-container border border-outline-variant/30 text-title-lg font-bold focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all"
              placeholder={`e.g. ${(maxPoints * 0.85).toFixed(1)}`}
            />
          </div>
          {hasTargetError && (
            <div className="mt-3 text-error text-label-sm flex items-center gap-2">
              <span className="font-bold">Error:</span> Goal CGPA must be between 0 and {maxPoints}.
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-tertiary" />
        
        <div className="mb-8">
          <label className="block text-label-sm font-semibold text-outline uppercase tracking-wider mb-2">Remaining Credits</label>
          <input 
            type="number" 
            min="1"
            value={remainingCredits}
            onChange={(e) => setRemainingCredits(e.target.value)}
            className="w-full md:w-1/2 h-12 px-4 rounded-xl bg-surface-container border border-outline-variant/30 text-body-lg focus:outline-none focus:border-tertiary transition-all"
            placeholder="e.g. 40"
          />
        </div>

        {hasRemCreditsError && (
          <div className="mb-8 p-3 rounded-lg bg-error-container/50 border border-error/20 text-error text-label-sm flex flex-col gap-1">
            <div className="flex items-center gap-2"><span className="font-bold">Error:</span> Remaining credits must be a valid positive number.</div>
          </div>
        )}

        <div className="p-6 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest text-center">
          <div className="text-label-md font-semibold text-outline uppercase tracking-wider mb-4">Required Average SGPA</div>
          
          {!requiredSgpa ? (
            <div className="text-title-lg text-on-surface-variant italic">Enter valid values to calculate</div>
          ) : isImpossible ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-error">
                <AlertCircle size={24} />
                <span className="text-display-md font-bold">{requiredSgpa}</span>
              </div>
              <p className="text-body-md text-error font-medium">Mathematically Impossible!</p>
              <p className="text-body-sm text-on-surface-variant">The maximum possible SGPA is {maxPoints}. You cannot reach this target CGPA with the remaining credits.</p>
            </div>
          ) : isAlreadyAchieved ? (
            <div className="space-y-3">
              <div className="text-display-md font-bold text-primary">Goal Achieved!</div>
              <p className="text-body-sm text-on-surface-variant">You have already surpassed this target. Even if you score 0 SGPA, your CGPA will remain above the target.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline justify-center gap-2">
                <span className={`text-display-lg font-bold ${isAchievable ? 'text-tertiary' : 'text-error'}`}>
                  {requiredSgpa}
                </span>
                <span className="text-title-lg text-outline">/ {maxPoints}</span>
              </div>
              <p className="text-body-md text-on-surface-variant">
                You need to maintain an average SGPA of <strong>{requiredSgpa}</strong> for your remaining <strong>{remainingCredits}</strong> credits to hit a {targetCgpa} CGPA.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
