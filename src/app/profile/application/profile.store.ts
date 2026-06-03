import {Injectable, signal, inject, effect} from '@angular/core';
import {IamStore} from '../../iam/application/iam.store';

export interface ProfilePreferences {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushAlerts: boolean;
  weeklyDigest: boolean;
  appearance: 'light' | 'dark' | 'system';
  language: string;
}

export interface AdminProfileFull {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  avatarInitials: string;
  avatarInitial: string;
  accountId: string;
  role: string;
  memberSince: string;
  status: 'active' | 'inactive';
  linkedLot: string;
  registeredEmail: string;
  created: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
  preferences: ProfilePreferences;
  location: string;
  bio: string;
  joinedAt: string;
}

function buildProfile(fullName: string, email: string, role: string, userId?: number): AdminProfileFull {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0]?.[0] ?? email?.[0] ?? 'U').toUpperCase();
  return {
    fullName: fullName || email || 'Owner',
    email: email || '',
    phone: '',
    jobTitle: role === 'OWNER' ? 'Parking Owner' : 'Driver',
    avatarInitials: initials,
    avatarInitial: initials[0],
    accountId: userId ? `ADM-${String(userId).padStart(6, '0')}` : '—',
    role: role || 'OWNER',
    memberSince: '—',
    status: 'active',
    linkedLot: '—',
    registeredEmail: email || '',
    created: '—',
    lastLogin: '—',
    twoFactorEnabled: false,
    preferences: {
      emailAlerts: true, smsAlerts: false, pushAlerts: true,
      weeklyDigest: true, appearance: 'light', language: 'English'
    },
    location: '',
    bio: '',
    joinedAt: '—',
  };
}

const EMPTY: AdminProfileFull = {
  fullName: '', email: '', phone: '', jobTitle: '',
  avatarInitials: '?', avatarInitial: '?',
  accountId: '—', role: 'OWNER', memberSince: '—',
  status: 'active', linkedLot: '—', registeredEmail: '—',
  created: '—', lastLogin: '—', twoFactorEnabled: false,
  preferences: {emailAlerts: true, smsAlerts: false, pushAlerts: true, weeklyDigest: true, appearance: 'light', language: 'English'},
  location: '', bio: '', joinedAt: '—',
};

@Injectable({providedIn: 'root'})
export class ProfileStore {
  private readonly iamStore = inject(IamStore);

  readonly loading = signal(false);
  readonly state = signal<'main' | 'edit'>('main');
  readonly profile = signal<AdminProfileFull>(EMPTY);

  constructor() {
    effect(() => {
      const user = this.iamStore.currentUser();
      if (user) {
        this.profile.set(buildProfile(user.fullName, user.email, user.role, user.userId));
      }
    });
  }

  load(): void {
    const user = this.iamStore.currentUser();
    if (user) {
      this.profile.set(buildProfile(user.fullName, user.email, user.role, user.userId));
    }
  }

  update(patch: Partial<AdminProfileFull>): void {
    const merged = {...this.profile(), ...patch};
    const parts = merged.fullName.trim().split(/\s+/);
    merged.avatarInitials = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0]?.[0] ?? 'U').toUpperCase();
    merged.avatarInitial = merged.avatarInitials[0];
    this.profile.set(merged);
  }

  togglePreference(key: keyof Pick<ProfilePreferences, 'emailAlerts' | 'smsAlerts' | 'pushAlerts' | 'weeklyDigest'>): void {
    this.profile.update(p => ({...p, preferences: {...p.preferences, [key]: !p.preferences[key]}}));
  }

  setAppearance(appearance: 'light' | 'dark' | 'system'): void {
    this.profile.update(p => ({...p, preferences: {...p.preferences, appearance}}));
  }

  setLanguage(language: string): void {
    this.profile.update(p => ({...p, preferences: {...p.preferences, language}}));
  }

  toggleEdit(): void {
    this.state.set(this.state() === 'main' ? 'edit' : 'main');
  }
}
