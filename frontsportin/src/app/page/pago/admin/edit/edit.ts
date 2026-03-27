import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PagoService } from '../../../../service/pago';
import { IPago } from '../../../../model/pago';
import { PagoAdminForm } from '../../../../component/pago/admin/form/form';

@Component({
  selector: 'app-pago-admin-edit-page',
  imports: [CommonModule, PagoAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class PagoAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pagoService = inject(PagoService);
  private snackBar = inject(MatSnackBar);

  id_pago = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  pago = signal<IPago | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || idParam === '0') {
      this.error.set('ID de pago no válido');
      this.loading.set(false);
      return;
    }
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID de pago no válido');
      this.loading.set(false);
      return;
    }
    this.id_pago.set(id);
    this.loadPago();
  }

  private loadPago(): void {
    this.pagoService.get(this.id_pago()).subscribe({
      next: (data) => {
        this.pago.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error cargando el pago');
        this.snackBar.open('Error cargando el pago', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/pago']);
  }

  onFormCancel(): void {
    this.router.navigate(['/pago']);
  }
}
