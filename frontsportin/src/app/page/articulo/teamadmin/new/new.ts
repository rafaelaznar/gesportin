import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloTeamadminForm } from '../../../../component/articulo/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-articulo-teamadmin-new-page',
  imports: [ArticuloTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-articulo-teamadmin-form [returnUrl]="returnUrl" [idTipoarticulo]="idTipoarticulo()"></app-articulo-teamadmin-form>',
})
export class ArticuloTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Artículos', route: '/articulo/teamadmin' }, { label: 'Nuevo Artículo' }]);

  private route = inject(ActivatedRoute);
  returnUrl = '/articulo/teamadmin';
  idTipoarticulo = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_tipoarticulo');
    if (val) this.idTipoarticulo.set(Number(val));
  }
}
