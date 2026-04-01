import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PuntuacionTeamadminDetail } from '../../../../component/puntuacion/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-puntuacion-teamadmin-view-page',
  imports: [PuntuacionTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-puntuacion-teamadmin-detail [id]="id_puntuacion"></app-puntuacion-teamadmin-detail>',
})
export class PuntuacionTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Puntuaciones', route: '/puntuacion/teamadmin' }, { label: 'Puntuación' }]);

  private route = inject(ActivatedRoute);
  id_puntuacion = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_puntuacion.set(id ? Number(id) : NaN);
  }
}
