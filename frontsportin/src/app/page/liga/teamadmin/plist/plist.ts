import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LigaTeamadminPlist } from '../../../../component/liga/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-liga-teamadmin-plist-page',
  imports: [LigaTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class LigaTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Ligas' }]);

  id_equipo = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_equipo');
    if (idParam) {
      this.id_equipo.set(Number(idParam));
    }
  }
}
