import {ChangeDetectionStrategy, Component, OnInit, inject, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {ReservationsStore, ReservationRow} from '../../../application/reservations.store';
import {IamStore} from '../../../../iam/application/iam.store';

type ReservationsView = 'management' | 'active' | 'history';

interface ActiveRow {
  id: string;
  space: string;
  driver: string;
  start: string;
  remaining: string;
  status: string;
  ticket: string;
}

interface HistoryRow {
  id: string;
  space: string;
  driver: string;
  date: string;
  window: string;
  status: string;
  reason: string;
}

function calcRemaining(end: string): string {
  if (!end) return '—';
  const m = Math.round((new Date(end).getTime() - Date.now()) / 60_000);
  if (m <= 0) return 'Expired';
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

function closureReason(status: string): string {
  if (status === 'finished') return 'Reservation consumed';
  if (status === 'cancelled') return 'Cancelled by operator';
  if (status === 'expiring') return 'Nearly expired';
  return '—';
}

@Component({
  selector: 'app-reservations-management',
  imports: [CommonModule, FormsModule, RouterLink, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reservations-management.html',
  styleUrl: './reservations-management.css'
})
export class ReservationsManagement implements OnInit {
  protected readonly store = inject(ReservationsStore);
  private readonly iamStore = inject(IamStore);

  protected readonly showDetails = signal(false);
  protected readonly view = signal<ReservationsView>('active');
  protected readonly query = this.store.query;

  private readonly _selectedActive = signal<ActiveRow | null>(null);
  private readonly _selectedHistory = signal<HistoryRow | null>(null);

  protected get activeRows(): ActiveRow[] {
    return this.store.reservations()
      .filter(r => r.status === 'active' || r.status === 'expiring')
      .map(r => ({
        id: r.code || r.id,
        space: r.space,
        driver: r.driver,
        start: r.start ? new Date(r.start).toLocaleString() : '—',
        remaining: calcRemaining(r.end),
        status: r.status,
        ticket: '—'
      }));
  }

  protected get historyRows(): HistoryRow[] {
    return this.store.filtered()
      .filter(r => r.status === 'finished' || r.status === 'cancelled')
      .map(r => ({
        id: r.code || r.id,
        space: r.space,
        driver: r.driver,
        date: r.end ? new Date(r.end).toLocaleDateString() : '—',
        window: `${r.start ? new Date(r.start).toLocaleString() : '?'} → ${r.end ? new Date(r.end).toLocaleString() : '?'}`,
        status: r.status,
        reason: closureReason(r.status)
      }));
  }

  protected readonly detailActive = computed(() => this._selectedActive());
  protected readonly detailHistory = computed(() => this._selectedHistory());

  ngOnInit(): void {
    const lotId = this.iamStore.parkingLotId;
    this.store.load(lotId ?? undefined);
  }

  protected setView(v: ReservationsView): void {
    this.view.set(v);
    if (v === 'active') this.store.setTab('active');
    else if (v === 'history') this.store.setTab('history');
    else this.store.setTab('all');
  }

  protected openActiveDetail(r: ActiveRow): void {
    this._selectedActive.set(r);
    this._selectedHistory.set(null);
    this.showDetails.set(true);
  }

  protected openHistoryDetail(r: HistoryRow): void {
    this._selectedHistory.set(r);
    this._selectedActive.set(null);
    this.showDetails.set(true);
  }

  protected closeDetails(): void {
    this.showDetails.set(false);
  }

  protected cancel(id: string): void {
    const row = this.store.reservations().find(r => r.code === id || r.id === id);
    if (row) this.store.cancel(row.id);
    this.showDetails.set(false);
  }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'Active', expiring: 'Almost expired',
      finished: 'Consumed', cancelled: 'Cancelled'
    };
    return labels[status] ?? status;
  }
}
