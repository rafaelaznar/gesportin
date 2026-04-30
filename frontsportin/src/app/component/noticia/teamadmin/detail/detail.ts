import { Component, inject, Input, OnInit, Signal, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { INoticia } from '../../../../model/noticia';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { NoticiaService } from '../../../../service/noticia';

@Component({
  selector: 'app-noticia-teamadmin-detail',
  imports: [DatetimePipe, RouterLink, CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class NoticiaTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oNoticiaService = inject(NoticiaService);

  oNoticia = signal<INoticia | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showClub = signal(false);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
    this.oNoticiaService.getById(id).subscribe({
      next: (data: INoticia) => {
        this.oNoticia.set(data);
        this.loading.set(false);
        const club = data.club;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la noticia');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
