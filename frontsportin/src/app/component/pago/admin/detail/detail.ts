import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../../../service/pago';
import { IPago } from '../../../../model/pago';

@Component({
  standalone: true,
  selector: 'app-pago-admin-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class PagoAdminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private pagoService = inject(PagoService);

  oPago = signal<IPago | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idPago = this.id();
    if (!idPago || isNaN(idPago)) {
      this.error.set('ID de pago no válido');
      this.loading.set(false);
      return;
    }
    this.load(idPago);
  }

  private load(id: number): void {
    this.pagoService.get(id).subscribe({
      next: (data) => {
        this.oPago.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el pago');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
