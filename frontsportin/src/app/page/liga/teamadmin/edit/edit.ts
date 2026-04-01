import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LigaTeamadminForm } from '../../../../component/liga/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-liga-teamadmin-edit-page',
  imports: [LigaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-liga-teamadmin-form [id]="id_liga()" [returnUrl]="returnUrl"></app-liga-teamadmin-form>',
})
export class LigaTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Editar Liga' }]);

  private route = inject(ActivatedRoute);
  id_liga = signal<number>(0);
  returnUrl = '/liga/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_liga.set(id ? Number(id) : NaN);
  }
}
