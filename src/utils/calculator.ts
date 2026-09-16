import {
  UserInputData,
  CalculationResults,
  ValidationErrors,
  ActivityLevel,
  MacroDistributionType,
  ImcData,
} from '../types';

export const ACTIVITY_FACTORS: Record<
  ActivityLevel,
  { factor: number; label: string; description: string; detail: string }
> = {
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
};

export const MACRO_PRESET_CONFIGS: Record<
  MacroDistributionType,
  { name: string; description: string; pRatio: number; cRatio: number; fRatio: number }
> = {
  balanced: {
    name: 'Equilibrada',
    description: 'Distribuição clássica e sustentável para o dia a dia',
    pRatio: 0.25, // 25% proteína
    cRatio: 0.50, // 50% carbo
    fRatio: 0.25, // 25% gordura
  },
  high_protein: {
    name: 'Hiperproteica',
    description: 'Prioriza saciedade, queima de gordura e síntese proteica',
    pRatio: 0.35, // 35% proteína
    cRatio: 0.40, // 40% carbo
    fRatio: 0.25, // 25% gordura
  },
  moderate_carb: {
    name: 'Low Carb Moderada',
    description: 'Maior proporção de lipídios saudáveis e controle glicêmico',
    pRatio: 0.30, // 30% proteína
    cRatio: 0.35, // 35% carbo
    fRatio: 0.35, // 35% gordura
  },
};

/**
 * Validação rigorosa dos dados de entrada
 */
export function validateInputs(data: UserInputData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validação de Idade (15 a 100 anos)
  if (data.age === '' || isNaN(Number(data.age))) {
    errors.age = 'Informe a sua idade em anos.';
  } else {
    const ageNum = Number(data.age);
    if (!Number.isInteger(ageNum) || ageNum < 15 || ageNum > 100) {
      errors.age = 'A idade deve estar entre 15 e 100 anos para este cálculo.';
    }
  }

  // Validação de Peso (35 a 250 kg)
  if (data.weight === '' || isNaN(Number(data.weight))) {
    errors.weight = 'Informe o seu peso corporal em kg.';
  } else {
    const weightNum = Number(data.weight);
    if (weightNum < 35 || weightNum > 250) {
      errors.weight = 'O peso deve estar entre 35 kg e 250 kg.';
    }
  }

  // Validação de Altura (120 a 230 cm)
  if (data.height === '' || isNaN(Number(data.height))) {
    errors.height = 'Informe a sua altura em centímetros.';
  } else {
    const heightNum = Number(data.height);
    if (heightNum < 120 || heightNum > 230) {
      errors.height = 'A altura deve estar entre 120 cm e 230 cm.';
    }
  }

  return errors;
}

/**
 * Calcula IMC e classificação completa
 */
export function calculateImc(weightKg: number, heightCm: number): ImcData {
  const heightM = heightCm / 100;
  const imcRaw = weightKg / (heightM * heightM);
  const value = Math.round(imcRaw * 10) / 10;

  const minHealthyWeight = Math.round(18.5 * (heightM * heightM) * 10) / 10;
  const maxHealthyWeight = Math.round(24.9 * (heightM * heightM) * 10) / 10;

  if (value < 18.5) {
    return {
      value,
      classification: 'Abaixo do peso',
      category: 'underweight',
      description: 'Massa corporal abaixo da faixa de referência populacional.',
      healthyWeightRange: { min: minHealthyWeight, max: maxHealthyWeight },
    };
  } else if (value <= 24.9) {
    return {
      value,
      classification: 'Peso adequado (Eutrofia)',
      category: 'normal',
      description: 'Massa corporal dentro da faixa considerada saudável pela OMS.',
      healthyWeightRange: { min: minHealthyWeight, max: maxHealthyWeight },
    };
  } else if (value <= 29.9) {
    return {
      value,
      classification: 'Sobrepeso',
      category: 'overweight',
      description: 'Leve acúmulo ponderal. Avaliar composição corporal e estilo de vida.',
      healthyWeightRange: { min: minHealthyWeight, max: maxHealthyWeight },
    };
  } else if (value <= 34.9) {
    return {
      value,
      classification: 'Obesidade Grau I',
      category: 'obesity1',
      description: 'Recomenda-se acompanhamento nutricional preventivo e reeducação alimentar.',
      healthyWeightRange: { min: minHealthyWeight, max: maxHealthyWeight },
    };
  } else if (value <= 39.9) {
    return {
      value,
      classification: 'Obesidade Grau II',
      category: 'obesity2',
      description: 'Acompanhamento médico e nutricional multiprofissional indicado.',
      healthyWeightRange: { min: minHealthyWeight, max: maxHealthyWeight },
    };
  } else {
    return {
      value,
      classification: 'Obesidade Grau III',
      category: 'obesity3',
      description: 'Quadro severo requer avaliação clínica completa e suporte especializado.',
      healthyWeightRange: { min: minHealthyWeight, max: maxHealthyWeight },
    };
  }
}

