import {ChangeDetectionStrategy, Component, OnInit, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {ReservationsStore} from '../../../application/reservations.store';
import {IamStore} from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-reservations-management',
  imports: [CommonModule, FormsModule, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reservations-management.html',
  styleUrl: './reservations-management.css'
})
export class ReservationsManagement implements OnInit {
  protected readonly store = inject(ReservationsStore);
  private readonly iamStore = inject(IamStore);

  protected readonly activeTab = signal<'active' | 'history'>('active');

  ngOnInit(): void {
    const lotId = this.iamStore.parkingLotId;
    this.store.load(lotId ?? undefined);
  }

  protected setTab(tab: 'active' | 'history'): void {
    this.activeTab.set(tab);
    this.store.setTab(tab);
  }

  protected cancel(id: string): void {
    this.store.cancel(id);
  }

  protected formatDate(iso: string): string {
    return iso ? new Date(iso).toLocaleString() : '—';
  }

  protected timeLeft(expiresAt: string): string {
    if (!expiresAt) return '—';
    const mins = Math.round((new Date(expiresAt).getTime() - Date.now()) / 60000);
    if (mins <= 0) return 'Expired';
    return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }

  protected statusLabel(status: string): string {
    const map: Record<string, string> = {
      active: 'Active', expiring: 'Almost expired',
      finished: 'Consumed', cancelled: 'Cancelled'
    };
    return map[status] ?? status;
  }
}
