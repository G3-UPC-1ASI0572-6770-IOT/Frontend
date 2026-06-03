import {Injectable, computed, signal, inject} from '@angular/core';
import {ReservationsApiService, ReservationDto} from '../infrastructure/reservations.service';

export interface ReservationRow {
  id: string;
  driverEmail: string;
  spaceLabel: string;
  parkingLotName: string;
  status: 'active' | 'expiring' | 'finished' | 'cancelled';
  rawStatus: string;
  createdAt: string;
  expiresAt: string;
  consumedAt: string;
  cancelledAt: string;
}

function toRow(d: ReservationDto): ReservationRow {
  const s = d.status?.toLowerCase();
  let status: ReservationRow['status'] = 'active';
  if (s === 'consumed' || s === 'expired') status = 'finished';
  else if (s === 'cancelled') status = 'cancelled';
  else if (s === 'active') {
    const mins = d.expiresAt
      ? Math.floor((new Date(d.expiresAt).getTime() - Date.now()) / 60000)
      : 999;
    status = mins < 5 ? 'expiring' : 'active';
  }
  return {
    id: String(d.id),
    driverEmail: d.driverEmail ?? '—',
    spaceLabel: d.spaceLabel ?? String(d.spaceId),
    parkingLotName: d.parkingLotName ?? '—',
    status,
    rawStatus: d.status,
    createdAt: d.createdAt ?? '',
    expiresAt: d.expiresAt ?? '',
    consumedAt: d.consumedAt ?? '',
    cancelledAt: d.cancelledAt ?? '',
  };
}

@Injectable({providedIn: 'root'})
export class ReservationsStore {
  private readonly api = inject(ReservationsApiService);

  readonly loading = signal(false);
  readonly tab = signal<'active' | 'history' | 'all'>('all');
  readonly query = signal('');
  private readonly _rows = signal<ReservationRow[]>([]);

  readonly reservations = computed(() => this._rows());

  readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    const t = this.tab();
    return this._rows().filter(r => {
      const tabMatch = t === 'all'
        || (t === 'active'  && (r.status === 'active' || r.status === 'expiring'))
        || (t === 'history' && (r.status === 'finished' || r.status === 'cancelled'));
      const qMatch = !q
        || r.driverEmail.toLowerCase().includes(q)
        || r.spaceLabel.toLowerCase().includes(q);
      return tabMatch && qMatch;
    });
  });

  readonly stats = computed(() => {
    const list = this._rows();
    return {
      total:     list.length,
      active:    list.filter(r => r.status === 'active').length,
      expiring:  list.filter(r => r.status === 'expiring').length,
      finished:  list.filter(r => r.status === 'finished').length,
      cancelled: list.filter(r => r.status === 'cancelled').length,
    };
  });

  load(lotId?: number): void {
    this.loading.set(true);
    if (!lotId) { this.loading.set(false); return; }
    this.api.getByLot(lotId).subscribe({
      next: dtos => { this._rows.set(dtos.map(toRow)); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  cancel(id: string): void {
    this.api.cancel(Number(id)).subscribe({
      next: dto => this._rows.update(list => list.map(r => r.id === id ? toRow(dto) : r))
    });
  }

  setTab(t: 'active' | 'history' | 'all'): void { this.tab.set(t); }
  setQuery(q: string): void { this.query.set(q); }
}
