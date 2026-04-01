import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoTeamadminForm } from '../../../../component/pago/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-pago-teamadmin-edit-page',
  imports: [PagoTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-pago-teamadmin-form [id]="id_pago()" [returnUrl]="returnUrl"></app-pago-teamadmin-form>',
})
export class PagoTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Pagos', route: '/pago/teamadmin' }, { label: 'Editar Pago' }]);

  private route = inject(ActivatedRoute);
  id_pago = signal<number>(0);
  returnUrl = '/pago/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_pago.set(id ? Number(id) : NaN);
  }
}
