import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from '../../../../service/carrito';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarritoAdminDetail } from '../../../../component/carrito/admin/detail/detail';

@Component({
  selector: 'app-carrito-admin-delete-page',
  imports: [CarritoAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class CarritoAdminDeletePage {
  private route = inject(ActivatedRoute);
  private carritoService = inject(CarritoService);
  private snackBar = inject(MatSnackBar);

  id_carrito = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id) || id <= 0) {
      this.error.set('ID de carrito no válido');
      return;
    }
    this.id_carrito.set(id);
  }

  doDelete(): void {
    this.carritoService.delete(this.id_carrito()).subscribe({
      next: () => {
        this.snackBar.open('Carrito eliminado', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando el carrito');
        this.snackBar.open('Error eliminando el carrito', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
