import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../../service/usuarioService';
import { NotificacionService } from '../../../../service/notificacion';
import { UsuarioAdminDetail } from '../../../../component/usuario/admin/detail/detail';

@Component({
  selector: 'app-usuario-admin-delete-page',
  imports: [UsuarioAdminDetail],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class UsuarioAdminDeletePage {
  private route = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);
  private notificacion = inject(NotificacionService);

  id_usuario = signal<number>(0);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id) || id <= 0) {
      this.error.set('ID de usuario no válido');
      return;
    }
    this.id_usuario.set(id);
  }

  doDelete(): void {
    this.usuarioService.delete(this.id_usuario()).subscribe({
      next: () => {
        this.notificacion.info('Usuario eliminado');
        window.history.back();
      },
      error: (err) => {
        this.error.set('Error eliminando el usuario');
        this.notificacion.error('Error eliminando el usuario');
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
