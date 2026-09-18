import React, { useState, useEffect } from 'react';
import {
  ProfessionalConfig,
  MethodologyConfig,
  WebhookConfig,
  LeadData,
  AdminTab,
} from '../../types';
import { ConfigService } from '../../services/configService';
import { LeadService } from '../../services/leadService';
import { FunnelAnalyticsTab } from './FunnelAnalyticsTab';
import { LeadsTableTab } from './LeadsTableTab';
import { BrandingTab } from './BrandingTab';
import { LeadCaptureTab } from './LeadCaptureTab';
import { CommercialCtaTab } from './CommercialCtaTab';
import { MethodologyTab } from './MethodologyTab';
import { IntegrationsTab } from './IntegrationsTab';
import {
  BarChart3,
  Users,
  Palette,
  Lock,
  MessageCircle,
  Calculator,
  Webhook,
  Save,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AdminPanelProps {
  onBackToApp: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToApp }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('funnel');
  const [professionalConfig, setProfessionalConfig] = useState<ProfessionalConfig>(
    ConfigService.getProfessionalConfig()
  );
  const [methodologyConfig, setMethodologyConfig] = useState<MethodologyConfig>(
    ConfigService.getMethodologyConfig()
  );
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>(
    ConfigService.getWebhookConfig()
  );
  const [leads, setLeads] = useState<LeadData[]>(LeadService.getLeads());
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const refreshLeads = () => {
    setLeads(LeadService.getLeads());
  };

  const handleProfessionalConfigChange = (field: keyof ProfessionalConfig, value: any) => {
    setProfessionalConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAll = () => {
    ConfigService.saveProfessionalConfig(professionalConfig);
    ConfigService.saveMethodologyConfig(methodologyConfig);
    ConfigService.saveWebhookConfig(webhookConfig);

    setSaveToast('Configurações salvas com sucesso!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Deseja restaurar todas as configurações para o padrão original?')) {
      ConfigService.resetDefaults();
      setProfessionalConfig(ConfigService.getProfessionalConfig());
      setMethodologyConfig(ConfigService.getMethodologyConfig());
      setWebhookConfig(ConfigService.getWebhookConfig());
      setSaveToast('Configurações restauradas para o padrão.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const tabs: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'funnel', label: 'Funil & Conversão', icon: BarChart3 },
    { id: 'leads', label: `Leads Capturados (${leads.length})`, icon: Users },
    { id: 'branding', label: 'Branding & Identidade', icon: Palette },
    { id: 'lead_gate', label: 'Captura & Oferta', icon: Lock },
    { id: 'cta', label: 'CTA Comercial', icon: MessageCircle },
    { id: 'methodology', label: 'Metodologia de Cálculo', icon: Calculator },
    { id: 'integrations', label: 'Integrações & Webhook', icon: Webhook },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#2D312E] pb-16">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8E6E1] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToApp}
              className="p-2 rounded-xl bg-[#EFF2EA] hover:bg-[#E2E7DB] text-[#4A5D4E] transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Voltar para a página pública da calculadora"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver App Pública</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-bold text-[#2D312E] tracking-tight">
                  Painel de Controle • Nutricionista
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#4A5D4E] text-white">
                  White-Label
                </span>
              </div>
              <p className="text-[11px] text-[#676F68]">
                Gerenciamento de leads, branding, funil de conversão e parâmetros clínicos
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-[#676F68] border border-[#E8E6E1] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Restaurar padrões"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar Padrões</span>
            </button>

            <button
              type="button"
              id="admin-save-all-btn"
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-[#4A5D4E] hover:bg-[#3E4E42] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none border-t border-[#E8E6E1]/60">
          <div className="flex gap-1 py-1.5 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-tight flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#4A5D4E] text-white shadow-xs'
                      : 'text-[#555C56] hover:bg-[#FAF9F6] hover:text-[#2D312E]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#8A928B]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D312E] text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Tab Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'funnel' && <FunnelAnalyticsTab onRefreshData={refreshLeads} />}

        {activeTab === 'leads' && (
          <LeadsTableTab leads={leads} onRefresh={refreshLeads} />
        )}

        {activeTab === 'branding' && (
          <BrandingTab
            config={professionalConfig}
            onChange={handleProfessionalConfigChange}
          />
        )}

        {activeTab === 'lead_gate' && (
          <LeadCaptureTab
            config={professionalConfig}
            onChange={handleProfessionalConfigChange}
          />
        )}

        {activeTab === 'cta' && (
          <CommercialCtaTab
            config={professionalConfig}
            onChange={handleProfessionalConfigChange}
          />
        )}

        {activeTab === 'methodology' && (
          <MethodologyTab
            methodology={methodologyConfig}
            onChange={setMethodologyConfig}
            onResetDefaults={() => setMethodologyConfig(ConfigService.getMethodologyConfig())}
          />
        )}

        {activeTab === 'integrations' && (
          <IntegrationsTab
            webhookConfig={webhookConfig}
            onChange={setWebhookConfig}
          />
        )}
      </main>
    </div>
  );
};
