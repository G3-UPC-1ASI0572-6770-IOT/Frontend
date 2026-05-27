import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface ReservationDto {
  id: number;
  code: string;
  driverName: string;
  driverPhone: string;
  spaceId: number;
  lotId: number;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

@Injectable({providedIn: 'root'})
export class ReservationsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/reservations`;

  getAll(): Observable<ReservationDto[]> {
    return this.http.get<ReservationDto[]>(this.base);
  }

  getByLot(lotId: number): Observable<ReservationDto[]> {
    return this.http.get<ReservationDto[]>(`${this.base}/lot/${lotId}`);
  }

  cancel(id: number): Observable<ReservationDto> {
    return this.http.patch<ReservationDto>(`${this.base}/${id}/cancel`, {});
  }

  consume(id: number): Observable<ReservationDto> {
    return this.http.patch<ReservationDto>(`${this.base}/${id}/consume`, {});
  }
}
