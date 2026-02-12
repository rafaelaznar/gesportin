import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PartidoPlistAdminUnrouted } from "../plist-admin-unrouted/partido-plist-admin-unrouted";

@Component({
  selector: 'app-partido-plist-admin-routed',
  imports: [PartidoPlistAdminUnrouted],
  templateUrl: './partido-plist.html',
  styleUrl: './partido-plist.css',
})
export class PartidoPlistAdminRouted {
  id_liga = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id_liga');
    if (id) {
      this.id_liga.set(+id);
    }
  
  }
}