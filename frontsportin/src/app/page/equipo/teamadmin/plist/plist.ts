import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoTeamadminPlist } from '../../../../component/equipo/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-equipo-teamadmin-plist-page',
  imports: [EquipoTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class EquipoTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos' }]);

  id_categoria = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_categoria');
    if (idParam) {
      this.id_categoria.set(Number(idParam));
    }
  }
}
