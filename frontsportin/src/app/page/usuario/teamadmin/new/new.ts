import { Component, signal } from '@angular/core';
import { UsuarioTeamadminForm } from '../../../../component/usuario/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-usuario-teamadmin-new-page',
  imports: [UsuarioTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-usuario-teamadmin-form [returnUrl]="returnUrl"></app-usuario-teamadmin-form>',
})
export class UsuarioTeamadminNewPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Usuarios', route: '/usuario/teamadmin' }, { label: 'Nuevo Usuario' }]);

  returnUrl = '/usuario/teamadmin';
}
