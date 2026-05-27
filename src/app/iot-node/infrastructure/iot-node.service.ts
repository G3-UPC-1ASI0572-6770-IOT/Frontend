import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface IotNodeDto {
  id: number;
  nodeCode: string;
  firmware: string;
  status: string;
  lastSeen: string;
  spaceId: number;
  lotId: number;
}

export interface IotNodeCreateDto {
  nodeCode: string;
  firmware?: string;
  spaceId?: number;
  lotId?: number;
}

@Injectable({providedIn: 'root'})
export class IotNodeApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/iot-nodes`;

  getAll(): Observable<IotNodeDto[]> {
    return this.http.get<IotNodeDto[]>(this.base);
  }

  register(body: IotNodeCreateDto): Observable<IotNodeDto> {
    return this.http.post<IotNodeDto>(this.base, body);
  }

  updateStatus(id: number, status: string): Observable<IotNodeDto> {
    return this.http.patch<IotNodeDto>(`${this.base}/${id}/status`, {status});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
