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
  occupied: number;
  hourlyRate: number;
  status: string;
  lotType: string;
  iotNodes: number;
  rating: number;
  ownerId: number;
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
}
