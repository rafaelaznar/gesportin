import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmailService } from '../../../service/email';
import { LoginService } from '../../../service/login';
import { NotificacionService } from '../../../service/notificacion';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private emailService = inject(EmailService);
  private loginService = inject(LoginService);
  private notificacion = inject(NotificacionService);

  private readonly tokenPassword = this.route.snapshot.paramMap.get('token') ?? '';

  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.loginService
      .sha256(this.form.value.password)
      .then((passwordHash) => {
        this.emailService.changePassword(this.tokenPassword, passwordHash, passwordHash).subscribe({
          next: () => {
            this.submitting.set(false);
            this.notificacion.success('Contraseña actualizada correctamente.');
            this.router.navigate(['/login']);
          },
          error: () => {
            this.submitting.set(false);
            this.error.set('El enlace de recuperación no es válido o ha caducado.');
            this.notificacion.error('El enlace de recuperación no es válido o ha caducado.');
          },
        });
      })
      .catch(() => {
        this.submitting.set(false);
        this.error.set('Error preparando la nueva contraseña.');
        this.notificacion.error('Error preparando la nueva contraseña.');
      });
  }
}
