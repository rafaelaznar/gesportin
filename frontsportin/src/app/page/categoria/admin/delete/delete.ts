import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from '../../../../service/categoria';
import { ICategoria } from '../../../../model/categoria';
import { CategoriaAdminDetail } from '../../../../component/categoria/admin/detail/detail';

@Component({
  selector: 'app-categoria-admin-delete-page',
  imports: [CategoriaAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class CategoriaAdminDeletePage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oCategoriaService = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);

  oCategoria = signal<ICategoria | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  id_categoria = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_categoria.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_categoria())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }
    this.cargarCategoria();
  }

  cargarCategoria(): void {
    this.oCategoriaService.get(this.id_categoria()).subscribe({
      next: (data: ICategoria) => {
        this.oCategoria.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error al cargar la categoría');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  tieneEquipos(): boolean {
    return (this.oCategoria()?.equipos ?? 0) > 0;
  }

  doDelete(): void {
    this.oCategoriaService.delete(this.id_categoria()).subscribe({
      next: () => {
        this.snackBar.open('Categoría eliminada', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/categoria']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando la categoría');
        this.snackBar.open('Error eliminando la categoría', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
