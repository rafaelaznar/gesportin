import { Component, signal } from '@angular/core';
import { CarritoTeamadminPlist } from '../../../../component/carrito/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-carrito-teamadmin-plist-page',
  imports: [CarritoTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CarritoTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Carritos' }]);
}
