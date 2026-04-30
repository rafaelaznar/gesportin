import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { ComentarioartService } from '../../../../service/comentarioart';
import { IComentarioart } from '../../../../model/comentarioart';

@Component({
  standalone: true,
  selector: 'app-comentarioart-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ComentarioartTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private comentarioartService = inject(ComentarioartService);

  oComentarioart = signal<IComentarioart | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showArticulo = signal(false);
  showArticuloTipoarticulo = signal(false);
  showArticuloTipoarticuloClub = signal(false);
  showUsuario = signal(false);
  showUsuarioTipousuario = signal(false);
  showUsuarioRolusuario = signal(false);
  showUsuarioClub = signal(false);

  ngOnInit(): void {
    const idComentarioart = this.id();
    if (!idComentarioart || isNaN(idComentarioart)) {
      this.error.set('ID de comentario no válido');
      this.loading.set(false);
      return;
    }
    this.load(idComentarioart);
  }

  private load(id: number): void {
    this.comentarioartService.get(id).subscribe({
      next: (data) => {
        this.oComentarioart.set(data);
        this.loading.set(false);
        const art = data.articulo;
        const tipo = art?.tipoarticulo;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el comentario');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
