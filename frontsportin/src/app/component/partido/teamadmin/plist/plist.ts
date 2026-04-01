import { Component, Input } from '@angular/core';
import { PartidoAdminPlist } from '../../../partido/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-partido-teamadmin-plist',
  imports: [PartidoAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PartidoTeamadminPlist {
  @Input() id_liga?: number;

}
