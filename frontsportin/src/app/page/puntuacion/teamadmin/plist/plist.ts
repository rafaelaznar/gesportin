import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PuntuacionTeamadminPlist } from '../../../../component/puntuacion/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { NoticiaService } from '../../../../service/noticia';
import { UsuarioService } from '../../../../service/usuarioService';
import { INoticia } from '../../../../model/noticia';

@Component({
  selector: 'app-puntuacion-teamadmin-plist-page',
  imports: [PuntuacionTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PuntuacionTeamadminPlistPage implements OnInit {
  id_noticia = signal<number | undefined>(undefined);
  id_usuario = signal<number | undefined>(undefined);
  noticia = signal<INoticia | null>(null);

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Noticias', route: '/noticia/teamadmin' },
    { label: 'Puntuaciones' },
  ]);

  constructor(
    private route: ActivatedRoute,
    private noticiaService: NoticiaService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    const noticiaParam = this.route.snapshot.paramMap.get('id_noticia');
    const usuarioParam = this.route.snapshot.paramMap.get('id_usuario');

    if (noticiaParam) {
      const id = Number(noticiaParam);
      this.id_noticia.set(id);
      this.noticiaService.getById(id).subscribe({
        next: (noticia) => {
          this.noticia.set(noticia);
          const items: BreadcrumbItem[] = [
            { label: 'Mis Clubes', route: '/club/teamadmin' },
          ];
          if (noticia.club) {
            items.push({ label: noticia.club.nombre, route: `/club/teamadmin/view/${noticia.club.id}` });
          }
          items.push({ label: 'Noticias', route: '/noticia/teamadmin' });
          items.push({ label: noticia.titulo, route: `/noticia/teamadmin/view/${noticia.id}` });
          items.push({ label: 'Puntuaciones' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    } else if (usuarioParam) {
      const id = Number(usuarioParam);
      this.id_usuario.set(id);
      this.usuarioService.get(id).subscribe({
        next: (usuario) => {
          const items: BreadcrumbItem[] = [
            { label: 'Mis Clubes', route: '/club/teamadmin' },
          ];
          if (usuario.club) {
            items.push({ label: usuario.club.nombre, route: `/club/teamadmin/view/${usuario.club.id}` });
          }
          items.push({ label: 'Usuarios', route: '/usuario/teamadmin' });
          items.push({ label: `${usuario.nombre} ${usuario.apellido1}`, route: `/usuario/teamadmin/view/${usuario.id}` });
          items.push({ label: 'Puntuaciones' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
