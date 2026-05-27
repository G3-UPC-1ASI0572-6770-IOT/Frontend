import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface PaymentDto {
  id: number;
  reservationId: number;
  amount: number;
  currency: string;
  method: string;
  status: string;
  paidAt: string;
  createdAt: string;
}

@Injectable({providedIn: 'root'})
export class PaymentsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/payments`;

  getAll(): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(this.base);
  }

  getByReservation(reservationId: number): Observable<PaymentDto> {
    return this.http.get<PaymentDto>(`${this.base}/reservation/${reservationId}`);
  }
}
