import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoTeamadminForm } from '../../../../component/equipo/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-equipo-teamadmin-edit-page',
  imports: [EquipoTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-equipo-teamadmin-form [id]="id_equipo()" [returnUrl]="returnUrl"></app-equipo-teamadmin-form>',
})
export class EquipoTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Editar Equipo' }]);

  private route = inject(ActivatedRoute);
  id_equipo = signal<number>(0);
  returnUrl = '/equipo/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_equipo.set(id ? Number(id) : NaN);
  }
}
