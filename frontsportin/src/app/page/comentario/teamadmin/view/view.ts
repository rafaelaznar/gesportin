import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioTeamadminDetail } from '../../../../component/comentario/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-comentario-teamadmin-view-page',
  imports: [ComentarioTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-comentario-teamadmin-detail [id]="id_comentario"></app-comentario-teamadmin-detail>',
})
export class ComentarioTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Comentarios', route: '/comentario/teamadmin' }, { label: 'Comentario' }]);

  private route = inject(ActivatedRoute);
  id_comentario = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_comentario.set(id ? Number(id) : NaN);
  }
}
