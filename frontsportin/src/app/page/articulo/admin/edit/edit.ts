import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticuloService } from '../../../../service/articulo';
import { IArticulo } from '../../../../model/articulo';
import { ArticuloAdminForm } from '../../../../component/articulo/admin/form/form';

@Component({
  selector: 'app-articulo-admin-edit-page',
  imports: [CommonModule, ArticuloAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class ArticuloAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articuloService = inject(ArticuloService);
  private snackBar = inject(MatSnackBar);

  id_articulo = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  articulo = signal<IArticulo | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || idParam === '0') {
      this.error.set('ID de artículo no válido');
      this.loading.set(false);
      return;
    }
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID de artículo no válido');
      this.loading.set(false);
      return;
    }
    this.id_articulo.set(id);
    this.loadArticulo();
  }

  private loadArticulo(): void {
    this.articuloService.get(this.id_articulo()).subscribe({
      next: (data) => {
        this.articulo.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error cargando el artículo');
        this.snackBar.open('Error cargando el artículo', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/articulo']);
  }

  onFormCancel(): void {
    this.router.navigate(['/articulo']);
  }
}
