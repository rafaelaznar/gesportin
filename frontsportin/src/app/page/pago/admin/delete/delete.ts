import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoService } from '../../../../service/pago';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PagoAdminDetail } from '../../../../component/pago/admin/detail/detail';

@Component({
  selector: 'app-pago-admin-delete-page',
  imports: [PagoAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class PagoAdminDeletePage {
  private route = inject(ActivatedRoute);
  private pagoService = inject(PagoService);
  private snackBar = inject(MatSnackBar);

  id_pago = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id) || id <= 0) {
      this.error.set('ID de pago no válido');
      return;
    }
    this.id_pago.set(id);
  }

  doDelete(): void {
    this.pagoService.delete(this.id_pago()).subscribe({
      next: () => {
        this.snackBar.open('Pago eliminado', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando el pago');
        this.snackBar.open('Error eliminando el pago', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
