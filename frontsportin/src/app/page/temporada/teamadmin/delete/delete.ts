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
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Eliminar Temporada' },
  ]);
  id_temporada = signal<number>(0);
  private returnUrlAfterDelete = '/temporada/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_temporada.set(n);
    if (!isNaN(n)) {
      this.temporadaService.get(n).subscribe({
        next: (temp) => {
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (temp.club) {
            items.push({ label: temp.club.nombre, route: `/club/teamadmin/view/${temp.club.id}` });
          }
          items.push({ label: 'Temporadas', route: temp.club ? `/temporada/teamadmin/club/${temp.club.id}` : '/temporada/teamadmin' });
          items.push({ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` });
          items.push({ label: 'Eliminar Temporada' });
          this.returnUrlAfterDelete = temp.club ? `/temporada/teamadmin/club/${temp.club.id}` : '/temporada/teamadmin';
          this.breadcrumbItems.set(items);
        },
        error: () => { this.error.set('Error cargando el registro'); },
      });
    } else {
      this.error.set('ID no válido');
    }
  }

  doDelete(): void {
    this.temporadaService.delete(this.id_temporada()).subscribe({
      next: () => {
        this.notificacion.info('Temporada eliminada correctamente');
        this.router.navigate([this.returnUrlAfterDelete]);
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
