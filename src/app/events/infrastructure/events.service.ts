import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface EventDto {
  id: number;
  severity: string;
  title: string;
  message: string;
  lotId: number;
  spaceId: number;
  nodeId: number;
  createdAt: string;
}

@Injectable({providedIn: 'root'})
export class EventsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/events`;

  getAll(limit = 100): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(this.base, {params: {limit: String(limit)}});
  }
}
