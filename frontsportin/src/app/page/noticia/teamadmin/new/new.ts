import { Component, signal } from '@angular/core';
import { NoticiaTeamadminForm } from '../../../../component/noticia/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-noticia-teamadmin-new-page',
  imports: [NoticiaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-noticia-teamadmin-form [returnUrl]="returnUrl"></app-noticia-teamadmin-form>',
})
export class NoticiaTeamadminNewPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Noticias', route: '/noticia/teamadmin' }, { label: 'Nueva Noticia' }]);

  returnUrl = '/noticia/teamadmin';
}
