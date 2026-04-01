import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LigaService } from '../../../../service/liga';
import { NotificacionService } from '../../../../service/notificacion';;
import { LigaTeamadminDetail } from '../../../../component/liga/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-liga-teamadmin-delete-page',
  imports: [LigaTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class LigaTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ligaService = inject(LigaService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Eliminar Liga' }]);
  id_liga = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_liga.set(id ? Number(id) : NaN);
    if (isNaN(this.id_liga())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.ligaService.delete(this.id_liga()).subscribe({
      next: () => {
        this.notificacion.info('Liga eliminado/a');
        this.router.navigate(['/liga/teamadmin']);
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
