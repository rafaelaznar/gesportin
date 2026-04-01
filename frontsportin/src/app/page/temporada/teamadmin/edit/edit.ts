import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemporadaTeamadminForm } from '../../../../component/temporada/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-temporada-teamadmin-edit-page',
  imports: [TemporadaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-temporada-teamadmin-form [id]="id_temporada()" [returnUrl]="returnUrl"></app-temporada-teamadmin-form>',
})
export class TemporadaTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Editar Temporada' }]);

  private route = inject(ActivatedRoute);
  id_temporada = signal<number>(0);
  returnUrl = '/temporada/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_temporada.set(id ? Number(id) : NaN);
  }
}
