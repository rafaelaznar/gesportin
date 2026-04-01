import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuotaTeamadminPlist } from '../../../../component/cuota/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-cuota-teamadmin-plist-page',
  imports: [CuotaTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CuotaTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Cuotas' }]);

  id_equipo = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_equipo');
    if (idParam) {
      this.id_equipo.set(Number(idParam));
    }
  }
}
