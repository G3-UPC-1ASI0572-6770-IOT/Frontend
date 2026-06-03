import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {CameraApiService, SnapshotDto} from '../../../infrastructure/camera.service';
import {IamStore} from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-camera-monitor',
  imports: [CommonModule, PageHeader, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './camera-monitor.html',
  styleUrl: './camera-monitor.css'
})
export class CameraMonitor implements OnInit, OnDestroy {
  private readonly api = inject(CameraApiService);
  private readonly iamStore = inject(IamStore);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  protected readonly loading = signal(false);
  protected readonly snapshot = signal<SnapshotDto | null>(null);

  protected readonly isRecent   = computed(() => this.snapshot()?.isRecent ?? false);
  protected readonly snapshotUrl = computed(() => this.snapshot()?.url ?? '');
  protected readonly capturedAt  = computed(() => {
    const ts = this.snapshot()?.timestamp;
    return ts ? new Date(ts).toLocaleString() : '—';
  });
  protected readonly secondsAgo = computed(() => {
    const ts = this.snapshot()?.timestamp;
    if (!ts) return 0;
    return Math.floor((Date.now() - ts) / 1000);
  });

  ngOnInit(): void {
    this.load();
    this.intervalId = setInterval(() => this.load(), 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  protected refresh(): void { this.load(); }

  private load(): void {
    const lotId = this.iamStore.parkingLotId;
    if (!lotId) return;
    this.loading.set(true);
    this.api.getSnapshot(lotId).subscribe({
      next: dto => { this.snapshot.set(dto); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
