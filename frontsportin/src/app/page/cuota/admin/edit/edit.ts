import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CuotaService } from '../../../../service/cuota';
import { ICuota } from '../../../../model/cuota';
import { CuotaAdminForm } from '../../../../component/cuota/admin/form/form';

@Component({
  selector: 'app-cuota-admin-edit-page',
  imports: [CommonModule, CuotaAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class CuotaAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cuotaService = inject(CuotaService);
  private snackBar = inject(MatSnackBar);

  id_cuota = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  cuota = signal<ICuota | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || idParam === '0') {
      this.error.set('ID de cuota no válido');
      this.loading.set(false);
      return;
    }
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID de cuota no válido');
      this.loading.set(false);
      return;
    }
    this.id_cuota.set(id);
    this.loadCuota();
  }

  private loadCuota(): void {
    this.cuotaService.get(this.id_cuota()).subscribe({
      next: (data) => {
        this.cuota.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error cargando la cuota');
        this.snackBar.open('Error cargando la cuota', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/cuota']);
  }

  onFormCancel(): void {
    this.router.navigate(['/cuota']);
  }
}
