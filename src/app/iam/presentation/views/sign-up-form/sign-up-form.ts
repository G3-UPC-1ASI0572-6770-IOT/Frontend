import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../infrastructure/auth.service';
import {IamStore} from '../../../application/iam.store';

@Component({
  selector: 'app-sign-up-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.css'
})
export class SignUpForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly iamStore = inject(IamStore);

  protected readonly showPassword = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name:     ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    agree:    [false, Validators.requiredTrue],
  });

  protected toggleShowPassword(): void { this.showPassword.update(v => !v); }

  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.error.set('');
    const {name, email, password} = this.form.getRawValue();
    this.authService.signUpOwner(name, email, password).subscribe({
      next: user => {
        this.iamStore.signIn(user);
        this.submitting.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Registration failed. Try again.');
        this.submitting.set(false);
      }
    });
  }
}
