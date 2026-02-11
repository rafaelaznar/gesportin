import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { ICuota } from '../../../model/cuota';
import { CuotaDetailAdminUnrouted } from '../detail-admin-unrouted/cuota-detail';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CuotaService } from '../../../service/cuota';

@Component({
  selector: 'app-cuota-view',
  imports: [CommonModule, CuotaDetailAdminUnrouted],
  templateUrl: './cuota-delete.html',
  styleUrl: './cuota-delete.css',
})
export class CuotaDeleteAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oCuotaService = inject(CuotaService);
  private snackBar = inject(MatSnackBar);

  oCuota = signal<ICuota | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  id_cuota = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_cuota.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_cuota())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }
  }

  doDelete() {
    this.oCuotaService.delete(this.id_cuota()).subscribe({
      next: (data: any) => {
        this.snackBar.open('Cuota eliminada', 'Cerrar', { duration: 4000 });
        console.log('Cuota eliminada');
        window.history.back();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando la cuota');
        this.snackBar.open('Error eliminando la cuota', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel() {
    window.history.back();
  }
}
