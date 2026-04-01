import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaTeamadminForm } from '../../../../component/categoria/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-categoria-teamadmin-new-page',
  imports: [CategoriaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-categoria-teamadmin-form [returnUrl]="returnUrl" [idTemporada]="idTemporada()"></app-categoria-teamadmin-form>',
})
export class CategoriaTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Nueva Categoría' }]);

  private route = inject(ActivatedRoute);
  returnUrl = '/categoria/teamadmin';
  idTemporada = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_temporada');
    if (val) this.idTemporada.set(Number(val));
  }
}
