import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioTeamadminForm } from '../../../../component/comentario/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-comentario-teamadmin-edit-page',
  imports: [ComentarioTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-comentario-teamadmin-form [id]="id_comentario()" [returnUrl]="returnUrl"></app-comentario-teamadmin-form>',
})
export class ComentarioTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Comentarios', route: '/comentario/teamadmin' }, { label: 'Editar Comentario' }]);

  private route = inject(ActivatedRoute);
  id_comentario = signal<number>(0);
  returnUrl = '/comentario/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_comentario.set(id ? Number(id) : NaN);
  }
}
