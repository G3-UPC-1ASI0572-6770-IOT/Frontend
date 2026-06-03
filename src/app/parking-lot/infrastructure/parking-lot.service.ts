import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface ParkingLotDto {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  totalSpaces: number;
  freeSpaces: number;
  occupiedSpaces: number;
  occupied: number;       // alias for occupiedSpaces (backwards compat)
  hourlyRate: number;
  lotType: string;
  ownerId: number;
  latitude: number;
  longitude: number;
  nodeId: string;
  nodeOnline: boolean;
  iotNodes: number;       // kept for backwards compat
  rating: number;         // kept for backwards compat
  status: string;         // kept for backwards compat
  createdAt: string;
}

@Injectable({providedIn: 'root'})
export class ParkingLotApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/parking-lots`;

  getAll(): Observable<ParkingLotDto[]> {
    return this.http.get<ParkingLotDto[]>(this.base);
  }

  getById(id: number): Observable<ParkingLotDto> {
    return this.http.get<ParkingLotDto>(`${this.base}/${id}`);
  }

  update(id: number, body: Partial<ParkingLotDto>): Observable<ParkingLotDto> {
    return this.http.put<ParkingLotDto>(`${this.base}/${id}`, body);
  }

  linkNode(id: number, nodeId: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.base}/${id}/link-node`, {nodeId});
  }
}
