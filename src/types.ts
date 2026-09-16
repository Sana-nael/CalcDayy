export type BiologicalSex = 'female' | 'male';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense' | 'very_intense';

export type NutritionGoal = 'loss' | 'maintenance' | 'gain';

export type MacroDistributionType = 'balanced' | 'high_protein' | 'moderate_carb';

export interface UserInputData {
  sex: BiologicalSex;
  age: number | '';
  weight: number | '';
  height: number | '';
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
  deficitPercent: number; // e.g. 20, 25
  surplusPercent: number; // e.g. 10, 15
  macroPreset: MacroDistributionType;
}

export interface ValidationErrors {
  age?: string;
  weight?: string;
  height?: string;
  general?: string;
}

export interface MacroDetail {
  grams: number;
  calories: number;
  percent: number;
  gPerKg: number;
}

export interface ImcData {
  value: number;
  classification: string;
  category: 'underweight' | 'normal' | 'overweight' | 'obesity1' | 'obesity2' | 'obesity3';
  description: string;
  healthyWeightRange: { min: number; max: number };
}

export interface CalculationResults {
  tmb: number; // Taxa Metabólica Basal (Mifflin-St Jeor)
  activityMultiplier: number;
  get: number; // Gasto Energético Total
  targetCalories: number; // Meta calórica final
  calorieDelta: number; // Diferença em kcal (+ ou -)
  calorieDeltaPercent: number; // % de déficit ou superávit
  imc: ImcData;
  hydrationMl: number;
  hydrationLiters: number;
  hydrationGlasses: number;
  macros: {
    protein: MacroDetail;
    carbs: MacroDetail;
    fats: MacroDetail;
    totalCalories: number;
    distributionName: string;
  };
}

export interface PresetScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  data: UserInputData;
  expectedTMB: number;
  expectedGET: number;
  expectedMeta: number;
}
