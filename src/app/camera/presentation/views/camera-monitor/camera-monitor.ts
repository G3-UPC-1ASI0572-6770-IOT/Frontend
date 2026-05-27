import {ChangeDetectionStrategy, Component, OnInit, inject, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {CameraApiService, CameraFeedDto} from '../../../infrastructure/camera.service';
import {IamStore} from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-camera-monitor',
  imports: [CommonModule, PageHeader, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './camera-monitor.html',
  styleUrl: './camera-monitor.css'
})
export class CameraMonitor implements OnInit {
  private readonly api = inject(CameraApiService);
  private readonly iamStore = inject(IamStore);

  protected readonly loading = signal(false);
  private readonly _feed = signal<CameraFeedDto | null>(null);
  protected readonly status = computed(() => (this._feed()?.status?.toUpperCase() ?? 'OFFLINE') as 'ONLINE' | 'OFFLINE');
  protected readonly nodeStatus = computed(() => this.status());
  protected readonly streamUrl = computed(() => this._feed()?.cameraUrl ?? '');
  protected readonly updatedAt = computed(() =>
    this._feed()?.lastSeenAt ? new Date(this._feed()!.lastSeenAt).toLocaleString() : ''
  );

  ngOnInit(): void {
    this.loadFeed();
  }

  protected refresh(): void {
    this.loadFeed();
  }

  protected toggleStatus(): void {
    const feed = this._feed();
    if (!feed) return;
    const next = this.status() === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    this.api.getAll(feed.parkingLotId).subscribe();
  }

  private loadFeed(): void {
    const lotId = this.iamStore.parkingLotId;
    if (!lotId) return;
    this.loading.set(true);
    this.api.getLatest(lotId).subscribe({
      next: dto => { this._feed.set(dto); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
