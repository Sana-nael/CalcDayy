import { LeadData, LeadScore, UserInputData, CalculationResults, UTMParams } from '../types';

const LEADS_STORAGE_KEY = 'metabolica_leads_v1';

export class LeadService {
  static getLeads(includeDemo: boolean = true): LeadData[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(LEADS_STORAGE_KEY);
      const leads: LeadData[] = data ? JSON.parse(data) : [];
      if (!includeDemo) {
        return leads.filter((l) => !l.isDemo);
      }
      return leads.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch {
      return [];
    }
  }

  static calculateScore(
    wantsFollowup?: 'yes' | 'maybe' | 'exploring',
    goal?: string
  ): LeadScore {
    if (wantsFollowup === 'yes') return 'high';
    if (wantsFollowup === 'maybe') return 'medium';
    if (wantsFollowup === 'exploring') return 'low';
    if (goal && goal !== '') return 'medium';
    return 'medium';
  }

  static saveLead(params: {
    name: string;
    whatsapp: string;
    email?: string;
    primaryGoal?: string;
    wantsFollowup?: 'yes' | 'maybe' | 'exploring';
    consentGiven: boolean;
    userInput: UserInputData;
    results: CalculationResults;
    utm: UTMParams;
    isDemo?: boolean;
  }): LeadData {
    const score = this.calculateScore(params.wantsFollowup, params.primaryGoal);

    const newLead: LeadData = {
      id: 'lead_' + Math.random().toString(36).substring(2, 10),
      name: params.name.trim(),
      whatsapp: params.whatsapp.replace(/\D/g, ''),
      email: params.email?.trim(),
      primaryGoal: params.primaryGoal,
      wantsFollowup: params.wantsFollowup,
      score,
      consentGiven: params.consentGiven,
      createdAt: new Date().toISOString(),
      isDemo: !!params.isDemo,
      utm: params.utm,
      calculatorSnapshot: {
        sex: params.userInput.sex,
        age: Number(params.userInput.age),
        weight: Number(params.userInput.weight),
        height: Number(params.userInput.height),
        activityLevel: params.userInput.activityLevel,
        goal: params.userInput.goal,
        bmr: params.results.tmb,
        tdee: params.results.get,
        targetCalories: params.results.targetCalories,
        imc: params.results.imc.value,
        imcCategory: params.results.imc.classification,
        hydrationLiters: params.results.hydrationLiters,
      },
    };

    if (typeof window !== 'undefined') {
      try {
        const current = this.getLeads(true);
        current.unshift(newLead);
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(current));
      } catch (e) {
        console.error('Falha ao salvar lead:', e);
      }
    }

