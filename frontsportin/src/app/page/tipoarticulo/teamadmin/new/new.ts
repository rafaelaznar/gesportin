import { Component, signal } from '@angular/core';
import { TipoarticuloTeamadminForm } from '../../../../component/tipoarticulo/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-tipoarticulo-teamadmin-new-page',
  imports: [TipoarticuloTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-tipoarticulo-teamadmin-form [returnUrl]="returnUrl"></app-tipoarticulo-teamadmin-form>',
})
export class TipoarticuloTeamadminNewPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' }, { label: 'Nuevo Tipo' }]);

  returnUrl = '/tipoarticulo/teamadmin';
}
