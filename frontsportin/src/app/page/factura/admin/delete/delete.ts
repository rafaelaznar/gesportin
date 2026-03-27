import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturaService } from '../../../../service/factura-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturaAdminDetail } from '../../../../component/factura/admin/detail/detail';

@Component({
  selector: 'app-factura-admin-delete-page',
  imports: [FacturaAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class FacturaAdminDeletePage {
  private route = inject(ActivatedRoute);
  private facturaService = inject(FacturaService);
  private snackBar = inject(MatSnackBar);

  id_factura = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id) || id <= 0) {
      this.error.set('ID de factura no válido');
      return;
    }
    this.id_factura.set(id);
  }

  doDelete(): void {
    this.facturaService.delete(this.id_factura()).subscribe({
      next: () => {
        this.snackBar.open('Factura eliminada', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando la factura');
        this.snackBar.open('Error eliminando la factura', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
