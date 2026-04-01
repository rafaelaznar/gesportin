import { Component, signal } from '@angular/core';
import { FacturaTeamadminForm } from '../../../../component/factura/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-factura-teamadmin-new-page',
  imports: [FacturaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-factura-teamadmin-form [returnUrl]="returnUrl"></app-factura-teamadmin-form>',
})
export class FacturaTeamadminNewPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Facturas', route: '/factura/teamadmin' }, { label: 'Nueva Factura' }]);

  returnUrl = '/factura/teamadmin';
}
