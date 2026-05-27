import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../infrastructure/auth.service';

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pwd = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pwd && cpw && pwd !== cpw ? {mismatch: true} : null;
};

@Component({
  selector: 'app-forgot-password-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password-form.html',
  styleUrl: './forgot-password-form.css'
})
export class ForgotPasswordForm {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  protected readonly step = signal<'email' | 'code' | 'reset' | 'success'>('email');
  protected readonly submitting = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly error = signal('');

  protected readonly emailForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  protected readonly codeForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  protected readonly resetForm = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {validators: passwordMatchValidator});

  protected toggleShowPassword(): void { this.showPassword.update(v => !v); }

  protected submitEmail(): void {
    if (this.emailForm.invalid) { this.emailForm.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.error.set('');
    this.authService.forgotPassword(this.emailForm.value.email!).subscribe({
      next: () => { this.submitting.set(false); this.step.set('code'); },
      error: () => { this.submitting.set(false); this.step.set('code'); }
    });
  }

  protected submitCode(): void {
    if (this.codeForm.invalid) { this.codeForm.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.error.set('');
    this.authService.verifyCode(this.emailForm.value.email!, this.codeForm.value.code!).subscribe({
      next: res => {
        this.submitting.set(false);
        if (res.valid) this.step.set('reset');
        else this.error.set('Invalid code. Try again.');
      },
      error: () => { this.submitting.set(false); this.error.set('Could not verify code.'); }
    });
  }

  protected submitReset(): void {
    if (this.resetForm.invalid) { this.resetForm.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.error.set('');
    this.authService.resetPassword(
      this.emailForm.value.email!,
      this.codeForm.value.code!,
      this.resetForm.value.password!
    ).subscribe({
      next: () => { this.submitting.set(false); this.step.set('success'); },
      error: () => { this.submitting.set(false); this.error.set('Could not reset password.'); }
    });
  }

  protected resendCode(): void {
    this.submitting.set(true);
    this.authService.forgotPassword(this.emailForm.value.email!).subscribe({
      next: () => this.submitting.set(false),
      error: () => this.submitting.set(false)
    });
  }

  protected goBack(): void {
    const s = this.step();
    if (s === 'code') { this.step.set('email'); this.codeForm.reset(); this.error.set(''); }
    else if (s === 'reset') { this.step.set('code'); this.resetForm.reset(); this.error.set(''); }
  }

  protected stepIndex(): number {
    const map: Record<string, number> = {email: 1, code: 2, reset: 3, success: 3};
    return map[this.step()] ?? 1;
  }
}
