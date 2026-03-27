import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LigaService } from '../../../../service/liga';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LigaAdminDetail } from '../../../../component/liga/admin/detail/detail';

@Component({
  selector: 'app-liga-admin-delete-page',
  imports: [LigaAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class LigaAdminDeletePage {
  private route = inject(ActivatedRoute);
  private ligaService = inject(LigaService);
  private snackBar = inject(MatSnackBar);

  id_liga = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_liga.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_liga())) {
      this.error.set('ID no válido');
      return;
    }
  }

  doDelete(): void {
    this.ligaService.delete(this.id_liga()).subscribe({
      next: () => {
        this.snackBar.open('Liga eliminada', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando la liga');
        this.snackBar.open('Error eliminando la liga', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
