import { UTMParams } from '../types';

/**
 * Extrai parâmetros UTM da URL e o Referrer do documento
 */
export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      utm_term: '',
      referrer: '',
    };
  }

  const urlParams = new URLSearchParams(window.location.search);

  return {
    utm_source: urlParams.get('utm_source') || 'direto',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_campaign: urlParams.get('utm_campaign') || '',
    utm_content: urlParams.get('utm_content') || '',
    utm_term: urlParams.get('utm_term') || '',
    referrer: document.referrer || '',
  };
}
