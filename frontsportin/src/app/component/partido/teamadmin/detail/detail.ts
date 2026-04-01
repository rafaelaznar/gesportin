import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { PartidoService } from '../../../../service/partido';
import { IPartido } from '../../../../model/partido';

@Component({
  standalone: true,
  selector: 'app-partido-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class PartidoTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private partidoService = inject(PartidoService);

  oPartido = signal<IPartido | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idPartido = this.id();
    if (!idPartido || isNaN(idPartido)) {
      this.error.set('ID de partido no válido');
      this.loading.set(false);
      return;
    }
    this.load(idPartido);
  }

  private load(id: number): void {
    this.partidoService.get(id).subscribe({
      next: (data) => {
        this.oPartido.set(data);
        this.loading.set(false);
        const liga = data.liga;
        const equipo = liga?.equipo;
        const cat = equipo?.categoria;
        const temp = cat?.temporada;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el partido');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
