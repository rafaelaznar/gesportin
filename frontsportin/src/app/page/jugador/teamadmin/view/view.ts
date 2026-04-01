import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JugadorTeamadminDetail } from '../../../../component/jugador/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-jugador-teamadmin-view-page',
  imports: [JugadorTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-jugador-teamadmin-detail [id]="id_jugador"></app-jugador-teamadmin-detail>',
})
export class JugadorTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Jugadores', route: '/jugador/teamadmin' }, { label: 'Jugador' }]);

  private route = inject(ActivatedRoute);
  id_jugador = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_jugador.set(id ? Number(id) : NaN);
  }
}
