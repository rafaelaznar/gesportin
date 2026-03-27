import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturaService } from '../../../../service/factura-service';
import { IFactura } from '../../../../model/factura';
import { FacturaAdminForm } from '../../../../component/factura/admin/form/form';

@Component({
  selector: 'app-factura-admin-edit-page',
  imports: [CommonModule, FacturaAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class FacturaAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private facturaService = inject(FacturaService);
  private snackBar = inject(MatSnackBar);

  id_factura = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  factura = signal<IFactura | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || idParam === '0') {
      this.error.set('ID de factura no válido');
      this.loading.set(false);
      return;
    }
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID de factura no válido');
      this.loading.set(false);
      return;
    }
    this.id_factura.set(id);
    this.loadFactura();
  }

  private loadFactura(): void {
    this.facturaService.get(this.id_factura()).subscribe({
      next: (data) => {
        this.factura.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error cargando la factura');
        this.snackBar.open('Error cargando la factura', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/factura']);
  }

  onFormCancel(): void {
    this.router.navigate(['/factura']);
  }
}
