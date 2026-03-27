import { Component } from '@angular/core';
import { PuntuacionAdminPlist } from '../../../puntuacion/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-puntuacion-teamadmin-plist',
  imports: [PuntuacionAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PuntuacionTeamadminPlist {}
