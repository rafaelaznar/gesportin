import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CuotaService } from '../../../../service/cuota';
import { NotificacionService } from '../../../../service/notificacion';;
import { CuotaTeamadminDetail } from '../../../../component/cuota/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-cuota-teamadmin-delete-page',
  imports: [CuotaTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class CuotaTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cuotaService = inject(CuotaService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Eliminar Cuota' }]);
  id_cuota = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_cuota.set(id ? Number(id) : NaN);
    if (isNaN(this.id_cuota())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.cuotaService.delete(this.id_cuota()).subscribe({
      next: () => {
        this.notificacion.info('Cuota eliminado/a');
        this.router.navigate(['/cuota/teamadmin']);
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
