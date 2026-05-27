import {Injectable, computed, signal, inject} from '@angular/core';
import {ParkingLotApiService, ParkingLotDto} from '../infrastructure/parking-lot.service';

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  occupied: number;
  hourlyRate: number;
  status: 'available' | 'occupied' | 'maintenance';
  image: string;
  iotNodes: number;
  rating: number;
  monthlyRevenue: string;
}

function toModel(d: ParkingLotDto): ParkingLot {
  const statusMap: Record<string, ParkingLot['status']> = {
    available: 'available', occupied: 'occupied', maintenance: 'maintenance'
  };
  const idx = d.id % 6 + 1;
  return {
    id: String(d.id),
    name: d.name,
    address: d.address ?? '',
    city: d.city ?? '',
    capacity: d.capacity ?? 0,
    occupied: d.occupied ?? 0,
    hourlyRate: d.hourlyRate ?? 0,
    status: statusMap[d.status?.toLowerCase()] ?? 'available',
    image: `gradient-${idx}`,
    iotNodes: d.iotNodes ?? d.capacity ?? 0,
    rating: d.rating ?? 4.5,
    monthlyRevenue: '$0'
  };
}

@Injectable({providedIn: 'root'})
export class ParkingLotStore {
  private readonly api = inject(ParkingLotApiService);

  readonly loading = signal(false);
  readonly filter = signal<'all' | 'available' | 'occupied' | 'maintenance'>('all');
  readonly query = signal('');
  readonly selectedId = signal<string | null>(null);
  private readonly _lots = signal<ParkingLot[]>([]);

  readonly lots = computed(() => {
    const q = this.query().toLowerCase();
    const f = this.filter();
    return this._lots().filter(l =>
      (f === 'all' || l.status === f) &&
      (l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.address.toLowerCase().includes(q))
    );
  });

  readonly summary = computed(() => {
    const lots = this._lots();
    const total = lots.reduce((s, l) => s + l.capacity, 0);
    const occupied = lots.reduce((s, l) => s + l.occupied, 0);
    return {
      lots: lots.length,
      capacity: total,
      occupied,
      occupancy: total ? Math.round((occupied / total) * 100) : 0,
      nodes: lots.reduce((s, l) => s + l.iotNodes, 0)
    };
  });

  readonly selected = computed(() => {
    const id = this.selectedId();
    const all = this._lots();
    return (id ? all.find(l => l.id === id) : null) ?? all[0] ?? null;
  });

  load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: dtos => {
        const lots = dtos.map(toModel);
        this._lots.set(lots);
        if (!this.selectedId() && lots.length) this.selectedId.set(lots[0].id);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setFilter(f: 'all' | 'available' | 'occupied' | 'maintenance'): void { this.filter.set(f); }
  setQuery(q: string): void { this.query.set(q); }
  select(id: string): void { this.selectedId.set(id); }
}
