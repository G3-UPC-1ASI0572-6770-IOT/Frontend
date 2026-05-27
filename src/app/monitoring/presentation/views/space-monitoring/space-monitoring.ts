import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {SpacesStore} from '../../../../spaces/application/spaces.store';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {ParkingSpace} from '../../../../shared/domain/model/parking-space';

@Component({
  selector: 'app-space-monitoring',
  imports: [CommonModule, RouterLink, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './space-monitoring.html',
  styleUrl: './space-monitoring.css'
})
export class SpaceMonitoring implements OnInit, OnDestroy {
  protected readonly store = inject(SpacesStore);
  protected readonly isLive = signal(true);
  protected readonly lastUpdate = signal(new Date());
  protected readonly tickKey = signal(0);
  protected readonly boardStats = {
    available: 8,
    occupied: 5,
    reserved: 3,
    offline: 1
  };
  protected readonly boardSpaces: Array<{id: string; status: ParkingSpace['status']; note: string; action: string; issue?: boolean}> = [
    {id: 'A1', status: 'available', note: 'Sensor updated 1m ago', action: 'View details'},
    {id: 'A2', status: 'occupied', note: 'Sensor updated 5m ago', action: 'View details'},
    {id: 'A3', status: 'occupied', note: 'Discrepancy detected', action: 'Resolve', issue: true},
    {id: 'A4', status: 'offline', note: 'Node unreachable', action: 'View details'},
    {id: 'B1', status: 'reserved', note: 'System assigned', action: 'View details'},
    {id: 'B2', status: 'available', note: 'Sensor updated 1m ago', action: 'View details'},
    {id: 'B3', status: 'occupied', note: 'Sensor updated 12m ago', action: 'View details'},
    {id: 'B4', status: 'available', note: 'Sensor updated 1m ago', action: 'View details'}
  ];

  private intervalId: ReturnType<typeof setInterval> | null = null;

  protected readonly bySection = computed(() => {
    const grouped: Record<string, ParkingSpace[]> = {};
    for (const s of this.store.spaces()) {
      grouped[s.zone] = grouped[s.zone] ? [...grouped[s.zone], s] : [s];
    }
    return Object.entries(grouped).map(([zone, spaces]) => ({zone, spaces}));
  });

  protected readonly liveStats = computed(() => this.store.stats());
  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      if (!this.isLive()) return;
      const ids = this.store.spaces().map(s => s.id);
      const pickCount = 1 + Math.floor(Math.random() * 2);
      const picks = new Set<string>();
      while (picks.size < pickCount) {
        picks.add(ids[Math.floor(Math.random() * ids.length)]);
      }
      picks.forEach(id => this.store.cycleStatus(id));
      this.lastUpdate.set(new Date());
      this.tickKey.update(k => k + 1);
    }, 3500);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  protected toggleLive(): void { this.isLive.update(v => !v); }

  protected statusLabel(status: ParkingSpace['status']): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
