import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JugadorTeamadminForm } from '../../../../component/jugador/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-jugador-teamadmin-new-page',
  imports: [JugadorTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-jugador-teamadmin-form [returnUrl]="returnUrl" [idEquipo]="idEquipo()"></app-jugador-teamadmin-form>',
})
export class JugadorTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Jugadores', route: '/jugador/teamadmin' }, { label: 'Nuevo Jugador' }]);

  private route = inject(ActivatedRoute);
  returnUrl = '/jugador/teamadmin';
  idEquipo = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_equipo');
    if (val) this.idEquipo.set(Number(val));
  }
}
