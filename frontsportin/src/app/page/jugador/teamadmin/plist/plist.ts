import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JugadorTeamadminPlist } from '../../../../component/jugador/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-jugador-teamadmin-plist-page',
  imports: [JugadorTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class JugadorTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Jugadores' }]);

  id_equipo = signal<number | undefined>(undefined);
  id_usuario = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idEquipoParam = this.route.snapshot.paramMap.get('id_equipo');
    if (idEquipoParam) {
      this.id_equipo.set(Number(idEquipoParam));
    }
    const idUsuarioParam = this.route.snapshot.paramMap.get('id_usuario');
    if (idUsuarioParam) {
      this.id_usuario.set(Number(idUsuarioParam));
    }
  }
}
