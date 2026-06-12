import { evaluate } from 'mathjs';
import { Regulation, GlobalScale } from './types';

// We evaluate a formula string where 'sgpa_array' and 'credits_array' are available.
// To use math.js sum(sgpa * credits) / sum(credits), we can pass an array of products
// But mathjs handles dot-multiplication for arrays: sum(sgpa .* credits) / sum(credits)
export function calculateCGPA(regulation: Regulation, semesters: { sgpa: number, credits: number }[]): number {
  if (semesters.length === 0) return 0;
  
  const sgpa_array = semesters.map(s => s.sgpa);
  const credits_array = semesters.map(s => s.credits);
  
  // Format standard formula: sum(sgpa_array .* credits_array) / sum(credits_array)
  // We will intercept generic formula strings to arrays
  try {
    let formula = regulation.formulas.cgpa;
    formula = formula.replace(/sgpa \* credits/g, 'sgpa_array .* credits_array');
    formula = formula.replace(/sum\(credits\)/g, 'sum(credits_array)');
    
    const result = evaluate(formula, { sgpa_array, credits_array });
    return Number(result.toFixed(2));
  } catch (error) {
    console.error("Error evaluating CGPA formula", error);
    return 0;
  }
}

export function calculateSGPA(regulation: Regulation, courses: { points: number, credits: number }[]): number {
  if (courses.length === 0) return 0;
  
  const points_array = courses.map(c => c.points);
  const credits_array = courses.map(c => c.credits);
  
  try {
    let formula = regulation.formulas.sgpa;
    formula = formula.replace(/points \* credits/g, 'points_array .* credits_array');
    formula = formula.replace(/sum\(credits\)/g, 'sum(credits_array)');
    
    const result = evaluate(formula, { points_array, credits_array });
    return Number(result.toFixed(2));
  } catch (error) {
    console.error("Error evaluating SGPA formula", error);
    return 0;
  }
}

export function calculatePercentage(regulation: Regulation, cgpa: number, activeScale?: GlobalScale, customFormula?: string): number {
  if (cgpa === 0) return 0;
  try {
    let formulaStr = customFormula || regulation.formulas.percentage;
    
    // If we're overriding the scale to a non-university one, standard percentage logic is (cgpa / maxScale) * 100
    if (!customFormula && activeScale && activeScale.id !== 'university-default') {
      const maxPoints = activeScale.gradingScale.reduce((max, g) => Math.max(max, g.points), 0);
      formulaStr = `(cgpa / ${maxPoints}) * 100`;
    }
    
    const result = evaluate(formulaStr, { cgpa });
    return Number(result.toFixed(2));
  } catch (error) {
    console.error("Error evaluating Percentage formula", error);
    return 0;
  }
}

export function calculateCgpaFromPercentage(regulation: Regulation, percentage: number, activeScale?: GlobalScale, customFormula?: string): number {
  if (percentage === 0) return 0;
  try {
    let formulaStr = customFormula || regulation.formulas.percentage;
    
    // Determine the active maximum points
    const maxPoints = activeScale && activeScale.id !== 'university-default' 
      ? activeScale.gradingScale.reduce((max, g) => Math.max(max, g.points), 0)
      : regulation.gradingScale.reduce((max, g) => Math.max(max, g.points), 0);

    if (!customFormula && activeScale && activeScale.id !== 'university-default') {
      formulaStr = `(cgpa / ${maxPoints}) * 100`;
    }

    // Since formulas are linear (y = mx + b), we can find m and b to reverse it
    const y1 = evaluate(formulaStr, { cgpa: 1 });
    const y2 = evaluate(formulaStr, { cgpa: 2 });
    
    const m = y2 - y1;
    const b = y1 - m * 1;
    
    // Reverse: x = (y - b) / m
    let cgpa = (percentage - b) / m;
    
    // Cap at maximum points
    if (cgpa > maxPoints) cgpa = maxPoints;
    if (cgpa < 0) cgpa = 0;
    
    return Number(cgpa.toFixed(2));
  } catch (error) {
    console.error("Error reverse-evaluating Percentage formula", error);
    return 0;
  }
}
