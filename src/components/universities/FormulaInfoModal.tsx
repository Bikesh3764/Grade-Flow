"use client";

import { Regulation, University } from "@/lib/universities/types";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

type FormulaInfoModalProps = {
  university: University | null;
  regulation: Regulation | null;
  isOpen: boolean;
  onClose: () => void;
};

export function FormulaInfoModal({ university, regulation, isOpen, onClose }: FormulaInfoModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || !university || !regulation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl w-full max-w-2xl shadow-elevation-3 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 bg-surface-container-low/50">
          <div>
            <h2 className="text-title-lg font-bold text-on-surface">{university.shortName} Formula Information</h2>
            <p className="text-body-sm text-on-surface-variant mt-1">{regulation.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          <section>
            <h3 className="text-title-md font-semibold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-label-sm font-bold">1</span>
              Grading Scale
            </h3>
            <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-label-sm uppercase tracking-wider text-on-surface-variant">
                    <th className="p-3 border-b border-outline-variant/20">Grade</th>
                    <th className="p-3 border-b border-outline-variant/20">Points</th>
                    <th className="p-3 border-b border-outline-variant/20">Description</th>
                  </tr>
                </thead>
                <tbody className="text-body-md">
                  {regulation.gradingScale.map((scale, i) => (
                    <tr key={i} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-variant/20">
                      <td className="p-3 font-semibold">{scale.grade}</td>
                      <td className="p-3 text-primary font-mono">{scale.points}</td>
                      <td className="p-3 text-on-surface-variant">{scale.description || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-title-md font-semibold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-label-sm font-bold">2</span>
              Calculation Formulas
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20">
                <div className="text-label-sm text-outline mb-1 uppercase tracking-wider">SGPA Formula</div>
                <code className="text-body-lg font-mono text-on-surface break-all">
                  {regulation.formulas.sgpa}
                </code>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20">
                <div className="text-label-sm text-outline mb-1 uppercase tracking-wider">CGPA Formula</div>
                <code className="text-body-lg font-mono text-on-surface break-all">
                  {regulation.formulas.cgpa}
                </code>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20">
                <div className="text-label-sm text-outline mb-1 uppercase tracking-wider">Percentage Conversion</div>
                <code className="text-body-lg font-mono text-on-surface break-all">
                  {regulation.formulas.percentage}
                </code>
              </div>
            </div>
          </section>

          {(regulation.formulas.source || regulation.formulas.sourceUrl || regulation.formulas.verifiedDate) && (
            <section className="p-4 rounded-xl bg-secondary-container/50 border border-outline-variant/20 space-y-2">
              {regulation.formulas.source && (
                <p className="text-body-sm text-on-secondary-container">
                  <strong>Source:</strong> {regulation.formulas.source}
                </p>
              )}
              {regulation.formulas.sourceUrl && (
                <p className="text-body-sm text-on-secondary-container">
                  <strong>Link:</strong> <a href={regulation.formulas.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{regulation.formulas.sourceUrl}</a>
                </p>
              )}
              {regulation.formulas.verifiedDate && (
                <p className="text-label-sm text-on-secondary-container opacity-80">
                  <strong>Verified on:</strong> {regulation.formulas.verifiedDate}
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
