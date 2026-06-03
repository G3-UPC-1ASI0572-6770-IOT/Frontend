import {Injectable, signal, inject} from '@angular/core';
import {AuthService, AuthResponse} from '../infrastructure/auth.service';

@Injectable({providedIn: 'root'})
export class IamStore {
  private readonly authService = inject(AuthService);

  readonly isAuthenticated = signal(this.authService.isAuthenticated());
  readonly currentUser = signal<AuthResponse | null>(this.authService.getStoredUser());

  signIn(user: AuthResponse): void {
    this.isAuthenticated.set(true);
    this.currentUser.set(user);
  }

  signOut(): void {
    this.authService.signOut();
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  // OWNER panel: parkingLotId is resolved at runtime via API after login
  get parkingLotId(): number | null {
    return (this.currentUser() as any)?.parkingLotId ?? null;
  }
}
