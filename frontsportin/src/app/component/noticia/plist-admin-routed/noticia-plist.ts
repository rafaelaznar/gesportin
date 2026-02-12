import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiaPlistAdminUnrouted } from '../plist-admin-unrouted/noticia-plist-admin-unrouted';

@Component({
  selector: 'app-noticia-plist',
  standalone: true,
  imports: [NoticiaPlistAdminUnrouted],
  templateUrl: './noticia-plist.html',
  styleUrl: './noticia-plist.css',
})
export class NoticiaPlistAdminRouted {
  // Variables de filtro
  club = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Suscribirse a cambios en los parámetros de ruta
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id_club');
      if (id) {
        this.club.set(+id);
      } else {
        this.club.set(0);
      }
    });
  }
}