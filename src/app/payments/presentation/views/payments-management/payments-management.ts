import {ChangeDetectionStrategy, Component, OnInit, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {PaymentsApiService} from '../../../infrastructure/payments.service';

interface PaymentRow {
  reservation: string;
  amount: string;
  method: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-payments-management',
  imports: [CommonModule, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payments-management.html',
  styleUrl: './payments-management.css'
})
export class PaymentsManagement implements OnInit {
  private readonly api = inject(PaymentsApiService);

  protected readonly loading = signal(false);
  protected rows: PaymentRow[] = [];

  ngOnInit(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: dtos => {
        this.rows = dtos.map(d => ({
          reservation: `RSV-${String(d.reservationId).padStart(4, '0')}`,
          amount: `${d.currency ?? 'PEN'} ${(d.amount ?? 0).toFixed(2)}`,
          method: d.method ?? '—',
          status: d.status ?? '—',
          date: d.paidAt ? new Date(d.paidAt).toLocaleString() : (d.createdAt ? new Date(d.createdAt).toLocaleString() : '—')
        }));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
