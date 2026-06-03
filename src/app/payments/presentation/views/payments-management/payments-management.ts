import {ChangeDetectionStrategy, Component, OnInit, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {PaymentsApiService, PaymentDto} from '../../../infrastructure/payments.service';
import {IamStore} from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-payments-management',
  imports: [CommonModule, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payments-management.html',
  styleUrl: './payments-management.css'
})
export class PaymentsManagement implements OnInit {
  private readonly api = inject(PaymentsApiService);
  private readonly iamStore = inject(IamStore);

  protected readonly loading = signal(false);
  protected readonly payments = signal<PaymentDto[]>([]);

  protected get total(): string {
    const sum = this.payments().reduce((a, p) => a + (p.amount ?? 0), 0);
    return `S/. ${sum.toFixed(2)}`;
  }

  protected get paidCount(): number {
    return this.payments().filter(p => p.status === 'PAID').length;
  }

  protected get pendingCount(): number {
    return this.payments().filter(p => p.status !== 'PAID').length;
  }

  ngOnInit(): void {
    const lotId = this.iamStore.parkingLotId;
    if (!lotId) return;
    this.loading.set(true);
    this.api.getByLot(lotId).subscribe({
      next: dtos => { this.payments.set(dtos); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  protected formatDate(iso: string): string {
    return iso ? new Date(iso).toLocaleString() : '—';
  }
}
