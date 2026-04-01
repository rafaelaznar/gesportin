import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CompraService } from '../../../../service/compra';
import { NotificacionService } from '../../../../service/notificacion';;
import { CompraTeamadminDetail } from '../../../../component/compra/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-compra-teamadmin-delete-page',
  imports: [CompraTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class CompraTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private compraService = inject(CompraService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Compras', route: '/compra/teamadmin' }, { label: 'Eliminar Compra' }]);
  id_compra = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_compra.set(id ? Number(id) : NaN);
    if (isNaN(this.id_compra())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.compraService.delete(this.id_compra()).subscribe({
      next: () => {
        this.notificacion.info('Compra eliminada');
        this.router.navigate(['/compra/teamadmin']);
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
