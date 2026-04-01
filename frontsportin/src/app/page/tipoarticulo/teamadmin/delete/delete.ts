import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoarticuloService } from '../../../../service/tipoarticulo';
import { NotificacionService } from '../../../../service/notificacion';;
import { TipoarticuloTeamadminDetail } from '../../../../component/tipoarticulo/teamadmin/detail/detail';
import { ConfirmacionBorradoComponent } from '../../../../component/shared/confirmacion-borrado/confirmacion-borrado.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-tipoarticulo-teamadmin-delete-page',
  imports: [TipoarticuloTeamadminDetail, ConfirmacionBorradoComponent, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class TipoarticuloTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tipoarticuloService = inject(TipoarticuloService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' }, { label: 'Eliminar Tipo de Artículo' }]);
  id_tipoarticulo = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_tipoarticulo.set(id ? Number(id) : NaN);
    if (isNaN(this.id_tipoarticulo())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.tipoarticuloService.delete(this.id_tipoarticulo()).subscribe({
      next: () => {
        this.notificacion.info('Tipoarticulo eliminado/a');
        this.router.navigate(['/tipoarticulo/teamadmin']);
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
