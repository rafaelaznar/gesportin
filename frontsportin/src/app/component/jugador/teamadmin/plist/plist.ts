import { Component, Input } from '@angular/core';
import { JugadorAdminPlist } from '../../../jugador/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-jugador-teamadmin-plist',
  imports: [JugadorAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class JugadorTeamadminPlist {
  @Input() id_equipo?: number;
  @Input() id_usuario?: number;

}
