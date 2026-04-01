import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturaTeamadminForm } from '../../../../component/factura/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-factura-teamadmin-edit-page',
  imports: [FacturaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-factura-teamadmin-form [id]="id_factura()" [returnUrl]="returnUrl"></app-factura-teamadmin-form>',
})
export class FacturaTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Facturas', route: '/factura/teamadmin' }, { label: 'Editar Factura' }]);

  private route = inject(ActivatedRoute);
  id_factura = signal<number>(0);
  returnUrl = '/factura/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_factura.set(id ? Number(id) : NaN);
  }
}
