import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LigaTeamadminDetail } from '../../../../component/liga/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-liga-teamadmin-view-page',
  imports: [LigaTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-liga-teamadmin-detail [id]="id_liga"></app-liga-teamadmin-detail>',
})
export class LigaTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Liga' }]);

  private route = inject(ActivatedRoute);
  id_liga = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_liga.set(id ? Number(id) : NaN);
  }
}
