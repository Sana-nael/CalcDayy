import { LeadData, WebhookConfig } from '../types';
import { ConfigService } from './configService';

export class WebhookService {
  /**
   * Envia o evento de lead para a URL configurada
   * Não lança erros para nunca interromper a experiência do usuário final
   */
  static async sendLeadWebhook(lead: LeadData): Promise<{ success: boolean; error?: string }> {
    const config = ConfigService.getWebhookConfig();
    if (!config.enabled || !config.url || !config.url.trim()) {
      return { success: true }; // Webhook desativado, segue normalmente
    }

    const payload = {
      event: 'lead_submitted',
      timestamp: lead.createdAt,
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email || '',
        whatsapp: lead.whatsapp,
        score: lead.score,
        primaryGoal: lead.primaryGoal || '',
        wantsFollowup: lead.wantsFollowup || '',
      },
      calculator: {
        sex: lead.calculatorSnapshot.sex,
        age: lead.calculatorSnapshot.age,
        weight: lead.calculatorSnapshot.weight,
        height: lead.calculatorSnapshot.height,
        activityLevel: lead.calculatorSnapshot.activityLevel,
        goal: lead.calculatorSnapshot.goal,
        bmr: lead.calculatorSnapshot.bmr,
        tdee: lead.calculatorSnapshot.tdee,
        targetCalories: lead.calculatorSnapshot.targetCalories,
        imc: lead.calculatorSnapshot.imc,
        imcClassification: lead.calculatorSnapshot.imcCategory,
        hydrationLiters: lead.calculatorSnapshot.hydrationLiters,
      },
      source: {
        utm_source: lead.utm.utm_source,
        utm_medium: lead.utm.utm_medium,
        utm_campaign: lead.utm.utm_campaign,
        utm_content: lead.utm.utm_content,
        utm_term: lead.utm.utm_term,
        referrer: lead.utm.referrer,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const success = response.ok;
      const updatedConfig: WebhookConfig = {
        ...config,
        lastStatus: success ? 'success' : 'failed',
        lastTestedAt: new Date().toISOString(),
        lastHttpStatus: response.status,
        lastErrorMessage: success ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      };
      ConfigService.saveWebhookConfig(updatedConfig);

      return { success, error: updatedConfig.lastErrorMessage };
    } catch (err: any) {
      const errorMessage = err.name === 'AbortError' ? 'Tempo de conexão esgotado (timeout)' : (err.message || 'Falha de rede ao conectar com webhook');
      const updatedConfig: WebhookConfig = {
        ...config,
        lastStatus: 'failed',
        lastTestedAt: new Date().toISOString(),
        lastHttpStatus: 0,
        lastErrorMessage: errorMessage,
      };
      ConfigService.saveWebhookConfig(updatedConfig);

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Dispara um teste de webhook a partir do painel administrativo
   */
  static async testWebhook(url: string): Promise<{ success: boolean; status?: number; error?: string }> {
    if (!url || !url.trim()) {
      return { success: false, error: 'Por favor, informe uma URL de webhook válida.' };
    }

    const testPayload = {
      event: 'webhook_test_ping',
      timestamp: new Date().toISOString(),
      app: 'Diagnóstico Metabólico White-Label',
      lead: {
        name: 'Lead de Teste da Dra. Camila',
        whatsapp: '5511999999999',
        email: 'teste@exemplo.com.br',
        score: 'high',
        primaryGoal: 'Emagrecimento com saúde',
        wantsFollowup: 'yes',
      },
      calculator: {
        sex: 'female',
        age: 30,
        weight: 65,
        height: 165,
        goal: 'loss',
        bmr: 1390,
        tdee: 2154,
        targetCalories: 1723,
      },
      source: {
        utm_source: 'admin_test',
        utm_medium: 'painel_integracoes',
        utm_campaign: 'teste_conexao',
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(testPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const success = response.ok;
      const currentConfig = ConfigService.getWebhookConfig();
      const updatedConfig: WebhookConfig = {
        ...currentConfig,
        url,
        lastStatus: success ? 'success' : 'failed',
        lastTestedAt: new Date().toISOString(),
        lastHttpStatus: response.status,
        lastErrorMessage: success ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      };
      ConfigService.saveWebhookConfig(updatedConfig);

      return {
        success,
        status: response.status,
        error: updatedConfig.lastErrorMessage,
      };
    } catch (err: any) {
      const errorMsg =
        err.name === 'AbortError'
          ? 'Tempo de resposta excedido (timeout de 6s).'
          : err.message || 'Falha de rede ao conectar com a URL informada.';

      const currentConfig = ConfigService.getWebhookConfig();
      const updatedConfig: WebhookConfig = {
        ...currentConfig,
        url,
        lastStatus: 'failed',
        lastTestedAt: new Date().toISOString(),
        lastHttpStatus: 0,
        lastErrorMessage: errorMsg,
      };
      ConfigService.saveWebhookConfig(updatedConfig);

      return { success: false, error: errorMsg };
    }
  }
}
