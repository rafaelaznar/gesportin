import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PuntuacionService } from '../../../../service/puntuacion';
import { IPuntuacion } from '../../../../model/puntuacion';
import { PuntuacionAdminForm } from '../../../../component/puntuacion/admin/form/form';

@Component({
  selector: 'app-puntuacion-admin-edit-page',
  imports: [CommonModule, PuntuacionAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class PuntuacionAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private puntuacionService = inject(PuntuacionService);
  private snackBar = inject(MatSnackBar);

  id_puntuacion = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  puntuacion = signal<IPuntuacion | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || idParam === '0') {
      this.error.set('ID de puntuación no válido');
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.id_puntuacion.set(id);
    this.loadPuntuacion();
  }

  private loadPuntuacion(): void {
    this.puntuacionService.get(this.id_puntuacion()).subscribe({
      next: (p: IPuntuacion) => {
        this.puntuacion.set(p);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error cargando la puntuación');
        this.snackBar.open('Error cargando la puntuación', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/puntuacion']);
  }

  onFormCancel(): void {
    this.router.navigate(['/puntuacion']);
  }
}
