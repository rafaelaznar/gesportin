import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { UsuarioService } from '../../../../service/usuarioService';
import { IUsuario } from '../../../../model/usuario';

@Component({
  standalone: true,
  selector: 'app-usuario-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class UsuarioTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private usuarioService = inject(UsuarioService);

  oUsuario = signal<IUsuario | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idUsuario = this.id();
    if (!idUsuario || isNaN(idUsuario)) {
      this.error.set('ID de usuario no válido');
      this.loading.set(false);
      return;
    }
    this.load(idUsuario);
  }

  private load(id: number): void {
    this.usuarioService.get(id).subscribe({
      next: (data) => {
        this.oUsuario.set(data);
        this.loading.set(false);
        const club = data.club;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el usuario');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
