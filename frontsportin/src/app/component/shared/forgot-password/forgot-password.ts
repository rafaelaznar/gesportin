import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmailService } from '../../../service/email';
import { NotificacionService } from '../../../service/notificacion';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private emailService = inject(EmailService);
  private notificacion = inject(NotificacionService);

  form: FormGroup = this.fb.group({
    mailTo: ['', [Validators.required, Validators.email]],
  });

  readonly submitting = signal(false);
  readonly sent = signal(false);
  readonly error = signal<string | null>(null);

  get mailTo() {
    return this.form.get('mailTo');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.emailService.recoverPassword(this.form.value.mailTo).subscribe({
      next: () => {
        this.submitting.set(false);
        this.sent.set(true);
        this.notificacion.success('Si existe una cuenta con ese email, recibirás un enlace de recuperación.');
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('No se pudo solicitar la recuperación.');
        this.notificacion.error('No se pudo solicitar la recuperación.');
      },
    });
  }
}
