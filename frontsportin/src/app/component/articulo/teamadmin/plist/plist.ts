import { Component } from '@angular/core';
import { ArticuloAdminPlist } from '../../../articulo/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-articulo-teamadmin-plist',
  imports: [ArticuloAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ArticuloTeamadminPlist {}