    return newLead;
  }

  static deleteLead(id: string): void {
    if (typeof window === 'undefined') return;
    const leads = this.getLeads(true).filter((l) => l.id !== id);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  }

  static clearDemoLeads(): void {
    if (typeof window === 'undefined') return;
    const realLeads = this.getLeads(true).filter((l) => !l.isDemo);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(realLeads));
  }

  static seedDemoLeads(): void {
    this.clearDemoLeads();

    const demoSamples: Array<Partial<LeadData>> = [
      {
        name: 'Mariana Silveira',
        whatsapp: '11984210987',
        email: 'mariana.silveira@email.com',
        primaryGoal: 'Emagrecimento com preservação muscular',
        wantsFollowup: 'yes',
        score: 'high',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        utm: {
          utm_source: 'instagram',
          utm_medium: 'link_bio',
          utm_campaign: 'perfil_nutri',
          utm_content: 'stories_destaque',
          utm_term: '',
          referrer: 'https://instagram.com',
        },
        calculatorSnapshot: {
          sex: 'female',
          age: 32,
          weight: 68,
          height: 165,
          activityLevel: 'moderate',
          goal: 'loss',
          bmr: 1420,
          tdee: 2201,
          targetCalories: 1761,
          imc: 25.0,
          imcCategory: 'Sobrepeso',
          hydrationLiters: 2.4,
        },
      },
      {
        name: 'Rodrigo Fontes',
        whatsapp: '21976543210',
        email: 'rodrigo.fontes@gmail.com',
        primaryGoal: 'Hipertrofia e ganho de força',
        wantsFollowup: 'yes',
        score: 'high',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        utm: {
          utm_source: 'youtube',
          utm_medium: 'video_descricao',
          utm_campaign: 'dieta_hipertrofia',
          utm_content: '',
          utm_term: '',
          referrer: 'https://youtube.com',
        },
        calculatorSnapshot: {
          sex: 'male',
          age: 27,
          weight: 78,
          height: 180,
          activityLevel: 'intense',
          goal: 'gain',
          bmr: 1780,
          tdee: 3071,
          targetCalories: 3439,
          imc: 24.1,
          imcCategory: 'Peso adequado (Eutrofia)',
          hydrationLiters: 2.7,
        },
      },
      {
        name: 'Juliana Castro',
        whatsapp: '31991234567',
        email: 'ju.castro.nutri@hotmail.com',
        primaryGoal: 'Reeducação alimentar & controle de ansiedade',
        wantsFollowup: 'maybe',
        score: 'medium',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        utm: {
          utm_source: 'meta_ads',
          utm_medium: 'reels_sponsored',
          utm_campaign: 'calculadora_lead',
          utm_content: 'criativo_video_01',
          utm_term: 'nutricao_feminina',
          referrer: '',
        },
        calculatorSnapshot: {
          sex: 'female',
          age: 41,
          weight: 74,
          height: 162,
          activityLevel: 'light',
          goal: 'loss',
          bmr: 1386,
          tdee: 1906,
          targetCalories: 1525,
          imc: 28.2,
          imcCategory: 'Sobrepeso',
          hydrationLiters: 2.6,
        },
      },
      {
        name: 'Lucas Brandão',
        whatsapp: '19988776655',
        email: 'lucas.brandao@outlook.com',
        primaryGoal: 'Manutenção de peso e energia no trabalho',
        wantsFollowup: 'exploring',
        score: 'low',
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        utm: {
          utm_source: 'google',
          utm_medium: 'organico',
          utm_campaign: 'busca_tmb',
          utm_content: '',
          utm_term: 'calcular gasto calorico',
          referrer: 'https://google.com.br',
        },
        calculatorSnapshot: {
          sex: 'male',
          age: 35,
          weight: 82,
          height: 176,
          activityLevel: 'sedentary',
          goal: 'maintenance',
          bmr: 1745,
          tdee: 2094,
          targetCalories: 2094,
          imc: 26.5,
          imcCategory: 'Sobrepeso',
          hydrationLiters: 2.9,
        },
      },
    ];

    const current = this.getLeads(false);
    const populated = demoSamples.map((s) => ({
      id: 'demo_lead_' + Math.random().toString(36).substring(2, 9),
      name: s.name || '',
      whatsapp: s.whatsapp || '',
      email: s.email,
      primaryGoal: s.primaryGoal,
      wantsFollowup: s.wantsFollowup || 'yes',
      score: s.score || 'high',
      consentGiven: true,
      createdAt: s.createdAt || new Date().toISOString(),
      isDemo: true,
      utm: s.utm || {
        utm_source: 'instagram',
        utm_medium: 'bio',
        utm_campaign: '',
        utm_content: '',
        utm_term: '',
        referrer: '',
      },
      calculatorSnapshot: s.calculatorSnapshot!,
    })) as LeadData[];

    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify([...current, ...populated]));
  }

  static exportToCSV(leads: LeadData[]): void {
    if (!leads.length) return;

    const headers = [
      'Data/Hora',
      'Nome',
      'WhatsApp',
      'Email',
      'Qualificacao',
      'Objetivo',
      'Acompanhamento Desejado',
      'Sexo',
      'Idade',
      'Peso (kg)',
      'Altura (cm)',
      'TMB (kcal)',
      'GET (kcal)',
      'Meta Calorica (kcal)',
      'IMC',
      'Classificacao IMC',
      'Agua (L)',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Origem Referrer',
      'Tipo Dado',
    ];

    const rows = leads.map((l) => [
      `"${new Date(l.createdAt).toLocaleString('pt-BR')}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.whatsapp}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${l.score.toUpperCase()}"`,
      `"${(l.primaryGoal || l.calculatorSnapshot.goal).replace(/"/g, '""')}"`,
      `"${l.wantsFollowup || 'Não informado'}"`,
      `"${l.calculatorSnapshot.sex === 'female' ? 'Feminino' : 'Masculino'}"`,
      l.calculatorSnapshot.age,
      l.calculatorSnapshot.weight,
      l.calculatorSnapshot.height,
      l.calculatorSnapshot.bmr,
      l.calculatorSnapshot.tdee,
      l.calculatorSnapshot.targetCalories,
      l.calculatorSnapshot.imc,
      `"${l.calculatorSnapshot.imcCategory}"`,
      l.calculatorSnapshot.hydrationLiters,
      `"${l.utm.utm_source || ''}"`,
      `"${l.utm.utm_medium || ''}"`,
      `"${l.utm.utm_campaign || ''}"`,
      `"${l.utm.referrer || ''}"`,
      l.isDemo ? '"Demonstração"' : '"Real"',
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_diagnostico_metabolico_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
