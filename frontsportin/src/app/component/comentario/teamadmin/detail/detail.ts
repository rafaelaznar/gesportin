import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { ComentarioService } from '../../../../service/comentario';
import { IComentario } from '../../../../model/comentario';

@Component({
  standalone: true,
  selector: 'app-comentario-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ComentarioTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oComentarioService = inject(ComentarioService);

  oComentario = signal<IComentario | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showNoticia = signal(false);
  showNoticiaClub = signal(false);
  showUsuario = signal(false);
  showUsuarioTipousuario = signal(false);
  showUsuarioRolusuario = signal(false);
  showUsuarioClub = signal(false);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
    this.oComentarioService.get(id).subscribe({
      next: (data: IComentario) => {
        this.oComentario.set(data);
        this.loading.set(false);
        const noticia = data.noticia;
        const titulo = noticia?.titulo ?? '';
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el comentario');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
