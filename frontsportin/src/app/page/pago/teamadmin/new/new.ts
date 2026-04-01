import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoTeamadminForm } from '../../../../component/pago/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-pago-teamadmin-new-page',
  imports: [PagoTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-pago-teamadmin-form [returnUrl]="returnUrl" [idCuota]="idCuota()"></app-pago-teamadmin-form>',
})
export class PagoTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Pagos', route: '/pago/teamadmin' }, { label: 'Nuevo Pago' }]);

  private route = inject(ActivatedRoute);
  returnUrl = '/pago/teamadmin';
  idCuota = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_cuota');
    if (val) this.idCuota.set(Number(val));
  }
}
