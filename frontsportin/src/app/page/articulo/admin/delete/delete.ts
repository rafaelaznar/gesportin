import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloService } from '../../../../service/articulo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticuloAdminDetail } from '../../../../component/articulo/admin/detail/detail';

@Component({
  selector: 'app-articulo-admin-delete-page',
  imports: [ArticuloAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class ArticuloAdminDeletePage {
  private route = inject(ActivatedRoute);
  private articuloService = inject(ArticuloService);
  private snackBar = inject(MatSnackBar);

  id_articulo = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id) || id <= 0) {
      this.error.set('ID de artículo no válido');
      return;
    }
    this.id_articulo.set(id);
  }

  doDelete(): void {
    this.articuloService.delete(this.id_articulo()).subscribe({
      next: () => {
        this.snackBar.open('Artículo eliminado', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando el artículo');
        this.snackBar.open('Error eliminando el artículo', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
