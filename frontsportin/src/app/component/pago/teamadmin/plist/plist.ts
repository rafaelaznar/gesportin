import { Component } from '@angular/core';
import { PagoAdminPlist } from '../../../pago/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-pago-teamadmin-plist',
  imports: [PagoAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PagoTeamadminPlist {}
