import { GlobalScale } from "./types";

export const globalScales: GlobalScale[] = [
  {
    id: "10-point",
    name: "10 Point Scale",
    gradingScale: [
      { grade: 'O', points: 10, description: 'Outstanding' },
      { grade: 'A+', points: 9, description: 'Excellent' },
      { grade: 'A', points: 8, description: 'Very Good' },
      { grade: 'B+', points: 7, description: 'Good' },
      { grade: 'B', points: 6, description: 'Above Average' },
      { grade: 'C', points: 5, description: 'Average' },
      { grade: 'P', points: 4, description: 'Pass' },
      { grade: 'F', points: 0, description: 'Fail' }
    ]
  },
  {
    id: "7-point",
    name: "7 Point Scale",
    gradingScale: [
      { grade: 'O', points: 7, description: 'Outstanding' },
      { grade: 'A', points: 6, description: 'Excellent' },
      { grade: 'B', points: 5, description: 'Very Good' },
      { grade: 'C', points: 4, description: 'Good' },
      { grade: 'D', points: 3, description: 'Average' },
      { grade: 'E', points: 2, description: 'Pass' },
      { grade: 'F', points: 0, description: 'Fail' }
    ]
  },
  {
    id: "5-point",
    name: "5 Point Scale",
    gradingScale: [
      { grade: 'A', points: 5, description: 'Excellent' },
      { grade: 'B', points: 4, description: 'Good' },
      { grade: 'C', points: 3, description: 'Average' },
      { grade: 'D', points: 2, description: 'Pass' },
      { grade: 'F', points: 0, description: 'Fail' }
    ]
  },
  {
    id: "4-point",
    name: "4 Point GPA Scale",
    gradingScale: [
      { grade: 'A', points: 4.0, description: 'Excellent' },
      { grade: 'A-', points: 3.7, description: 'Very Good' },
      { grade: 'B+', points: 3.3, description: 'Good' },
      { grade: 'B', points: 3.0, description: 'Good' },
      { grade: 'B-', points: 2.7, description: 'Average' },
      { grade: 'C+', points: 2.3, description: 'Average' },
      { grade: 'C', points: 2.0, description: 'Average' },
      { grade: 'C-', points: 1.7, description: 'Poor' },
      { grade: 'D+', points: 1.3, description: 'Poor' },
      { grade: 'D', points: 1.0, description: 'Poor' },
      { grade: 'F', points: 0.0, description: 'Fail' }
    ]
  },
  {
    id: "percentage",
    name: "Percentage Based Scale",
    gradingScale: [
      // Percentage systems typically just map 1:1 or use exact numbers.
      // But for grading scale logic, we can define a standard percentage bands:
      { grade: '90-100%', points: 10, description: 'Outstanding' },
      { grade: '80-89%', points: 9, description: 'Excellent' },
      { grade: '70-79%', points: 8, description: 'Very Good' },
      { grade: '60-69%', points: 7, description: 'Good' },
      { grade: '50-59%', points: 6, description: 'Average' },
      { grade: '40-49%', points: 5, description: 'Pass' },
      { grade: '0-39%', points: 0, description: 'Fail' }
    ]
  }
];
