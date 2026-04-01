import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiaTeamadminForm } from '../../../../component/noticia/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-noticia-teamadmin-edit-page',
  imports: [NoticiaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-noticia-teamadmin-form [id]="id_noticia()" [returnUrl]="returnUrl"></app-noticia-teamadmin-form>',
})
export class NoticiaTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Noticias', route: '/noticia/teamadmin' }, { label: 'Editar Noticia' }]);

  private route = inject(ActivatedRoute);
  id_noticia = signal<number>(0);
  returnUrl = '/noticia/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_noticia.set(id ? Number(id) : NaN);
  }
}
