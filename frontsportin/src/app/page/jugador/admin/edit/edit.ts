import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { JugadorService } from '../../../../service/jugador-service';
import { IJugador } from '../../../../model/jugador';
import { JugadorAdminForm } from '../../../../component/jugador/admin/form/form';

@Component({
  selector: 'app-jugador-admin-edit-page',
  imports: [CommonModule, JugadorAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class JugadorAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jugadorService = inject(JugadorService);
  private snackBar = inject(MatSnackBar);

  id_jugador = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  jugador = signal<IJugador | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || idParam === '0') {
      this.error.set('ID de jugador no válido');
      this.loading.set(false);
      return;
    }
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID de jugador no válido');
      this.loading.set(false);
      return;
    }
    this.id_jugador.set(id);
    this.loadJugador();
  }

  private loadJugador(): void {
    this.jugadorService.getById(this.id_jugador()).subscribe({
      next: (data: IJugador) => {
        this.jugador.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el jugador');
        this.snackBar.open('Error cargando el jugador', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/jugador']);
  }

  onFormCancel(): void {
    this.router.navigate(['/jugador']);
  }
}
