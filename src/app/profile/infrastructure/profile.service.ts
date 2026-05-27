import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface ProfileDto {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  role: string;
  active: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLoginAt: string;
  parkingLotId: number;
}

@Injectable({providedIn: 'root'})
export class ProfileApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/profile`;

  get(): Observable<ProfileDto> {
    return this.http.get<ProfileDto>(this.base);
  }

  update(body: Partial<ProfileDto>): Observable<ProfileDto> {
    return this.http.put<ProfileDto>(this.base, body);
  }
}
