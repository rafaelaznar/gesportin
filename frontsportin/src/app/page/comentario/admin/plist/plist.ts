import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioAdminPlist } from '../../../../component/comentario/admin/plist/plist';

@Component({
  selector: 'app-comentario-admin-plist-page',
  imports: [ComentarioAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ComentarioAdminPlistPage {
  id_usuario = signal<number>(0);
  id_noticia = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idUsr = this.route.snapshot.paramMap.get('id_usuario');
    const idNot = this.route.snapshot.paramMap.get('id_noticia');

    if (idUsr) {
      this.id_usuario.set(Number(idUsr));
    }
    if (idNot) {
      this.id_noticia.set(Number(idNot));
    }
  }
}
