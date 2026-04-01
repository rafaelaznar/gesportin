import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NoticiaService } from '../../../../service/noticia';
import { NotificacionService } from '../../../../service/notificacion';;
import { NoticiaTeamadminDetail } from '../../../../component/noticia/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-noticia-teamadmin-delete-page',
  imports: [NoticiaTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class NoticiaTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private noticiaService = inject(NoticiaService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Noticias', route: '/noticia/teamadmin' }, { label: 'Eliminar Noticia' }]);
  id_noticia = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_noticia.set(id ? Number(id) : NaN);
    if (isNaN(this.id_noticia())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.noticiaService.delete(this.id_noticia()).subscribe({
      next: () => {
        this.notificacion.info('Noticia eliminado/a');
        this.router.navigate(['/noticia/teamadmin']);
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
