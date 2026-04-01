import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiaTeamadminDetail } from '../../../../component/noticia/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-noticia-teamadmin-view-page',
  imports: [NoticiaTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-noticia-teamadmin-detail [id]="id_noticia"></app-noticia-teamadmin-detail>',
})
export class NoticiaTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Noticias', route: '/noticia/teamadmin' }, { label: 'Noticia' }]);

  private route = inject(ActivatedRoute);
  id_noticia = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_noticia.set(id ? Number(id) : NaN);
  }
}
