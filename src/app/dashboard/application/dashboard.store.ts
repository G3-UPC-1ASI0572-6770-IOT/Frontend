import {Injectable, computed, signal, inject} from '@angular/core';
import {DashboardApiService, DashboardSummary} from '../infrastructure/dashboard.service';

export interface OccupancyPoint {
  hour: number;
  value: number;
}

@Injectable({providedIn: 'root'})
export class DashboardStore {
  private readonly api = inject(DashboardApiService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly summary = signal<DashboardSummary | null>(null);
  readonly mode = signal<'balanced' | 'structured'>('balanced');

  readonly kpis = computed(() => {
    const s = this.summary();
    if (!s) return [];
    return [
      {id: 'total',        icon: 'grid_view',              label: 'Total Spaces',        value: String(s.totalSpaces),         tone: 'default' as const,  delta: '', hint: 'All spaces',        trend: 'flat' as const},
      {id: 'occupancy',    icon: 'percent',                label: 'Occupancy',           value: `${s.occupancyPercent}%`,      tone: 'accent' as const,   delta: '', hint: 'Right now',         trend: 'flat' as const},
      {id: 'reservations', icon: 'event_available',        label: 'Active Reservations', value: String(s.activeReservations),  tone: 'success' as const,  delta: '', hint: 'In progress',       trend: 'up' as const},
      {id: 'alerts',       icon: 'notification_important', label: 'Alerts Today',        value: String(s.alertsToday),         tone: 'warning' as const,  delta: '', hint: 'Last 24 h',         trend: 'flat' as const},
      {id: 'revenue',      icon: 'payments',               label: 'Revenue Today',       value: `S/${(s.estimatedRevenueToday ?? 0).toFixed(2)}`, tone: 'default' as const, delta: '', hint: 'Estimated', trend: 'up' as const},
    ];
  });

  readonly occupancyTrend = computed((): OccupancyPoint[] => {
    const s = this.summary();
    if (!s) return defaultTrend();
    return defaultTrend();
  });

  readonly recentEvents = computed(() => {
    const s = this.summary();
    if (!s) return [];
    return (s.recentEvents as any[]).map((e: any) => ({
      id: String(e.id),
      icon: severityIcon(e.severity),
      title: e.title,
      detail: e.message ?? '',
      time: formatAgo(e.createdAt),
      variant: e.severity?.toLowerCase() ?? 'info'
    }));
  });

  readonly topLots = computed(() => (this.summary()?.topLots ?? []) as any[]);

  load(ownerId?: number): void {
    this.loading.set(true);
    this.api.getSummary(ownerId).subscribe({
      next: s => { this.summary.set(s); this.loading.set(false); },
      error: () => { this.error.set('No se pudo cargar el dashboard.'); this.loading.set(false); }
    });
  }

  setMode(mode: 'balanced' | 'structured'): void { this.mode.set(mode); }
}

function defaultTrend(): OccupancyPoint[] {
  return [6, 8, 9, 11, 13, 15, 14, 12, 11, 10, 9, 8].map((v, i) => ({hour: 8 + i, value: v * 5}));
}

function severityIcon(s: string): string {
  switch (s?.toUpperCase()) {
    case 'CRITICAL': return 'crisis_alert';
    case 'WARNING':  return 'warning';
    case 'RESOLVED': return 'check_circle';
    default:         return 'info';
  }
}

function formatAgo(iso: string): string {
  if (!iso) return '';
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.floor(h / 24)} d ago`;
}
