import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraTeamadminDetail } from '../../../../component/compra/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-compra-teamadmin-view-page',
  imports: [CompraTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-compra-teamadmin-detail [id]="id_compra"></app-compra-teamadmin-detail>',
})
export class CompraTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Compras', route: '/compra/teamadmin' }, { label: 'Compra' }]);

  private route = inject(ActivatedRoute);
  id_compra = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_compra.set(id ? Number(id) : NaN);
  }
}
