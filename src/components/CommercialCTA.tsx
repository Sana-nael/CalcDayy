import React from 'react';
import { ProfessionalConfig, CalculationResults, UserInputData, LeadData } from '../types';
import { formatKcal } from '../utils/calculator';
import { analytics } from '../services/analyticsService';
import {
  MessageCircle,
  Calendar,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';

interface CommercialCTAProps {
  config: ProfessionalConfig;
  results: CalculationResults;
  userInput: UserInputData;
  lead?: LeadData | null;
}

export const CommercialCTA: React.FC<CommercialCTAProps> = ({
  config,
  results,
  userInput,
  lead,
}) => {
  // Substitui variáveis dinâmicas no template de mensagem
  const getInterpolatedMessage = (): string => {
    const rawTemplate = config.ctaMessage || '';
    const goalMap = {
      loss: 'Emagrecimento com preservação de massa magra',
      maintenance: 'Manutenção e equilíbrio fisiológico',
      gain: 'Hipertrofia e ganho de massa magra',
    };

    const leadName = lead?.name || 'Cliente';
    const replacements: Record<string, string> = {
      '{{nome}}': leadName,
      '{{idade}}': String(userInput.age || ''),
      '{{peso}}': String(userInput.weight || ''),
      '{{altura}}': String(userInput.height || ''),
      '{{objetivo}}': goalMap[userInput.goal] || userInput.goal,
      '{{tmb}}': formatKcal(results.tmb),
      '{{get}}': formatKcal(results.get),
      '{{meta_calorica}}': formatKcal(results.targetCalories),
      '{{imc}}': String(results.imc.value),
      '{{profissional}}': config.professionalName || 'Dra.',
    };

    let message = rawTemplate;
    Object.entries(replacements).forEach(([key, val]) => {
      message = message.split(key).join(val);
    });

    return message;
  };

  const handleCtaClick = () => {
    // Rastreamento de evento no Analytics
    analytics.track('cta_clicked', {
      type: config.ctaType,
      leadId: lead?.id,
      goal: userInput.goal,
    });

    if (config.ctaType === 'whatsapp') {
      analytics.track('whatsapp_clicked', { leadId: lead?.id });
      const phone = config.whatsapp.replace(/\D/g, '');
      const text = encodeURIComponent(getInterpolatedMessage());
      const whatsappUrl = `https://wa.me/${phone}?text=${text}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } else if (config.ctaType === 'booking') {
      analytics.track('booking_clicked', { leadId: lead?.id });
      if (config.ctaUrl) {
        window.open(config.ctaUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      if (config.ctaUrl) {
        window.open(config.ctaUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const goalText =
    userInput.goal === 'loss'
      ? 'emagrecimento sustentável'
      : userInput.goal === 'gain'
      ? 'ganho de massa muscular'
      : 'equilíbrio e manutenção corporal';

  return (
    <div className="relative mt-8 p-6 sm:p-9 rounded-3xl bg-[#FAF9F6] border border-[#E8E6E1] shadow-md overflow-hidden no-print">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#EFF2EA] rounded-full filter blur-3xl opacity-50 pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E6E1]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF2EA] text-[#4A5D4E] text-xs font-bold uppercase tracking-wider mb-3 border border-[#4A5D4E]/20">
              <Sparkles className="w-3.5 h-3.5" />
              Estratégia Individualizada
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D312E] tracking-tight leading-tight">
              Quer transformar esses números em um plano feito sob medida para você?
            </h3>

            <p className="text-sm sm:text-base text-[#555C56] mt-3 leading-relaxed">
              Estes cálculos representam referências matemáticas fundamentais. No entanto, o metabolismo real responde à sua rotina, preferências, exames laboratoriais e histórico individual.
            </p>

            <p className="text-xs sm:text-sm text-[#4A5D4E] mt-2 font-medium flex items-center gap-1.5">
              <Award className="w-4 h-4 shrink-0" />
              {config.professionalName} ({config.professionalRegistration || 'CRN'}) pode elaborar o planejamento ideal para seu foco em {goalText}.
            </p>
          </div>

          {/* Professional Credentials Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E6E1] shadow-xs flex items-center gap-4 shrink-0 md:w-72">
            <div className="w-12 h-12 rounded-xl bg-[#4A5D4E] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              {config.professionalName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('') || 'NV'}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-serif font-bold text-[#2D312E] truncate">
                {config.professionalName}
              </h4>
              <p className="text-xs text-[#4A5D4E] font-medium">
                {config.professionalRegistration || 'Nutricionista'}
              </p>
              {config.instagram && (
                <p className="text-[11px] text-[#676F68] truncate mt-0.5">
                  {config.instagram}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#676F68]">
            <ShieldCheck className="w-4 h-4 text-[#4A5D4E] shrink-0" />
            <span>Atendimento individual com avaliação clínica e plano alimentar personalizado.</span>
          </div>

          <button
            type="button"
            id="commercial-cta-primary-btn"
            onClick={handleCtaClick}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#4A5D4E] hover:bg-[#3E4E42] active:scale-[0.98] text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer"
          >
            {config.ctaType === 'whatsapp' && <MessageCircle className="w-5 h-5 text-emerald-300" />}
            {config.ctaType === 'booking' && <Calendar className="w-5 h-5 text-amber-300" />}
            {(config.ctaType === 'external_page' || config.ctaType === 'custom_url') && (
              <ExternalLink className="w-5 h-5" />
            )}
            <span>{config.primaryCTA || 'QUERO MINHA CONSULTA INDIVIDUALIZADA'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
