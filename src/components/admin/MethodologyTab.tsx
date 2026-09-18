import React from 'react';
import { MethodologyConfig, ActivityLevel } from '../../types';
import { ACTIVITY_FACTORS } from '../../utils/calculator';
import { Calculator, AlertCircle, CheckCircle2, RotateCcw, Droplet, Flame } from 'lucide-react';

interface MethodologyTabProps {
  methodology: MethodologyConfig;
  onChange: (methodology: MethodologyConfig) => void;
  onResetDefaults: () => void;
}

export const MethodologyTab: React.FC<MethodologyTabProps> = ({
  methodology,
  onChange,
  onResetDefaults,
}) => {
  const handleActivityFactorChange = (key: ActivityLevel, factorVal: number) => {
    const updated = {
      ...methodology,
      activityFactors: {
        ...methodology.activityFactors,
        [key]: {
          ...methodology.activityFactors[key],
          factor: factorVal,
        },
      },
    };
    onChange(updated);
  };

  const handleMacroRatioChange = (
    presetKey: 'macroBalanced' | 'macroHighProtein' | 'macroModerateCarb',
    p: number,
    c: number,
    f: number
  ) => {
    const updated = {
      ...methodology,
      [presetKey]: {
        pRatio: p,
        cRatio: c,
        fRatio: f,
      },
    };
    onChange(updated);
  };

  // Helper para validar soma 100%
  const checkMacroSum = (p: number, c: number, f: number) => {
    const sum = Math.round((p + c + f) * 100);
    return sum === 100;
  };

  const isBalancedValid = checkMacroSum(
    methodology.macroBalanced.pRatio,
    methodology.macroBalanced.cRatio,
    methodology.macroBalanced.fRatio
  );

  const isHighProtValid = checkMacroSum(
    methodology.macroHighProtein.pRatio,
    methodology.macroHighProtein.cRatio,
    methodology.macroHighProtein.fRatio
  );

  const isModCarbValid = checkMacroSum(
    methodology.macroModerateCarb.pRatio,
    methodology.macroModerateCarb.cRatio,
    methodology.macroModerateCarb.fRatio
  );

  return (
    <div className="space-y-6">
      {/* Top Explanation */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-serif font-bold text-[#2D312E] mb-1">
              Metodologia e Fórmulas de Cálculo
            </h3>
            <p className="text-xs text-[#676F68]">
              Personalize os multiplicadores de atividade física, limites calóricos e divisões de macronutrientes da sua conduta clínica.
            </p>
          </div>

          <button
            type="button"
            onClick={onResetDefaults}
            className="px-3 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#EFF2EA] text-[#4A5D4E] border border-[#E8E6E1] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Fórmulas Padrão</span>
          </button>
        </div>
      </div>

      {/* Fórmula Basal e Parâmetros Energéticos */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#4A5D4E]" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#2D312E]">
            Equação de Taxa Metabólica Basal (TMB)
          </h4>
        </div>

        <div className="p-3.5 rounded-xl bg-[#EFF2EA] border border-[#4A5D4E]/20 text-xs text-[#3E4E42]">
          <strong>Mifflin-St Jeor (1990) - Padrão Ouro Clínico da ADA:</strong>
          <div className="font-mono text-[11px] mt-1 space-y-0.5">
            <div>Mulheres: (10 × peso kg) + (6.25 × altura cm) - (5 × idade) - 161</div>
            <div>Homens: (10 × peso kg) + (6.25 × altura cm) - (5 × idade) + 5</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5">
              Déficit Padrão (Perda)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="35"
                value={methodology.defaultDeficitPercent}
                onChange={(e) =>
                  onChange({ ...methodology, defaultDeficitPercent: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E]"
              />
              <span className="text-xs font-bold text-[#676F68]">%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5">
              Déficit Máximo Seguro
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="15"
                max="40"
                value={methodology.maxDeficitPercent}
                onChange={(e) =>
                  onChange({ ...methodology, maxDeficitPercent: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E]"
              />
              <span className="text-xs font-bold text-[#676F68]">%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5">
              Superávit Padrão (Ganho)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="30"
                value={methodology.defaultSurplusPercent}
                onChange={(e) =>
                  onChange({ ...methodology, defaultSurplusPercent: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E]"
              />
              <span className="text-xs font-bold text-[#676F68]">%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5">
              Hidratação de Referência
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="25"
                max="50"
                value={methodology.hydrationMlPerKg}
                onChange={(e) =>
                  onChange({ ...methodology, hydrationMlPerKg: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E]"
              />
              <span className="text-xs font-bold text-[#676F68]">ml/kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fatores de Atividade Física (GET) */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#2D312E]">
          Multiplicadores de Atividade Física (GET = TMB × Fator)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {(
            ['sedentary', 'light', 'moderate', 'intense', 'very_intense'] as ActivityLevel[]
          ).map((level) => {
            const item = methodology.activityFactors[level];
            return (
              <div key={level} className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E8E6E1]">
                <span className="text-xs font-bold text-[#2D312E] block">{item.label}</span>
                <span className="text-[10px] text-[#676F68] block mt-0.5 line-clamp-2">
                  {item.description}
                </span>
                <div className="mt-2 pt-2 border-t border-[#E8E6E1] flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#8A928B]">Fator:</span>
                  <input
                    type="number"
                    step="0.025"
                    min="1.0"
                    max="2.5"
                    value={item.factor}
                    onChange={(e) => handleActivityFactorChange(level, Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-white border border-[#E8E6E1] rounded-lg text-xs font-bold text-center text-[#4A5D4E]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribuição de Macronutrientes com Validação 100% */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#2D312E]">
          Distribuição dos Presets de Macronutrientes (% de Calorias)
        </h4>
        <p className="text-xs text-[#676F68]">
          A soma dos percentuais de Proteína, Carboidrato e Gordura deve ser estritamente igual a 100%.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Equilibrada */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              isBalancedValid ? 'bg-[#FAF9F6] border-[#E8E6E1]' : 'bg-rose-50/50 border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#2D312E]">Equilibrada</span>
              {isBalancedValid ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  100% OK
                </span>
              ) : (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                  Soma ≠ 100%
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#555C56]">Proteínas:</span>
                <input
                  type="number"
                  min="10"
                  max="60"
                  value={Math.round(methodology.macroBalanced.pRatio * 100)}
                  onChange={(e) =>
                    handleMacroRatioChange(
                      'macroBalanced',
                      Number(e.target.value) / 100,
                      methodology.macroBalanced.cRatio,
                      methodology.macroBalanced.fRatio
                    )
                  }
                  className="w-16 px-2 py-1 bg-white border border-[#E8E6E1] rounded-lg text-xs font-bold text-center"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#555C56]">Carboidratos:</span>
                <input
                  type="number"
                  min="10"
                  max="70"
                  value={Math.round(methodology.macroBalanced.cRatio * 100)}
                  onChange={(e) =>
                    handleMacroRatioChange(
                      'macroBalanced',
                      methodology.macroBalanced.pRatio,
                      Number(e.target.value) / 100,
                      methodology.macroBalanced.fRatio
                    )
                  }
                  className="w-16 px-2 py-1 bg-white border border-[#E8E6E1] rounded-lg text-xs font-bold text-center"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#555C56]">Gorduras:</span>
                <input
                  type="number"
                  min="10"
                  max="60"
                  value={Math.round(methodology.macroBalanced.fRatio * 100)}
                  onChange={(e) =>
                    handleMacroRatioChange(
                      'macroBalanced',
                      methodology.macroBalanced.pRatio,
                      methodology.macroBalanced.cRatio,
                      Number(e.target.value) / 100
                    )
                  }
                  className="w-16 px-2 py-1 bg-white border border-[#E8E6E1] rounded-lg text-xs font-bold text-center"
                />
              </div>
            </div>
          </div>

          {/* Hiperproteica */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              isHighProtValid ? 'bg-[#FAF9F6] border-[#E8E6E1]' : 'bg-rose-50/50 border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#2D312E]">Hiperproteica</span>
              {isHighProtValid ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  100% OK
                </span>
              ) : (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                  Soma ≠ 100%
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#555C56]">Proteínas:</span>
                <input
                  type="number"
                  min="10"
                  max="60"
                  value={Math.round(methodology.macroHighProtein.pRatio * 100)}
                  onChange={(e) =>
                    handleMacroRatioChange(
                      'macroHighProtein',
                      Number(e.target.value) / 100,
                      methodology.macroHighProtein.cRatio,
                      methodology.macroHighProtein.fRatio
                    )
                  }
                  className="w-16 px-2 py-1 bg-white border border-[#E8E6E1] rounded-lg text-xs font-bold text-center"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#555C56]">Carboidratos:</span>
                <input
                  type="number"
                  min="10"
                  max="70"
                  value={Math.round(methodology.macroHighProtein.cRatio * 100)}
                  onChange={(e) =>
                    handleMacroRatioChange(
                      'macroHighProtein',
                      methodology.macroHighProtein.pRatio,
                      Number(e.target.value) / 100,
                      methodology.macroHighProtein.fRatio
                    )
                  }
                  className="w-16 px-2 py-1 bg-white border border-[#E8E6E1] rounded-lg text-xs font-bold text-center"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#555C56]">Gorduras:</span>
                <input
                  type="number"
                  min="10"
                  max="60"
                  value={Math.round(methodology.macroHighProtein.fRatio * 100)}
                  onChange={(e) =>
                    handleMacroRatioChange(
                      'macroHighProtein',
                      methodology.macroHighProtein.pRatio,
                      methodology.macroHighProtein.cRatio,
                      Number(e.target.value) / 100
                    )
                  }
                  className="w-16 px-2 py-1 bg-white border border-[#E8E6E1] rounded-lg text-xs font-bold text-center"
                />
              </div>
            </div>
          </div>

          {/* Low Carb Moderada */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              isModCarbValid ? 'bg-[#FAF9F6] border-[#E8E6E1]' : 'bg-rose-50/50 border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#2D312E]">Low Carb Moderada</span>
              {isModCarbValid ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  100% OK
                </span>
              ) : (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                  Soma ≠ 100%
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#555C56]">Proteínas:</span>
                <input
                  type="number"
                  min="10"
                  max="60"
                  value={Math.round(methodology.macroModerateCarb.pRatio * 100)}
                  onChange={(e) =>
                    handleMacroRatioChange(
                      'macroModerateCarb',
                      Number(e.target.value) / 100,
                      methodology.macroModerateCarb.cRatio,
                      methodology.macroModerateCarb.fRatio
                    )
                  }
                  className="w-16 px-2 py-1 bg-white border border-[#E8E6E1] rounded-lg text-xs font-bold text-center"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#555C56]">Carboidratos:</span>
                <input
                  type="number"
                  min="10"
                  max="70"
                  value={Math.round(methodology.macroModerateCarb.cRatio * 100)}
                  onChange={(e) =>
                    handleMacroRatioChange(
                      'macroModerateCarb',
                      methodology.macroModerateCarb.pRatio,
                      Number(e.target.value) / 100,
                      methodology.macroModerateCarb.fRatio
                    )
                  }
                  className="w-16 px-2 py-1 bg-white border border-[#E8E6E1] rounded-lg text-xs font-bold text-center"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#555C56]">Gorduras:</span>
                <input
                  type="number"
                  min="10"
                  max="60"
                  value={Math.round(methodology.macroModerateCarb.fRatio * 100)}
                  onChange={(e) =>
                    handleMacroRatioChange(
                      'macroModerateCarb',
                      methodology.macroModerateCarb.pRatio,
                      methodology.macroModerateCarb.cRatio,
                      Number(e.target.value) / 100
                    )
                  }
                  className="w-16 px-2 py-1 bg-white border border-[#E8E6E1] rounded-lg text-xs font-bold text-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
