import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LigaTeamadminForm } from '../../../../component/liga/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-liga-teamadmin-new-page',
  imports: [LigaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-liga-teamadmin-form [returnUrl]="returnUrl" [idEquipo]="idEquipo()"></app-liga-teamadmin-form>',
})
export class LigaTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Nueva Liga' }]);

  private route = inject(ActivatedRoute);
  returnUrl = '/liga/teamadmin';
  idEquipo = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_equipo');
    if (val) this.idEquipo.set(Number(val));
  }
}
