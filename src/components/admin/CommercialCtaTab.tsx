import React from 'react';
import { ProfessionalConfig, CTAType } from '../../types';
import { MessageCircle, Calendar, ExternalLink, Link, Sparkles, Copy } from 'lucide-react';

interface CommercialCtaTabProps {
  config: ProfessionalConfig;
  onChange: (field: keyof ProfessionalConfig, value: any) => void;
}

export const CommercialCtaTab: React.FC<CommercialCtaTabProps> = ({ config, onChange }) => {
  const insertVariable = (tag: string) => {
    const currentMsg = config.ctaMessage || '';
    onChange('ctaMessage', currentMsg + ' ' + tag);
  };

  // Preview com dados simulados
  const getPreviewMessage = (): string => {
    const raw = config.ctaMessage || '';
    return raw
      .replace(/{{nome}}/g, 'Mariana Silveira')
      .replace(/{{idade}}/g, '28')
      .replace(/{{peso}}/g, '65')
      .replace(/{{altura}}/g, '165')
      .replace(/{{objetivo}}/g, 'Emagrecimento com preservação muscular')
      .replace(/{{tmb}}/g, '1.420 kcal')
      .replace(/{{get}}/g, '2.201 kcal')
      .replace(/{{meta_calorica}}/g, '1.761 kcal')
      .replace(/{{imc}}/g, '23.9')
      .replace(/{{profissional}}/g, config.professionalName);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
        <h3 className="text-base font-serif font-bold text-[#2D312E] mb-1">
          Configuração do CTA Comercial (Conversão em Consulta)
        </h3>
        <p className="text-xs text-[#676F68] mb-6">
          Defina para onde o lead qualificado será direcionado após visualizar o diagnóstico metabólico.
        </p>

        {/* Tipo de CTA */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-2">
            Tipo de Ação Principal
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onChange('ctaType', 'whatsapp')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                config.ctaType === 'whatsapp'
                  ? 'bg-[#EFF2EA] border-[#4A5D4E] ring-1 ring-[#4A5D4E]/30'
                  : 'bg-[#FAF9F6] border-[#E8E6E1] hover:bg-white'
              }`}
            >
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#2D312E] block">WhatsApp Direto</span>
                <span className="text-[11px] text-[#676F68] block mt-0.5">
                  Abre conversa pré-preenchida com os dados metabólicos do lead
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChange('ctaType', 'booking')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                config.ctaType === 'booking'
                  ? 'bg-[#EFF2EA] border-[#4A5D4E] ring-1 ring-[#4A5D4E]/30'
                  : 'bg-[#FAF9F6] border-[#E8E6E1] hover:bg-white'
              }`}
            >
              <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#2D312E] block">Página de Agendamento</span>
                <span className="text-[11px] text-[#676F68] block mt-0.5">
                  Calendly, Doctoralia, Hotmart ou agenda online
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChange('ctaType', 'external_page')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                config.ctaType === 'external_page'
                  ? 'bg-[#EFF2EA] border-[#4A5D4E] ring-1 ring-[#4A5D4E]/30'
                  : 'bg-[#FAF9F6] border-[#E8E6E1] hover:bg-white'
              }`}
            >
              <ExternalLink className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#2D312E] block">Landing Page Externa</span>
                <span className="text-[11px] text-[#676F68] block mt-0.5">
                  Página de vendas de acompanhamento ou programa nutricional
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Texto do Botão e URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5">
              Texto do Botão Principal
            </label>
            <input
              type="text"
              value={config.primaryCTA}
              onChange={(e) => onChange('primaryCTA', e.target.value)}
              placeholder="Ex: QUERO MINHA CONSULTA INDIVIDUALIZADA"
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30"
            />
          </div>

          {(config.ctaType === 'booking' ||
            config.ctaType === 'external_page' ||
            config.ctaType === 'custom_url') && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-[#4A5D4E]" />
                Link de Destino
              </label>
              <input
                type="url"
                value={config.ctaUrl || ''}
                onChange={(e) => onChange('ctaUrl', e.target.value)}
                placeholder="Ex: https://calendly.com/sua-agenda"
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30"
              />
            </div>
          )}
        </div>
      </div>

      {/* Template de Mensagem do WhatsApp com Tags Dinâmicas */}
      {config.ctaType === 'whatsapp' && (
        <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-[#2D312E]">
              Template de Mensagem Automática para WhatsApp
            </h3>
            <span className="text-[11px] font-semibold text-[#4A5D4E] bg-[#EFF2EA] px-2 py-0.5 rounded-md border border-[#4A5D4E]/20">
              Personalização Dinâmica
            </span>
          </div>
          <p className="text-xs text-[#676F68]">
            Quando o paciente clica no botão, o WhatsApp abre automaticamente com esta mensagem preenchida com as variáveis calculadas dele.
          </p>

          {/* Botões de Variáveis */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A928B] block mb-1.5">
              Clique para inserir variáveis dinâmicas no texto:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { tag: '{{nome}}', desc: 'Nome do lead' },
                { tag: '{{objetivo}}', desc: 'Objetivo escolhido' },
                { tag: '{{get}}', desc: 'Gasto total (kcal)' },
                { tag: '{{meta_calorica}}', desc: 'Meta calórica diária' },
                { tag: '{{tmb}}', desc: 'Metabolismo basal' },
                { tag: '{{imc}}', desc: 'IMC calculado' },
                { tag: '{{profissional}}', desc: 'Nome do nutricionista' },
              ].map((v) => (
                <button
                  key={v.tag}
                  type="button"
                  onClick={() => insertVariable(v.tag)}
                  className="px-2 py-1 rounded-lg bg-[#FAF9F6] hover:bg-[#EFF2EA] text-[#4A5D4E] border border-[#E8E6E1] text-[11px] font-mono transition-all cursor-pointer"
                  title={v.desc}
                >
                  +{v.tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              rows={4}
              value={config.ctaMessage || ''}
              onChange={(e) => onChange('ctaMessage', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-mono text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30 leading-relaxed"
            />
          </div>

          {/* Live Preview */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Prévia em Tempo Real (Como o Nutricionista Recebe):
            </span>
            <div className="p-3 bg-white rounded-lg border border-emerald-100 text-xs text-stone-800 leading-relaxed font-sans shadow-2xs whitespace-pre-wrap">
              {getPreviewMessage()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
