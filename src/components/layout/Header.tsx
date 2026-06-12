"use client";

import { useAppStore } from "@/lib/store";
import { GradeScaleSelector } from "./GradeScaleSelector";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Menu } from "lucide-react";
import { getUniversityById } from "@/lib/universities/registry";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const profile = useAppStore((state) => state.profile);

  const university = profile.universityId ? getUniversityById(profile.universityId) : null;

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-surface/50 backdrop-blur-md border-b border-outline-variant/20 sticky top-0 z-20">
      <div className="flex items-center gap-3 sm:gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 lg:hidden"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-title-md sm:text-title-lg font-semibold text-on-surface tracking-tight hidden md:block">
          Welcome back, {profile.name}
        </h2>
        {university ? (
          <div className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-label-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Using: {university.shortName}
          </div>
        ) : (
          <div className="px-2 sm:px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm font-bold flex items-center gap-2 border border-outline-variant/30">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-outline" />
            <span className="hidden sm:inline">General Mode</span>
            <span className="sm:hidden">General</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input 
            type="text" 
            placeholder="Search tools..." 
            className="h-10 pl-10 pr-4 rounded-full bg-surface-container-high border border-outline-variant/30 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-64"
          />
        </div>
        
        <GradeScaleSelector />

        <ThemeToggle />
      </div>
    </header>
  );
}
