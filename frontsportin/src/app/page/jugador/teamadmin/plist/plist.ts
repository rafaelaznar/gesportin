import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JugadorTeamadminPlist } from '../../../../component/jugador/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { EquipoService } from '../../../../service/equipo';
import { UsuarioService } from '../../../../service/usuarioService';

@Component({
  selector: 'app-jugador-teamadmin-plist-page',
  imports: [JugadorTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class JugadorTeamadminPlistPage implements OnInit {
  id_equipo = signal<number | undefined>(undefined);
  id_usuario = signal<number | undefined>(undefined);

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Jugadores' },
  ]);

  constructor(
    private route: ActivatedRoute,
    private equipoService: EquipoService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    const idEquipoParam = this.route.snapshot.paramMap.get('id_equipo');
    const idUsuarioParam = this.route.snapshot.paramMap.get('id_usuario');

    if (idEquipoParam) {
      const id = Number(idEquipoParam);
      this.id_equipo.set(id);
      this.equipoService.get(id).subscribe({
        next: (equipo) => {
          const cat = equipo.categoria;
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
          items.push({ label: 'Equipos', route: cat ? `/equipo/teamadmin/categoria/${cat.id}` : '/equipo/teamadmin' });
          items.push({ label: equipo.nombre!, route: `/equipo/teamadmin/view/${equipo.id}` });
          items.push({ label: 'Jugadores' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    } else if (idUsuarioParam) {
      const id = Number(idUsuarioParam);
      this.id_usuario.set(id);
      this.usuarioService.get(id).subscribe({
        next: (usuario) => {
          const items: BreadcrumbItem[] = [
            { label: 'Mis Clubes', route: '/club/teamadmin' },
          ];
          if (usuario.club) {
            items.push({ label: usuario.club.nombre, route: `/club/teamadmin/view/${usuario.club.id}` });
          }
          items.push({ label: 'Usuarios', route: usuario.club ? `/usuario/teamadmin/club/${usuario.club.id}` : '/usuario/teamadmin' });
          items.push({ label: `${usuario.nombre} ${usuario.apellido1}`, route: `/usuario/teamadmin/view/${usuario.id}` });
          items.push({ label: 'Jugadores' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
