import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidoService } from '../../../../service/partido';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartidoAdminDetail } from '../../../../component/partido/admin/detail/detail';

@Component({
  selector: 'app-partido-admin-delete-page',
  imports: [PartidoAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class PartidoAdminDeletePage {
  private route = inject(ActivatedRoute);
  private partidoService = inject(PartidoService);
  private snackBar = inject(MatSnackBar);

  id_partido = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id) || id <= 0) {
      this.error.set('ID de partido no válido');
      return;
    }
    this.id_partido.set(id);
  }

  doDelete(): void {
    this.partidoService.delete(this.id_partido()).subscribe({
      next: () => {
        this.snackBar.open('Partido eliminado', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando el partido');
        this.snackBar.open('Error eliminando el partido', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
