import { Component } from '@angular/core';
import { LigaAdminPlist } from '../../../liga/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-liga-teamadmin-plist',
  imports: [LigaAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class LigaTeamadminPlist {}
