import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuarioService } from '../../../../service/usuarioService';
import { NotificacionService } from '../../../../service/notificacion';;
import { UsuarioTeamadminDetail } from '../../../../component/usuario/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-usuario-teamadmin-delete-page',
  imports: [UsuarioTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class UsuarioTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Usuarios', route: '/usuario/teamadmin' }, { label: 'Eliminar Usuario' }]);
  id_usuario = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_usuario.set(id ? Number(id) : NaN);
    if (isNaN(this.id_usuario())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.usuarioService.delete(this.id_usuario()).subscribe({
      next: () => {
        this.notificacion.info('Usuario eliminado/a');
        this.router.navigate(['/usuario/teamadmin']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando el registro');
        this.notificacion.error('Error eliminando el registro');
        console.error(err);
      },
    });
  }

  doCancel(): void { window.history.back(); }
}
