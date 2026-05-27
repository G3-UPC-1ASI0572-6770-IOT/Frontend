import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface CameraFeedDto {
  id: number;
  parkingLotId: number;
  nodeId: string;
  cameraUrl: string;
  status: string;
  lastSeenAt: string;
}

@Injectable({providedIn: 'root'})
export class CameraApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/camera-feeds`;

  getLatest(lotId: number): Observable<CameraFeedDto> {
    return this.http.get<CameraFeedDto>(`${this.base}/${lotId}/latest`);
  }

  getAll(lotId: number): Observable<CameraFeedDto[]> {
    return this.http.get<CameraFeedDto[]>(`${this.base}/${lotId}`);
  }
}
