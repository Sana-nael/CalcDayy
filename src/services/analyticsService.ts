import {
  AnalyticsEvent,
  AnalyticsEventName,
  FunnelPeriod,
  FunnelStats,
} from '../types';

const ANALYTICS_STORAGE_KEY = 'metabolica_analytics_events_v1';

export interface AnalyticsAdapter {
  track(event: AnalyticsEventName, metadata?: Record<string, any>, isDemo?: boolean): void;
  getEvents(period?: FunnelPeriod, includeDemo?: boolean): AnalyticsEvent[];
  getFunnelStats(period?: FunnelPeriod, includeDemo?: boolean): FunnelStats;
  clearAll(): void;
  clearDemoEvents(): void;
  seedDemoEvents(): void;
}

export class LocalAnalyticsAdapter implements AnalyticsAdapter {
  private getStoredEvents(): AnalyticsEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setStoredEvents(events: AnalyticsEvent[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Falha ao salvar eventos de analytics:', e);
    }
  }

  track(event: AnalyticsEventName, metadata?: Record<string, any>, isDemo: boolean = false): void {
    const newEvent: AnalyticsEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 11),
      event,
      timestamp: new Date().toISOString(),
      isDemo,
      metadata,
    };

    const events = this.getStoredEvents();
    events.push(newEvent);
    // Limit to last 3000 events to avoid overflowing localStorage
    const trimmed = events.slice(-3000);
    this.setStoredEvents(trimmed);
  }

  getEvents(period: FunnelPeriod = 'all', includeDemo: boolean = true): AnalyticsEvent[] {
    const all = this.getStoredEvents();
    const now = new Date().getTime();

    return all.filter((ev) => {
      if (!includeDemo && ev.isDemo) return false;

      if (period === 'all') return true;

      const evTime = new Date(ev.timestamp).getTime();
      const diffHours = (now - evTime) / (1000 * 60 * 60);

      if (period === 'today') {
        const today = new Date().toDateString();
        return new Date(ev.timestamp).toDateString() === today;
      }
      if (period === '7days') {
        return diffHours <= 24 * 7;
      }
      if (period === '30days') {
        return diffHours <= 24 * 30;
      }
      return true;
    });
  }

  getFunnelStats(period: FunnelPeriod = 'all', includeDemo: boolean = true): FunnelStats {
    const events = this.getEvents(period, includeDemo);

    const countEvent = (name: AnalyticsEventName) =>
      events.filter((e) => e.event === name).length;

    const visitors = Math.max(countEvent('page_view'), 1); // At least 1 to avoid zero division if empty
    const calculatorStarted = countEvent('calculator_started');
    const calculatorCompleted = countEvent('calculator_completed');
    const leadsCaptured = countEvent('lead_submitted');
    const fullResultsViewed = countEvent('full_result_viewed');
    const whatsappClicks = countEvent('whatsapp_clicked');
    const bookingClicks = countEvent('booking_clicked');
    const ctaClicks = countEvent('cta_clicked') + whatsappClicks + bookingClicks;

    const conversionVisitorToLead = visitors > 0 ? (leadsCaptured / visitors) * 100 : 0;
    const conversionLeadToCta = leadsCaptured > 0 ? (ctaClicks / leadsCaptured) * 100 : 0;
    const conversionVisitorToCta = visitors > 0 ? (ctaClicks / visitors) * 100 : 0;

    return {
      visitors: countEvent('page_view'),
      calculatorStarted,
      calculatorCompleted,
      leadsCaptured,
      fullResultsViewed,
      ctaClicks,
      whatsappClicks,
      bookingClicks,
      conversionVisitorToLead: Math.round(conversionVisitorToLead * 10) / 10,
      conversionLeadToCta: Math.round(conversionLeadToCta * 10) / 10,
      conversionVisitorToCta: Math.round(conversionVisitorToCta * 10) / 10,
    };
  }

  clearAll(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    }
  }

  clearDemoEvents(): void {
    const events = this.getStoredEvents().filter((e) => !e.isDemo);
    this.setStoredEvents(events);
  }

  seedDemoEvents(): void {
    this.clearDemoEvents();
    const demoEvents: AnalyticsEvent[] = [];
    const now = new Date();

    // Generates realistic distribution for a top-performing nutritionist funnel:
    // ~1280 views -> ~740 started -> ~600 completed -> ~220 leads -> ~85 CTA clicks
    const steps = [
      { name: 'page_view' as AnalyticsEventName, count: 1284 },
      { name: 'calculator_started' as AnalyticsEventName, count: 742 },
      { name: 'calculator_completed' as AnalyticsEventName, count: 603 },
      { name: 'lead_form_viewed' as AnalyticsEventName, count: 540 },
      { name: 'lead_submitted' as AnalyticsEventName, count: 284 },
      { name: 'full_result_viewed' as AnalyticsEventName, count: 284 },
      { name: 'report_generated' as AnalyticsEventName, count: 122 },
      { name: 'cta_clicked' as AnalyticsEventName, count: 96 },
      { name: 'whatsapp_clicked' as AnalyticsEventName, count: 78 },
      { name: 'booking_clicked' as AnalyticsEventName, count: 18 },
    ];

    steps.forEach(({ name, count }) => {
      for (let i = 0; i < count; i++) {
        // Distribute across last 14 days
        const daysAgo = Math.floor(Math.random() * 14);
        const hoursAgo = Math.floor(Math.random() * 24);
        const eventTime = new Date(now.getTime() - (daysAgo * 24 + hoursAgo) * 3600000);

        demoEvents.push({
          id: 'demo_evt_' + Math.random().toString(36).substring(2, 9),
          event: name,
          timestamp: eventTime.toISOString(),
          isDemo: true,
        });
      }
    });

    const current = this.getStoredEvents().filter((e) => !e.isDemo);
    this.setStoredEvents([...current, ...demoEvents]);
  }
}

export const analytics = new LocalAnalyticsAdapter();
