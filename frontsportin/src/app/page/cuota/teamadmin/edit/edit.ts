import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuotaTeamadminForm } from '../../../../component/cuota/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-cuota-teamadmin-edit-page',
  imports: [CuotaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-cuota-teamadmin-form [id]="id_cuota()" [returnUrl]="returnUrl"></app-cuota-teamadmin-form>',
})
export class CuotaTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Editar Cuota' }]);

  private route = inject(ActivatedRoute);
  id_cuota = signal<number>(0);
  returnUrl = '/cuota/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_cuota.set(id ? Number(id) : NaN);
  }
}
