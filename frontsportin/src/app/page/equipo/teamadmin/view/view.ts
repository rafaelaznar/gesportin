import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoTeamadminDetail } from '../../../../component/equipo/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-equipo-teamadmin-view-page',
  imports: [EquipoTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-equipo-teamadmin-detail [id]="id_equipo"></app-equipo-teamadmin-detail>',
})
export class EquipoTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Equipo' }]);

  private route = inject(ActivatedRoute);
  id_equipo = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_equipo.set(id ? Number(id) : NaN);
  }
}
