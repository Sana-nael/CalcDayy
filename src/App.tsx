import React, { useState, useMemo } from 'react';
import { UserInputData, PresetScenario, MacroDistributionType } from './types';
import { calculateMetabolism, validateInputs } from './utils/calculator';
import { PRESET_SCENARIOS } from './data/presets';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ScenarioPicker } from './components/ScenarioPicker';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsView } from './components/ResultsView';
import { EducationalGuide } from './components/EducationalGuide';
import { Footer } from './components/Footer';
import { Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';

const INITIAL_STATE: UserInputData = {
  sex: 'female',
  age: 30,
  weight: 68,
  height: 165,
  activityLevel: 'moderate',
  goal: 'loss',
  deficitPercent: 20,
  surplusPercent: 12,
  macroPreset: 'high_protein',
};

const BLANK_STATE: UserInputData = {
  sex: 'female',
  age: '',
  weight: '',
  height: '',
  activityLevel: 'moderate',
  goal: 'loss',
  deficitPercent: 20,
  surplusPercent: 12,
  macroPreset: 'balanced',
};

export default function App() {
  const [formData, setFormData] = useState<UserInputData>(INITIAL_STATE);
  const [activePresetId, setActivePresetId] = useState<string | undefined>('cenario-1');

  // Validação dinâmica dos campos
  const validationErrors = useMemo(() => {
    return validateInputs(formData);
  }, [formData]);

  const hasErrors = Object.keys(validationErrors).length > 0;

  // Cálculo metabólico em tempo real
  const results = useMemo(() => {
    return calculateMetabolism(formData);
  }, [formData]);

  const handleFieldChange = (field: keyof UserInputData, value: any) => {
    setActivePresetId(undefined); // Remove vínculo direto de preset ao alterar manualmente
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMacroPresetChange = (preset: MacroDistributionType) => {
    setFormData((prev) => ({
      ...prev,
      macroPreset: preset,
    }));
  };

  const handleSelectPreset = (preset: PresetScenario) => {
    setFormData({ ...preset.data });
    setActivePresetId(preset.id);
  };

  const handleReset = () => {
    setFormData(BLANK_STATE);
    setActivePresetId(undefined);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D312E] flex flex-col font-sans selection:bg-[#4A5D4E] selection:text-white">
      {/* Header */}
      <Header
        presets={PRESET_SCENARIOS}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
      />

      {/* Hero Section */}
      <Hero />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Preset Scenarios Selector */}
        <ScenarioPicker
          presets={PRESET_SCENARIOS}
          activeId={activePresetId}
          onSelect={handleSelectPreset}
        />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Inputs (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <CalculatorForm
              data={formData}
              errors={validationErrors}
              onChange={handleFieldChange}
            />

            {/* Validation Notice Box */}
            <div className="p-4 rounded-2xl bg-[#F5F3EF] border border-[#E8E6E1] text-xs text-[#555C56] space-y-1.5">
              <div className="font-bold text-[#2D312E] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4A5D4E]" />
                Faixas Plausíveis de Validação:
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#676F68] pl-1">
                <li>Idade: 15 a 100 anos</li>
                <li>Peso corporal: 35 a 250 kg</li>
                <li>Altura: 120 a 230 cm</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Real-Time Results (7 cols on lg) */}
          <div className="lg:col-span-7">
            {results && !hasErrors ? (
              <ResultsView
                results={results}
                userInput={formData}
                onMacroPresetChange={handleMacroPresetChange}
              />
            ) : (
              /* Fallback / Incomplete Form State */
              <div className="p-8 sm:p-12 rounded-3xl bg-[#F5F3EF] border border-[#E8E6E1] text-center flex flex-col items-center justify-center min-h-[450px]">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 mb-4">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#2D312E] mb-2">
                  Preencha os dados corretamente
                </h3>
                <p className="text-sm text-[#676F68] max-w-md mb-6 leading-relaxed">
                  Para garantir a precisão dos cálculos metabólicos de Mifflin-St Jeor, certifique-se de preencher idade, peso e altura válidos no formulário ao lado.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(PRESET_SCENARIOS[0])}
                    className="px-4 py-2.5 rounded-xl bg-[#4A5D4E] hover:bg-[#3E4E42] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all"
                  >
                    Carregar Exemplo Pré-configurado
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Educational Guide Section */}
      <EducationalGuide />

      {/* Footer with Legal & Medical Disclaimer */}
      <Footer />
    </div>
  );
}
