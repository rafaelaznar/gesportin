import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoTeamadminForm } from '../../../../component/equipo/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-equipo-teamadmin-new-page',
  imports: [EquipoTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-equipo-teamadmin-form [returnUrl]="returnUrl" [idCategoria]="idCategoria()"></app-equipo-teamadmin-form>',
})
export class EquipoTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Nuevo Equipo' }]);

  private route = inject(ActivatedRoute);
  returnUrl = '/equipo/teamadmin';
  idCategoria = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_categoria');
    if (val) this.idCategoria.set(Number(val));
  }
}
