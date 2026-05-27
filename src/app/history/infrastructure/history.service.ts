import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface HistorySummary {
  reservations: unknown[];
  payments: unknown[];
  iotEvents: unknown[];
}

@Injectable({providedIn: 'root'})
export class HistoryApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/history`;

  get(lotId?: number): Observable<HistorySummary> {
    let params = new HttpParams();
    if (lotId) params = params.set('lotId', String(lotId));
    return this.http.get<HistorySummary>(this.base, {params});
  }
}
