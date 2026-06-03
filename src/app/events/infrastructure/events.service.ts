import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface EventDto {
  id: number;
  nodeId: string;
  parkingSpaceId: number;
  spaceCode: string;
  distanceCm: number;
  detectedStatus: string;
  receivedAt: string;
  syncedAt?: string;
  syncStatus: string;
  result: string;
}

@Injectable({providedIn: 'root'})
export class EventsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/iot/events`;

  getAll(limit = 100): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(this.base, {params: {limit: String(limit)}});
  }
}
