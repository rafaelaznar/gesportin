import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidoTeamadminPlist } from '../../../../component/partido/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-partido-teamadmin-plist-page',
  imports: [PartidoTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PartidoTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Partidos' }]);

  id_liga = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_liga');
    if (idParam) {
      this.id_liga.set(Number(idParam));
    }
  }
}
