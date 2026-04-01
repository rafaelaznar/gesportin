import { Component, signal } from '@angular/core';
import { CompraTeamadminPlist } from '../../../../component/compra/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-compra-teamadmin-plist-page',
  imports: [CompraTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CompraTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Compras' }]);
}
