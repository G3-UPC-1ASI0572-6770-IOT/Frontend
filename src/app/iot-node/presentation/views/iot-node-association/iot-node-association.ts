import {ChangeDetectionStrategy, Component, OnInit, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {IotNodeApiService, IotNodeDto} from '../../../infrastructure/iot-node.service';

@Component({
  selector: 'app-iot-node-association',
  imports: [CommonModule, FormsModule, RouterLink, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './iot-node-association.html',
  styleUrl: './iot-node-association.css'
})
export class IotNodeAssociation implements OnInit {
  private readonly api = inject(IotNodeApiService);

  protected readonly loading = signal(false);
  protected readonly nodes = signal<IotNodeDto[]>([]);
  protected readonly query = signal('');
  protected readonly filter = signal<'all' | 'online' | 'warning' | 'offline'>('all');
  protected readonly drawerOpen = signal(false);
  protected readonly newNode = signal({id: '', type: 'Ultrasonic', lot: '', space: ''});

  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    const f = this.filter();
    return this.nodes().filter(n =>
      (f === 'all' || n.status === f) &&
      (n.nodeCode?.toLowerCase().includes(q) || String(n.spaceId).includes(q) || String(n.lotId).includes(q))
    );
  });

  protected readonly stats = computed(() => {
    const list = this.nodes();
    return {
      total: list.length,
      online: list.filter(n => n.status === 'online').length,
      warning: list.filter(n => n.status === 'warning').length,
      offline: list.filter(n => n.status === 'offline').length
    };
  });

  ngOnInit(): void {
    this.loadNodes();
  }

  private loadNodes(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: dtos => { this.nodes.set(dtos); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  protected toggleDrawer(): void { this.drawerOpen.update(v => !v); }

  protected associate(): void {
    const draft = this.newNode();
    if (!draft.id) return;
    this.api.register({
      nodeCode: draft.id,
      lotId: draft.lot ? Number(draft.lot) : undefined,
      spaceId: draft.space ? Number(draft.space) : undefined
    }).subscribe({
      next: dto => {
        this.nodes.update(list => [dto, ...list]);
        this.newNode.set({id: '', type: 'Ultrasonic', lot: '', space: ''});
        this.drawerOpen.set(false);
      }
    });
  }

  protected resync(): void {
    this.loadNodes();
  }

  protected updateNew(field: 'id' | 'type' | 'lot' | 'space', value: string): void {
    this.newNode.update(n => ({...n, [field]: value}));
  }

  protected statusClass(status: string): string {
    if (status === 'online') return 'ok';
    if (status === 'warning') return 'warn';
    return 'low';
  }

  protected formatLastSeen(lastSeen: string): string {
    if (!lastSeen) return '—';
    const m = Math.floor((Date.now() - new Date(lastSeen).getTime()) / 60_000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m} min ago`;
    const h = Math.floor(m / 60);
    return h < 24 ? `${h} h ago` : `${Math.floor(h / 24)} d ago`;
  }
}
