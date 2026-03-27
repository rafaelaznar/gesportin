import { Component } from '@angular/core';
import { FacturaAdminPlist } from '../../../factura/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-factura-teamadmin-plist',
  imports: [FacturaAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class FacturaTeamadminPlist {}
