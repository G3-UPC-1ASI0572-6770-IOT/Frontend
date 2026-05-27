import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {IamStore} from '../../../application/iam.store';
import {AuthService} from '../../../infrastructure/auth.service';

@Component({
  selector: 'app-sign-in-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.css'
})
export class SignInForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);
  private readonly authService = inject(AuthService);

  protected readonly showPassword = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.nonNullable.group({
    email: ['admin@parkingnow.com', [Validators.required, Validators.email]],
    password: ['demo1234', [Validators.required, Validators.minLength(6)]],
    remember: [true]
  });

  protected toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set('');
    const {email, password} = this.form.getRawValue();
    this.authService.signIn(email, password).subscribe({
      next: user => {
        this.iamStore.signIn(user);
        this.submitting.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.error.set('Credenciales incorrectas.');
        this.submitting.set(false);
      }
    });
  }
}
