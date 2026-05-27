import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../infrastructure/auth.service';

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pwd = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pwd && cpw && pwd !== cpw ? {mismatch: true} : null;
};

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

  protected readonly showPassword = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    lotName: ['', Validators.required],
    lotAddress: ['', Validators.required],
    lotDistrict: ['', Validators.required],
    lotCapacity: ['', Validators.required],
    lotType: ['open'],
    agree: [false, Validators.requiredTrue]
  }, {validators: passwordMatchValidator});

  protected toggleShowPassword(): void { this.showPassword.update(v => !v); }
  protected setLotType(type: string): void { this.form.controls.lotType.setValue(type); }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set('');
    const v = this.form.getRawValue();
    this.authService.signUp({
      fullName: v.fullName,
      email: v.email,
      phone: v.phone,
      password: v.password,
      lotName: v.lotName,
      lotAddress: v.lotAddress,
      lotDistrict: v.lotDistrict,
      lotCapacity: Number(v.lotCapacity),
      lotType: v.lotType
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigateByUrl('/iam/sign-in');
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Error al registrar. Intenta de nuevo.');
        this.submitting.set(false);
      }
    });
  }
}