/**
 * Realiza os cálculos metabólicos completos
 */
export function calculateMetabolism(data: UserInputData): CalculationResults | null {
  const errors = validateInputs(data);
  if (Object.keys(errors).length > 0) {
    return null;
  }

  const age = Number(data.age);
  const weight = Number(data.weight);
  const height = Number(data.height);

  // 1. TMB - Mifflin-St Jeor
  // Feminino: (10 × peso kg) + (6.25 × altura cm) - (5 × idade) - 161
  // Masculino: (10 × peso kg) + (6.25 × altura cm) - (5 × idade) + 5
  let tmbRaw = (10 * weight) + (6.25 * height) - (5 * age);
  if (data.sex === 'female') {
    tmbRaw -= 161;
  } else {
    tmbRaw += 5;
  }
  const tmb = Math.round(tmbRaw);

  // 2. GET = TMB × fator de atividade
  const activityConfig = ACTIVITY_FACTORS[data.activityLevel];
  const activityMultiplier = activityConfig.factor;
  const getRaw = tmbRaw * activityMultiplier;
  const get = Math.round(getRaw);

  // 3. Meta Calórica segundo o objetivo
  let targetCalories = get;
  let calorieDelta = 0;
  let calorieDeltaPercent = 0;

  if (data.goal === 'loss') {
    calorieDeltaPercent = -Math.abs(data.deficitPercent || 20);
    calorieDelta = Math.round(get * (calorieDeltaPercent / 100));
    targetCalories = Math.max(1000, get + calorieDelta);
  } else if (data.goal === 'gain') {
    calorieDeltaPercent = Math.abs(data.surplusPercent || 12);
    calorieDelta = Math.round(get * (calorieDeltaPercent / 100));
    targetCalories = get + calorieDelta;
  } else {
    // Manutenção
    calorieDeltaPercent = 0;
    calorieDelta = 0;
    targetCalories = get;
  }

  // 4. IMC
  const imc = calculateImc(weight, height);

  // 5. Hidratação estimada: 35 ml x peso kg
  const hydrationMl = Math.round(35 * weight);
  const hydrationLiters = Math.round((hydrationMl / 1000) * 10) / 10;
  const hydrationGlasses = Math.round(hydrationMl / 250);

  // 6. Macronutrientes
  // Ajuste do preset dependendo do objetivo caso não especificado
  const presetConfig = MACRO_PRESET_CONFIGS[data.macroPreset] || MACRO_PRESET_CONFIGS.balanced;

  // Calculamos os gramas baseados nos percentuais
  const targetProtCalories = targetCalories * presetConfig.pRatio;
  const targetFatCalories = targetCalories * presetConfig.fRatio;

  const protGrams = Math.round(targetProtCalories / 4);
  const fatGrams = Math.round(targetFatCalories / 9);

  const calculatedProtKcal = protGrams * 4;
  const calculatedFatKcal = fatGrams * 9;

  // O restante exato vai para carboidratos para assegurar soma calórica 100% perfeita
  const remainingCarbKcal = Math.max(0, targetCalories - calculatedProtKcal - calculatedFatKcal);
  const carbGrams = Math.round(remainingCarbKcal / 4);
  const calculatedCarbKcal = carbGrams * 4;

  const finalTotalKcal = calculatedProtKcal + calculatedFatKcal + calculatedCarbKcal;

  const protPercent = Math.round((calculatedProtKcal / finalTotalKcal) * 100);
  const fatPercent = Math.round((calculatedFatKcal / finalTotalKcal) * 100);
  const carbPercent = Math.max(0, 100 - protPercent - fatPercent);

  const protGPerKg = Math.round((protGrams / weight) * 10) / 10;
  const carbGPerKg = Math.round((carbGrams / weight) * 10) / 10;
  const fatGPerKg = Math.round((fatGrams / weight) * 10) / 10;

  return {
    tmb,
    activityMultiplier,
    get,
    targetCalories: finalTotalKcal,
    calorieDelta,
    calorieDeltaPercent,
    imc,
    hydrationMl,
    hydrationLiters,
    hydrationGlasses,
    macros: {
      protein: {
        grams: protGrams,
        calories: calculatedProtKcal,
        percent: protPercent,
        gPerKg: protGPerKg,
      },
      carbs: {
        grams: carbGrams,
        calories: calculatedCarbKcal,
        percent: carbPercent,
        gPerKg: carbGPerKg,
      },
      fats: {
        grams: fatGrams,
        calories: calculatedFatKcal,
        percent: fatPercent,
        gPerKg: fatGPerKg,
      },
      totalCalories: finalTotalKcal,
      distributionName: presetConfig.name,
    },
  };
}

/**
 * Formata números com separador de milhar pt-BR
 */
export function formatKcal(val: number): string {
  return new Intl.NumberFormat('pt-BR').format(Math.round(val));
}
