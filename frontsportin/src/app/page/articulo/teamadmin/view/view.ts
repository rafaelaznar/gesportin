import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloTeamadminDetail } from '../../../../component/articulo/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-articulo-teamadmin-view-page',
  imports: [ArticuloTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-articulo-teamadmin-detail [id]="id_articulo"></app-articulo-teamadmin-detail>',
})
export class ArticuloTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Artículos', route: '/articulo/teamadmin' }, { label: 'Artículo' }]);

  private route = inject(ActivatedRoute);
  id_articulo = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_articulo.set(id ? Number(id) : NaN);
  }
}
