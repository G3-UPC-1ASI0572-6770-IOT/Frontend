import {Injectable, computed, signal, inject} from '@angular/core';
import {ParkingSpace} from '../../shared/domain/model/parking-space';
import {SpacesApiService, SpaceDto} from '../infrastructure/spaces.service';

function toModel(d: SpaceDto): ParkingSpace {
  const s = d.status?.toUpperCase();
  const status: ParkingSpace['status'] =
    s === 'OCCUPIED' ? 'occupied' :
    s === 'RESERVED' ? 'reserved' :
    'available';
  return {
    id: d.label || String(d.id),
    zone: 'Zone A',
    type: 'Standard',
    sensor: d.source ?? 'MANUAL',
    status,
  };
}

@Injectable({providedIn: 'root'})
export class SpacesStore {
  private readonly api = inject(SpacesApiService);

  readonly loading = signal(false);
  readonly filter = signal<'all' | ParkingSpace['status']>('all');
  readonly zone = signal<'all' | string>('all');
  readonly query = signal('');
  private readonly _spaces = signal<ParkingSpace[]>([]);

  readonly spaces = computed(() => this._spaces());

  readonly filtered = computed(() => {
    const f = this.filter(), z = this.zone(), q = this.query().toLowerCase();
    return this._spaces().filter(s =>
      (f === 'all' || s.status === f) &&
      (z === 'all' || s.zone === z) &&
      (s.id.toLowerCase().includes(q) || s.sensor.toLowerCase().includes(q))
    );
  });

  readonly stats = computed(() => {
    const s = this._spaces();
    return {
      total:     s.length,
      available: s.filter(x => x.status === 'available').length,
      occupied:  s.filter(x => x.status === 'occupied').length,
      reserved:  s.filter(x => x.status === 'reserved').length,
      offline:   s.filter(x => x.status === 'offline').length,
    };
  });

  readonly zones = computed(() => Array.from(new Set(this._spaces().map(s => s.zone))));

  load(lotId?: number): void {
    this.loading.set(true);
    const req = lotId ? this.api.getByLot(lotId) : this.api.getByLot(1);
    req.subscribe({
      next: dtos => { this._spaces.set(dtos.map(toModel)); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  setFilter(f: 'all' | ParkingSpace['status']): void { this.filter.set(f); }
  setZone(z: 'all' | string): void { this.zone.set(z); }
  setQuery(q: string): void { this.query.set(q); }
  refresh(lotId?: number): void { this.load(lotId); }
}
