import React, { useState } from 'react';
import { WebhookConfig } from '../../types';
import { WebhookService } from '../../services/webhookService';
import {
  Webhook,
  Play,
  CheckCircle2,
  AlertCircle,
  Code,
  Copy,
  Check,
  FileSpreadsheet,
  ExternalLink,
} from 'lucide-react';

interface IntegrationsTabProps {
  webhookConfig: WebhookConfig;
  onChange: (config: WebhookConfig) => void;
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = ({ webhookConfig, onChange }) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleTestWebhook = async () => {
    if (!webhookConfig.url) {
      setTestResult({ success: false, message: 'Por favor, insira uma URL de Webhook válida.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await WebhookService.testWebhook(webhookConfig.url);

    setTestResult({
      success: result.success,
      message: result.error || (result.success ? `Webhook respondeu com sucesso (HTTP ${result.status || 200})!` : 'Falha ao conectar com o endpoint.'),
    });

    onChange({
      ...webhookConfig,
      lastStatus: result.success ? 'success' : 'failed',
      lastTestedAt: new Date().toISOString(),
      lastHttpStatus: result.status,
      lastErrorMessage: result.error,
    });

    setTesting(false);
  };

  const appsScriptCode = `// Cole este código no menu "Extensões > Apps Script" da sua planilha Google
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Cria cabeçalho se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data/Hora", "Nome", "WhatsApp", "E-mail", "Objetivo", 
        "Quer Consulta", "Score", "TMB", "GET", "Meta Calórica", 
        "IMC", "Origem (UTM Source)", "Campanha"
      ]);
    }
    
    // Adiciona nova linha com o lead capturado
    sheet.appendRow([
      data.createdAt || new Date(),
      data.name,
      data.whatsapp,
      data.email || "",
      data.primaryGoal,
      data.wantsFollowup,
      data.score,
      data.calculatorSnapshot.bmr,
      data.calculatorSnapshot.tdee,
      data.calculatorSnapshot.targetCalories,
      data.calculatorSnapshot.imc,
      data.utm ? data.utm.utm_source : "direto",
      data.utm ? data.utm.utm_campaign : ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Webhook Configuration Card */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Webhook className="w-4 h-4 text-[#4A5D4E]" />
              <h3 className="text-base font-serif font-bold text-[#2D312E]">
                Webhook de Disparo Automático de Leads
              </h3>
            </div>
            <p className="text-xs text-[#676F68]">
              Envie automaticamente os dados de cada lead em tempo real para Google Planilhas, Make, Zapier, n8n ou CRM.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={webhookConfig.enabled}
              onChange={(e) => onChange({ ...webhookConfig, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A5D4E]"></div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#555C56] mb-1.5">
            Endpoint URL (POST JSON)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={webhookConfig.url}
              onChange={(e) => onChange({ ...webhookConfig, url: e.target.value })}
              placeholder="Ex: https://script.google.com/macros/s/.../exec ou https://hook.eu1.make.com/..."
              className="flex-1 px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-mono text-[#2D312E] focus:ring-2 focus:ring-[#4A5D4E]/30"
            />
            <button
              type="button"
              onClick={handleTestWebhook}
              disabled={testing || !webhookConfig.url}
              className="px-4 py-2.5 rounded-xl bg-[#4A5D4E] hover:bg-[#3E4E42] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{testing ? 'Testando...' : 'Testar Webhook'}</span>
            </button>
          </div>

          {/* Test Status Feedback */}
          {testResult && (
            <div
              className={`mt-3 p-3 rounded-xl border flex items-center gap-2 text-xs ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Google Sheets Step-by-Step Guide */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#2D312E]">
              Integração Gratuita com Google Planilhas (Sem ferramentas pagas)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="px-2.5 py-1 rounded-lg bg-[#FAF9F6] hover:bg-[#EFF2EA] text-[#4A5D4E] border border-[#E8E6E1] text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Código Copiado!' : 'Copiar Script'}</span>
          </button>
        </div>

        <ol className="text-xs text-[#555C56] space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>Abra uma planilha em branco no seu Google Drive.</li>
          <li>
            Clique em <strong>Extensões → Apps Script</strong> no menu superior.
          </li>
          <li>Apague o código de exemplo e cole o script abaixo.</li>
          <li>
            Clique em <strong>Implantar → Nova Implantação</strong>, selecione tipo{' '}
            <em>"App da Web"</em>, defina <em>"Quem pode acessar: Qualquer pessoa"</em>.
          </li>
          <li>Copie a URL da aplicação da Web gerada e cole no campo acima!</li>
        </ol>

        <div className="p-3.5 rounded-xl bg-stone-900 text-stone-200 text-[11px] font-mono overflow-x-auto max-h-48 border border-stone-800">
          <pre>{appsScriptCode}</pre>
        </div>
      </div>
    </div>
  );
};
