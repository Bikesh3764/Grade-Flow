"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { globalScales } from "@/lib/universities/scales";
import { getActiveRegulation } from "@/lib/universities/registry";
import { ChevronDown, SlidersHorizontal, Check, Plus, AlertCircle } from "lucide-react";
import clsx from "clsx";
import CustomScaleBuilder from "../universities/CustomScaleBuilder";

export function GradeScaleSelector() {
  const profile = useAppStore(state => state.profile);
  const setActiveScale = useAppStore(state => state.setActiveScale);
  
  const { university, regulation } = getActiveRegulation({
    ...profile,
    activeScaleId: 'university-default' // Always evaluate what the default WOULD be
  });

  const currentScaleId = profile.activeScaleId || 'university-default';
  
  const [isOpen, setIsOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  let currentScaleName = "University Recommended";
  if (currentScaleId !== 'university-default') {
    const globalScale = globalScales.find(s => s.id === currentScaleId);
    if (globalScale) {
      currentScaleName = globalScale.name;
    } else {
      const customScale = profile.customScales?.find(s => s.id === currentScaleId);
      if (customScale) {
        currentScaleName = customScale.name;
      }
    }
  }

  const handleSelect = (id: string) => {
    setActiveScale(id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-4 rounded-full bg-surface-container border border-outline-variant/30 hover:bg-surface-variant/50 transition-colors text-body-sm font-semibold text-on-surface"
      >
        <SlidersHorizontal size={16} className="text-primary" />
        <span className="hidden sm:inline-block">Scale: {currentScaleName}</span>
        <ChevronDown size={16} className={clsx("text-outline transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 rounded-2xl bg-surface-container-high border border-outline-variant/30 shadow-elevation-3 overflow-hidden z-50">
          <div className="p-3 border-b border-outline-variant/20 bg-surface-container-lowest">
            <h4 className="text-label-sm font-bold text-outline uppercase tracking-wider mb-1">Global Scale</h4>
            <p className="text-body-sm text-on-surface-variant text-[11px] leading-tight">
              Select the grading scale to use across all calculators.
            </p>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
            <button 
              onClick={() => handleSelect('university-default')}
              className={clsx(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-body-sm transition-colors",
                currentScaleId === 'university-default' ? "bg-primary/10 text-primary font-bold" : "hover:bg-surface-variant/50 text-on-surface"
              )}
            >
              <div>
                <div>University Recommended</div>
                <div className="text-[10px] text-outline opacity-80 font-normal mt-0.5">
                  {university?.shortName || 'General'} - {regulation?.gradingScale.length} Points
                </div>
              </div>
              {currentScaleId === 'university-default' && <Check size={16} />}
            </button>

            <div className="h-px w-full bg-outline-variant/20 my-2" />

            <div className="px-3 py-1 text-[10px] font-bold text-outline uppercase tracking-wider">Standard Scales</div>
            {globalScales.map(scale => (
              <button 
                key={scale.id}
                onClick={() => handleSelect(scale.id)}
                className={clsx(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-body-sm transition-colors",
                  currentScaleId === scale.id ? "bg-primary/10 text-primary font-bold" : "hover:bg-surface-variant/50 text-on-surface"
                )}
              >
                {scale.name}
                {currentScaleId === scale.id && <Check size={16} />}
              </button>
            ))}

            {(profile.customScales?.length ?? 0) > 0 && (
              <>
                <div className="h-px w-full bg-outline-variant/20 my-2" />
                <div className="px-3 py-1 text-[10px] font-bold text-outline uppercase tracking-wider">Custom Scales</div>
                {profile.customScales.map(scale => (
                  <button 
                    key={scale.id}
                    onClick={() => handleSelect(scale.id)}
                    className={clsx(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-body-sm transition-colors",
                      currentScaleId === scale.id ? "bg-primary/10 text-primary font-bold" : "hover:bg-surface-variant/50 text-on-surface"
                    )}
                  >
                    {scale.name}
                    {currentScaleId === scale.id && <Check size={16} />}
                  </button>
                ))}
              </>
            )}
          </div>

          <div className="p-2 border-t border-outline-variant/20 bg-surface-container-lowest">
            <button 
              onClick={() => {
                setIsOpen(false);
                setIsBuilderOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-primary hover:bg-primary/10 transition-colors text-label-sm font-semibold"
            >
              <Plus size={16} /> Build Custom Scale
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isBuilderOpen && (
        <CustomScaleBuilder onClose={() => setIsBuilderOpen(false)} />
      )}
    </div>
  );
}
