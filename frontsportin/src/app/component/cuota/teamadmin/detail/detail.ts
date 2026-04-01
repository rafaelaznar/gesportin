import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CuotaService } from '../../../../service/cuota';
import { ICuota } from '../../../../model/cuota';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { SessionService } from '../../../../service/session';

@Component({
  standalone: true,
  selector: 'app-cuota-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class CuotaTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private cuotaService = inject(CuotaService);
  session = inject(SessionService);

  oCuota = signal<ICuota | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idCuota = this.id();
    if (!idCuota || isNaN(idCuota)) {
      this.error.set('ID de cuota no válido');
      this.loading.set(false);
      return;
    }
    this.load(idCuota);
  }

  private load(id: number): void {
    this.cuotaService.get(id).subscribe({
      next: (data) => {
        this.oCuota.set(data);
        this.loading.set(false);
        const equipo = data.equipo;
        const cat = equipo?.categoria;
        const temp = cat?.temporada;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la cuota');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
