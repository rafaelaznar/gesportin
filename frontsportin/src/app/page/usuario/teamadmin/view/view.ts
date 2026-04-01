import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioTeamadminDetail } from '../../../../component/usuario/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-usuario-teamadmin-view-page',
  imports: [UsuarioTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-usuario-teamadmin-detail [id]="id_usuario"></app-usuario-teamadmin-detail>',
})
export class UsuarioTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Usuarios', route: '/usuario/teamadmin' }, { label: 'Usuario' }]);

  private route = inject(ActivatedRoute);
  id_usuario = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_usuario.set(id ? Number(id) : NaN);
  }
}
