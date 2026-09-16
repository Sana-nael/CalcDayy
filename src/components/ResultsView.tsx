import React, { useState } from 'react';
import { CalculationResults, MacroDistributionType, UserInputData } from '../types';
import { formatKcal } from '../utils/calculator';
import { MacroDistribution } from './MacroDistribution';
import { ImcGauge } from './ImcGauge';
import {
  Flame,
  Zap,
  Droplet,
  Copy,
  Printer,
  Check,
  TrendingDown,
  TrendingUp,
  Minus,
  Info,
  Sparkles,
} from 'lucide-react';

interface ResultsViewProps {
  results: CalculationResults;
  userInput: UserInputData;
  onMacroPresetChange: (preset: MacroDistributionType) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  userInput,
  onMacroPresetChange,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = async () => {
    const goalText =
      userInput.goal === 'loss'
        ? `Emagrecimento (${results.calorieDeltaPercent}% déficit)`
        : userInput.goal === 'gain'
        ? `Ganho de Massa (+${results.calorieDeltaPercent}% superávit)`
        : 'Manutenção (100% GET)';

    const summary = `📊 *Planejamento Nutricional & Metabólico (Mifflin-St Jeor)*
--------------------------------------------
👤 *Perfil:* ${userInput.sex === 'female' ? 'Feminino' : 'Masculino'} | ${userInput.age} anos | ${userInput.weight} kg | ${userInput.height} cm
🎯 *Objetivo:* ${goalText}

🔥 *Taxa Metabólica Basal (TMB):* ${formatKcal(results.tmb)} kcal/dia
⚡ *Gasto Energético Total (GET):* ${formatKcal(results.get)} kcal/dia
🏆 *Meta Calórica Diária:* ${formatKcal(results.targetCalories)} kcal/dia (${results.calorieDelta >= 0 ? '+' : ''}${results.calorieDelta} kcal)

⚖️ *IMC:* ${results.imc.value} kg/m² (${results.imc.classification})
💧 *Hidratação Diária:* ${results.hydrationLiters} L (${results.hydrationMl} ml • ~${results.hydrationGlasses} copos de 250ml)

🥗 *Distribuição de Macronutrientes (${results.macros.distributionName}):*
• Proteínas: ${results.macros.protein.grams}g (${formatKcal(results.macros.protein.calories)} kcal • ${results.macros.protein.percent}% • ${results.macros.protein.gPerKg}g/kg)
• Carboidratos: ${results.macros.carbs.grams}g (${formatKcal(results.macros.carbs.calories)} kcal • ${results.macros.carbs.percent}% • ${results.macros.carbs.gPerKg}g/kg)
• Gorduras: ${results.macros.fats.grams}g (${formatKcal(results.macros.fats.calories)} kcal • ${results.macros.fats.percent}% • ${results.macros.fats.gPerKg}g/kg)
--------------------------------------------
*Nota:* Estimativa educativa para suporte nutricional individualizado.`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Hero Card: Meta Calórica Diária */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#4A5D4E] text-[#FDFCFB] shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#EFF2EA]/80">
                Prescrição Energética Estimada
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Meta Diária
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-white">
                {formatKcal(results.targetCalories)}
              </h2>
              <span className="text-sm sm:text-base font-medium text-[#EFF2EA]/90">
                kcal / dia
              </span>
            </div>
          </div>

          {/* Goal pill with delta */}
          <div className="sm:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs border border-white/20">
              {userInput.goal === 'loss' && (
                <>
                  <TrendingDown className="w-4 h-4 text-emerald-300" />
                  <span>Déficit de {Math.abs(results.calorieDeltaPercent)}%</span>
                </>
              )}
              {userInput.goal === 'gain' && (
                <>
                  <TrendingUp className="w-4 h-4 text-amber-300" />
                  <span>Superávit de +{results.calorieDeltaPercent}%</span>
                </>
              )}
              {userInput.goal === 'maintenance' && (
                <>
                  <Minus className="w-4 h-4 text-sky-300" />
                  <span>Balanço Isocalórico (100% GET)</span>
                </>
              )}
            </div>

            {results.calorieDelta !== 0 && (
              <p className="text-xs text-[#EFF2EA]/80 mt-1.5 font-medium">
                {results.calorieDelta > 0 ? '+' : ''}
                {results.calorieDelta} kcal em relação ao gasto total (GET)
              </p>
            )}
          </div>
        </div>

        {/* Quick Energy Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/15 text-xs">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[#EFF2EA]/70 block text-[10px] font-bold uppercase tracking-wider">
              Metabolismo de Repouso (TMB)
            </span>
            <span className="text-base font-serif font-bold text-white mt-0.5 block">
              {formatKcal(results.tmb)} kcal
            </span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[#EFF2EA]/70 block text-[10px] font-bold uppercase tracking-wider">
              Gasto com Rotina (GET)
            </span>
            <span className="text-base font-serif font-bold text-white mt-0.5 block">
              {formatKcal(results.get)} kcal
            </span>
          </div>
        </div>
      </div>

      {/* 2-Card Metabolic Pillars (TMB & GET Details) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* TMB Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#4A5D4E] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#4A5D4E]" />
                Taxa Metabólica Basal (TMB)
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#EFF2EA] text-[#4A5D4E] border border-[#4A5D4E]/20">
                Mifflin-St Jeor
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-serif font-bold text-[#2D312E]">
                {formatKcal(results.tmb)}
              </span>
              <span className="text-xs text-[#676F68]">kcal/dia</span>
            </div>
            <p className="text-xs text-[#555C56] mt-2 leading-relaxed">
              Energia mínima consumida pelo organismo em repouso estrito para manter funções vitais (respiração, circulação, atividade cerebral e celular).
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E8E6E1] text-[11px] font-mono text-[#676F68]">
            {userInput.sex === 'female'
              ? 'Fórmula: (10×peso) + (6.25×alt) - (5×idade) - 161'
              : 'Fórmula: (10×peso) + (6.25×alt) - (5×idade) + 5'}
          </div>
        </div>

        {/* GET Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#4A5D4E] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#4A5D4E]" />
                Gasto Energético Total (GET)
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#EFF2EA] text-[#4A5D4E] border border-[#4A5D4E]/20">
                Fator × {results.activityMultiplier}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-serif font-bold text-[#2D312E]">
                {formatKcal(results.get)}
              </span>
              <span className="text-xs text-[#676F68]">kcal/dia</span>
            </div>
            <p className="text-xs text-[#555C56] mt-2 leading-relaxed">
              Gasto calórico real considerando seu nível de atividade física diária somado ao efeito térmico dos alimentos e movimento espontâneo (NEAT).
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E8E6E1] text-[11px] font-mono text-[#676F68]">
            GET = {formatKcal(results.tmb)} × {results.activityMultiplier}
          </div>
        </div>
      </div>

      {/* IMC Gauge */}
      <ImcGauge imc={results.imc} />

      {/* Macronutrient Distribution */}
      <MacroDistribution
        results={results}
        currentPreset={userInput.macroPreset}
        onPresetChange={onMacroPresetChange}
      />

      {/* Hydration Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-sky-800">
                Hidratação Fisiológica Estimada
              </span>
              <h3 className="text-xl font-serif font-bold text-[#2D312E]">
                Ingestão Hídrica Mínima
              </h3>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-sky-950">
              {results.hydrationLiters}
            </span>
            <span className="text-sm font-medium text-sky-800">Litros/dia</span>
            <span className="text-xs text-[#676F68]">({formatKcal(results.hydrationMl)} ml)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#555C56]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sky-900">
              💧 Meta Prática:
            </span>
            <span>
              Aproximadamente <strong>{results.hydrationGlasses} copos</strong> de 250ml distribuídos ao longo do seu dia.
            </span>
          </div>
          <div className="text-[11px] font-mono text-sky-800/80 bg-white/80 px-2.5 py-1 rounded-md border border-sky-200 shrink-0">
            Regra: 35 ml × {userInput.weight} kg
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 no-print">
        <button
          type="button"
          id="copy-summary-btn"
          onClick={handleCopySummary}
          className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#4A5D4E] hover:bg-[#3E4E42] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Resumo Copiado com Sucesso!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Resumo Completo</span>
            </>
          )}
        </button>

        <button
          type="button"
          id="print-summary-btn"
          onClick={handlePrint}
          className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-[#EFF2EA] hover:bg-[#E2E7DB] text-[#4A5D4E] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#4A5D4E]/20 active:scale-[0.98] transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Salvar PDF</span>
        </button>
      </div>
    </div>
  );
};
