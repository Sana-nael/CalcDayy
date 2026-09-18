import React, { useState } from 'react';
import {
  ProfessionalConfig,
  CalculationResults,
  UserInputData,
  LeadData,
  UTMParams,
} from '../types';
import { formatKcal } from '../utils/calculator';
import { analytics } from '../services/analyticsService';
import { LeadService } from '../services/leadService';
import { WebhookService } from '../services/webhookService';
import { getUTMParams } from '../utils/utm';
import {
  Lock,
  Sparkles,
  Flame,
  Zap,
  PieChart,
  Droplet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Phone,
  Mail,
  Target,
  HeartHandshake,
} from 'lucide-react';

interface LeadCaptureGateProps {
  config: ProfessionalConfig;
  results: CalculationResults;
  userInput: UserInputData;
  onLeadCaptured: (lead: LeadData) => void;
}

export const LeadCaptureGate: React.FC<LeadCaptureGateProps> = ({
  config,
  results,
  userInput,
  onLeadCaptured,
}) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState<string>(
    userInput.goal === 'loss'
      ? 'Emagrecimento com preservação muscular'
      : userInput.goal === 'gain'
      ? 'Hipertrofia e ganho de força'
      : 'Reeducação alimentar & vitalidade'
  );
  const [wantsFollowup, setWantsFollowup] = useState<'yes' | 'maybe' | 'exploring'>('yes');
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Formatação amigável de telefone brasileiro
  const handleWhatsappChange = (val: string) => {
    const raw = val.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length <= 10) {
      formatted = raw.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      formatted = raw.slice(0, 11).replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    setWhatsapp(formatted);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (config.requireName && !name.trim()) {
      newErrors.name = 'Por favor, informe seu nome completo.';
    }

    if (config.requireWhatsapp) {
      const cleanPhone = whatsapp.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        newErrors.whatsapp = 'Informe um número de WhatsApp válido com DDD (ex: 11 99999-9999).';
      }
    }

    if (config.requireEmail) {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = 'Informe um endereço de e-mail válido.';
      }
    } else if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'O formato do e-mail é inválido.';
    }

    if (!consent) {
      newErrors.consent = 'Você precisa aceitar os termos de recebimento para prosseguir.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const utmParams: UTMParams = getUTMParams();

      // 1. Salva o lead localmente
      const savedLead = LeadService.saveLead({
        name,
        whatsapp,
        email: email || undefined,
        primaryGoal,
        wantsFollowup,
        consentGiven: consent,
        userInput,
        results,
        utm: utmParams,
      });

      // 2. Dispara eventos de Analytics
      analytics.track('lead_submitted', {
        leadId: savedLead.id,
        score: savedLead.score,
        goal: userInput.goal,
        source: utmParams.utm_source,
      });

      analytics.track('full_result_viewed', {
        leadId: savedLead.id,
      });

      // 3. Dispara webhook de forma segura (não bloqueante)
      WebhookService.sendLeadWebhook(savedLead).catch((err) => {
        console.warn('Webhook dispatch failed:', err);
      });

      // 4. Notifica o componente pai para liberar o resultado completo
      onLeadCaptured(savedLead);
    } catch (err) {
      console.error('Erro ao processar captura de lead:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Teaser Preview Card: Valor real antecipado */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#1A3827] via-[#284C36] to-[#396246] text-white shadow-lg border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -top-12 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Cálculo Concluído • Prévia Liberada
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/85">
              Seu metabolismo basal estimado pela equação de Mifflin-St Jeor é de aproximadamente:
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-white drop-shadow-xs">
                {formatKcal(results.tmb)}
              </span>
              <span className="text-sm font-semibold text-emerald-200">kcal / dia</span>
            </div>
          </div>

          <div className="sm:text-right bg-white/10 p-3.5 rounded-2xl border border-white/15 backdrop-blur-xs text-xs">
            <span className="text-emerald-100/90 block font-semibold flex items-center sm:justify-end gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              Gasto Total Previsto (GET)
            </span>
            <span className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5 block">
              ~{formatKcal(results.get)} kcal
            </span>
            <span className="text-[11px] text-emerald-200/80">
              Fator {results.activityMultiplier}× para sua rotina
            </span>
          </div>
        </div>

        {/* Locked indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-5 border-t border-white/15 text-xs text-emerald-100/90 relative z-10">
          <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/15 backdrop-blur-xs">
            <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate font-medium">Meta Calórica Exata</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/15 backdrop-blur-xs">
            <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate font-medium">Gramas de Proteína/Carbo</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/10">
            <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate font-medium">Faixas de IMC & Peso</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/10">
            <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate font-medium">Relatório para Salvar PDF</span>
          </div>
        </div>
      </div>

      {/* Elegant Lead Capture Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E6E1] shadow-xs">
        <div className="max-w-xl mx-auto text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF2EA] text-[#4A5D4E] flex items-center justify-center mx-auto mb-3 border border-[#4A5D4E]/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D312E] tracking-tight">
            {config.offerHeadline || 'Receba seu Diagnóstico Metabólico Completo'}
          </h3>
          <p className="text-xs sm:text-sm text-[#555C56] mt-2 leading-relaxed">
            {config.offerDescription ||
              'Informe onde deseja receber sua análise nutricional completa com o plano detalhado de macronutrientes, hidratação e relatório formatado para impressão.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
          {/* Nome */}
          {config.requireName && (
            <div>
              <label
                htmlFor="lead-name-input"
                className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#4A5D4E]" />
                Nome Completo *
              </label>
              <input
                id="lead-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mariana Silveira"
                className={`w-full px-4 py-3 bg-[#FDFCFB] border rounded-xl text-sm font-semibold text-[#2D312E] placeholder:text-[#9EA59F] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/30 focus:border-[#4A5D4E] transition-all ${
                  errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E6E1]'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* WhatsApp */}
          {config.requireWhatsapp && (
            <div>
              <label
                htmlFor="lead-whatsapp-input"
                className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#4A5D4E]" />
                WhatsApp (com DDD) *
              </label>
              <input
                id="lead-whatsapp-input"
                type="tel"
                value={whatsapp}
                onChange={(e) => handleWhatsappChange(e.target.value)}
                placeholder="Ex: (11) 98765-4321"
                className={`w-full px-4 py-3 bg-[#FDFCFB] border rounded-xl text-sm font-semibold text-[#2D312E] placeholder:text-[#9EA59F] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/30 focus:border-[#4A5D4E] transition-all ${
                  errors.whatsapp ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E6E1]'
                }`}
              />
              {errors.whatsapp && (
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.whatsapp}
                </p>
              )}
            </div>
          )}

          {/* E-mail (Opcional ou Obrigatório conforme config) */}
          <div>
            <label
              htmlFor="lead-email-input"
              className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#4A5D4E]" />
                E-mail {config.requireEmail && '*'}
              </span>
              {!config.requireEmail && (
                <span className="text-[10px] text-[#8A928B] font-normal">Opcional</span>
              )}
            </label>
            <input
              id="lead-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: mariana@email.com"
              className={`w-full px-4 py-3 bg-[#FDFCFB] border rounded-xl text-sm font-semibold text-[#2D312E] placeholder:text-[#9EA59F] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/30 focus:border-[#4A5D4E] transition-all ${
                errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E6E1]'
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Pergunta Qualificadora 1: Principal Objetivo */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#4A5D4E]" />
              Qual é seu principal foco atual?
            </label>
            <select
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FDFCFB] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/30"
            >
              <option value="Emagrecimento com preservação muscular">
                Emagrecimento saudável preservando massa muscular
              </option>
              <option value="Hipertrofia e ganho de força">
                Hipertrofia e ganho de força muscular
              </option>
              <option value="Definição e composição corporal">
                Definição corporal e redução de gordura localizada
              </option>
              <option value="Reeducação alimentar & controle de exames">
                Reeducação alimentar, saúde metabólica e longevidade
              </option>
              <option value="Melhora de energia e digestão">
                Mais disposição, digestão e rotina sem restrições loucas
              </option>
            </select>
          </div>

          {/* Pergunta Qualificadora 2: Interesse em Acompanhamento Profissional */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-[#4A5D4E]" />
              Gostaria de acompanhamento profissional com {config.professionalName}?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setWantsFollowup('yes')}
                className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                  wantsFollowup === 'yes'
                    ? 'bg-[#EFF2EA] border-[#4A5D4E] text-[#4A5D4E] ring-1 ring-[#4A5D4E]/30 font-bold'
                    : 'bg-[#FDFCFB] border-[#E8E6E1] text-[#555C56] hover:bg-white'
                }`}
              >
                Sim, quero saber mais
              </button>
              <button
                type="button"
                onClick={() => setWantsFollowup('maybe')}
                className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                  wantsFollowup === 'maybe'
                    ? 'bg-[#EFF2EA] border-[#4A5D4E] text-[#4A5D4E] ring-1 ring-[#4A5D4E]/30 font-bold'
                    : 'bg-[#FDFCFB] border-[#E8E6E1] text-[#555C56] hover:bg-white'
                }`}
              >
                Talvez futuramente
              </button>
              <button
                type="button"
                onClick={() => setWantsFollowup('exploring')}
                className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                  wantsFollowup === 'exploring'
                    ? 'bg-[#EFF2EA] border-[#4A5D4E] text-[#4A5D4E] ring-1 ring-[#4A5D4E]/30 font-bold'
                    : 'bg-[#FDFCFB] border-[#E8E6E1] text-[#555C56] hover:bg-white'
                }`}
              >
                Apenas conhecendo
              </button>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-[#4A5D4E] focus:ring-[#4A5D4E] border-[#D0CDC5]"
              />
              <span className="text-xs text-[#676F68] leading-relaxed">
                {config.consentText ||
                  'Concordo em receber meu diagnóstico e comunicações personalizadas de nutrição.'}
              </span>
            </label>
            {errors.consent && (
              <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.consent}
              </p>
            )}
          </div>

          {/* Botão de Envio */}
          <div className="pt-2">
            <button
              type="submit"
              id="unlock-full-diagnosis-btn"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#4A5D4E] hover:bg-[#3E4E42] active:scale-[0.98] text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer disabled:opacity-70"
            >
              {submitting ? (
                <span>Liberando Diagnóstico...</span>
              ) : (
                <>
                  <span>Desbloquear Meu Diagnóstico Completo</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Garantia de Privacidade */}
          <p className="text-[11px] text-[#8A928B] text-center flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4A5D4E]" />
            Seus dados estão protegidos. Não compartilhamos informações pessoais.
          </p>
        </form>
      </div>
    </div>
  );
};
