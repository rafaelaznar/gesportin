import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarritoService } from '../../../../service/carrito';
import { ICarrito } from '../../../../model/carrito';
import { CarritoAdminForm } from '../../../../component/carrito/admin/form/form';

@Component({
  selector: 'app-carrito-admin-edit-page',
  imports: [CommonModule, CarritoAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class CarritoAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private carritoService = inject(CarritoService);
  private snackBar = inject(MatSnackBar);

  id_carrito = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  carrito = signal<ICarrito | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || idParam === '0') {
      this.error.set('ID de carrito no válido');
      this.loading.set(false);
      return;
    }
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID de carrito no válido');
      this.loading.set(false);
      return;
    }
    this.id_carrito.set(id);
    this.loadCarrito();
  }

  private loadCarrito(): void {
    this.carritoService.get(this.id_carrito()).subscribe({
      next: (data) => {
        this.carrito.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error cargando el carrito');
        this.snackBar.open('Error cargando el carrito', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/carrito']);
  }

  onFormCancel(): void {
    this.router.navigate(['/carrito']);
  }
}
