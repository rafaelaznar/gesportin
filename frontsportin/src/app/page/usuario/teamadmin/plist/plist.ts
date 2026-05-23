import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioTeamadminPlist } from '../../../../component/usuario/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { ClubService } from '../../../../service/club';

@Component({
  selector: 'app-usuario-teamadmin-plist-page',
  imports: [UsuarioTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class UsuarioTeamadminPlistPage {

  id_club = signal<number>(0);

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: "" + this.id_club(), route: '/club/teamadmin/' + this.id_club() },
    { label: 'Usuarios' }]);

  constructor(private route: ActivatedRoute, private clubService: ClubService) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_club');
    if (idParam) {
      this.id_club.set(Number(idParam));
      this.clubService.get(this.id_club()).subscribe(club => {
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: club.nombre, route: '/club/teamadmin/' + this.id_club() },
          { label: 'Usuarios' }]);
      });
    }
  }
   
}
