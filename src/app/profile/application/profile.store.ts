import {Injectable, signal, inject} from '@angular/core';
import {ProfileApiService, ProfileDto} from '../infrastructure/profile.service';

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
  avatarInitial: string;
}

function toProfile(d: ProfileDto): AdminProfileFull {
  const parts = (d.fullName ?? '').trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0]?.[0] ?? 'U').toUpperCase();
  return {
    fullName: d.fullName ?? '',
    email: d.email ?? '',
    phone: d.phone ?? '',
    jobTitle: d.jobTitle ?? '',
    avatarInitials: initials,
    avatarInitial: initials[0],
    accountId: `ADM-${String(d.id).padStart(6, '0')}`,
    role: d.role ?? 'Administrator',
    memberSince: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}) : '',
    status: d.active ? 'active' : 'inactive',
    linkedLot: d.parkingLotId ? `Lot #${d.parkingLotId}` : '—',
    registeredEmail: d.email ?? '',
    created: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '',
    lastLogin: d.lastLoginAt ? new Date(d.lastLoginAt).toLocaleString() : '—',
    twoFactorEnabled: d.twoFactorEnabled ?? false,
    preferences: {
      emailAlerts: true,
      smsAlerts: false,
      pushAlerts: true,
      weeklyDigest: true,
      appearance: 'light',
      language: 'English'
    },
    location: '',
    bio: '',
    joinedAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', {month: 'long', year: 'numeric'}) : ''
  };
}

const EMPTY_PROFILE: AdminProfileFull = {
  fullName: '', email: '', phone: '', jobTitle: '',
  avatarInitials: '?', avatarInitial: '?',
  accountId: '—', role: '—', memberSince: '—',
  status: 'active', linkedLot: '—', registeredEmail: '—',
  created: '—', lastLogin: '—', twoFactorEnabled: false,
  preferences: {emailAlerts: true, smsAlerts: false, pushAlerts: true, weeklyDigest: true, appearance: 'light', language: 'English'},
  location: '', bio: '', joinedAt: '—'
};

@Injectable({providedIn: 'root'})
export class ProfileStore {
  private readonly api = inject(ProfileApiService);

  readonly loading = signal(false);
  readonly state = signal<'main' | 'edit'>('main');
  readonly profile = signal<AdminProfileFull>(EMPTY_PROFILE);

  load(): void {
    this.loading.set(true);
    this.api.get().subscribe({
      next: dto => { this.profile.set(toProfile(dto)); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  update(patch: Partial<AdminProfileFull>): void {
    const merged = {...this.profile(), ...patch};
    const parts = merged.fullName.trim().split(/\s+/);
    merged.avatarInitials = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0]?.[0] ?? 'U').toUpperCase();
    merged.avatarInitial = merged.avatarInitials[0];
    this.profile.set(merged);

    this.api.update({fullName: merged.fullName, phone: merged.phone, jobTitle: merged.jobTitle}).subscribe();
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
