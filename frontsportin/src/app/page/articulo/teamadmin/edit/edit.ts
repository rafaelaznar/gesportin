import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloTeamadminForm } from '../../../../component/articulo/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-articulo-teamadmin-edit-page',
  imports: [ArticuloTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-articulo-teamadmin-form [id]="id_articulo()" [returnUrl]="returnUrl"></app-articulo-teamadmin-form>',
})
export class ArticuloTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Artículos', route: '/articulo/teamadmin' }, { label: 'Editar Artículo' }]);

  private route = inject(ActivatedRoute);
  id_articulo = signal<number>(0);
  returnUrl = '/articulo/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_articulo.set(id ? Number(id) : NaN);
  }
}
