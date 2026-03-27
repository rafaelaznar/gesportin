import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { JugadorService } from '../../../../service/jugador-service';
import { IJugador } from '../../../../model/jugador';

@Component({
  standalone: true,
  selector: 'app-jugador-admin-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class JugadorAdminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private jugadorService = inject(JugadorService);

  oJugador = signal<IJugador | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idJugador = this.id();
    if (!idJugador || isNaN(idJugador)) {
      this.error.set('ID de jugador no válido');
      this.loading.set(false);
      return;
    }
    this.load(idJugador);
  }

  private load(id: number): void {
    this.jugadorService.getById(id).subscribe({
      next: (data: IJugador) => {
        this.oJugador.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el jugador');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
