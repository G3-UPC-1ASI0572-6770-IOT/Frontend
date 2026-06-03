import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface SnapshotDto {
  url: string;
  timestamp: number;
  isRecent: boolean;
}

@Injectable({providedIn: 'root'})
export class CameraApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/camera`;

  getSnapshot(lotId: number): Observable<SnapshotDto> {
    return this.http.get<SnapshotDto>(`${this.base}/snapshot/${lotId}`);
  }
}
