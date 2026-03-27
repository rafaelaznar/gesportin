import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioartAdminPlist } from '../../../../component/comentarioart/admin/plist/plist';

@Component({
  selector: 'app-comentarioart-admin-plist-page',
  imports: [ComentarioartAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ComentarioartAdminPlistPage {
  id_articulo = signal<number>(0);
  id_usuario = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idArticulo = this.route.snapshot.paramMap.get('id_articulo');
    if (idArticulo) {
      this.id_articulo.set(Number(idArticulo));
    }
    const idUsuario = this.route.snapshot.paramMap.get('id_usuario');
    if (idUsuario) {
      this.id_usuario.set(Number(idUsuario));
    }
  }
}
