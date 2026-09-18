import React from 'react';
import { ProfessionalConfig } from '../../types';
import { Lock, CheckSquare, Sparkles, ShieldAlert, FileText } from 'lucide-react';

interface LeadCaptureTabProps {
  config: ProfessionalConfig;
  onChange: (field: keyof ProfessionalConfig, value: any) => void;
}

export const LeadCaptureTab: React.FC<LeadCaptureTabProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Lead Gate Enable Toggle */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-[#4A5D4E]" />
              <h3 className="text-base font-serif font-bold text-[#2D312E]">
                Portão de Captura de Leads (Prévia Interativa)
              </h3>
            </div>
            <p className="text-xs text-[#676F68] max-w-xl">
              Quando ativado, a ferramenta exibe uma prévia com o Metabolismo Basal e exige o preenchimento do formulário para liberar a meta calórica completa, divisão de macros e hidratação.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={config.leadCaptureEnabled}
              onChange={(e) => onChange('leadCaptureEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A5D4E]"></div>
          </label>
        </div>
      </div>

      {/* Required Fields Configuration */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
        <h3 className="text-base font-serif font-bold text-[#2D312E] mb-1">
          Campos Obrigatórios do Formulário
        </h3>
        <p className="text-xs text-[#676F68] mb-4">
          Defina quais informações são estritamente necessárias para desbloquear o diagnóstico.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-[#E8E6E1] cursor-pointer">
            <input
              type="checkbox"
              checked={config.requireName}
              onChange={(e) => onChange('requireName', e.target.checked)}
              className="h-4 w-4 rounded text-[#4A5D4E] focus:ring-[#4A5D4E]"
            />
            <span className="text-xs font-bold text-[#2D312E]">Exigir Nome</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-[#E8E6E1] cursor-pointer">
            <input
              type="checkbox"
              checked={config.requireWhatsapp}
              onChange={(e) => onChange('requireWhatsapp', e.target.checked)}
              className="h-4 w-4 rounded text-[#4A5D4E] focus:ring-[#4A5D4E]"
            />
            <span className="text-xs font-bold text-[#2D312E]">Exigir WhatsApp</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-[#E8E6E1] cursor-pointer">
            <input
              type="checkbox"
              checked={config.requireEmail}
              onChange={(e) => onChange('requireEmail', e.target.checked)}
              className="h-4 w-4 rounded text-[#4A5D4E] focus:ring-[#4A5D4E]"
            />
            <span className="text-xs font-bold text-[#2D312E]">Exigir E-mail</span>
          </label>
        </div>
      </div>

      {/* Copywriting da Oferta & Consentimento */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs space-y-4">
        <h3 className="text-base font-serif font-bold text-[#2D312E] mb-1">
          Copywriting da Oferta de Desbloqueio & LGPD
        </h3>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5">
            Título da Oferta de Captura
          </label>
          <input
            type="text"
            value={config.offerHeadline}
            onChange={(e) => onChange('offerHeadline', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5">
            Descrição / Promessa de Valor da Análise Completa
          </label>
          <textarea
            rows={2}
            value={config.offerDescription}
            onChange={(e) => onChange('offerDescription', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5">
            Texto de Consentimento / Política de Privacidade (Checkbox)
          </label>
          <textarea
            rows={2}
            value={config.consentText}
            onChange={(e) => onChange('consentText', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            Aviso Legal / Disclaimer de Responsabilidade Médica
          </label>
          <textarea
            rows={3}
            value={config.disclaimer}
            onChange={(e) => onChange('disclaimer', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
