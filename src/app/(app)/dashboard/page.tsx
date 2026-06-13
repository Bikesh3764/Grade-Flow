"use client";

import { useAppStore } from "@/lib/store";
import { getActiveRegulation } from "@/lib/universities/registry";
import { calculateCGPA, calculatePercentage } from "@/lib/universities/engine";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { BookOpen, Target, TrendingUp, Trophy, ArrowRight, Calculator, RefreshCw } from "lucide-react";

import { ShareButton } from "@/components/ui/ShareButton";

export default function Dashboard() {
  const profile = useAppStore(state => state.profile);
  const [mounted, setMounted] = useState(false);
  const { university, regulation, isGeneral, activeScale } = getActiveRegulation(profile);

  useEffect(() => setMounted(true), []);

  const maxPoints = activeScale.gradingScale.reduce((max, g) => Math.max(max, g.points), 0);

  if (!mounted) return null;

  const semestersWithSgpa = profile.semesters.filter(sem => sem.sgpa !== undefined);
  
  const currentCgpa = regulation && semestersWithSgpa.length > 0 
    ? calculateCGPA(regulation, semestersWithSgpa.map(sem => ({ sgpa: sem.sgpa as number, credits: sem.totalCredits || 0 }))) 
    : 0;

  const percentage = regulation ? calculatePercentage(regulation, currentCgpa) : 0;
  
  const chartData = profile.semesters.map(sem => ({
    name: sem.name,
    SGPA: sem.sgpa || 0
  }));

  const isSetup = profile.universityId && profile.regulationId;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!isSetup && (
        <div className="p-6 rounded-2xl bg-primary-container text-on-primary-container border border-primary/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-title-lg font-bold">Welcome to GradeFlow!</h3>
            <p className="text-body-md mt-1 opacity-90">To get accurate calculations, please set up your university profile first.</p>
          </div>
          <Link href="/university-hub" className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-medium shadow-elevation-1 hover:shadow-elevation-2 transition-all whitespace-nowrap">
            Setup Profile
          </Link>
        </div>
      )}

      {isSetup && currentCgpa > 0 && (
        <div className="flex justify-between items-center">
          <h2 className="text-headline-sm font-bold">Your Dashboard</h2>
          <ShareButton 
            title="My CGPA" 
            text={`I just calculated my CGPA on GradeFlow and got ${currentCgpa.toFixed(2)} at ${university?.name || 'my university'}! Calculate yours:`}
            url="https://cgpacalculator.xyz" 
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-4 text-outline">
            <Trophy size={20} className="text-primary" />
            <span className="text-label-md uppercase tracking-wider font-semibold">Current CGPA</span>
          </div>
          <div className="mt-auto">
            <span className="text-display-md font-bold text-on-surface">{currentCgpa > 0 ? currentCgpa.toFixed(2) : "-"}</span>
            <span className="text-title-md text-on-surface-variant ml-1">/ {maxPoints}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-4 text-outline">
            <Target size={20} className="text-tertiary" />
            <span className="text-label-md uppercase tracking-wider font-semibold">Equivalent %</span>
          </div>
          <div className="mt-auto">
            <span className="text-display-md font-bold text-on-surface">{percentage > 0 ? percentage.toFixed(2) : "-"}</span>
            <span className="text-title-md text-on-surface-variant ml-1">%</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-4 text-outline">
            <BookOpen size={20} className="text-secondary" />
            <span className="text-label-md uppercase tracking-wider font-semibold">Semesters</span>
          </div>
          <div className="mt-auto">
            <span className="text-display-md font-bold text-on-surface">{profile.semesters.length}</span>
            <span className="text-title-md text-on-surface-variant ml-1">completed</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-4 text-outline">
            <TrendingUp size={20} className="text-error" />
            <span className="text-label-md uppercase tracking-wider font-semibold">Target CGPA</span>
          </div>
          <div className="mt-auto flex items-end justify-between">
            <div>
              <span className="text-display-md font-bold text-on-surface">{profile.targetCgpa || "-"}</span>
            </div>
            {profile.targetCgpa && currentCgpa > 0 && (
              <span className={`text-label-sm font-semibold px-2 py-1 rounded-md ${currentCgpa >= profile.targetCgpa ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'}`}>
                {currentCgpa >= profile.targetCgpa ? 'On Track' : 'Needs Work'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-title-lg font-bold text-on-surface">Academic Trajectory</h3>
            <Link href="/calculators/cgpa" className="text-label-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
              Add Semester <ArrowRight size={16} />
            </Link>
          </div>
          
          {chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="name" stroke="currentColor" className="text-outline text-label-sm" tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" className="text-outline text-label-sm" tickLine={false} axisLine={false} domain={[0, maxPoints]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgb(var(--surface-container-high))', borderColor: 'rgb(var(--outline-variant))', borderRadius: '12px', color: 'rgb(var(--on-surface))' }}
                    itemStyle={{ color: 'rgb(var(--primary))', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="SGPA" stroke="rgb(var(--primary))" strokeWidth={3} dot={{ r: 6, fill: "rgb(var(--primary))", strokeWidth: 2, stroke: "rgb(var(--surface))" }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant">
              <TrendingUp size={48} className="opacity-20 mb-4" />
              <p className="text-body-md">No semester data available yet.</p>
            </div>
          )}
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col">
          <h3 className="text-title-lg font-bold text-on-surface mb-6">Quick Tools</h3>
          <div className="space-y-3 flex-1">
            <Link href="/calculators/sgpa" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-variant/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calculator size={20} />
              </div>
              <div>
                <h4 className="text-title-sm font-semibold text-on-surface">SGPA Calculator</h4>
                <p className="text-body-sm text-on-surface-variant">Calculate current semester</p>
              </div>
            </Link>

            <Link href="/calculators/target-predictor" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 hover:border-tertiary/50 hover:bg-surface-variant/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target size={20} />
              </div>
              <div>
                <h4 className="text-title-sm font-semibold text-on-surface">Target Predictor</h4>
                <p className="text-body-sm text-on-surface-variant">Plan your next grades</p>
              </div>
            </Link>

            <Link href="/converter" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 hover:border-secondary/50 hover:bg-surface-variant/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                <RefreshCw size={20} />
              </div>
              <div>
                <h4 className="text-title-sm font-semibold text-on-surface">Converter</h4>
                <p className="text-body-sm text-on-surface-variant">CGPA to Percentage</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
