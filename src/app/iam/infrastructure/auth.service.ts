import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/auth`;

  signIn(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/sign-in`, {email, password}).pipe(
      tap(res => {
        localStorage.setItem('pn_token', res.token);
        localStorage.setItem('pn_user', JSON.stringify(res));
      })
    );
  }

  signUpOwner(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/sign-up/owner`, {name, email, password}).pipe(
      tap(res => {
        localStorage.setItem('pn_token', res.token);
        localStorage.setItem('pn_user', JSON.stringify(res));
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.base}/change-password`, {oldPassword, newPassword});
  }

  signOut(): void {
    localStorage.removeItem('pn_token');
    localStorage.removeItem('pn_user');
  }

  getStoredUser(): AuthResponse | null {
    const raw = localStorage.getItem('pn_user');
    return raw ? JSON.parse(raw) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('pn_token');
  }
}
