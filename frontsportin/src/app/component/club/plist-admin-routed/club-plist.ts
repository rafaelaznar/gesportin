import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClubPlistAdminUnrouted } from '../plist-admin-unrouted/club-plist-admin-unrouted';

@Component({
  selector: 'app-club-plist',
  imports: [ClubPlistAdminUnrouted],
  templateUrl: './club-plist.html',
  styleUrl: './club-plist.css',
})
export class ClubPlistAdminRouted {
  // No se necesita filtro por club en el plist de clubes
  // ya que club no tiene relación con otro club
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // No hay parámetros de ruta para club
  }
}
