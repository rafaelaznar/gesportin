import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClubTeamadminDetail } from '../../../../component/club/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-club-teamadmin-view-page',
  imports: [ClubTeamadminDetail, BreadcrumbComponent],
  template: '<div class="container-fluid"><app-club-teamadmin-detail [id]="id_club"></app-club-teamadmin-detail></div>',
})
export class ClubTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Club' }]);

  private route = inject(ActivatedRoute);
  id_club = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_club.set(id ? Number(id) : NaN);
  }
}
