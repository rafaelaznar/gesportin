import { Component, inject, input, Input, OnInit, Signal, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { IClub } from '../../../../model/club';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { ClubService } from '../../../../service/club';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-club-teamadmin-detail',
  imports: [DatetimePipe, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ClubTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oClubService = inject(ClubService);
  session = inject(SessionService);
  //private notificacion = inject(NotificacionService);

  oClub = signal<IClub | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {  
    this.load(this.id());
  }

  load(id: number) {
    this.oClubService.get(id).subscribe({
      next: (data: IClub) => {
        this.oClub.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el club');
        this.loading.set(false);
        //this.notificacion.error('Error cargando el club');
        console.error(err);
      },
    });
  }
}
