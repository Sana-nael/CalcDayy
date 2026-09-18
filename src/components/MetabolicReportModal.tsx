import React from 'react';
import {
  ProfessionalConfig,
  CalculationResults,
  UserInputData,
  LeadData,
} from '../types';
import { formatKcal } from '../utils/calculator';
import { analytics } from '../services/analyticsService';
import {
  X,
  Printer,
  Sparkles,
  Flame,
  Zap,
  Droplet,
  ShieldAlert,
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface MetabolicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProfessionalConfig;
  results: CalculationResults;
  userInput: UserInputData;
  lead?: LeadData | null;
}

export const MetabolicReportModal: React.FC<MetabolicReportModalProps> = ({
  isOpen,
  onClose,
  config,
  results,
  userInput,
  lead,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    analytics.track('report_generated', {
      leadId: lead?.id,
      goal: userInput.goal,
    });
    window.print();
  };

  const handleCtaClick = () => {
    analytics.track('cta_clicked', {
      from: 'report_modal',
      leadId: lead?.id,
    });

    if (config.ctaType === 'whatsapp') {
      analytics.track('whatsapp_clicked', { leadId: lead?.id });
      const phone = config.whatsapp.replace(/\D/g, '');
      const text = encodeURIComponent(
        `Olá, ${config.professionalName}! Imprimi meu Diagnóstico Metabólico e gostaria de agendar uma consulta individualizada com você.`
      );
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
    } else if (config.ctaUrl) {
      window.open(config.ctaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const patientName = lead?.name || 'Avaliação Individual';
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const goalTitleMap = {
    loss: `Emagrecimento Saudável (${results.calorieDeltaPercent}% de déficit calórico)`,
    maintenance: 'Manutenção Ponderal e Equilíbrio Isocalórico (100% GET)',
    gain: `Hipertrofia Muscular (+${results.calorieDeltaPercent}% de superávit energético)`,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-[#FDFCFB] w-full max-w-4xl rounded-3xl border border-[#E8E6E1] shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-[#F5F3EF] border-b border-[#E8E6E1] flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A5D4E] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Diagnóstico Metabólico Personalizado
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              id="report-print-btn"
              className="px-4 py-2 rounded-xl bg-[#4A5D4E] hover:bg-[#3E4E42] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar em PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#676F68] hover:text-[#2D312E] hover:bg-[#E8E6E1] transition-all cursor-pointer"
              title="Fechar relatório"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-6 sm:p-10 space-y-8 print:p-8" id="printable-report">
          {/* Header do Documento */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E6E1] gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#4A5D4E] text-white flex items-center justify-center font-serif text-xl font-bold shadow-xs">
                {config.professionalName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('') || 'NV'}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2D312E] tracking-tight">
                  {config.brandName || 'Clínica de Nutrição'}
                </h1>
                <p className="text-xs text-[#4A5D4E] font-medium">
                  {config.professionalName} • {config.professionalRegistration || 'CRN'}
                </p>
                <p className="text-[11px] text-[#676F68]">
                  Relatório e Diagnóstico Metabólico Baseado em Evidências
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-[#676F68] space-y-0.5">
              <div className="font-semibold text-[#2D312E]">Data de Emissão:</div>
              <div>{currentDate}</div>
              <div className="text-[10px] text-[#8A928B]">Modelo Preditivo Mifflin-St Jeor</div>
            </div>
          </div>

          {/* Dados Cadastrais do Indivíduo */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F3EF] border border-[#E8E6E1]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#4A5D4E] mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Perfil Individual Avaliado
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <span className="text-[#676F68] block text-[10px] uppercase">Nome</span>
                <span className="font-bold text-[#2D312E] truncate block">{patientName}</span>
              </div>
              <div>
                <span className="text-[#676F68] block text-[10px] uppercase">Idade</span>
                <span className="font-bold text-[#2D312E]">{userInput.age} anos</span>
              </div>
              <div>
                <span className="text-[#676F68] block text-[10px] uppercase">Peso / Altura</span>
                <span className="font-bold text-[#2D312E]">
                  {userInput.weight} kg • {userInput.height} cm
                </span>
              </div>
              <div>
                <span className="text-[#676F68] block text-[10px] uppercase">IMC Calculado</span>
                <span className="font-bold text-[#2D312E]">
                  {results.imc.value} kg/m² ({results.imc.classification})
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[#676F68] block text-[10px] uppercase">Foco Selecionado</span>
                <span className="font-bold text-[#4A5D4E] truncate block">
                  {userInput.goal === 'loss'
                    ? 'Emagrecimento'
                    : userInput.goal === 'gain'
                    ? 'Hipertrofia'
                    : 'Manutenção'}
                </span>
              </div>
            </div>
          </div>

          {/* Pilares Metabólicos Centrais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* TMB */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#4A5D4E]" />
                Taxa Metabólica Basal (TMB)
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-serif font-bold text-[#2D312E]">
                  {formatKcal(results.tmb)}
                </span>
                <span className="text-xs text-[#676F68]">kcal/dia</span>
              </div>
              <p className="text-[11px] text-[#676F68] mt-2 leading-relaxed">
                Energia mínima para funções orgânicas vitais em repouso estrito (respiração, atividade celular e circulatória).
              </p>
            </div>

            {/* GET */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#4A5D4E]" />
                Gasto Energético Total (GET)
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-serif font-bold text-[#2D312E]">
                  {formatKcal(results.get)}
                </span>
                <span className="text-xs text-[#676F68]">kcal/dia</span>
              </div>
              <p className="text-[11px] text-[#676F68] mt-2 leading-relaxed">
                Gasto real considerando suas atividades físicas e efeito térmico alimentar ({results.activityMultiplier}×).
              </p>
            </div>

            {/* Meta Calórica Diária */}
            <div className="p-5 rounded-2xl bg-[#EFF2EA] border border-[#4A5D4E]/30 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#4A5D4E]" />
                Meta Energética Recomendada
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-serif font-bold text-[#2D312E]">
                  {formatKcal(results.targetCalories)}
                </span>
                <span className="text-xs text-[#4A5D4E] font-medium">kcal/dia</span>
              </div>
              <p className="text-[11px] text-[#3E4E42] mt-2 leading-relaxed font-medium">
                {goalTitleMap[userInput.goal]} ({results.calorieDelta >= 0 ? '+' : ''}
                {results.calorieDelta} kcal em relação ao GET).
              </p>
            </div>
          </div>

          {/* Distribuição de Macronutrientes & Hidratação */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Macros (8 cols) */}
            <div className="md:col-span-8 p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
                    Planejamento Nutricional
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#2D312E]">
                    Distribuição de Macronutrientes ({results.macros.distributionName})
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#676F68]">Soma: 100% kcal</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Proteína */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <span className="text-[10px] font-bold uppercase text-amber-900 block">
                    Proteínas
                  </span>
                  <div className="text-2xl font-serif font-bold text-amber-950 mt-0.5">
                    {results.macros.protein.grams}g
                  </div>
                  <div className="text-[11px] text-amber-800 mt-1">
                    {formatKcal(results.macros.protein.calories)} kcal • {results.macros.protein.percent}%
                  </div>
                  <div className="text-[10px] font-semibold text-amber-900 mt-1">
                    {results.macros.protein.gPerKg} g/kg
                  </div>
                </div>

                {/* Carbo */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                  <span className="text-[10px] font-bold uppercase text-emerald-900 block">
                    Carboidratos
                  </span>
                  <div className="text-2xl font-serif font-bold text-emerald-950 mt-0.5">
                    {results.macros.carbs.grams}g
                  </div>
                  <div className="text-[11px] text-emerald-800 mt-1">
                    {formatKcal(results.macros.carbs.calories)} kcal • {results.macros.carbs.percent}%
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-900 mt-1">
                    {results.macros.carbs.gPerKg} g/kg
                  </div>
                </div>

                {/* Gordura */}
                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/80">
                  <span className="text-[10px] font-bold uppercase text-sky-900 block">
                    Lipídios (Gorduras)
                  </span>
                  <div className="text-2xl font-serif font-bold text-sky-950 mt-0.5">
                    {results.macros.fats.grams}g
                  </div>
                  <div className="text-[11px] text-sky-800 mt-1">
                    {formatKcal(results.macros.fats.calories)} kcal • {results.macros.fats.percent}%
                  </div>
                  <div className="text-[10px] font-semibold text-sky-900 mt-1">
                    {results.macros.fats.gPerKg} g/kg
                  </div>
                </div>
              </div>
            </div>

            {/* Hidratação (4 cols) */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-sky-600" />
                  Hidratação Estimada
                </span>
                <h3 className="text-base font-serif font-bold text-[#2D312E] mt-0.5">
                  Ingestão de Água Diária
                </h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-serif font-bold text-sky-950">
                    {results.hydrationLiters}
                  </span>
                  <span className="text-xs text-sky-800 font-semibold">Litros/dia</span>
                </div>
                <p className="text-[11px] text-[#676F68] mt-2">
                  Aproximadamente {results.hydrationGlasses} copos de 250ml distribuídos ao longo do dia para osmolalidade ideal.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E8E6E1] text-[10px] font-mono text-[#8A928B]">
                Cálculo base: 35 ml por kg de peso
              </div>
            </div>
          </div>

          {/* Próximo Passo Recomendado com Branding & CTA */}
          <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E6E1]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E] mb-1">
                  <Award className="w-3.5 h-3.5" />
                  Próximo Passo Recomendado
                </div>
                <h4 className="text-lg font-serif font-bold text-[#2D312E]">
                  Avaliação Clínica & Prescrição Dietética Individualizada
                </h4>
                <p className="text-xs text-[#555C56] mt-1 max-w-xl leading-relaxed">
                  Os números deste relatório são estimativas preditivas calculadas. Para transformar estes valores em cardápios prazerosos, ajustes finos de micronutrientes e acompanhamento de exames, agende sua consulta com {config.professionalName}.
                </p>
              </div>

              <div className="no-print shrink-0">
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="px-5 py-3 rounded-xl bg-[#4A5D4E] hover:bg-[#3E4E42] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {config.ctaType === 'whatsapp' ? (
                    <MessageCircle className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  <span>Agendar Consulta</span>
                </button>
              </div>
            </div>
          </div>

          {/* Rodapé Configurável com Disclaimer */}
          <div className="pt-6 border-t border-[#E8E6E1] text-xs text-[#676F68] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong className="text-[#2D312E]">{config.professionalName}</strong>
                {config.professionalRegistration && ` • ${config.professionalRegistration}`}
              </div>
              <div className="flex items-center gap-4 text-[11px] text-[#4A5D4E]">
                {config.instagram && <span>{config.instagram}</span>}
                {config.website && <span>{config.website.replace('https://', '')}</span>}
                {config.whatsapp && <span>WhatsApp: +{config.whatsapp}</span>}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F5F3EF] border border-[#E8E6E1] text-[10px] text-[#7A827B] leading-normal flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Aviso Legal de Rigor Ético & Científico:</strong> {config.disclaimer}
              </div>
            </div>

            <p className="text-[10px] text-[#9EA59F] text-center">
              {config.reportFooter ||
                'Diagnóstico gerado para suporte nutricional educativo. Consulte sempre seu nutricionista habilitado.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
