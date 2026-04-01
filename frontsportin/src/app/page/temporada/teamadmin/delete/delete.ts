import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TemporadaService } from '../../../../service/temporada';
import { NotificacionService } from '../../../../service/notificacion';
import { TemporadaTeamadminDetail } from '../../../../component/temporada/teamadmin/detail/detail';
import { ConfirmacionBorradoComponent } from '../../../../component/shared/confirmacion-borrado/confirmacion-borrado.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-temporada-teamadmin-delete-page',
  imports: [TemporadaTeamadminDetail, ConfirmacionBorradoComponent, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class TemporadaTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private temporadaService = inject(TemporadaService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Eliminar Temporada' }]);
  id_temporada = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_temporada.set(id ? Number(id) : NaN);
    if (isNaN(this.id_temporada())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.temporadaService.delete(this.id_temporada()).subscribe({
      next: () => {
        this.notificacion.success('Temporada eliminada correctamente');
        this.router.navigate(['/temporada/teamadmin']);
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
