import React from 'react';
import { ImcData } from '../types';
import { Info } from 'lucide-react';

interface ImcGaugeProps {
  imc: ImcData;
}

export const ImcGauge: React.FC<ImcGaugeProps> = ({ imc }) => {
  // Scale positions for BMI from 15 to 45
  const minVal = 15;
  const maxVal = 45;
  const clampedVal = Math.min(Math.max(imc.value, minVal), maxVal);
  const pointerPercent = ((clampedVal - minVal) / (maxVal - minVal)) * 100;

  const getBadgeStyle = (category: ImcData['category']) => {
    switch (category) {
      case 'underweight':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'normal':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'overweight':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'obesity1':
      case 'obesity2':
      case 'obesity3':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-50 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#4A5D4E]">
            Índice de Massa Corporal (IMC)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-serif font-bold text-[#2D312E]">
              {imc.value}
            </span>
            <span className="text-xs text-[#676F68]">kg/m²</span>
          </div>
        </div>

        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${getBadgeStyle(
            imc.category
          )}`}
        >
          {imc.classification}
        </span>
      </div>

      <p className="text-xs text-[#555C56] leading-relaxed mb-4">
        {imc.description}
      </p>

      {/* Visual Multi-Segment Bar */}
      <div className="relative pt-6 pb-2">
        {/* Pointer Triangle & Label */}
        <div
          className="absolute top-0 transform -translate-x-1/2 transition-all duration-500 ease-out flex flex-col items-center pointer-events-none"
          style={{ left: `${Math.max(5, Math.min(95, pointerPercent))}%` }}
        >
          <span className="text-[10px] font-bold text-[#2D312E] bg-white px-1.5 py-0.5 rounded shadow-xs border border-[#E8E6E1] mb-0.5">
            {imc.value}
          </span>
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#2D312E]" />
        </div>

        {/* Color Spectrum Bar */}
        <div className="h-2.5 w-full rounded-full flex overflow-hidden bg-stone-200">
          <div className="w-[11.6%] bg-blue-300" title="Abaixo do peso (< 18.5)" />
          <div className="w-[21.3%] bg-emerald-400" title="Eutrofia / Normal (18.5 - 24.9)" />
          <div className="w-[16.7%] bg-amber-400" title="Sobrepeso (25.0 - 29.9)" />
          <div className="w-[16.7%] bg-orange-400" title="Obesidade Grau I (30.0 - 34.9)" />
          <div className="w-[16.7%] bg-rose-400" title="Obesidade Grau II (35.0 - 39.9)" />
          <div className="w-[17%] bg-rose-600" title="Obesidade Grau III (≥ 40)" />
        </div>

        {/* Segment Labels */}
        <div className="flex justify-between text-[10px] text-[#676F68] font-medium mt-1 px-0.5">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>35</span>
          <span>40+</span>
        </div>
      </div>

      {/* Educational context note on IMC */}
      <div className="mt-3 pt-3 border-t border-[#E8E6E1] flex items-start gap-2 text-[11px] text-[#676F68] leading-normal bg-[#F5F3EF]/50 p-2.5 rounded-lg">
        <Info className="w-3.5 h-3.5 text-[#4A5D4E] shrink-0 mt-0.5" />
        <div>
          <strong>Compreensão Clínica do IMC:</strong> O IMC é uma métrica de triagem populacional. Ele não diferencia massa muscular de gordura corporal nem avalia densidade óssea. Indivíduos com alto volume muscular podem apresentar IMC de sobrepeso mantendo baixíssimo percentual de gordura.
        </div>
      </div>
    </div>
  );
};
