"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { searchUniversities, universities } from "@/lib/universities/registry";
import { University, Regulation } from "@/lib/universities/types";
import { FormulaInfoModal } from "@/components/universities/FormulaInfoModal";
import { Search, Info, CheckCircle2, Building2, Globe, ExternalLink } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

export default function UniversityHub() {
  const profile = useAppStore(state => state.profile);
  const setUniversity = useAppStore(state => state.setUniversity);
  const clearUniversity = useAppStore(state => state.clearUniversity);
  
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [selectedReg, setSelectedReg] = useState<Regulation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUniversities = searchUniversities(search, typeFilter);

  const handleSetProfile = (uni: University, reg: Regulation) => {
    setUniversity(uni.id, reg.id);
  };

  const handleClearProfile = () => {
    clearUniversity();
  };

  const openInfo = (uni: University, reg: Regulation) => {
    setSelectedUni(uni);
    setSelectedReg(reg);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight text-on-background">University Hub</h1>
          <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Select your university and regulation scheme. GradeFlow will automatically adapt its calculators and grading scales to match your institution&apos;s exact formulas.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 w-full">
        <div className="lg:col-span-2 space-y-6 min-w-0 w-full">

          {/* General Profile Card */}
          <div className="glass-panel rounded-2xl p-6 border border-outline-variant/30 hover:border-outline-variant/50 transition-all bg-surface-container-low relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center text-on-surface">
                    <Globe size={20} />
                  </div>
                  <h2 className="text-title-lg font-bold text-on-surface">General Academic Profile</h2>
                </div>
                <p className="text-body-md text-on-surface-variant mt-2 max-w-lg">
                  Use GradeFlow without university-specific rules. Features a standard 10-point scale, generic CGPA calculations, and generic percentage conversions.
                </p>
              </div>
              
              <div className="shrink-0 pt-2">
                {!profile.universityId ? (
                  <span className="px-5 py-2.5 rounded-xl bg-surface-variant text-on-surface font-semibold flex items-center gap-2 border border-outline-variant/30 shadow-sm">
                    <CheckCircle2 size={18} className="text-primary" /> Active (Default)
                  </span>
                ) : (
                  <button 
                    onClick={handleClearProfile}
                    className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Use General Calculator
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input 
              type="text" 
              placeholder="Search universities by name, acronym, state, or type..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-surface-container-high border border-outline-variant/30 text-body-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full min-w-0">
            {["All", "IIT", "NIT", "IIIT", "GFTI", "Private", "State University"].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-label-md font-semibold transition-colors border ${
                  typeFilter === type 
                  ? "bg-primary text-on-primary border-primary" 
                  : "bg-surface-container-low text-on-surface hover:bg-surface-variant border-outline-variant/30"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredUniversities.length === 0 ? (
              <div className="text-center p-12 glass-panel rounded-2xl">
                <Building2 className="mx-auto h-12 w-12 text-outline mb-4 opacity-50" />
                <h3 className="text-title-md font-semibold text-on-surface">No universities found</h3>
                <p className="text-body-md text-on-surface-variant mt-2">
                  Try adjusting your search query or acronym.
                </p>
              </div>
            ) : (
              filteredUniversities.map((uni) => (
                <div key={uni.id} className="glass-panel rounded-2xl p-6 transition-all hover:shadow-elevation-2 border border-outline-variant/20 hover:border-primary/30">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h2 className="text-title-lg font-bold text-on-surface">{uni.name}</h2>
                        <span className="px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container text-label-sm font-semibold tracking-wide shrink-0">
                          {uni.shortName}
                        </span>
                        {uni.nirfRanking && (
                          <span className="px-2.5 py-1 rounded-md bg-tertiary-container text-on-tertiary-container text-label-sm font-semibold tracking-wide flex items-center gap-1 shrink-0">
                            🏅 NIRF 2025: {uni.nirfRanking.includes('-') ? `${uni.nirfRanking} Band` : `Rank #${uni.nirfRanking}`}
                          </span>
                        )}
                      </div>
                      <p className="text-body-sm text-on-surface-variant flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                        {uni.location}
                      </p>
                      <Link 
                        href={`/${uni.shortName ? uni.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : uni.id}-cgpa-calculator`}
                        className="inline-flex items-center gap-1.5 mt-2 text-body-sm text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        <ExternalLink size={14} />
                        View CGPA Calculator
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="text-label-md uppercase tracking-wider text-outline font-semibold mb-2">Available Regulations</h4>
                    {uni.regulations.map(reg => {
                      const isActive = profile.universityId === uni.id && profile.regulationId === reg.id;
                      return (
                        <div key={reg.id} className={clsx(
                          "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all",
                          isActive 
                            ? "bg-primary-container/20 border-primary shadow-sm" 
                            : "bg-surface-container-lowest border-outline-variant/20 hover:border-outline"
                        )}>
                          <div>
                            <p className="text-title-sm font-semibold text-on-surface flex items-center gap-2">
                              {reg.name}
                              {isActive && <CheckCircle2 size={16} className="text-primary" />}
                            </p>
                          </div>
                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                            <button 
                              onClick={() => openInfo(uni, reg)}
                              className="w-full sm:w-auto justify-center px-3 py-2 rounded-lg text-body-sm font-medium text-secondary hover:bg-secondary-container/50 transition-colors flex items-center gap-1.5"
                            >
                              <Info size={16} /> Formula Info
                            </button>
                            {isActive ? (
                              <button 
                                onClick={handleClearProfile}
                                className="w-full sm:w-auto justify-center px-4 py-2 rounded-lg bg-error-container hover:bg-error/20 text-error text-body-sm font-medium flex items-center gap-1.5 transition-colors"
                              >
                                Remove Selection
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleSetProfile(uni, reg)}
                                className="w-full sm:w-auto justify-center px-4 py-2 rounded-lg border border-outline hover:border-primary text-on-surface hover:text-primary hover:bg-primary-container/10 text-body-sm font-medium transition-all"
                              >
                                Set as Active
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-1 min-w-0 w-full">
          <div className="glass-panel rounded-2xl p-6 sticky top-24">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-4">
              <Building2 size={24} />
            </div>
            <h3 className="text-title-lg font-bold text-on-surface mb-2">Custom Integration</h3>
            <p className="text-body-md text-on-surface-variant mb-6 leading-relaxed">
              GradeFlow uses dynamic mathematical engine parsing. If your university&apos;s specific grading scheme isn&apos;t listed, you can request it or create a custom profile.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <h4 className="text-title-sm font-semibold text-on-surface mb-1">Current Active</h4>
                {profile.universityId ? (
                  <p className="text-body-sm text-primary font-medium flex justify-between items-center">
                    <span>{universities.find(u => u.id === profile.universityId)?.shortName} - {profile.regulationId}</span>
                    <button onClick={handleClearProfile} className="text-label-sm text-error hover:underline">Deactivate</button>
                  </p>
                ) : (
                  <p className="text-body-sm text-on-surface-variant font-medium">General Profile (Default)</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormulaInfoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        university={selectedUni}
        regulation={selectedReg}
      />
    </div>
  );
}
