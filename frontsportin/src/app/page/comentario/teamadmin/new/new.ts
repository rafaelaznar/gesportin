import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioTeamadminForm } from '../../../../component/comentario/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-comentario-teamadmin-new-page',
  imports: [ComentarioTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-comentario-teamadmin-form [returnUrl]="returnUrl" [idNoticia]="idNoticia()"></app-comentario-teamadmin-form>',
})
export class ComentarioTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Comentarios', route: '/comentario/teamadmin' }, { label: 'Nuevo Comentario' }]);

  private route = inject(ActivatedRoute);
  returnUrl = '/comentario/teamadmin';
  idNoticia = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_noticia');
    if (val) this.idNoticia.set(Number(val));
  }
}
