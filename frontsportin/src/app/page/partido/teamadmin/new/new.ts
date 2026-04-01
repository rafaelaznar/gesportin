import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidoTeamadminForm } from '../../../../component/partido/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-partido-teamadmin-new-page',
  imports: [PartidoTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-partido-teamadmin-form [returnUrl]="returnUrl" [idLiga]="idLiga()"></app-partido-teamadmin-form>',
})
export class PartidoTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Partidos', route: '/partido/teamadmin' }, { label: 'Nuevo Partido' }]);

  private route = inject(ActivatedRoute);
  returnUrl = '/partido/teamadmin';
  idLiga = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_liga');
    if (val) this.idLiga.set(Number(val));
  }
}
