import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {SpacesStore} from '../../../../spaces/application/spaces.store';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {ParkingSpace} from '../../../../shared/domain/model/parking-space';
import {IamStore} from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-space-monitoring',
  imports: [CommonModule, RouterLink, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './space-monitoring.html',
  styleUrl: './space-monitoring.css'
})
export class SpaceMonitoring implements OnInit, OnDestroy {
  protected readonly store = inject(SpacesStore);
  private readonly iamStore = inject(IamStore);
  protected readonly isLive = signal(true);
  protected readonly lastUpdate = signal(new Date());
  protected readonly tickKey = signal(0);
  protected readonly boardStats = computed(() => this.store.stats());
  protected readonly boardSpaces = computed(() =>
    this.store.spaces().map(s => ({
      id: s.id,
      status: s.status,
      note: s.status === 'offline' ? 'Node unreachable' : 'Sensor state from backend',
      action: 'View details',
      issue: s.status === 'offline'
    }))
  );

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
    this.loadSpaces();
    this.intervalId = setInterval(() => {
      if (!this.isLive()) return;
      this.loadSpaces();
      this.lastUpdate.set(new Date());
      this.tickKey.update(k => k + 1);
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  protected toggleLive(): void { this.isLive.update(v => !v); }

  private loadSpaces(): void {
    this.store.load(this.iamStore.parkingLotId ?? undefined);
  }

  protected statusLabel(status: ParkingSpace['status']): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
