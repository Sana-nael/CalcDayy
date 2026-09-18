import { ProfessionalConfig, MethodologyConfig, WebhookConfig } from '../types';

export const DEFAULT_PROFESSIONAL_CONFIG: ProfessionalConfig = {
  professionalName: 'Dra. Camila Vasconcelos',
  brandName: 'Clínica Vasconcelos • Nutrição Integrativa',
  logoUrl: '',
  professionalRegistration: 'CRN-3 48.912',
  instagram: '@dra.camilavasconcelos',
  website: 'https://camilavasconcelos.com.br',
  whatsapp: '5511987654321',
  heroBadge: 'Diagnóstico Metabólico • Nutrição Baseada em Evidências',
  heroTitle: 'Diagnóstico Metabólico & Necessidades Energéticas',
  heroSubtitle:
    'Estime com rigor científico seu gasto calórico, taxa metabólica basal, hidratação e distribuição de macronutrientes alinhados ao seu objetivo de saúde e composição corporal.',
  primaryCTA: 'QUERO MINHA CONSULTA INDIVIDUALIZADA',
  ctaType: 'whatsapp',
  ctaUrl: '',
  ctaMessage:
    'Olá, {{profissional}}! Acabei de fazer meu Diagnóstico Metabólico no seu site. Meu resultado indicou gasto de {{get}} kcal/dia e meta de {{meta_calorica}} kcal ({{objetivo}}). Gostaria de agendar uma consulta individualizada!',
  leadCaptureEnabled: true,
  requireName: true,
  requireWhatsapp: true,
  requireEmail: false,
  offerHeadline: 'Receba seu Diagnóstico Metabólico Completo',
  offerDescription:
    'Seu metabolismo basal foi calculado. Preencha seus dados para desbloquear sua meta energética exata, distribuição detalhada de macronutrientes, hidratação diária e o relatório completo para download.',
  consentText:
    'Concordo em receber meu diagnóstico e comunicações personalizadas da equipe de nutrição.',
  reportFooter:
    'Diagnóstico gerado para suporte nutricional e planejamento consciente. Consulte sempre seu nutricionista para prescrição dietética individual.',
  disclaimer:
    'As informações e cálculos fornecidos por esta ferramenta têm finalidade exclusivamente educativa e informativa. Baseiam-se na equação preditiva de Mifflin-St Jeor e não constituem prescrição dietética ou diagnóstico médico. Consulte sempre um nutricionista habilitado (CRN).',
  primaryColor: '#4A5D4E',
  accentColor: '#3E4E42',
};

export const DEFAULT_METHODOLOGY_CONFIG: MethodologyConfig = {
  formula: 'mifflin_st_jeor',
  activityFactors: {
    sedentary: {
      factor: 1.2,
      label: 'Sedentário',
      description: 'Pouco ou nenhum exercício diário',
      detail: 'Trabalho de escritório sentado, rotina predominantemente em repouso.',
    },
    light: {
      factor: 1.375,
      label: 'Levemente Ativo',
      description: 'Exercício leve 1 a 3 dias/semana',
      detail: 'Caminhadas ocasionais, pilates ou treinos recreativos moderados.',
    },
    moderate: {
      factor: 1.55,
      label: 'Moderadamente Ativo',
      description: 'Exercício moderado 3 a 5 dias/semana',
      detail: 'Musculação regular, corrida, natação ou esportes coletivos com consistência.',
    },
    intense: {
      factor: 1.725,
      label: 'Muito Ativo',
      description: 'Exercício intenso 6 a 7 dias/semana',
      detail: 'Treinos diários vigorosos, atletas amadores dedicados ou treinos duplos.',
    },
    very_intense: {
      factor: 1.9,
      label: 'Extremamente Ativo',
      description: 'Exercício pesado diário + trabalho físico',
      detail: 'Atletas de alta performance, atletas profissionais ou trabalho braçal pesado.',
    },
  },
  defaultDeficitPercent: 20,
  maxDeficitPercent: 30,
  defaultSurplusPercent: 12,
  hydrationMlPerKg: 35,
  macroBalanced: { pRatio: 0.25, cRatio: 0.5, fRatio: 0.25 },
  macroHighProtein: { pRatio: 0.35, cRatio: 0.4, fRatio: 0.25 },
  macroModerateCarb: { pRatio: 0.3, cRatio: 0.35, fRatio: 0.35 },
};

export const DEFAULT_WEBHOOK_CONFIG: WebhookConfig = {
  enabled: false,
  url: '',
  lastStatus: 'idle',
};

const STORAGE_KEYS = {
  PROFESSIONAL: 'metabolica_professional_config_v1',
  METHODOLOGY: 'metabolica_methodology_config_v1',
  WEBHOOK: 'metabolica_webhook_config_v1',
};

export class ConfigService {
  static getProfessionalConfig(): ProfessionalConfig {
    if (typeof window === 'undefined') return DEFAULT_PROFESSIONAL_CONFIG;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFESSIONAL);
      if (!stored) return DEFAULT_PROFESSIONAL_CONFIG;
      return { ...DEFAULT_PROFESSIONAL_CONFIG, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_PROFESSIONAL_CONFIG;
    }
  }

  static saveProfessionalConfig(config: ProfessionalConfig): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFESSIONAL, JSON.stringify(config));
    } catch (e) {
      console.error('Falha ao salvar professional config:', e);
    }
  }

  static resetProfessionalConfig(): ProfessionalConfig {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.PROFESSIONAL);
    }
    return DEFAULT_PROFESSIONAL_CONFIG;
  }

  static getMethodologyConfig(): MethodologyConfig {
    if (typeof window === 'undefined') return DEFAULT_METHODOLOGY_CONFIG;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.METHODOLOGY);
      if (!stored) return DEFAULT_METHODOLOGY_CONFIG;
      return { ...DEFAULT_METHODOLOGY_CONFIG, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_METHODOLOGY_CONFIG;
    }
  }

  static saveMethodologyConfig(config: MethodologyConfig): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.METHODOLOGY, JSON.stringify(config));
    } catch (e) {
      console.error('Falha ao salvar methodology config:', e);
    }
  }

  static resetMethodologyConfig(): MethodologyConfig {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.METHODOLOGY);
    }
    return DEFAULT_METHODOLOGY_CONFIG;
  }

  static getWebhookConfig(): WebhookConfig {
    if (typeof window === 'undefined') return DEFAULT_WEBHOOK_CONFIG;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WEBHOOK);
      if (!stored) return DEFAULT_WEBHOOK_CONFIG;
      return { ...DEFAULT_WEBHOOK_CONFIG, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_WEBHOOK_CONFIG;
    }
  }

  static saveWebhookConfig(config: WebhookConfig): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.WEBHOOK, JSON.stringify(config));
    } catch (e) {
      console.error('Falha ao salvar webhook config:', e);
    }
  }

  static resetDefaults(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.PROFESSIONAL);
      localStorage.removeItem(STORAGE_KEYS.METHODOLOGY);
      localStorage.removeItem(STORAGE_KEYS.WEBHOOK);
    }
  }
}
