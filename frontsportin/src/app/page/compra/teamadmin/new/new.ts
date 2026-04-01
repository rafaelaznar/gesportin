import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraTeamadminForm } from '../../../../component/compra/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-compra-teamadmin-new-page',
  imports: [CompraTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-compra-teamadmin-form [returnUrl]="returnUrl" [idArticulo]="idArticulo()"></app-compra-teamadmin-form>',
})
export class CompraTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Compras', route: '/compra/teamadmin' }, { label: 'Nueva Compra' }]);

  private route = inject(ActivatedRoute);
  returnUrl = '/compra/teamadmin';
  idArticulo = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_articulo');
    if (val) this.idArticulo.set(Number(val));
  }
}
