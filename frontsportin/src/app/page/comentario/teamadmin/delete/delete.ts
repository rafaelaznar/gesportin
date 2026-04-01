import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ComentarioService } from '../../../../service/comentario';
import { NotificacionService } from '../../../../service/notificacion';;
import { ComentarioTeamadminDetail } from '../../../../component/comentario/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-comentario-teamadmin-delete-page',
  imports: [ComentarioTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class ComentarioTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comentarioService = inject(ComentarioService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Comentarios', route: '/comentario/teamadmin' }, { label: 'Eliminar Comentario' }]);
  id_comentario = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_comentario.set(id ? Number(id) : NaN);
    if (isNaN(this.id_comentario())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.comentarioService.delete(this.id_comentario()).subscribe({
      next: () => {
        this.notificacion.info('Comentario eliminado');
        this.router.navigate(['/comentario/teamadmin']);
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
