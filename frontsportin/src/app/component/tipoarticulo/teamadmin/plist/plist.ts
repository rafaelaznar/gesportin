import { Component } from '@angular/core';
import { TipoarticuloAdminPlist } from '../../../tipoarticulo/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-tipoarticulo-teamadmin-plist',
  imports: [TipoarticuloAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class TipoarticuloTeamadminPlist {}
