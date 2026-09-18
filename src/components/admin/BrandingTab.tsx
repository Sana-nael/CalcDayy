import React from 'react';
import { ProfessionalConfig } from '../../types';
import { User, Award, Instagram, Globe, Phone, Image, Type, Palette } from 'lucide-react';

interface BrandingTabProps {
  config: ProfessionalConfig;
  onChange: (field: keyof ProfessionalConfig, value: any) => void;
}

export const BrandingTab: React.FC<BrandingTabProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
        <h3 className="text-base font-serif font-bold text-[#2D312E] mb-1">
          Identidade do Profissional & Marca (White-Label)
        </h3>
        <p className="text-xs text-[#676F68] mb-6">
          Personalize seu nome, clínica, registros e redes sociais para exibir no cabeçalho, hero, relatório e mensagens de conversão.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nome do Profissional */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#4A5D4E]" />
              Nome do Profissional
            </label>
            <input
              type="text"
              value={config.professionalName}
              onChange={(e) => onChange('professionalName', e.target.value)}
              placeholder="Ex: Dra. Camila Vasconcelos"
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30"
            />
          </div>

          {/* Nome da Marca / Clínica */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#4A5D4E]" />
              Nome da Marca ou Clínica
            </label>
            <input
              type="text"
              value={config.brandName}
              onChange={(e) => onChange('brandName', e.target.value)}
              placeholder="Ex: Clínica Vasconcelos de Nutrição"
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30"
            />
          </div>

          {/* Registro Profissional (CRN) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#4A5D4E]" />
              Registro Profissional (CRN)
            </label>
            <input
              type="text"
              value={config.professionalRegistration}
              onChange={(e) => onChange('professionalRegistration', e.target.value)}
              placeholder="Ex: CRN-3 48.912"
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30"
            />
          </div>

          {/* WhatsApp de Atendimento */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#4A5D4E]" />
              WhatsApp Comercial (com DDI e DDD)
            </label>
            <input
              type="text"
              value={config.whatsapp}
              onChange={(e) => onChange('whatsapp', e.target.value)}
              placeholder="Ex: 5511987654321"
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30"
            />
            <span className="text-[10px] text-[#8A928B] mt-1 block">
              Apenas números com código do país (55 para Brasil). Usado para redirecionar o lead no CTA.
            </span>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-[#4A5D4E]" />
              Perfil do Instagram
            </label>
            <input
              type="text"
              value={config.instagram}
              onChange={(e) => onChange('instagram', e.target.value)}
              placeholder="Ex: @dra.camilavasconcelos"
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#4A5D4E]" />
              Website ou Link da Bio
            </label>
            <input
              type="text"
              value={config.website}
              onChange={(e) => onChange('website', e.target.value)}
              placeholder="Ex: https://camilavasconcelos.com.br"
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30"
            />
          </div>
        </div>
      </div>

      {/* Personalização da Seção Hero Pública */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
        <h3 className="text-base font-serif font-bold text-[#2D312E] mb-1">
          Copywriting da Página Inicial (Hero)
        </h3>
        <p className="text-xs text-[#676F68] mb-4">
          Adapte a mensagem que seus visitantes e seguidores verão ao acessar a ferramenta.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5">
              Título Principal da Ferramenta
            </label>
            <input
              type="text"
              value={config.heroTitle}
              onChange={(e) => onChange('heroTitle', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5">
              Subtítulo / Descrição da Promessa Educativa
            </label>
            <textarea
              rows={2}
              value={config.heroSubtitle}
              onChange={(e) => onChange('heroSubtitle', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
