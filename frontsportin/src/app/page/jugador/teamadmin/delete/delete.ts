import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { JugadorService } from '../../../../service/jugador-service';
import { NotificacionService } from '../../../../service/notificacion';;
import { JugadorTeamadminDetail } from '../../../../component/jugador/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-jugador-teamadmin-delete-page',
  imports: [JugadorTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class JugadorTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jugadorService = inject(JugadorService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Jugadores', route: '/jugador/teamadmin' }, { label: 'Eliminar Jugador' }]);
  id_jugador = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_jugador.set(id ? Number(id) : NaN);
    if (isNaN(this.id_jugador())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.jugadorService.delete(this.id_jugador()).subscribe({
      next: () => {
        this.notificacion.info('Jugador eliminado/a');
        this.router.navigate(['/jugador/teamadmin']);
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
