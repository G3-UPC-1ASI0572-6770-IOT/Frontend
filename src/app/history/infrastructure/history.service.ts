import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, forkJoin, map} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface HistorySummary {
  reservations: unknown[];
  payments: unknown[];
  iotEvents: unknown[];
}

@Injectable({providedIn: 'root'})
export class HistoryApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  get(lotId?: number): Observable<HistorySummary> {
    const reservations$ = lotId
      ? this.http.get<unknown[]>(`${this.base}/reservations/parking-lot/${lotId}`)
      : this.http.get<unknown[]>(`${this.base}/reservations/parking-lot/1`);
    const payments$ = lotId
      ? this.http.get<unknown[]>(`${this.base}/payments/parking-lot/${lotId}`)
      : this.http.get<unknown[]>(`${this.base}/payments/parking-lot/1`);
    const iotEvents$ = this.http.get<unknown[]>(`${this.base}/iot/events?limit=50`);

    return forkJoin({reservations: reservations$, payments: payments$, iotEvents: iotEvents$}).pipe(
      map(({reservations, payments, iotEvents}) => ({reservations, payments, iotEvents}))
    );
  }
}
