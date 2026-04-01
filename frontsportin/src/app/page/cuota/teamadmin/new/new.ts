import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuotaTeamadminForm } from '../../../../component/cuota/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-cuota-teamadmin-new-page',
  imports: [CuotaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-cuota-teamadmin-form [returnUrl]="returnUrl" [idEquipo]="idEquipo()"></app-cuota-teamadmin-form>',
})
export class CuotaTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Nueva Cuota' }]);

  private route = inject(ActivatedRoute);
  returnUrl = '/cuota/teamadmin';
  idEquipo = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_equipo');
    if (val) this.idEquipo.set(Number(val));
  }
}
