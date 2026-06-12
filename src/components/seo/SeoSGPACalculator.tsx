"use client";

import { useState } from "react";
import { University } from "@/lib/universities/types";
import { calculateSGPA } from "@/lib/universities/engine";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { DynamicFAQ } from "./DynamicFAQ";

export function SeoSGPACalculator({ university }: { university: University }) {
  const regulation = university.regulations[0];
  const activeScale = {
    id: "seo-default",
    name: regulation.name,
    gradingScale: regulation.gradingScale
  };
  const maxPoints = activeScale.gradingScale.reduce((max, g) => Math.max(max, g.points), 0);

  const [inputs, setInputs] = useState<{ id: string; subject: string; grade: string; credits: string }[]>([
    { id: "1", subject: "Subject 1", grade: "", credits: "3" },
    { id: "2", subject: "Subject 2", grade: "", credits: "3" },
    { id: "3", subject: "Subject 3", grade: "", credits: "4" },
    { id: "4", subject: "Subject 4", grade: "", credits: "4" },
  ]);

  const addInput = () => {
    setInputs([
      ...inputs, 
      { id: Date.now().toString(), subject: `Subject ${inputs.length + 1}`, grade: "", credits: "" }
    ]);
  };

  const removeInput = (id: string) => {
    if (inputs.length === 1) return;
    setInputs(inputs.filter(input => input.id !== id));
  };

  const handleUpdate = (id: string, field: "subject" | "grade" | "credits", value: string) => {
    setInputs(inputs.map(input => input.id === id ? { ...input, [field]: value } : input));
  };

  const validCourses = inputs.map(input => {
    if (!input.grade || !input.credits || isNaN(parseFloat(input.credits))) return null;
    const c = parseFloat(input.credits);
    if (c <= 0) return null;
    
    const gradeDef = activeScale.gradingScale.find(g => g.grade.toUpperCase() === input.grade.toUpperCase());
    if (!gradeDef) return null;
    
    return {
      points: gradeDef.points,
      credits: c
    };
  }).filter(Boolean) as { points: number, credits: number }[];

  const currentSgpa = regulation && validCourses.length > 0 ? calculateSGPA(regulation, validCourses) : 0;
  const totalCredits = validCourses.reduce((sum, c) => sum + c.credits, 0);

  const hasCreditsError = inputs.some(i => {
    const c = parseFloat(i.credits);
    return i.credits !== "" && !isNaN(c) && c <= 0;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-display-sm md:text-display-md font-bold tracking-tight text-on-background">
          {university.shortName} SGPA Calculator
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Calculate your exact Semester Grade Point Average (SGPA) using the official <strong className="text-primary">{university.name}</strong> credit system.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-title-md font-bold text-on-surface">Subject Details</h3>
              <button onClick={addInput} className="text-label-sm font-semibold text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
                <Plus size={16} /> Add Subject
              </button>
            </div>

            <div className="space-y-4">
              <div className="hidden sm:flex gap-4 px-4 text-label-sm text-outline font-semibold uppercase tracking-wider">
                <div className="flex-[2]">Subject Name</div>
                <div className="flex-1">Grade</div>
                <div className="flex-1">Credits</div>
                <div className="w-10"></div>
              </div>
              
              {inputs.map((input) => (
                <div key={input.id} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-2 sm:px-4 rounded-xl border border-outline-variant/30 sm:border-transparent bg-surface-container-lowest sm:bg-transparent transition-all hover:bg-surface-variant/20">
                  <div className="flex-[2]">
                    <label className="block sm:hidden text-label-sm text-outline font-semibold mb-1 uppercase tracking-wider">Subject</label>
                    <input 
                      type="text" 
                      value={input.subject}
                      onChange={(e) => handleUpdate(input.id, "subject", e.target.value)}
                      className="w-full h-11 px-3 rounded-lg bg-surface-container sm:bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block sm:hidden text-label-sm text-outline font-semibold mb-1 uppercase tracking-wider">Grade</label>
                    <select 
                      value={input.grade}
                      onChange={(e) => handleUpdate(input.id, "grade", e.target.value)}
                      className="w-full h-11 px-3 rounded-lg bg-surface-container sm:bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-sm font-semibold"
                    >
                      <option value="">Select</option>
                      {activeScale.gradingScale.map(scale => (
                        <option key={scale.grade} value={scale.grade}>
                          {scale.grade} ({scale.points} pts)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block sm:hidden text-label-sm text-outline font-semibold mb-1 uppercase tracking-wider">Credits</label>
                    <input 
                      type="number"
                      step="0.5"
                      min="1"
                      value={input.credits}
                      onChange={(e) => handleUpdate(input.id, "credits", e.target.value)}
                      placeholder="e.g. 3"
                      className="w-full h-11 px-3 rounded-lg bg-surface-container sm:bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-sm"
                    />
                  </div>
                  <div className="flex items-center justify-end sm:pt-0 pt-2 shrink-0 w-10">
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
            
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setInputs([{ id: "1", subject: "Subject 1", grade: "", credits: "" }])}
                className="px-4 py-2 text-label-sm font-semibold text-outline hover:text-on-surface transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} /> Reset Form
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl p-6 sticky top-24 border-t-4 border-t-primary">
            <h3 className="text-title-lg font-bold text-on-surface mb-6">Results</h3>
            
            <div className="space-y-6">
              <div>
                <div className="text-label-md uppercase tracking-wider text-outline font-semibold mb-1">Calculated SGPA</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-display-lg font-bold text-primary">{currentSgpa > 0 ? currentSgpa : "-"}</span>
                  <span className="text-title-lg text-outline">/ {maxPoints}</span>
                </div>
              </div>

              <div className="h-px w-full bg-outline-variant/20" />

              <div>
                <div className="text-label-md uppercase tracking-wider text-outline font-semibold mb-1">Total Credits Attempted</div>
                <div className="text-title-lg font-medium text-on-surface">
                  {totalCredits} <span className="text-body-md text-outline font-normal">credits</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <h4 className="text-label-sm font-semibold text-on-surface mb-2 flex items-center gap-2">
                {university.shortName} Grading Scale
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeScale.gradingScale.map(scale => (
                  <div key={scale.grade} className="flex items-center gap-1.5 px-2 py-1 bg-surface rounded text-body-xs font-mono border border-outline-variant/30">
                    <span className="font-bold">{scale.grade}</span>
                    <span className="text-outline">=</span>
                    <span className="text-primary">{scale.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DynamicFAQ university={university} pageType="sgpa-calculator" />
    </div>
  );
}
