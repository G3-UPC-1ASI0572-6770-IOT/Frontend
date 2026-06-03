import {ChangeDetectionStrategy, Component, OnInit, effect, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileStore} from '../../../application/profile.store';
import {LogoutConfirmDialog} from '../../components/logout-confirm-dialog/logout-confirm-dialog';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';

@Component({
  selector: 'app-profile-settings',
  imports: [CommonModule, ReactiveFormsModule, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css'
})
export class ProfileSettings implements OnInit {
  protected readonly store = inject(ProfileStore);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly savedToast = signal(false);
  protected readonly validationStatus = signal<'idle' | 'saving' | 'saved' | 'noChanges'>('idle');

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    jobTitle: ['']
  });

  ngOnInit(): void {
    this.store.load();
  }

  constructor() {
    effect(() => {
      const p = this.store.profile();
      this.form.patchValue(
        {fullName: p.fullName, email: p.email, phone: p.phone, jobTitle: p.jobTitle},
        {emitEvent: false}
      );
    });
    const segment = this.route.snapshot.url[0]?.path;
    if (segment === 'edit') {
      this.store.state.set('edit');
    } else if (segment === 'logout') {
      this.store.state.set('main');
      queueMicrotask(() => this.openLogout());
    } else {
      this.store.state.set('main');
    }
  }

  protected edit(): void {
    this.validationStatus.set('idle');
    this.store.state.set('edit');
    this.router.navigate(['/profile/edit']);
  }

  protected cancel(): void {
    this.store.state.set('main');
    this.router.navigate(['/profile/main']);
  }

  protected save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.validationStatus.set('saving');
    setTimeout(() => {
      this.store.update(this.form.getRawValue());
      this.validationStatus.set('saved');
      setTimeout(() => {
        this.store.state.set('main');
        this.validationStatus.set('idle');
        this.router.navigate(['/profile/main']);
        this.savedToast.set(true);
        setTimeout(() => this.savedToast.set(false), 2400);
      }, 700);
    }, 500);
  }

  protected openLogout(): void {
    this.dialog.open(LogoutConfirmDialog, {
      width: '448px',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'parking-dialog-panel',
      backdropClass: 'parking-dialog-backdrop'
    });
  }
}
