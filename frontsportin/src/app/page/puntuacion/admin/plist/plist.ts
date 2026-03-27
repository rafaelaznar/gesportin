import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PuntuacionAdminPlist } from '../../../../component/puntuacion/admin/plist/plist';

@Component({
  selector: 'app-puntuacion-admin-plist-page',
  imports: [PuntuacionAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PuntuacionAdminPlistPage {
  id_usuario = signal<number>(0);
  id_noticia = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idUsuario = this.route.snapshot.paramMap.get('id_usuario');
    const idNoticia = this.route.snapshot.paramMap.get('id_noticia');
    if (idUsuario) {
      this.id_usuario.set(Number(idUsuario));
    }
    if (idNoticia) {
      this.id_noticia.set(Number(idNoticia));
    }
  }
}
