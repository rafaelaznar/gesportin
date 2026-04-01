import { Component, signal } from '@angular/core';
import { TemporadaTeamadminForm } from '../../../../component/temporada/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-temporada-teamadmin-new-page',
  imports: [TemporadaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-temporada-teamadmin-form [returnUrl]="returnUrl"></app-temporada-teamadmin-form>',
})
export class TemporadaTeamadminNewPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Nueva Temporada' }]);

  returnUrl = '/temporada/teamadmin';
}
