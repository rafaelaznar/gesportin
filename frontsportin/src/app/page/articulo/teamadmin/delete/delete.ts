import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ArticuloService } from '../../../../service/articulo';
import { NotificacionService } from '../../../../service/notificacion';;
import { ArticuloTeamadminDetail } from '../../../../component/articulo/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-articulo-teamadmin-delete-page',
  imports: [ArticuloTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class ArticuloTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articuloService = inject(ArticuloService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Artículos', route: '/articulo/teamadmin' }, { label: 'Eliminar Artículo' }]);
  id_articulo = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_articulo.set(id ? Number(id) : NaN);
    if (isNaN(this.id_articulo())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.articuloService.delete(this.id_articulo()).subscribe({
      next: () => {
        this.notificacion.info('Articulo eliminado/a');
        this.router.navigate(['/articulo/teamadmin']);
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
