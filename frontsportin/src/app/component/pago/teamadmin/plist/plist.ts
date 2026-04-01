import { Component, Input } from '@angular/core';
import { PagoAdminPlist } from '../../../pago/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-pago-teamadmin-plist',
  imports: [PagoAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PagoTeamadminPlist {
  @Input() id_cuota?: number;
  @Input() id_jugador?: number;

}
