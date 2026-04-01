import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidoTeamadminDetail } from '../../../../component/partido/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-partido-teamadmin-view-page',
  imports: [PartidoTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-partido-teamadmin-detail [id]="id_partido"></app-partido-teamadmin-detail>',
})
export class PartidoTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Partidos', route: '/partido/teamadmin' }, { label: 'Partido' }]);

  private route = inject(ActivatedRoute);
  id_partido = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_partido.set(id ? Number(id) : NaN);
  }
}
