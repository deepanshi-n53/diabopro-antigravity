export type DiabetesType = 'Type 1' | 'Type 2' | 'Gestational';

export interface UserProfile {
  diabetesType: DiabetesType;
  age: number;
  targetRangeMin: number;
  targetRangeMax: number;
}

export interface BloodSugarLog {
  id: string;
  timestamp: number;
  reading: number; // in mg/dL
  insulinUnits?: number;
  notes?: string;
}

export interface TestResult {
  id: string;
  type: 'HbA1c' | 'Kidney Profile' | 'Lipid Profile' | 'UACR';
  resultValue: string;
  dateLogged: number;
}

export interface MealLog {
  id: string;
  timestamp: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  foodName: string;
  estimatedCarbs: number;
}

export interface WorkoutLog {
  id: string;
  timestamp: number;
  activityType: string;
  durationMinutes: number;
}
