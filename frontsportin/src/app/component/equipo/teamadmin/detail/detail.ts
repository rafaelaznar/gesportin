import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { EquipoService } from '../../../../service/equipo';
import { IEquipo } from '../../../../model/equipo';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-equipo-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class EquipoTeamadminDetail implements OnInit {

  @Input() id: Signal<number> = signal(0);

  private oEquipoService = inject(EquipoService);
  session = inject(SessionService);

  oEquipo = signal<IEquipo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
    this.oEquipoService.get(id).subscribe({
      next: (data: IEquipo) => {
        this.oEquipo.set(data);
        this.loading.set(false);
        const cat = data.categoria;
        const temp = cat?.temporada;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el equipo');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
