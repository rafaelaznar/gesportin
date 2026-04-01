import { Component, Input } from '@angular/core';
import { CuotaAdminPlist } from '../../../cuota/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-cuota-teamadmin-plist',
  imports: [CuotaAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CuotaTeamadminPlist {
  @Input() id_equipo?: number;

}
