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
  parkingLotId: number;
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

  signUp(body: Record<string, unknown>): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/sign-up`, body).pipe(
      tap(res => {
        localStorage.setItem('pn_token', res.token);
        localStorage.setItem('pn_user', JSON.stringify(res));
      })
    );
  }

  forgotPassword(email: string): Observable<unknown> {
    return this.http.post(`${this.base}/forgot-password`, {email});
  }

  verifyCode(email: string, code: string): Observable<{valid: boolean}> {
    return this.http.post<{valid: boolean}>(`${this.base}/verify-code`, {email, code});
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<unknown> {
    return this.http.post(`${this.base}/reset-password`, {email, code, newPassword});
  }

  me(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.base}/me`);
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
