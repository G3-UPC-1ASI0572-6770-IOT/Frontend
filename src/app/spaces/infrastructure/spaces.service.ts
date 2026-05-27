import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface SpaceDto {
  id: number;
  code: string;
  zone: string;
  type: string;
  sensorCode: string;
  status: string;
  lotId: number;
}

@Injectable({providedIn: 'root'})
export class SpacesApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  getByLot(lotId: number): Observable<SpaceDto[]> {
    return this.http.get<SpaceDto[]>(`${this.base}/parking-lots/${lotId}/spaces`);
  }

  updateStatus(id: number, status: string): Observable<SpaceDto> {
    return this.http.patch<SpaceDto>(`${this.base}/spaces/${id}/status`, {status});
  }
}
