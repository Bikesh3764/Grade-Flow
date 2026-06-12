"use client";

import { useState } from "react";
import { University } from "@/lib/universities/types";
import { calculateCGPA } from "@/lib/universities/engine";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { DynamicFAQ } from "./DynamicFAQ";

export function SeoSGPAToCGPA({ university }: { university: University }) {
  const regulation = university.regulations[0]; // Default to first regulation
  const activeScale = {
    id: "seo-default",
    name: regulation.name,
    gradingScale: regulation.gradingScale
  };
  const maxPoints = activeScale.gradingScale.reduce((max, g) => Math.max(max, g.points), 0);

  const isGeneric = university.id === 'general';
  const displayTitle = isGeneric ? "SGPA to CGPA Calculator" : `${university.shortName} SGPA to CGPA Calculator`;

  const [inputs, setInputs] = useState<{ id: string; name: string; sgpa: string; credits: string }[]>([
    { id: "1", name: "Semester 1", sgpa: "", credits: "" }
  ]);

  const addInput = () => {
    setInputs([
      ...inputs, 
      { id: Date.now().toString(), name: `Semester ${inputs.length + 1}`, sgpa: "", credits: "" }
    ]);
  };

  const removeInput = (id: string) => {
    if (inputs.length === 1) return;
    setInputs(inputs.filter(input => input.id !== id));
  };

  const handleUpdate = (id: string, field: "sgpa" | "credits", value: string) => {
    setInputs(inputs.map(input => input.id === id ? { ...input, [field]: value } : input));
  };

  const validSemesters = inputs
    .filter(i => {
      const s = parseFloat(i.sgpa);
      const c = parseFloat(i.credits);
      return !isNaN(s) && !isNaN(c) && s >= 0 && s <= maxPoints && c > 0;
    })
    .map(i => ({ sgpa: parseFloat(i.sgpa), credits: parseFloat(i.credits) }));

  const currentCgpa = regulation && validSemesters.length > 0 ? calculateCGPA(regulation, validSemesters) : 0;

  const hasSgpaError = inputs.some(i => {
    const s = parseFloat(i.sgpa);
    return i.sgpa !== "" && !isNaN(s) && (s < 0 || s > maxPoints);
  });
  
  const hasCreditsError = inputs.some(i => {
    const c = parseFloat(i.credits);
    return i.credits !== "" && !isNaN(c) && c <= 0;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-display-sm md:text-display-md font-bold tracking-tight text-on-background">
          {displayTitle}
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Convert your semester SGPAs into a cumulative CGPA using {isGeneric ? 'standard weighted averaging' : `the official ${university.name} formula`}.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-title-md font-bold text-on-surface">Enter Semester SGPAs</h3>
              <button onClick={addInput} className="text-label-sm font-semibold text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
                <Plus size={16} /> Add Semester
              </button>
            </div>

            <div className="space-y-4">
              {inputs.map((input) => (
                <div key={input.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest transition-all hover:border-outline-variant">
                  <div className="flex-1">
                    <label className="block text-label-sm text-outline font-semibold mb-1 uppercase tracking-wider">Name</label>
                    <input 
                      type="text" 
                      value={input.name}
                      onChange={(e) => setInputs(inputs.map(i => i.id === input.id ? { ...i, name: e.target.value } : i))}
                      className="w-full h-10 px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-label-sm text-outline font-semibold mb-1 uppercase tracking-wider">SGPA</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      max={maxPoints}
                      value={input.sgpa}
                      onChange={(e) => handleUpdate(input.id, "sgpa", e.target.value)}
                      placeholder={`Max ${maxPoints}`}
                      className="w-full h-10 px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-label-sm text-outline font-semibold mb-1 uppercase tracking-wider">Credits</label>
                    <input 
                      type="number"
                      step="0.5"
                      min="1"
                      value={input.credits}
                      onChange={(e) => handleUpdate(input.id, "credits", e.target.value)}
                      placeholder="e.g. 21"
                      className="w-full h-10 px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-sm"
                    />
                  </div>
                  <div className="flex items-end pb-1 shrink-0">
                    <button 
                      onClick={() => removeInput(input.id)}
                      disabled={inputs.length === 1}
                      className="p-2 rounded-lg text-outline hover:text-error hover:bg-error-container/50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-outline"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setInputs([{ id: "1", name: "Semester 1", sgpa: "", credits: "" }])}
                className="px-4 py-2 text-label-sm font-semibold text-outline hover:text-on-surface transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} /> Reset
              </button>
            </div>
            
            {(hasSgpaError || hasCreditsError) && (
              <div className="mt-4 p-3 rounded-lg bg-error-container/50 border border-error/20 text-error text-label-sm flex flex-col gap-1">
                {hasSgpaError && <div className="flex items-center gap-2"><span className="font-bold">Error:</span> SGPA cannot exceed {maxPoints}.</div>}
                {hasCreditsError && <div className="flex items-center gap-2"><span className="font-bold">Error:</span> Credits must be greater than 0.</div>}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="glass-panel rounded-2xl p-6 sticky top-24 border-t-4 border-t-primary">
            <h3 className="text-title-lg font-bold text-on-surface mb-6">Results</h3>
            
            <div className="space-y-6">
              <div>
                <div className="text-label-md uppercase tracking-wider text-outline font-semibold mb-1">Calculated CGPA</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-display-lg font-bold text-primary">{currentCgpa > 0 ? currentCgpa : "-"}</span>
                  <span className="text-title-lg text-outline">/ {maxPoints}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DynamicFAQ university={university} pageType="sgpa-to-cgpa-calculator" />
    </div>
  );
}
