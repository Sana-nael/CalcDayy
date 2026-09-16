import React, { useState } from 'react';
import { EDUCATIONAL_TOPICS } from '../data/presets';
import { BookOpen, HelpCircle, ChevronDown, Sparkles, CheckCircle } from 'lucide-react';

export const EducationalGuide: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Por que a fórmula de Mifflin-St Jeor é considerada o padrão-ouro?',
      a: 'Publicada em 1990 pelo American Journal of Clinical Nutrition, a equação de Mifflin-St Jeor demonstrou maior precisão preditiva (com margem de erro significativamente menor) em comparação à clássica fórmula de Harris-Benedict (1919), tornando-se a referência recomendada pela Academy of Nutrition and Dietetics para populações modernas.',
    },
    {
      q: 'Por que o déficit calórico seguro é de 20% a 25% e não maior?',
      a: 'Déficits excessivos (>30%) desencadeiam adaptações metabólicas severas (termogênese adaptativa), perda pronunciada de massa muscular esquelética, desregulação nos hormônios tireoidianos e reprodutivos, e aumento descontrolado da grelina (hormônio da fome), aumentando drasticamente a taxa de reganho de peso (efeito rebote).',
    },
    {
      q: 'Como e quando devo reajustar minhas calorias?',
      a: 'À medida que seu peso corporal se altera, sua TMB e GET diminuem (menos peso significa menor custo energético para se movimentar). Recomenda-se recalcular seus valores a cada 3 a 5 kg de alteração no peso ou quando houver mudanças significativas no nível semanal de atividade física.',
    },
    {
      q: 'Por que a hidratação recomendada é de 35 ml/kg?',
      a: 'A diretriz fisiológica de 35 ml por quilo de peso corporal assegura a osmolalidade plasmática ideal, filtração renal eficiente, transporte intracelular de nutrientes e termorregulação durante o exercício físico.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-[#E8E6E1] bg-[#F5F3EF]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4A5D4E] bg-[#EFF2EA] px-3 py-1 rounded-full border border-[#4A5D4E]/20 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Guia Educativo de Nutrição & Fisiologia
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2D312E] tracking-tight">
            Compreendendo os Macronutrientes & o Metabolismo
          </h2>
          <p className="text-sm sm:text-base text-[#555C56] mt-2">
            Entenda como cada macronutriente age no seu corpo e como aplicar estes números no prato com alimentos reais.
          </p>
        </div>

        {/* 3 Macro Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {EDUCATIONAL_TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="p-6 rounded-3xl bg-white border border-[#E8E6E1] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-serif font-bold text-[#2D312E]">
                    {topic.name}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#F5F3EF] text-[#4A5D4E] border border-[#E8E6E1]">
                    {topic.calPerGram}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#4A5D4E] uppercase tracking-wider mb-2.5">
                  {topic.role}
                </div>

                <p className="text-xs sm:text-sm text-[#555C56] leading-relaxed mb-4">
                  {topic.description}
                </p>
              </div>

              <div>
                <div className="p-3 rounded-xl bg-[#EFF2EA]/60 border border-[#4A5D4E]/15 text-xs text-[#3E4D41] mb-4">
                  <span className="font-semibold block mb-0.5">Diretriz Prática:</span>
                  {topic.recommendation}
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#676F68] block mb-2">
                    Principais Fontes Alimentares:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#555C56]">
                    {topic.sources.map((src, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#4A5D4E] shrink-0" />
                        <span>{src}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A5D4E] bg-[#EFF2EA] px-3 py-1 rounded-full border border-[#4A5D4E]/20">
              Perguntas Frequentes
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#2D312E] mt-2">
              Dúvidas Comuns sobre Cálculos Metabólicos
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#E8E6E1] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#2D312E] hover:bg-[#FAF9F6] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#4A5D4E] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#555C56] leading-relaxed border-t border-[#E8E6E1]/60 pt-3 bg-[#FDFCFB]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
