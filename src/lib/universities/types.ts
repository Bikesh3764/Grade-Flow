export type GradeMapping = {
  grade: string;
  points: number;
  description?: string;
};

export type GlobalScale = {
  id: string;
  name: string;
  gradingScale: GradeMapping[];
};

export type FormulaInfo = {
  cgpa: string; // The mathematical formula string (e.g. 'sum(sgpa * credits) / sum(credits)')
  sgpa: string; // The mathematical formula string (e.g. 'sum(points * credits) / sum(credits)')
  percentage: string; // e.g. '(cgpa - 0.75) * 10'
  description?: string;
  source?: string;
  sourceUrl?: string;
  verifiedDate?: string;
};

export type Regulation = {
  id: string; // e.g., "R18", "2021"
  name: string; // e.g., "Regulation 2018"
  gradingScale: GradeMapping[];
  formulas: FormulaInfo;
};

export type UniversityType = 'IIT' | 'NIT' | 'IIIT' | 'GFTI' | 'Private' | 'State University' | 'Central University';

export type University = {
  id: string;
  name: string;
  shortName: string;
  location: string;
  type?: UniversityType;
  nirfRanking?: string;
  regulations: Regulation[];
};
