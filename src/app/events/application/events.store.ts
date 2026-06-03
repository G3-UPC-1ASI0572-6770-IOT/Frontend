import {Injectable, computed, signal, inject} from '@angular/core';
import {EventAlert} from '../../shared/domain/model/event-alert';
import {EventsApiService, EventDto} from '../infrastructure/events.service';

function toModel(d: EventDto): EventAlert {
  const synced = d.syncStatus === 'SYNCED';
  return {
    id: String(d.id),
    severity: synced ? 'info' : 'warning',
    title: `${d.detectedStatus} · ${d.spaceCode}`,
    message: `Node ${d.nodeId} reported ${d.distanceCm ?? '-'} cm. ${d.result ?? ''}`,
    time: formatAgo(d.receivedAt)
  };
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

@Injectable({providedIn: 'root'})
export class EventsStore {
  private readonly api = inject(EventsApiService);

  readonly loading = signal(false);
  readonly filter = signal<'all' | EventAlert['severity']>('all');
  readonly query = signal('');
  private readonly _events = signal<EventAlert[]>([]);

  readonly events = computed(() => this._events());

  readonly filtered = computed(() => {
    const f = this.filter(), q = this.query().toLowerCase();
    return this._events().filter(e =>
      (f === 'all' || e.severity === f) &&
      (e.title.toLowerCase().includes(q) || e.message.toLowerCase().includes(q) || e.id.toLowerCase().includes(q))
    );
  });

  readonly stats = computed(() => {
    const list = this._events();
    return {
      total:    list.length,
      critical: list.filter(e => e.severity === 'critical').length,
      warning:  list.filter(e => e.severity === 'warning').length,
      info:     list.filter(e => e.severity === 'info').length,
      resolved: list.filter(e => e.severity === 'resolved').length
    };
  });

  load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: dtos => { this._events.set(dtos.map(toModel)); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  iconFor(severity: EventAlert['severity']): string {
    switch (severity) {
      case 'critical': return 'crisis_alert';
      case 'warning':  return 'warning';
      case 'info':     return 'info';
      case 'resolved': return 'check_circle';
    }
  }

  setFilter(f: 'all' | EventAlert['severity']): void { this.filter.set(f); }
  setQuery(q: string): void { this.query.set(q); }
}
