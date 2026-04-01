import { Component, inject, Input, OnInit, Signal, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ITemporada } from '../../../../model/temporada';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { TemporadaService } from '../../../../service/temporada';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-temporada-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class TemporadaTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oTemporadaService = inject(TemporadaService);
  session = inject(SessionService);

  oTemporada = signal<ITemporada | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number): void {
    this.oTemporadaService.get(id).subscribe({
      next: (data: ITemporada) => {
        this.oTemporada.set(data);
        this.loading.set(false);
        const club = data.club;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la temporada');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
