import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioService } from '../../../../service/comentario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IComentario } from '../../../../model/comentario';
import { ComentarioAdminDetail } from '../../../../component/comentario/admin/detail/detail';

@Component({
  selector: 'app-comentario-admin-delete-page',
  imports: [ComentarioAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class ComentarioAdminDeletePage {
  private route = inject(ActivatedRoute);
  private comentarioService = inject(ComentarioService);
  private snackBar = inject(MatSnackBar);

  id_comentario = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_comentario.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_comentario())) {
      this.error.set('ID no válido');
      return;
    }
  }

  doDelete(): void {
    this.comentarioService.delete(this.id_comentario()).subscribe({
      next: () => {
        this.snackBar.open('Comentario eliminado', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando el comentario');
        this.snackBar.open('Error eliminando el comentario', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
