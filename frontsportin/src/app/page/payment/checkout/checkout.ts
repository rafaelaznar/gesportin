import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../service/payment.service';
import { IPaymentSession, IPaymentConfirm } from '../../../model/payment-session';

@Component({
  selector: 'app-payment-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class PaymentCheckoutPage implements OnInit {
  private router = inject(Router);
  private paymentService = inject(PaymentService);
  private sessionToken: string | null = null;

  session = signal<IPaymentSession | null>(null);
  loading = signal(true);
  procesando = signal(false);
  error = signal<string | null>(null);

  form: IPaymentConfirm = {
    titular: '',
    numeroTarjeta: '',
    caducidad: '',
    cvv: '',
  };

  ngOnInit(): void {
    const navigationState = this.router.getCurrentNavigation()?.extras.state as
      | { sessionToken?: string }
      | undefined;
    const historyState = history.state as { sessionToken?: string } | undefined;
    this.sessionToken = navigationState?.sessionToken ?? historyState?.sessionToken ?? null;
    const token = this.sessionToken;
    if (!token) {
      this.error.set('Token de sesión no encontrado');
      this.loading.set(false);
      return;
    }
    this.paymentService.getSesion(token).subscribe({
      next: (s) => {
        if (s.estado !== 'PENDIENTE') {
          this.error.set('Esta sesión de pago ya fue procesada (estado: ' + s.estado + ')');
        }
        this.session.set(s);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la sesión de pago');
        this.loading.set(false);
      },
    });
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').substring(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    this.form.numeroTarjeta = digits;
    input.value = formatted;
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      input.value = raw.substring(0, 2) + '/' + raw.substring(2);
      this.form.caducidad = raw.substring(0, 2) + '/' + raw.substring(2);
    } else {
      input.value = raw;
      this.form.caducidad = raw;
    }
  }

  confirmar(): void {
    const token = this.sessionToken;
    if (!token) {
      this.error.set('Token de sesión no encontrado');
      return;
    }
    this.procesando.set(true);
    this.error.set(null);
    this.paymentService.confirmar(token, this.form).subscribe({
      next: (result) => {
        this.procesando.set(false);
        this.router.navigate(['/payment/success'], {
          queryParams: { tipo: result.tipo },
        });
      },
      error: (err) => {
        this.procesando.set(false);
        this.error.set(
          err?.error?.message ?? 'Error al procesar el pago. Revisa los datos de tu tarjeta.',
        );
      },
    });
  }

  cancelar(): void {
    const token = this.sessionToken;
    if (!token) {
      this.router.navigate(['/payment/cancel']);
      return;
    }
    this.paymentService.cancelar(token).subscribe({
      next: () => this.router.navigate(['/payment/cancel']),
      error: () => this.router.navigate(['/payment/cancel']),
    });
  }
}
