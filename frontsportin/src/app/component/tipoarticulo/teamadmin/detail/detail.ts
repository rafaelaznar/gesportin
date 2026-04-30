import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TipoarticuloService } from '../../../../service/tipoarticulo';
import { ITipoarticulo } from '../../../../model/tipoarticulo';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { SessionService } from '../../../../service/session';

@Component({
  standalone: true,
  selector: 'app-tipoarticulo-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class TipoarticuloTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private tipoarticuloService = inject(TipoarticuloService);
  session = inject(SessionService);

  oTipoarticulo = signal<ITipoarticulo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showClub = signal(false);

  ngOnInit(): void {
    const idTipoarticulo = this.id();
    if (!idTipoarticulo || isNaN(idTipoarticulo)) {
      this.error.set('ID de tipo de artículo no válido');
      this.loading.set(false);
      return;
    }
    this.load(idTipoarticulo);
  }

  private load(id: number): void {
    this.tipoarticuloService.get(id).subscribe({
      next: (data) => {
        this.oTipoarticulo.set(data);
        this.loading.set(false);
        const club = data.club;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el tipo de artículo');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
