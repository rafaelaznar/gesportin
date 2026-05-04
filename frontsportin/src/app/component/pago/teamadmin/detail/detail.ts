import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { PagoService } from '../../../../service/pago';
import { IPago } from '../../../../model/pago';

@Component({
  standalone: true,
  selector: 'app-pago-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class PagoTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private pagoService = inject(PagoService);

  oPago = signal<IPago | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showCuota = signal(false);
  showCuotaEquipo = signal(false);
  showCuotaEquipoCategoria = signal(false);
  showCuotaEquipoCategoriaTemporada = signal(false);
  showCuotaEquipoCategoriaTemporadaClub = signal(false);
  showCuotaEquipoUsuario = signal(false);
  showCuotaEquipoUsuarioTipousuario = signal(false);
  showCuotaEquipoUsuarioRolusuario = signal(false);
  showCuotaEquipoUsuarioClub = signal(false);
  showJugador = signal(false);
  showJugadorUsuario = signal(false);
  showJugadorUsuarioTipousuario = signal(false);
  showJugadorUsuarioRolusuario = signal(false);
  showJugadorUsuarioClub = signal(false);
  showJugadorEquipo = signal(false);
  showJugadorEquipoCategoria = signal(false);
  showJugadorEquipoCategoriaTemporada = signal(false);
  showJugadorEquipoCategoriaTemporadaClub = signal(false);
  showJugadorEquipoUsuario = signal(false);
  showJugadorEquipoUsuarioTipousuario = signal(false);
  showJugadorEquipoUsuarioRolusuario = signal(false);
  showJugadorEquipoUsuarioClub = signal(false);

  ngOnInit(): void {
    const idPago = this.id();
    if (!idPago || isNaN(idPago)) {
      this.error.set('ID de pago no válido');
      this.loading.set(false);
      return;
    }
    this.load(idPago);
  }

  private load(id: number): void {
    this.pagoService.get(id).subscribe({
      next: (data) => {
        this.oPago.set(data);
        this.loading.set(false);
        const cuota = data.cuota;
        const equipo = cuota?.equipo;
        const cat = equipo?.categoria;
        const temp = cat?.temporada;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el pago');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
