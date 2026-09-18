import React from 'react';
import { ShieldAlert, BookOpen, HeartHandshake, Instagram, Globe, Phone } from 'lucide-react';
import { ProfessionalConfig } from '../types';

interface FooterProps {
  config: ProfessionalConfig;
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  return (
    <footer className="w-full border-t border-[#E8E6E1] bg-[#F5F3EF] text-[#555C56] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Legal Disclaimer Box */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E6E1] mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-serif font-bold text-[#2D312E] mb-1.5">
                Aviso Legal & Isenção de Responsabilidade Médica
              </h4>
              <p className="text-xs sm:text-sm text-[#676F68] leading-relaxed">
                {config.disclaimer ||
                  'As informações, cálculos, taxas metabólicas e divisões de macronutrientes fornecidas por esta ferramenta têm finalidade estritamente educativa e informativa. Elas baseiam-se em modelos preditivos matemáticos populacionais (como a equação de Mifflin-St Jeor) e não constituem prescrição dietética ou diagnóstico médico.'}
              </p>
            </div>
          </div>
        </div>

        {/* References, Professional Info & Credits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs text-[#676F68]">
          <div>
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#4A5D4E] mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Referência Científica Principal
            </div>
            <p className="italic">
              Mifflin, M. D., St Jeor, S. T., Hill, L. A., Scott, B. J., Daugherty, S. A., & Koh, Y. O. (1990). A new predictive equation for resting energy expenditure in healthy individuals. <em>The American Journal of Clinical Nutrition</em>, 51(2), 241-247.
            </p>
          </div>

          <div className="md:text-right flex flex-col md:items-end justify-between">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#4A5D4E] mb-2">
              <HeartHandshake className="w-3.5 h-3.5" />
              Acompanhamento Profissional
            </div>
            <p className="font-semibold text-[#2D312E]">
              {config.professionalName} {config.professionalRegistration && `• ${config.professionalRegistration}`}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-[#4A5D4E]">
              {config.instagram && <span>{config.instagram}</span>}
              {config.website && <span>{config.website.replace('https://', '')}</span>}
              {config.whatsapp && <span>WhatsApp: +{config.whatsapp}</span>}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E8E6E1] text-center text-xs text-[#8A928B]">
          © {new Date().getFullYear()} {config.brandName || 'Metabólica'}. Todos os direitos reservados. Fórmulas matemáticas validadas para propósitos didáticos e de planejamento.
        </div>
      </div>
    </footer>
  );
};
