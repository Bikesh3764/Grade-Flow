"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { GradeMapping, GlobalScale } from "@/lib/universities/types";
import { X, Plus, Trash2, Save, ArrowRight } from "lucide-react";

export default function CustomScaleBuilder({ onClose }: { onClose: () => void }) {
  const addCustomScale = useAppStore(state => state.addCustomScale);
  const setActiveScale = useAppStore(state => state.setActiveScale);

  const [name, setName] = useState("");
  const [mappings, setMappings] = useState<GradeMapping[]>([
    { grade: 'A', points: 10, description: 'Excellent' },
    { grade: 'B', points: 8, description: 'Good' },
    { grade: 'C', points: 6, description: 'Average' },
    { grade: 'F', points: 0, description: 'Fail' }
  ]);

  const handleAddRow = () => {
    setMappings([...mappings, { grade: '', points: 0, description: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (index: number, field: keyof GradeMapping, value: string | number) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setMappings(newMappings);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a name for your custom scale.");
      return;
    }
    
    // Clean mappings
    const validMappings = mappings.filter(m => m.grade.trim() !== '' && !isNaN(m.points));
    
    if (validMappings.length < 2) {
      alert("Please define at least two valid grades.");
      return;
    }

    const newScale: GlobalScale = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      gradingScale: validMappings.sort((a, b) => b.points - a.points) // Sort highest to lowest
    };

    addCustomScale(newScale);
    setActiveScale(newScale.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-high w-full max-w-2xl rounded-3xl shadow-elevation-4 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <div>
            <h2 className="text-title-lg font-bold text-on-surface">Build Custom Scale</h2>
            <p className="text-body-sm text-on-surface-variant mt-1">Define your own grade mappings to use globally.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <label className="block text-label-sm font-semibold text-outline uppercase tracking-wider mb-2">Scale Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. My Custom 8-Point Scale"
              className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-lg"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-label-sm font-semibold text-outline uppercase tracking-wider">Grade Mappings</label>
              <button 
                onClick={handleAddRow}
                className="text-label-sm text-primary font-semibold flex items-center gap-1 hover:text-primary/80 transition-colors"
              >
                <Plus size={16} /> Add Grade
              </button>
            </div>

            <div className="space-y-3">
              {mappings.map((mapping, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-1/4">
                    <input 
                      type="text" 
                      placeholder="Grade (e.g. A+)"
                      value={mapping.grade}
                      onChange={e => handleUpdateRow(index, 'grade', e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-sm"
                    />
                  </div>
                  <ArrowRight size={16} className="text-outline-variant shrink-0" />
                  <div className="w-1/4">
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="Points"
                      value={mapping.points === 0 && mapping.grade === '' ? '' : mapping.points}
                      onChange={e => handleUpdateRow(index, 'points', parseFloat(e.target.value))}
                      className="w-full h-10 px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Description (Optional)"
                      value={mapping.description || ''}
                      onChange={e => handleUpdateRow(index, 'description', e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:outline-none focus:border-primary/50 text-body-sm"
                    />
                  </div>
                  <button 
                    onClick={() => handleRemoveRow(index)}
                    disabled={mappings.length <= 2}
                    className="p-2 rounded-lg text-outline hover:text-error hover:bg-error-container/50 transition-colors disabled:opacity-30"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-outline-variant/20 bg-surface-container-lowest flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-on-surface hover:bg-surface-variant transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save size={18} /> Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
