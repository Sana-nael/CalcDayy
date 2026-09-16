import React from 'react';
import { Sparkles, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import { PresetScenario } from '../types';

interface HeaderProps {
  onReset: () => void;
  onSelectPreset: (preset: PresetScenario) => void;
  presets: PresetScenario[];
  activePresetId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onSelectPreset,
  presets,
  activePresetId,
}) => {
  return (
    <header className="w-full border-b border-[#E8E6E1] bg-[#FDFCFB]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#4A5D4E] text-[#FDFCFB] flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2D312E]">
                Metabólica
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EFF2EA] text-[#4A5D4E] border border-[#4A5D4E]/20">
                <CheckCircle2 className="w-3 h-3" />
                Mifflin-St Jeor
              </span>
            </div>
            <p className="text-xs text-[#676F68] hidden md:block">
              Calculadora Nutricional & Metabólica de Alta Precisão
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Preset Selector Dropdown / Pills */}
          <div className="hidden lg:flex items-center bg-[#F5F3EF] p-1 rounded-xl border border-[#E8E6E1]">
            <span className="text-[11px] font-semibold text-[#676F68] uppercase tracking-wider px-2.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#4A5D4E]" />
              Cenários:
            </span>
            {presets.map((preset, idx) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  activePresetId === preset.id
                    ? 'bg-[#4A5D4E] text-white shadow-xs'
                    : 'text-[#2D312E] hover:bg-[#E8E6E1]'
                }`}
                title={preset.description}
              >
                Cenário {idx + 1}
              </button>
            ))}
          </div>

          {/* Reset Button */}
          <button
            type="button"
            id="reset-form-button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#4A5D4E] bg-[#EFF2EA] hover:bg-[#E2E7DB] active:scale-95 transition-all rounded-xl border border-[#4A5D4E]/20"
            title="Limpar e reiniciar todas as entradas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
