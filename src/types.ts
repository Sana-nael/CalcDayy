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
  // Campos de qualificação opcionais
  primaryGoalDetail?: string;
  wantsFollowup?: 'yes' | 'maybe' | 'exploring';
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

// ==========================================
// WHITE-LABEL & PROFESSIONAL CONFIGURATION
// ==========================================

export type CtaType = 'whatsapp' | 'booking' | 'external_page' | 'custom_url';
export type CTAType = CtaType;

export type AdminTab =
  | 'funnel'
  | 'leads'
  | 'branding'
  | 'lead_gate'
  | 'cta'
  | 'methodology'
  | 'integrations';

export interface ProfessionalConfig {
  professionalName: string;
  brandName: string;
  logoUrl?: string;
  professionalRegistration: string; // Ex: CRN-3 54.120
  instagram: string; // Ex: @dra.camilavasconcelos
  website: string; // Ex: https://dracamilavasconcelos.com.br
  whatsapp: string; // Ex: 5511998765432
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCTA: string;
  ctaType: CtaType;
  ctaUrl: string;
  ctaMessage: string;
  leadCaptureEnabled: boolean;
  requireName: boolean;
  requireWhatsapp: boolean;
  requireEmail: boolean;
  offerHeadline: string;
  offerDescription: string;
  consentText: string;
  reportFooter: string;
  disclaimer: string;
  primaryColor: string; // Default: #4A5D4E
  accentColor: string; // Default: #3E4E42
}

// ==========================================
// METHODOLOGY CUSTOMIZATION
// ==========================================

export interface ActivityFactorConfig {
  factor: number;
  label: string;
  description: string;
  detail: string;
}

export interface MethodologyConfig {
  formula: 'mifflin_st_jeor';
  activityFactors: Record<ActivityLevel, ActivityFactorConfig>;
  defaultDeficitPercent: number; // default: 20
  maxDeficitPercent: number; // default: 30
  defaultSurplusPercent: number; // default: 12
  hydrationMlPerKg: number; // default: 35
  macroBalanced: { pRatio: number; cRatio: number; fRatio: number };
  macroHighProtein: { pRatio: number; cRatio: number; fRatio: number };
  macroModerateCarb: { pRatio: number; cRatio: number; fRatio: number };
}

// ==========================================
// LEADS & QUALIFICATION
// ==========================================

export type LeadScore = 'high' | 'medium' | 'low';

export interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  referrer: string;
}

export interface LeadData {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  primaryGoal?: string;
  wantsFollowup?: 'yes' | 'maybe' | 'exploring';
  score: LeadScore;
  consentGiven: boolean;
  createdAt: string; // ISO string
  isDemo?: boolean;
  utm: UTMParams;
  calculatorSnapshot: {
    sex: BiologicalSex;
    age: number;
    weight: number;
    height: number;
    activityLevel: ActivityLevel;
    goal: NutritionGoal;
    bmr: number;
    tdee: number;
    targetCalories: number;
    imc: number;
    imcCategory: string;
    hydrationLiters: number;
  };
}

// ==========================================
// ANALYTICS & FUNNEL
// ==========================================

export type AnalyticsEventName =
  | 'page_view'
  | 'visitor_arrived'
  | 'calculator_started'
  | 'calculator_completed'
  | 'lead_form_viewed'
  | 'lead_submitted'
  | 'full_result_viewed'
  | 'report_generated'
  | 'cta_clicked'
  | 'whatsapp_clicked'
  | 'booking_clicked';

export interface AnalyticsEvent {
  id: string;
  event: AnalyticsEventName;
  timestamp: string; // ISO string
  isDemo?: boolean;
  metadata?: Record<string, any>;
}

export type FunnelPeriod = 'today' | '7days' | '30days' | 'all';

export interface FunnelStats {
  visitors: number;
  calculatorStarted: number;
  calculatorCompleted: number;
  leadsCaptured: number;
  fullResultsViewed: number;
  ctaClicks: number;
  whatsappClicks: number;
  bookingClicks: number;
  conversionVisitorToLead: number;
  conversionLeadToCta: number;
  conversionVisitorToCta: number;
}

// ==========================================
// INTEGRATIONS & WEBHOOK
// ==========================================

export interface WebhookConfig {
  enabled: boolean;
  url: string;
  lastStatus?: 'success' | 'failed' | 'idle';
  lastTestedAt?: string;
  lastHttpStatus?: number;
  lastErrorMessage?: string;
}
