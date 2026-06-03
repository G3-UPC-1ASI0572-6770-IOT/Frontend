import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface DashboardSummary {
  totalSpaces: number;
  freeSpaces: number;
  occupiedSpaces: number;
  reservedSpaces: number;
  occupancyRate: number;
  todayRevenue: number;
  activeReservations: number;
  nodeStatus: string;
  nodeLastSeen: string | null;
  last7DaysRevenue: {date: string; amount: number}[];
  recentIotEvents: {ts: string; spaceLabel: string; status: string}[];
}

@Injectable({providedIn: 'root'})
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/dashboard`;

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(this.base);
  }
}
