import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoarticuloTeamadminForm } from '../../../../component/tipoarticulo/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-tipoarticulo-teamadmin-edit-page',
  imports: [TipoarticuloTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-tipoarticulo-teamadmin-form [id]="id_tipoarticulo()" [returnUrl]="returnUrl"></app-tipoarticulo-teamadmin-form>',
})
export class TipoarticuloTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' }, { label: 'Editar Tipo' }]);

  private route = inject(ActivatedRoute);
  id_tipoarticulo = signal<number>(0);
  returnUrl = '/tipoarticulo/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_tipoarticulo.set(id ? Number(id) : NaN);
  }
}
