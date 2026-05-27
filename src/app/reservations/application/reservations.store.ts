import {Injectable, computed, signal, inject} from '@angular/core';
import {ReservationsApiService, ReservationDto} from '../infrastructure/reservations.service';

export interface ReservationRow {
  id: string;
  code: string;
  driver: string;
  space: string;
  start: string;
  end: string;
  status: 'active' | 'expiring' | 'finished' | 'cancelled';
  rawStatus: string;
}

function toRow(d: ReservationDto): ReservationRow {
  const statusMap: Record<string, ReservationRow['status']> = {
    active: 'active', expiring: 'expiring',
    finished: 'finished', consumed: 'finished',
    cancelled: 'cancelled', expired: 'finished',
    pending_payment: 'active'
  };
  return {
    id: String(d.id),
    code: d.code,
    driver: d.driverName,
    space: String(d.spaceId),
    start: d.startTime ?? '',
    end: d.endTime ?? '',
    status: statusMap[d.status?.toLowerCase()] ?? 'active',
    rawStatus: d.status
  };
}

@Injectable({providedIn: 'root'})
export class ReservationsStore {
  private readonly api = inject(ReservationsApiService);

  readonly loading = signal(false);
  readonly tab = signal<'active' | 'history' | 'all'>('all');
  readonly query = signal('');
  readonly selectedReservation = signal<ReservationRow | null>(null);
  private readonly _rows = signal<ReservationRow[]>([]);

  readonly reservations = computed(() => this._rows());

  readonly filtered = computed(() => {
    const q = this.query().toLowerCase(), t = this.tab();
    return this._rows().filter(r => {
      const tabMatch = t === 'all' ||
        (t === 'active'  && (r.status === 'active'  || r.status === 'expiring')) ||
        (t === 'history' && (r.status === 'finished' || r.status === 'cancelled'));
      const qMatch = r.code.toLowerCase().includes(q) || r.driver.toLowerCase().includes(q) || r.space.toLowerCase().includes(q);
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
      cancelled: list.filter(r => r.status === 'cancelled').length
    };
  });

  load(lotId?: number): void {
    this.loading.set(true);
    const obs = lotId ? this.api.getByLot(lotId) : this.api.getAll();
    obs.subscribe({
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
