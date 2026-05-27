import {ChangeDetectionStrategy, Component, OnInit, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {DashboardStore} from '../../../application/dashboard.store';
import {IamStore} from '../../../../iam/application/iam.store';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {MetricCard} from '../../../../shared/presentation/components/metric-card/metric-card';
import {StatusChip} from '../../../../shared/presentation/components/status-chip/status-chip';

const W = 600, H = 200, PAD = 12;

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, RouterLink, PageHeader, MetricCard, StatusChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit {
  protected readonly store = inject(DashboardStore);
  private readonly iamStore = inject(IamStore);

  ngOnInit(): void {
    this.store.load(this.iamStore.parkingLotId ?? undefined);
  }

  protected readonly trendPath = computed(() => {
    const pts = this.store.occupancyTrend();
    if (!pts.length) return '';
    return toPath(pts, false);
  });

  protected readonly trendArea = computed(() => {
    const pts = this.store.occupancyTrend();
    if (!pts.length) return '';
    const n = pts.length;
    const lastX = PAD + (n - 1) * ((W - PAD * 2) / (n - 1));
    return toPath(pts, false) + ` L${lastX},${H - PAD} L${PAD},${H - PAD} Z`;
  });
}

function toPath(pts: {hour: number; value: number}[], close: boolean): string {
  const n = pts.length;
  const xStep = (W - PAD * 2) / (n - 1);
  const coords = pts.map((p, i) => {
    const x = PAD + i * xStep;
    const y = H - PAD - (p.value / 100) * (H - PAD * 2);
    return `${x},${y}`;
  });
  return `M${coords.join(' L')}` + (close ? ' Z' : '');
}
