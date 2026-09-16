import React from 'react';
import { Flame, Activity, PieChart, ShieldCheck, Droplet } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 border-b border-[#E8E6E1] bg-gradient-to-b from-[#FDFCFB] to-[#F5F3EF]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF2EA] border border-[#4A5D4E]/20 text-[#4A5D4E] text-xs font-semibold uppercase tracking-wider mb-4">
            <Flame className="w-3.5 h-3.5" />
            Fisiologia Aplicada & Nutrição Baseada em Evidências
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D312E] tracking-tight leading-[1.15] mb-4">
            Calculadora Nutricional & Metabólica Interativa
          </h1>

          <p className="text-base sm:text-lg text-[#555C56] leading-relaxed mb-6">
            Estime com rigor científico sua <strong>Taxa Metabólica Basal (TMB)</strong> pela equação de
            Mifflin-St Jeor, seu <strong>Gasto Energético Total (GET)</strong>, a meta calórica ajustada ao seu objetivo e a
            distribuição exata de macronutrientes e hidratação.
          </p>

          {/* Educational pill note */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#EFF2EA]/80 border border-[#4A5D4E]/15 flex items-start gap-3 text-xs sm:text-sm text-[#3E4D41] leading-normal">
            <ShieldCheck className="w-5 h-5 text-[#4A5D4E] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#2D312E]">Nota de Rigor Científico:</span> Os resultados gerados constituem estimativas educativas com alta precisão preditiva na literatura. Como cada organismo possui variações adaptativas e de composição corporal, estes dados servem como ponto de partida consciente para planejamento alimentar.
            </div>
          </div>
        </div>

        {/* Feature Grid Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#E8E6E1]/80 text-xs text-[#555C56]">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8E6E1]">
            <Flame className="w-4 h-4 text-[#4A5D4E]" />
            <span><strong>TMB</strong> Mifflin-St Jeor</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8E6E1]">
            <Activity className="w-4 h-4 text-[#4A5D4E]" />
            <span><strong>GET</strong> 5 Fatores de Atividade</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8E6E1]">
            <PieChart className="w-4 h-4 text-[#4A5D4E]" />
            <span><strong>Macros</strong> Soma Calórica 100%</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8E6E1]">
            <Droplet className="w-4 h-4 text-[#4A5D4E]" />
            <span><strong>Água</strong> 35 ml / kg corporal</span>
          </div>
        </div>
      </div>
    </section>
  );
};
