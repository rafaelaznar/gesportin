import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoTeamadminPlist } from '../../../../component/pago/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { CuotaService } from '../../../../service/cuota';
import { JugadorService } from '../../../../service/jugador-service';

@Component({
  selector: 'app-pago-teamadmin-plist-page',
  imports: [PagoTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PagoTeamadminPlistPage implements OnInit {
  id_cuota = signal<number | undefined>(undefined);
  id_jugador = signal<number | undefined>(undefined);

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Cuotas', route: '/cuota/teamadmin' },
    { label: 'Pagos' },
  ]);

  constructor(
    private route: ActivatedRoute,
    private cuotaService: CuotaService,
    private jugadorService: JugadorService,
  ) {}

  ngOnInit(): void {
    const cuotaParam = this.route.snapshot.paramMap.get('id_cuota');
    const jugadorParam = this.route.snapshot.paramMap.get('id_jugador');

    if (cuotaParam) {
      const id = Number(cuotaParam);
      this.id_cuota.set(id);
      this.cuotaService.get(id).subscribe({
        next: (cuota) => {
          const equipo = cuota.equipo;
          const cat = equipo?.categoria;
          const temp = cat?.temporada;
          const items: BreadcrumbItem[] = [
            { label: 'Mis Clubes', route: '/club/teamadmin' },
          ];
          if (temp?.club) {
            items.push({ label: temp.club.nombre, route: `/club/teamadmin/view/${temp.club.id}` });
          }
          items.push({ label: 'Temporadas', route: '/temporada/teamadmin' });
          if (temp) {
            items.push({ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` });
          }
          if (cat) {
            items.push({
              label: 'Categorías',
              route: temp ? `/categoria/teamadmin/temporada/${temp.id}` : '/categoria/teamadmin',
            });
            items.push({ label: cat.nombre!, route: `/categoria/teamadmin/view/${cat.id}` });
          } else {
            items.push({ label: 'Categorías', route: '/categoria/teamadmin' });
          }
          if (equipo) {
            items.push({ label: 'Equipos', route: cat ? `/equipo/teamadmin/categoria/${cat.id}` : '/equipo/teamadmin' });
            items.push({ label: equipo.nombre!, route: `/equipo/teamadmin/view/${equipo.id}` });
          } else {
            items.push({ label: 'Equipos', route: '/equipo/teamadmin' });
          }
          items.push({ label: 'Cuotas', route: equipo ? `/cuota/teamadmin/equipo/${equipo.id}` : '/cuota/teamadmin' });
          items.push({ label: cuota.descripcion, route: `/cuota/teamadmin/view/${cuota.id}` });
          items.push({ label: 'Pagos' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    } else if (jugadorParam) {
      const id = Number(jugadorParam);
      this.id_jugador.set(id);
      this.jugadorService.getById(id).subscribe({
        next: (jugador) => {
          const usuario = jugador.usuario;
          const items: BreadcrumbItem[] = [
            { label: 'Mis Clubes', route: '/club/teamadmin' },
          ];
          if (usuario?.club) {
            items.push({ label: usuario.club.nombre, route: `/club/teamadmin/view/${usuario.club.id}` });
          }
          items.push({ label: 'Usuarios', route: '/usuario/teamadmin' });
          if (usuario) {
            items.push({ label: `${usuario.nombre} ${usuario.apellido1}`, route: `/usuario/teamadmin/view/${usuario.id}` });
          }
          items.push({ label: 'Jugadores', route: usuario ? `/jugador/teamadmin/usuario/${usuario.id}` : '/jugador/teamadmin' });
          items.push({ label: `${jugador.usuario.nombre} ${jugador.usuario.apellido1}`, route: `/jugador/teamadmin/view/${jugador.id}` });
          items.push({ label: 'Pagos' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
