import { evaluate } from 'mathjs';
import { Regulation, GlobalScale } from './types';

type WeightedInput = { value: number; credits: number };

function normalizeFormula(formula: string, valueName: 'sgpa' | 'points'): string {
  const compact = formula.replace(/\s+/g, '');
  const weightedPattern = `sum(${valueName}*credits)`;
  const reverseWeightedPattern = `sum(credits*${valueName})`;

  return compact
    .replaceAll(weightedPattern, `sum(${valueName}_array .* credits_array)`)
    .replaceAll(reverseWeightedPattern, `sum(${valueName}_array .* credits_array)`)
    .replaceAll(`sum(credits)`, 'sum(credits_array)');
}

function weightedAverage(items: WeightedInput[]): number {
  const valid = items.filter((item) => Number.isFinite(item.value) && Number.isFinite(item.credits) && item.credits > 0);
  const totalCredits = valid.reduce((sum, item) => sum + item.credits, 0);
  if (totalCredits <= 0) return 0;
  return valid.reduce((sum, item) => sum + item.value * item.credits, 0) / totalCredits;
}

export function calculateCGPA(regulation: Regulation, semesters: { sgpa: number; credits: number }[]): number {
  const valid = semesters.filter(
    (semester) => Number.isFinite(semester.sgpa) && Number.isFinite(semester.credits) && semester.credits > 0
  );
  if (valid.length === 0) return 0;

  const fallback = weightedAverage(valid.map((semester) => ({ value: semester.sgpa, credits: semester.credits })));

  try {
    const formula = normalizeFormula(regulation.formulas.cgpa, 'sgpa');
    const result = evaluate(formula, {
      sgpa_array: valid.map((semester) => semester.sgpa),
      credits_array: valid.map((semester) => semester.credits),
    });
    const numericResult = Number(result);
    return Number.isFinite(numericResult) ? Number(numericResult.toFixed(2)) : Number(fallback.toFixed(2));
  } catch (error) {
    console.error('Error evaluating CGPA formula', error);
    return Number(fallback.toFixed(2));
  }
}

export function calculateSGPA(regulation: Regulation, courses: { points: number; credits: number }[]): number {
  const valid = courses.filter(
    (course) => Number.isFinite(course.points) && Number.isFinite(course.credits) && course.credits > 0
  );
  if (valid.length === 0) return 0;

  const fallback = weightedAverage(valid.map((course) => ({ value: course.points, credits: course.credits })));

  try {
    const formula = normalizeFormula(regulation.formulas.sgpa, 'points');
    const result = evaluate(formula, {
      points_array: valid.map((course) => course.points),
      credits_array: valid.map((course) => course.credits),
    });
    const numericResult = Number(result);
    return Number.isFinite(numericResult) ? Number(numericResult.toFixed(2)) : Number(fallback.toFixed(2));
  } catch (error) {
    console.error('Error evaluating SGPA formula', error);
    return Number(fallback.toFixed(2));
  }
}

function getScaleMaximum(scale: GlobalScale | undefined, regulation: Regulation): number {
  const points = (scale?.gradingScale ?? regulation.gradingScale).map((grade) => grade.points).filter(Number.isFinite);
  return points.length > 0 ? Math.max(...points) : 0;
}

export function calculatePercentage(
  regulation: Regulation,
  cgpa: number,
  activeScale?: GlobalScale,
  customFormula?: string
): number {
  if (!Number.isFinite(cgpa)) return 0;

  try {
    const maxPoints = getScaleMaximum(activeScale, regulation);
    const formulaStr = customFormula ||
      (activeScale && activeScale.id !== 'university-default' && maxPoints > 0
        ? `(cgpa / ${maxPoints}) * 100`
        : regulation.formulas.percentage);
    const result = Number(evaluate(formulaStr, { cgpa }));
    return Number.isFinite(result) ? Number(result.toFixed(2)) : 0;
  } catch (error) {
    console.error('Error evaluating Percentage formula', error);
    return 0;
  }
}

export function calculateCgpaFromPercentage(
  regulation: Regulation,
  percentage: number,
  activeScale?: GlobalScale,
  customFormula?: string
): number {
  if (!Number.isFinite(percentage)) return 0;

  const maxPoints = getScaleMaximum(activeScale, regulation);
  if (maxPoints <= 0) return 0;

  try {
    const formulaStr = customFormula ||
      (activeScale && activeScale.id !== 'university-default'
        ? `(cgpa / ${maxPoints}) * 100`
        : regulation.formulas.percentage);

    const evaluateAt = (cgpa: number) => Number(evaluate(formulaStr, { cgpa }));
    const lowValue = evaluateAt(0);
    const highValue = evaluateAt(maxPoints);

    if (!Number.isFinite(lowValue) || !Number.isFinite(highValue) || lowValue === highValue) return 0;

    const increasing = highValue > lowValue;
    const minPercent = Math.min(lowValue, highValue);
    const maxPercent = Math.max(lowValue, highValue);
    if (percentage < minPercent || percentage > maxPercent) return 0;

    let low = 0;
    let high = maxPoints;

    for (let i = 0; i < 80; i += 1) {
      const mid = (low + high) / 2;
      const value = evaluateAt(mid);
      if (!Number.isFinite(value)) return 0;

      if (increasing) {
        if (value < percentage) low = mid;
        else high = mid;
      } else {
        if (value > percentage) low = mid;
        else high = mid;
      }
    }

    return Number((((low + high) / 2)).toFixed(2));
  } catch (error) {
    console.error('Error reverse-evaluating Percentage formula', error);
    return 0;
  }
}
