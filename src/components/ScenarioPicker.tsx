import React from 'react';
import { PresetScenario } from '../types';
import { Award, ArrowRight, CheckCircle } from 'lucide-react';

interface ScenarioPickerProps {
  presets: PresetScenario[];
  activeId?: string;
  onSelect: (preset: PresetScenario) => void;
}

export const ScenarioPicker: React.FC<ScenarioPickerProps> = ({
  presets,
  activeId,
  onSelect,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E8E6E1] shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#4A5D4E] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#4A5D4E]" />
            Cenários de Validação & Demonstração
          </span>
          <h3 className="text-lg font-serif font-bold text-[#2D312E]">
            Carregar Casos Práticos Pré-testados
          </h3>
        </div>
        <p className="text-xs text-[#676F68]">
          Clique para preencher e validar instantaneamente as fórmulas matemáticas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {presets.map((preset, index) => {
          const isSelected = activeId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              id={`preset-btn-${index + 1}`}
              onClick={() => onSelect(preset)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#EFF2EA] border-[#4A5D4E] ring-2 ring-[#4A5D4E]/20 shadow-xs'
                  : 'bg-[#FDFCFB] border-[#E8E6E1] hover:bg-[#F5F3EF] hover:border-[#D0CDC5]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-[#2D312E] group-hover:text-[#4A5D4E] transition-colors">
                    {preset.title}
                  </span>
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-[#4A5D4E] shrink-0" />
                  )}
                </div>
                <div className="text-[11px] font-semibold text-[#4A5D4E] mb-1">
                  {preset.subtitle}
                </div>
                <p className="text-xs text-[#676F68] leading-normal line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#E8E6E1] flex items-center justify-between text-[11px] font-mono text-[#555C56]">
                <span>TMB: ~{preset.expectedTMB} kcal</span>
                <span className="flex items-center gap-1 font-bold text-[#4A5D4E] group-hover:translate-x-0.5 transition-transform">
                  Aplicar <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
