import {ChangeDetectionStrategy, Component, OnInit, inject, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {RouterLink} from '@angular/router';
import {HistoryApiService, HistorySummary} from '../../../infrastructure/history.service';
import {IamStore} from '../../../../iam/application/iam.store';

type HistoryRow = {type: string; ref: string; detail: string; at: string};
type TabType = 'all' | 'reservation' | 'payment' | 'iot';

@Component({
  selector: 'app-operations-history',
  imports: [CommonModule, PageHeader, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './operations-history.html',
  styleUrl: './operations-history.css'
})
export class OperationsHistory implements OnInit {
  private readonly api = inject(HistoryApiService);
  private readonly iamStore = inject(IamStore);

  protected readonly loading = signal(false);
  protected readonly activeTab = signal<TabType>('all');
  private readonly _allRows = signal<HistoryRow[]>([]);

  protected readonly rows = computed(() => {
    const tab = this.activeTab();
    const all = this._allRows();
    if (tab === 'all') return all;
    if (tab === 'reservation') return all.filter(r => r.type === 'RESERVA');
    if (tab === 'payment') return all.filter(r => r.type === 'PAGO');
    return all.filter(r => r.type === 'IOT');
  });

  ngOnInit(): void {
    this.loading.set(true);
    const lotId = this.iamStore.parkingLotId ?? undefined;
    this.api.get(lotId).subscribe({
      next: data => { this._allRows.set(this.toRows(data)); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  private toRows(data: HistorySummary): HistoryRow[] {
    const rows: HistoryRow[] = [];
    const reservations = (data.reservations ?? []) as any[];
    const payments = (data.payments ?? []) as any[];
    const events = (data.iotEvents ?? []) as any[];

    for (const r of reservations) {
      rows.push({type: 'RESERVA', ref: r.code ?? String(r.id), detail: `Espacio ${r.spaceId} — ${r.status}`, at: r.updatedAt ?? r.createdAt ?? ''});
    }
    for (const p of payments) {
      rows.push({type: 'PAGO', ref: `PAY-${p.id}`, detail: `${p.currency} ${p.amount} — ${p.method} — ${p.status}`, at: p.paidAt ?? p.createdAt ?? ''});
    }
    for (const e of events) {
      rows.push({type: 'IOT', ref: `EVT-${e.id}`, detail: `${e.title ?? e.message}`, at: e.createdAt ?? ''});
    }

    return rows.sort((a, b) => b.at.localeCompare(a.at));
  }

  protected setTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  protected typeIcon(type: string): string {
    if (type === 'PAGO') return 'payments';
    if (type === 'IOT')  return 'memory';
    return 'event_available';
  }

  protected statusFromDetail(detail: string): string {
    if (detail.includes('PAID') || detail.includes('SYNCED') || detail.includes('CONSUMED')) return 'done';
    if (detail.includes('CANCELLED')) return 'cancelled';
    if (detail.includes('EXPIRED'))   return 'expired';
    return 'info';
  }
}
