import React from 'react';
import { CalculationResults, MacroDistributionType } from '../types';
import { formatKcal, MACRO_PRESET_CONFIGS } from '../utils/calculator';
import { Drumstick, Wheat, Flame, CheckCircle2 } from 'lucide-react';

interface MacroDistributionProps {
  results: CalculationResults;
  currentPreset: MacroDistributionType;
  onPresetChange: (preset: MacroDistributionType) => void;
}

export const MacroDistribution: React.FC<MacroDistributionProps> = ({
  results,
  currentPreset,
  onPresetChange,
}) => {
  const { macros } = results;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#4A5D4E]">
            Divisão Estratégica de Macronutrientes
          </span>
          <h3 className="text-xl font-serif font-bold text-[#2D312E] mt-0.5">
            Distribuição Calórica Diária
          </h3>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1 bg-[#F5F3EF] p-1 rounded-xl border border-[#E8E6E1] self-start sm:self-auto">
          {(['balanced', 'high_protein', 'moderate_carb'] as MacroDistributionType[]).map((key) => {
            const cfg = MACRO_PRESET_CONFIGS[key];
            const isSelected = currentPreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onPresetChange(key)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  isSelected
                    ? 'bg-[#4A5D4E] text-white shadow-xs'
                    : 'text-[#555C56] hover:text-[#2D312E] hover:bg-[#E8E6E1]'
                }`}
                title={cfg.description}
              >
                {cfg.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Proportional Bar */}
      <div className="mb-6">
        <div className="h-4 w-full rounded-full flex overflow-hidden bg-stone-100 p-0.5 border border-[#E8E6E1]">
          <div
            className="h-full rounded-l-full bg-emerald-600 transition-all duration-500 ease-out"
            style={{ width: `${macros.protein.percent}%` }}
            title={`Proteínas: ${macros.protein.percent}%`}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-500 ease-out"
            style={{ width: `${macros.carbs.percent}%` }}
            title={`Carboidratos: ${macros.carbs.percent}%`}
          />
          <div
            className="h-full rounded-r-full bg-stone-500 transition-all duration-500 ease-out"
            style={{ width: `${macros.fats.percent}%` }}
            title={`Gorduras: ${macros.fats.percent}%`}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-semibold mt-2 px-1">
          <div className="flex items-center gap-1.5 text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Proteínas ({macros.protein.percent}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-800">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Carboidratos ({macros.carbs.percent}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-500 inline-block" />
            <span>Gorduras ({macros.fats.percent}%)</span>
          </div>
        </div>
      </div>

      {/* 3 Macro Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
        {/* Proteínas */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <Drumstick className="w-3.5 h-3.5" />
              Proteínas
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
              4 kcal/g
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950">
            {macros.protein.grams} <span className="text-sm font-sans font-medium text-emerald-800">g</span>
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-900/80 mt-2 pt-2 border-t border-emerald-200/60 font-medium">
            <span>{formatKcal(macros.protein.calories)} kcal</span>
            <span className="font-semibold">{macros.protein.gPerKg} g/kg</span>
          </div>
        </div>

        {/* Carboidratos */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <Wheat className="w-3.5 h-3.5" />
              Carboidratos
            </span>
            <span className="text-[11px] font-semibold text-amber-700 bg-white/80 px-2 py-0.5 rounded-full border border-amber-200">
              4 kcal/g
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-950">
            {macros.carbs.grams} <span className="text-sm font-sans font-medium text-amber-800">g</span>
          </div>
          <div className="flex items-center justify-between text-xs text-amber-900/80 mt-2 pt-2 border-t border-amber-200/60 font-medium">
            <span>{formatKcal(macros.carbs.calories)} kcal</span>
            <span className="font-semibold">{macros.carbs.gPerKg} g/kg</span>
          </div>
        </div>

        {/* Gorduras */}
        <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-300/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              Gorduras
            </span>
            <span className="text-[11px] font-semibold text-stone-700 bg-white/80 px-2 py-0.5 rounded-full border border-stone-300">
              9 kcal/g
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {macros.fats.grams} <span className="text-sm font-sans font-medium text-stone-700">g</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-800/80 mt-2 pt-2 border-t border-stone-300/60 font-medium">
            <span>{formatKcal(macros.fats.calories)} kcal</span>
            <span className="font-semibold">{macros.fats.gPerKg} g/kg</span>
          </div>
        </div>
      </div>

      {/* Proof of Caloric Coherence */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-[#555C56] bg-[#EFF2EA]/60 p-3 rounded-xl border border-[#4A5D4E]/15">
        <div className="flex items-center gap-1.5 text-[#3E4D41]">
          <CheckCircle2 className="w-4 h-4 text-[#4A5D4E]" />
          <span>
            <strong>Coerência Energética Validada:</strong> ({macros.protein.grams}g × 4) + ({macros.carbs.grams}g × 4) + ({macros.fats.grams}g × 9) =
          </span>
        </div>
        <span className="font-mono font-bold text-[#2D312E] bg-white px-2 py-0.5 rounded border border-[#E8E6E1]">
          {formatKcal(macros.totalCalories)} kcal ({results.targetCalories} kcal)
        </span>
      </div>
    </div>
  );
};
