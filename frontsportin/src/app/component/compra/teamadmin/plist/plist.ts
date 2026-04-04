import { Component, Input } from '@angular/core';
import { CompraAdminPlist } from '../../../compra/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-compra-teamadmin-plist',
  imports: [CompraAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CompraTeamadminPlist {
  @Input() id_articulo?: number;
}
