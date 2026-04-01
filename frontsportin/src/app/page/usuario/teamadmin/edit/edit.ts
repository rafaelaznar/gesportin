import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioTeamadminForm } from '../../../../component/usuario/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-usuario-teamadmin-edit-page',
  imports: [UsuarioTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-usuario-teamadmin-form [id]="id_usuario()" [returnUrl]="returnUrl"></app-usuario-teamadmin-form>',
})
export class UsuarioTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Usuarios', route: '/usuario/teamadmin' }, { label: 'Editar Usuario' }]);

  private route = inject(ActivatedRoute);
  id_usuario = signal<number>(0);
  returnUrl = '/usuario/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_usuario.set(id ? Number(id) : NaN);
  }
}
