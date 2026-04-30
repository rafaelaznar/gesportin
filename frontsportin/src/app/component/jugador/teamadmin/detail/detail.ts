import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { JugadorService } from '../../../../service/jugador-service';
import { IJugador } from '../../../../model/jugador';
import { SessionService } from '../../../../service/session';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';

@Component({
  standalone: true,
  selector: 'app-jugador-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class JugadorTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private jugadorService = inject(JugadorService);
  session = inject(SessionService);

  oJugador = signal<IJugador | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showUsuario = signal(false);
  showUsuarioTipousuario = signal(false);
  showUsuarioRolusuario = signal(false);
  showUsuarioClub = signal(false);
  showEquipo = signal(false);
  showEquipoCategoria = signal(false);
  showEquipoCategoriaTemporada = signal(false);
  showEquipoCategoriaTemporadaClub = signal(false);
  showEquipoUsuario = signal(false);
  showEquipoUsuarioTipousuario = signal(false);
  showEquipoUsuarioRolusuario = signal(false);
  showEquipoUsuarioClub = signal(false);

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
        const equipo = data.equipo;
        const cat = equipo?.categoria;
        const temp = cat?.temporada;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el jugador');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
