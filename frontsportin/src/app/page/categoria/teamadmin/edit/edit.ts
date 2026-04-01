import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaTeamadminForm } from '../../../../component/categoria/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-categoria-teamadmin-edit-page',
  imports: [CategoriaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-categoria-teamadmin-form [id]="id_categoria()" [returnUrl]="returnUrl"></app-categoria-teamadmin-form>',
})
export class CategoriaTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Editar Categoría' }]);

  private route = inject(ActivatedRoute);
  id_categoria = signal<number>(0);
  returnUrl = '/categoria/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_categoria.set(id ? Number(id) : NaN);
  }
}
