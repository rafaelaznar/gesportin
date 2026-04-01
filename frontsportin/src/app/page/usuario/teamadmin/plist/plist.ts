import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioTeamadminPlist } from '../../../../component/usuario/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-usuario-teamadmin-plist-page',
  imports: [UsuarioTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class UsuarioTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Usuarios' }]);

  id_club = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_club');
    if (idParam) {
      this.id_club.set(Number(idParam));
    }
  }
}
