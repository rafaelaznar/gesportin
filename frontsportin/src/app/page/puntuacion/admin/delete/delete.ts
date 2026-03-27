import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PuntuacionService } from '../../../../service/puntuacion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PuntuacionAdminDetail } from '../../../../component/puntuacion/admin/detail/detail';

@Component({
  selector: 'app-puntuacion-admin-delete-page',
  imports: [PuntuacionAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class PuntuacionAdminDeletePage {
  private route = inject(ActivatedRoute);
  private puntuacionService = inject(PuntuacionService);
  private snackBar = inject(MatSnackBar);

  id_puntuacion = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_puntuacion.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_puntuacion())) {
      this.error.set('ID no válido');
      return;
    }
  }

  doDelete(): void {
    this.puntuacionService.delete(this.id_puntuacion()).subscribe({
      next: () => {
        this.snackBar.open('Puntuación eliminada', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando la puntuación');
        this.snackBar.open('Error eliminando la puntuación', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
