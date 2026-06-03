import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface SpaceDto {
  id: number;
  label: string;
  status: string;   // FREE | RESERVED | OCCUPIED
  source: string;   // SENSOR | MANUAL
  lotId: number;
  lastUpdated?: string;
}

@Injectable({providedIn: 'root'})
export class SpacesApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/spaces`;

  getByLot(lotId: number): Observable<SpaceDto[]> {
    return this.http.get<SpaceDto[]>(`${this.base}/parking-lot/${lotId}`);
  }

  updateStatus(id: number, status: string, source = 'MANUAL'): Observable<SpaceDto> {
    return this.http.patch<SpaceDto>(`${this.base}/${id}/status`, {status, source});
  }
}
