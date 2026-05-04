import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { UsuarioService } from '../../../service/usuarioService';
import { SessionService } from '../../../service/session';
import { IUsuario } from '../../../model/usuario';

@Component({
  selector: 'app-usuario-perfil-page',
  standalone: true,
  imports: [CommonModule, DatetimePipe],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class UsuarioPerfilPage {
  private usuarioService = inject(UsuarioService);
  private session = inject(SessionService);

  oUsuario = signal<IUsuario | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const userId = this.session.getUserId();
    if (!userId) {
      this.error.set('No se pudo obtener el identificador de usuario');
      this.loading.set(false);
      return;
    }
    this.usuarioService.get(userId).subscribe({
      next: (data) => {
        this.oUsuario.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando los datos del perfil');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
