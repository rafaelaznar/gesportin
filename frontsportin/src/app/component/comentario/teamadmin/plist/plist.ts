import { Component } from '@angular/core';
import { ComentarioAdminPlist } from '../../../comentario/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-comentario-teamadmin-plist',
  imports: [ComentarioAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ComentarioTeamadminPlist {}
