import { Component, signal } from '@angular/core';
import { ComentarioartTeamadminPlist } from '../../../../component/comentarioart/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-comentarioart-teamadmin-plist-page',
  imports: [ComentarioartTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ComentarioartTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Comentarios de Artículos' }]);
}
