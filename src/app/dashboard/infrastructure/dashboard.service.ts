import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface DashboardSummary {
  totalSpaces: number;
  occupiedSpaces: number;
  occupancyPercent: number;
  activeReservations: number;
  alertsToday: number;
  totalLots: number;
  totalNodes: number;
  paidReservationsToday: number;
  estimatedRevenueToday: number;
  topLots: unknown[];
  recentEvents: unknown[];
}

@Injectable({providedIn: 'root'})
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/dashboard`;

  getSummary(ownerId?: number): Observable<DashboardSummary> {
    let params = new HttpParams();
    if (ownerId) params = params.set('ownerId', String(ownerId));
    return this.http.get<DashboardSummary>(this.base, {params});
  }
}
