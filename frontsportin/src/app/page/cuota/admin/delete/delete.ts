import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuotaService } from '../../../../service/cuota';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CuotaAdminDetail } from '../../../../component/cuota/admin/detail/detail';

@Component({
  selector: 'app-cuota-admin-delete-page',
  imports: [CuotaAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class CuotaAdminDeletePage {
  private route = inject(ActivatedRoute);
  private cuotaService = inject(CuotaService);
  private snackBar = inject(MatSnackBar);

  id_cuota = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id) || id <= 0) {
      this.error.set('ID de cuota no válido');
      return;
    }
    this.id_cuota.set(id);
  }

  doDelete(): void {
    this.cuotaService.delete(this.id_cuota()).subscribe({
      next: () => {
        this.snackBar.open('Cuota eliminada', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando la cuota');
        this.snackBar.open('Error eliminando la cuota', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
