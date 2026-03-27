import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioartService } from '../../../../service/comentarioart';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComentarioartAdminDetail } from '../../../../component/comentarioart/admin/detail/detail';

@Component({
  selector: 'app-comentarioart-admin-delete-page',
  imports: [ComentarioartAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class ComentarioartAdminDeletePage {
  private route = inject(ActivatedRoute);
  private comentarioartService = inject(ComentarioartService);
  private snackBar = inject(MatSnackBar);

  id_comentarioart = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id) || id <= 0) {
      this.error.set('ID de comentario de artículo no válido');
      return;
    }
    this.id_comentarioart.set(id);
  }

  doDelete(): void {
    this.comentarioartService.delete(this.id_comentarioart()).subscribe({
      next: () => {
        this.snackBar.open('Comentario de artículo eliminado', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando el comentario de artículo');
        this.snackBar.open('Error eliminando el comentario de artículo', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
