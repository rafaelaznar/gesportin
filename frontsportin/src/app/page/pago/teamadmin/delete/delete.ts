import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PagoService } from '../../../../service/pago';
import { NotificacionService } from '../../../../service/notificacion';;
import { PagoTeamadminDetail } from '../../../../component/pago/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-pago-teamadmin-delete-page',
  imports: [PagoTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class PagoTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pagoService = inject(PagoService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Pagos', route: '/pago/teamadmin' }, { label: 'Eliminar Pago' }]);
  id_pago = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_pago.set(id ? Number(id) : NaN);
    if (isNaN(this.id_pago())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.pagoService.delete(this.id_pago()).subscribe({
      next: () => {
        this.notificacion.info('Pago eliminado/a');
        this.router.navigate(['/pago/teamadmin']);
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
