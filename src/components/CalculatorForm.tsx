import React from 'react';
import {
  UserInputData,
  ValidationErrors,
  ActivityLevel,
  NutritionGoal,
  BiologicalSex,
} from '../types';
import { ACTIVITY_FACTORS } from '../utils/calculator';
import {
  User,
  Scale,
  Ruler,
  Calendar,
  Activity,
  Target,
  TrendingDown,
  Minus,
  TrendingUp,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface CalculatorFormProps {
  data: UserInputData;
  errors: ValidationErrors;
  onChange: (field: keyof UserInputData, value: any) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <div className="bg-[#F5F3EF] p-5 sm:p-7 rounded-3xl border border-[#E8E6E1] shadow-sm">
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E8E6E1]">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#4A5D4E]">
            Parâmetros Fisiológicos
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#2D312E] mt-0.5">
            Dados do Indivíduo
          </h2>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#EFF2EA] flex items-center justify-center text-[#4A5D4E] border border-[#4A5D4E]/20">
          <User className="w-4 h-4" />
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* 1. Sexo Biológico */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-[#555C56] mb-2.5">
            1. Sexo Biológico (Equação Mifflin-St Jeor)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="sex-female-btn"
              onClick={() => onChange('sex', 'female' as BiologicalSex)}
              className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                data.sex === 'female'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-500 shadow-sm ring-2 ring-rose-500/20'
                  : 'bg-white text-[#2D312E] border-[#E8E6E1] hover:bg-rose-50/30 hover:border-rose-200'
              }`}
            >
              <span>Feminino (-161 kcal)</span>
            </button>
            <button
              type="button"
              id="sex-male-btn"
              onClick={() => onChange('sex', 'male' as BiologicalSex)}
              className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                data.sex === 'male'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-sky-600 shadow-sm ring-2 ring-sky-600/20'
                  : 'bg-white text-[#2D312E] border-[#E8E6E1] hover:bg-sky-50/30 hover:border-sky-200'
              }`}
            >
              <span>Masculino (+5 kcal)</span>
            </button>
          </div>
        </div>

        {/* 2. Idade, Peso, Altura */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Idade */}
          <div>
            <label
              htmlFor="age-input"
              className="block text-xs font-bold tracking-wider uppercase text-[#555C56] mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Idade
              </span>
              <span className="text-[10px] text-[#676F68] font-normal">15-100 anos</span>
            </label>
            <div className="relative">
              <input
                id="age-input"
                type="number"
                min={15}
                max={100}
                value={data.age}
                onChange={(e) => onChange('age', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 30"
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm font-semibold text-[#2D312E] focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all ${
                  errors.age ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E6E1]'
                }`}
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-[#676F68] font-medium pointer-events-none">
                anos
              </span>
            </div>
            {errors.age && (
              <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.age}
              </p>
            )}
          </div>

          {/* Peso */}
          <div>
            <label
              htmlFor="weight-input"
              className="block text-xs font-bold tracking-wider uppercase text-[#555C56] mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                Peso
              </span>
              <span className="text-[10px] text-[#676F68] font-normal">35-250 kg</span>
            </label>
            <div className="relative">
              <input
                id="weight-input"
                type="number"
                step="0.5"
                min={35}
                max={250}
                value={data.weight}
                onChange={(e) => onChange('weight', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 70"
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm font-semibold text-[#2D312E] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all ${
                  errors.weight ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E6E1]'
                }`}
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-[#676F68] font-medium pointer-events-none">
                kg
              </span>
            </div>
            {errors.weight && (
              <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.weight}
              </p>
            )}
          </div>

          {/* Altura */}
          <div>
            <label
              htmlFor="height-input"
              className="block text-xs font-bold tracking-wider uppercase text-[#555C56] mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-sky-600" />
                Altura
              </span>
              <span className="text-[10px] text-[#676F68] font-normal">120-230 cm</span>
            </label>
            <div className="relative">
              <input
                id="height-input"
                type="number"
                min={120}
                max={230}
                value={data.height}
                onChange={(e) => onChange('height', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 175"
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm font-semibold text-[#2D312E] focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all ${
                  errors.height ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E6E1]'
                }`}
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-[#676F68] font-medium pointer-events-none">
                cm
              </span>
            </div>
            {errors.height && (
              <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.height}
              </p>
            )}
          </div>
        </div>

        {/* 3. Nível de Atividade Física */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold tracking-wider uppercase text-[#555C56] flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              3. Nível de Atividade Física (Fator de Correção GET)
            </label>
          </div>

          <div className="space-y-2">
            {(Object.keys(ACTIVITY_FACTORS) as ActivityLevel[]).map((level) => {
              const info = ACTIVITY_FACTORS[level];
              const isSelected = data.activityLevel === level;
              
              const levelColorStyles: Record<ActivityLevel, { selected: string; badge: string }> = {
                sedentary: {
                  selected: 'bg-slate-50/90 border-slate-400 ring-2 ring-slate-400/20 shadow-xs',
                  badge: 'bg-slate-100 text-slate-800 border-slate-300',
                },
                light: {
                  selected: 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs',
                  badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                },
                moderate: {
                  selected: 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/20 shadow-xs',
                  badge: 'bg-sky-100 text-sky-800 border-sky-300',
                },
                intense: {
                  selected: 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-xs',
                  badge: 'bg-amber-100 text-amber-800 border-amber-300',
                },
                very_intense: {
                  selected: 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 shadow-xs',
                  badge: 'bg-rose-100 text-rose-800 border-rose-300',
                },
              };

              const styles = levelColorStyles[level];

              return (
                <label
                  key={level}
                  id={`activity-${level}-label`}
                  className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? styles.selected
                      : 'bg-white/80 border-[#E8E6E1] hover:bg-white hover:border-[#D0CDC5]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="activityLevel"
                      checked={isSelected}
                      onChange={() => onChange('activityLevel', level)}
                      className="mt-1 text-emerald-700 focus:ring-emerald-600 h-4 w-4 border-[#E8E6E1]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#2D312E]">
                          {info.label}
                        </span>
                        <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md border ${styles.badge}`}>
                          × {info.factor}
                        </span>
                      </div>
                      <p className="text-xs text-[#555C56] mt-0.5 font-medium">
                        {info.description}
                      </p>
                      <p className="text-[11px] text-[#676F68] mt-1 italic">
                        {info.detail}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* 4. Objetivo Nutricional */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-[#555C56] mb-2.5 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-emerald-700" />
            4. Objetivo Principal & Balanço Energético
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Emagrecimento */}
            <button
              type="button"
              id="goal-loss-btn"
              onClick={() => onChange('goal', 'loss' as NutritionGoal)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                data.goal === 'loss'
                  ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white/80 border-[#E8E6E1] hover:bg-emerald-50/30 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-[#2D312E] flex items-center gap-1">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  Emagrecimento
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Déficit
                </span>
              </div>
              <p className="text-xs text-[#676F68]">
                Redução de gordura preservando massa magra.
              </p>
            </button>

            {/* Manutenção */}
            <button
              type="button"
              id="goal-maint-btn"
              onClick={() => onChange('goal', 'maintenance' as NutritionGoal)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                data.goal === 'maintenance'
                  ? 'bg-gradient-to-br from-sky-50 to-sky-100/40 border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                  : 'bg-white/80 border-[#E8E6E1] hover:bg-sky-50/30 hover:border-sky-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-[#2D312E] flex items-center gap-1">
                  <Minus className="w-4 h-4 text-sky-600" />
                  Manutenção
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300">
                  100% GET
                </span>
              </div>
              <p className="text-xs text-[#676F68]">
                Estabilidade de peso e equilíbrio fisiológico.
              </p>
            </button>

            {/* Ganho de Massa */}
            <button
              type="button"
              id="goal-gain-btn"
              onClick={() => onChange('goal', 'gain' as NutritionGoal)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                data.goal === 'gain'
                  ? 'bg-gradient-to-br from-amber-50 to-amber-100/40 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                  : 'bg-white/80 border-[#E8E6E1] hover:bg-amber-50/30 hover:border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-[#2D312E] flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Hipertrofia
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  Superávit
                </span>
              </div>
              <p className="text-xs text-[#676F68]">
                Ganho de massa muscular com energia extra.
              </p>
            </button>
          </div>

          {/* Sub-selector for Deficit Intensity */}
          {data.goal === 'loss' && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#2D312E] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                Intensidade do Déficit Calórico:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange('deficitPercent', 20)}
                  className={`text-xs px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                    data.deficitPercent === 20
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  20% (Moderado Seguro)
                </button>
                <button
                  type="button"
                  onClick={() => onChange('deficitPercent', 25)}
                  className={`text-xs px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                    data.deficitPercent === 25
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  25% (Agressivo Controlado)
                </button>
              </div>
            </div>
          )}

          {/* Sub-selector for Surplus Intensity */}
          {data.goal === 'gain' && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#2D312E] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                Intensidade do Superávit Calórico:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange('surplusPercent', 10)}
                  className={`text-xs px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                    data.surplusPercent === 10
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  +10% (Ganho Limpo)
                </button>
                <button
                  type="button"
                  onClick={() => onChange('surplusPercent', 15)}
                  className={`text-xs px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                    data.surplusPercent === 15
                      ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  +15% (Avançado / Ectomorfo)
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
