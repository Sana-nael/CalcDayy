import React, { useState, useEffect } from 'react';
import { FunnelPeriod, FunnelStats } from '../../types';
import { analytics } from '../../services/analyticsService';
import {
  TrendingUp,
  Users,
  PlayCircle,
  CheckCircle2,
  Lock,
  Eye,
  MousePointerClick,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Database,
  Trash2,
} from 'lucide-react';

interface FunnelAnalyticsTabProps {
  onRefreshData?: () => void;
}

export const FunnelAnalyticsTab: React.FC<FunnelAnalyticsTabProps> = ({ onRefreshData }) => {
  const [period, setPeriod] = useState<FunnelPeriod>('all');
  const [stats, setStats] = useState<FunnelStats>(analytics.getFunnelStats('all', true));

  const refreshStats = (selectedPeriod: FunnelPeriod = period) => {
    setStats(analytics.getFunnelStats(selectedPeriod, true));
    if (onRefreshData) onRefreshData();
  };

  useEffect(() => {
    refreshStats(period);
  }, [period]);

  const handlePeriodChange = (newPeriod: FunnelPeriod) => {
    setPeriod(newPeriod);
    refreshStats(newPeriod);
  };

  const handleSeedDemo = () => {
    analytics.seedDemoEvents();
    refreshStats(period);
  };

  const handleClearDemo = () => {
    analytics.clearDemoEvents();
    refreshStats(period);
  };

  // Funnel steps data
  const steps = [
    {
      label: '1. Visitantes da Página',
      count: stats.visitors,
      icon: Users,
      color: 'bg-stone-100 text-stone-700 border-stone-200',
      dropRate: stats.visitors > 0 ? Math.round((stats.calculatorStarted / stats.visitors) * 100) : 0,
    },
    {
      label: '2. Iniciaram Preenchimento',
      count: stats.calculatorStarted,
      icon: PlayCircle,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dropRate:
        stats.calculatorStarted > 0
          ? Math.round((stats.calculatorCompleted / stats.calculatorStarted) * 100)
          : 0,
    },
    {
      label: '3. Concluíram os Cálculos',
      count: stats.calculatorCompleted,
      icon: CheckCircle2,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      dropRate:
        stats.calculatorCompleted > 0
          ? Math.round((stats.leadsCaptured / stats.calculatorCompleted) * 100)
          : 0,
    },
    {
      label: '4. Viraram Lead (Formulário)',
      count: stats.leadsCaptured,
      icon: Lock,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      dropRate:
        stats.leadsCaptured > 0
          ? Math.round((stats.fullResultsViewed / stats.leadsCaptured) * 100)
          : 0,
    },
    {
      label: '5. Visualizaram Diagnóstico',
      count: stats.fullResultsViewed,
      icon: Eye,
      color: 'bg-sky-50 text-sky-800 border-sky-200',
      dropRate:
        stats.fullResultsViewed > 0
          ? Math.round((stats.ctaClicks / stats.fullResultsViewed) * 100)
          : 0,
    },
    {
      label: '6. Clicaram no CTA Comercial',
      count: stats.ctaClicks,
      icon: MousePointerClick,
      color: 'bg-[#EFF2EA] text-[#4A5D4E] border-[#4A5D4E]/30',
      dropRate: 100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E8E6E1]">
        <div>
          <h3 className="text-base font-serif font-bold text-[#2D312E]">
            Métricas de Conversão do Funil
          </h3>
          <p className="text-xs text-[#676F68]">
            Acompanhe a eficiência da sua captação de leads e transição para o WhatsApp/Consulta
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className="inline-flex rounded-xl bg-[#F5F3EF] p-1 border border-[#E8E6E1]">
            <button
              type="button"
              onClick={() => handlePeriodChange('today')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                period === 'today'
                  ? 'bg-[#4A5D4E] text-white shadow-xs'
                  : 'text-[#555C56] hover:bg-[#E8E6E1]'
              }`}
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange('7days')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                period === '7days'
                  ? 'bg-[#4A5D4E] text-white shadow-xs'
                  : 'text-[#555C56] hover:bg-[#E8E6E1]'
              }`}
            >
              7 dias
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange('30days')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                period === '30days'
                  ? 'bg-[#4A5D4E] text-white shadow-xs'
                  : 'text-[#555C56] hover:bg-[#E8E6E1]'
              }`}
            >
              30 dias
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                period === 'all'
                  ? 'bg-[#4A5D4E] text-white shadow-xs'
                  : 'text-[#555C56] hover:bg-[#E8E6E1]'
              }`}
            >
              Todo Período
            </button>
          </div>

          {/* Quick Demo Loader */}
          <button
            type="button"
            onClick={handleSeedDemo}
            className="px-3 py-1.5 rounded-xl bg-[#EFF2EA] hover:bg-[#E2E7DB] text-[#4A5D4E] text-xs font-bold border border-[#4A5D4E]/20 flex items-center gap-1.5 transition-all"
            title="Carregar métricas simuladas realistas para demonstração"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dados Demo</span>
          </button>
          <button
            type="button"
            onClick={handleClearDemo}
            className="p-1.5 rounded-xl text-[#8A928B] hover:text-rose-600 hover:bg-rose-50 border border-transparent transition-all"
            title="Limpar eventos de demonstração"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Main Highlight Conversion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Visitor -> Lead */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#676F68]">
              Conversão Visitante → Lead
            </span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
              %
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#2D312E]">
              {stats.conversionVisitorToLead}%
            </span>
            <span className="text-xs text-[#676F68]">
              ({stats.leadsCaptured} de {stats.visitors})
            </span>
          </div>
          <p className="text-xs text-[#555C56] mt-2">
            Taxa de visitantes que preenchem Nome e WhatsApp para desbloquear o diagnóstico completo.
          </p>
        </div>

        {/* Lead -> CTA */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5D4E]">
              Conversão Lead → CTA Comercial
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#EFF2EA] text-[#4A5D4E] flex items-center justify-center font-bold text-xs border border-[#4A5D4E]/20">
              %
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#4A5D4E]">
              {stats.conversionLeadToCta}%
            </span>
            <span className="text-xs text-[#676F68]">
              ({stats.ctaClicks} de {stats.leadsCaptured})
            </span>
          </div>
          <p className="text-xs text-[#555C56] mt-2">
            Leads qualificados que avançaram para contato via WhatsApp ou agendamento de consulta.
          </p>
        </div>

        {/* Visitor -> CTA */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
              Eficiência Geral (Visitante → CTA)
            </span>
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs border border-teal-200">
              %
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-teal-950">
              {stats.conversionVisitorToCta}%
            </span>
            <span className="text-xs text-[#676F68]">
              ({stats.ctaClicks} de {stats.visitors})
            </span>
          </div>
          <p className="text-xs text-[#555C56] mt-2">
            Percentual total da sua audiência de tráfego que iniciou conversa ou agendou consulta.
          </p>
        </div>
      </div>

      {/* Visual Funnel Breakdown */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs">
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#4A5D4E] mb-4">
          Etapas do Funil Interativo
        </h4>

        <div className="space-y-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const maxVal = Math.max(stats.visitors, 1);
            const barWidth = Math.max(8, Math.round((step.count / maxVal) * 100));

            return (
              <div key={idx} className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E8E6E1]">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center ${step.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#2D312E]">
                      {step.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm sm:text-base font-serif font-bold text-[#2D312E]">
                      {step.count.toLocaleString('pt-BR')}
                    </span>
                    {idx < steps.length - 1 && (
                      <span className="text-[11px] font-semibold text-[#676F68] bg-[#F5F3EF] px-2 py-0.5 rounded-md border border-[#E8E6E1]">
                        {step.dropRate}% avançaram
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#E8E6E1] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4A5D4E] rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
