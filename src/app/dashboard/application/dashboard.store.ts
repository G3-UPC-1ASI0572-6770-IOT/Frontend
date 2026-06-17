import {Injectable, computed, signal, inject} from '@angular/core';
import {DashboardApiService, DashboardSummary} from '../infrastructure/dashboard.service';

@Injectable({providedIn: 'root'})
export class DashboardStore {
  private readonly api = inject(DashboardApiService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly summary = signal<DashboardSummary | null>(null);

  readonly kpis = computed(() => {
    const s = this.summary();
    if (!s) return [] as KpiCard[];
    return [
      {id: 'total',        icon: 'grid_view',      label: 'Total Spaces',        value: String(s.totalSpaces),                     tone: 'default'  as Tone, trend: 'flat' as Trend},
      {id: 'free',         icon: 'check_circle',   label: 'Free',                value: String(s.freeSpaces),                      tone: 'success'  as Tone, trend: 'flat' as Trend},
      {id: 'occupied',     icon: 'directions_car', label: 'Occupied',            value: String(s.occupiedSpaces),                  tone: 'danger'   as Tone, trend: 'up'   as Trend},
      {id: 'reserved',     icon: 'schedule',       label: 'Reserved',            value: String(s.reservedSpaces),                  tone: 'warning'  as Tone, trend: 'flat' as Trend},
      {id: 'occupancy',    icon: 'percent',        label: 'Occupancy Rate',      value: `${(s.occupancyRate ?? 0).toFixed(1)}%`,   tone: 'accent'   as Tone, trend: 'up'   as Trend},
      {id: 'revenue',      icon: 'payments',       label: 'Revenue Today',       value: `S/. ${(s.todayRevenue ?? 0).toFixed(2)}`, tone: 'default'  as Tone, trend: 'up'   as Trend},
      {id: 'reservations', icon: 'book_online',    label: 'Active Reservations', value: String(s.activeReservations),              tone: 'success'  as Tone, trend: 'flat' as Trend},
      {id: 'node',         icon: 'memory',         label: 'Node Status',         value: s.nodeStatus ?? 'UNKNOWN',                 tone: s.nodeStatus === 'ONLINE' ? 'success' as Tone : 'danger' as Tone, trend: 'flat' as Trend},
    ];
  });

  readonly chartDonutData = computed(() => {
    const s = this.summary();
    if (!s) return null;
    return {
      labels: ['Occupied', 'Reserved', 'Free'],
      datasets: [{
        data: [s.occupiedSpaces, s.reservedSpaces, s.freeSpaces],
        backgroundColor: ['#F43F5E', '#00d4aa', '#10B981'],
        borderWidth: 0,
        hoverOffset: 6,
      }]
    };
  });

  readonly chartBarData = computed(() => {
    const s = this.summary();
    if (!s || !s.last7DaysRevenue?.length) return null;
    return {
      labels: s.last7DaysRevenue.map((d: any) => d.date.slice(5)),
      datasets: [{
        label: 'Revenue S/.',
        data: s.last7DaysRevenue.map((d: any) => Number(d.amount)),
        backgroundColor: '#00d4aa',
        borderRadius: 8,
        borderSkipped: false,
      }]
    };
  });

  readonly recentIotEvents = computed(() => {
    const s = this.summary();
    if (!s?.recentIotEvents) return [];
    return s.recentIotEvents.map((e: any) => {
      const status = e.detectedStatus ?? e.status ?? 'FREE';
      return {
        ts: formatAgo(e.receivedAt ?? e.ts ?? ''),
        spaceLabel: e.spaceCode ?? e.spaceLabel ?? '—',
        status,
        icon: status === 'OCCUPIED' ? 'directions_car' : 'check_circle',
        variant: status === 'OCCUPIED' ? 'danger' : 'success',
      };
    });
  });

  load(): void {
    this.loading.set(true);
    this.api.getSummary().subscribe({
      next: s => { this.summary.set(s); this.loading.set(false); },
      error: () => { this.error.set('Could not load dashboard.'); this.loading.set(false); }
    });
  }
}

type Tone = 'default' | 'accent' | 'success' | 'warning' | 'danger';
type Trend = 'up' | 'down' | 'flat';
interface KpiCard { id: string; icon: string; label: string; value: string; tone: Tone; trend: Trend; }

function formatAgo(iso: string): string {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}
