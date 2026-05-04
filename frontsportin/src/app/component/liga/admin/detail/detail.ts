import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LigaService } from '../../../../service/liga';
import { ILiga } from '../../../../model/liga';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { SessionService } from '../../../../service/session';

@Component({
  standalone: true,
  selector: 'app-liga-admin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class LigaAdminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oLigaService = inject(LigaService);
  session = inject(SessionService);

  oLiga = signal<ILiga | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showEquipo = signal(false);
  showCategoria = signal(false);
  showTemporada = signal(false);
  showClub = signal(false);
  showEntrenador = signal(false);
  showTipousuario = signal(false);
  showRolusuario = signal(false);
  showEntrenadorClub = signal(false);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
    this.oLigaService.get(id).subscribe({
      next: (data: ILiga) => {
        this.oLiga.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la liga');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
