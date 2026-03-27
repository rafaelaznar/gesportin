import { Component } from '@angular/core';
import { CarritoAdminPlist } from '../../../carrito/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-carrito-teamadmin-plist',
  imports: [CarritoAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CarritoTeamadminPlist {}
