import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoarticuloService } from '../../../../service/tipoarticulo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoarticuloAdminDetail } from '../../../../component/tipoarticulo/admin/detail/detail';

@Component({
  selector: 'app-tipoarticulo-admin-delete-page',
  imports: [TipoarticuloAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class TipoarticuloAdminDeletePage {
  private route = inject(ActivatedRoute);
  private tipoarticuloService = inject(TipoarticuloService);
  private snackBar = inject(MatSnackBar);

  id_tipoarticulo = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id) || id <= 0) {
      this.error.set('ID de tipo de artículo no válido');
      return;
    }
    this.id_tipoarticulo.set(id);
  }

  doDelete(): void {
    this.tipoarticuloService.delete(this.id_tipoarticulo()).subscribe({
      next: () => {
        this.snackBar.open('Tipo de artículo eliminado', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando el tipo de artículo');
        this.snackBar.open('Error eliminando el tipo de artículo', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
