import { Component, signal } from '@angular/core';
import { PuntuacionTeamadminPlist } from '../../../../component/puntuacion/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-puntuacion-teamadmin-plist-page',
  imports: [PuntuacionTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PuntuacionTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Puntuaciones' }]);
}
