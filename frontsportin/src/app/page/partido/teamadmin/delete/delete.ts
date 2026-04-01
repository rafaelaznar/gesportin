import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PartidoService } from '../../../../service/partido';
import { NotificacionService } from '../../../../service/notificacion';;
import { PartidoTeamadminDetail } from '../../../../component/partido/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-partido-teamadmin-delete-page',
  imports: [PartidoTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class PartidoTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private partidoService = inject(PartidoService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Partidos', route: '/partido/teamadmin' }, { label: 'Eliminar Partido' }]);
  id_partido = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_partido.set(id ? Number(id) : NaN);
    if (isNaN(this.id_partido())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.partidoService.delete(this.id_partido()).subscribe({
      next: () => {
        this.notificacion.info('Partido eliminado/a');
        this.router.navigate(['/partido/teamadmin']);
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
