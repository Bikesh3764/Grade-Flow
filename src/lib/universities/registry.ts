import { University, GlobalScale } from './types';
import { globalScales } from "./scales";
import registryData from "../../../data/universities/registry.json";

export const universities: University[] = registryData as University[];

export function getUniversityById(id: string): University | undefined {
  return universities.find(u => u.id === id);
}

export function getUniversityBySlug(slug: string): University | undefined {
  return universities.find(u => {
    const normalizedShortName = u.shortName ? u.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
    return u.id === slug || normalizedShortName === slug;
  });
}

export function searchUniversities(query: string, typeFilter: string | null): University[] {
  const q = query.toLowerCase();
  return universities.filter(u => {
    const matchesQuery = !q || 
      u.name.toLowerCase().includes(q) || 
      u.shortName.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q) ||
      (u.type && u.type.toLowerCase().includes(q));
      
    const matchesType = !typeFilter || typeFilter === 'All' || u.type === typeFilter;
    
    return matchesQuery && matchesType;
  });
}

export const generalUniversity: University = {
  id: "general",
  name: "General Academic Profile",
  shortName: "General",
  location: "Global",
  regulations: [
    {
      id: "general-10",
      name: "Standard 10-Point Scale",
      gradingScale: [
        { grade: 'O', points: 10, description: 'Outstanding' },
        { grade: 'E', points: 9, description: 'Excellent' },
        { grade: 'A', points: 8, description: 'Very Good' },
        { grade: 'B', points: 7, description: 'Good' },
        { grade: 'C', points: 6, description: 'Fair' },
        { grade: 'D', points: 5, description: 'Below Average' },
        { grade: 'F', points: 0, description: 'Fail' }
      ],
      formulas: {
        cgpa: 'sum(sgpa * credits) / sum(credits)',
        sgpa: 'sum(points * credits) / sum(credits)',
        percentage: '(cgpa - 0.75) * 10',
        source: "Standard Academic Formula"
      }
    }
  ]
};

export function getActiveRegulation(profile: any) {
  let university = generalUniversity;
  let regulation = generalUniversity.regulations[0];
  let isGeneral = true;

  if (profile.universityId && profile.regulationId) {
    const foundUni = getUniversityById(profile.universityId);
    const foundReg = foundUni?.regulations.find(r => r.id === profile.regulationId);
    if (foundUni && foundReg) {
      university = foundUni;
      regulation = foundReg;
      isGeneral = false;
    }
  }

  // Determine the active scale
  let activeScale: GlobalScale = {
    id: "university-default",
    name: "University Recommended",
    gradingScale: regulation.gradingScale
  };

  if (profile.activeScaleId && profile.activeScaleId !== 'university-default') {
    const globalMatch = globalScales.find(s => s.id === profile.activeScaleId);
    if (globalMatch) {
      activeScale = globalMatch;
    } else if (profile.customScales) {
      const customMatch = profile.customScales.find((s: GlobalScale) => s.id === profile.activeScaleId);
      if (customMatch) {
        activeScale = customMatch;
      }
    }
  }

  return { university, regulation, isGeneral, activeScale };
}