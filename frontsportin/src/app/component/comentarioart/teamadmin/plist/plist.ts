import { Component } from '@angular/core';
import { ComentarioartAdminPlist } from '../../../comentarioart/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-comentarioart-teamadmin-plist',
  imports: [ComentarioartAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ComentarioartTeamadminPlist {}
