import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface ReservationDto {
  id: number;
  spaceId: number;
  spaceLabel: string;
  lotId: number;
  parkingLotName: string;
  driverId: number;
  driverEmail: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  consumedAt?: string;
  cancelledAt?: string;
}

@Injectable({providedIn: 'root'})
export class ReservationsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/reservations`;

  getByLot(lotId: number): Observable<ReservationDto[]> {
    return this.http.get<ReservationDto[]>(`${this.base}/parking-lot/${lotId}`);
  }

  cancel(id: number): Observable<ReservationDto> {
    return this.http.patch<ReservationDto>(`${this.base}/${id}/cancel`, {});
  }

  consume(id: number): Observable<ReservationDto> {
    return this.http.patch<ReservationDto>(`${this.base}/${id}/consume`, {});
  }
}
