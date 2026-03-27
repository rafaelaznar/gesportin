import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoAdminPlist } from '../../../../component/carrito/admin/plist/plist';

@Component({
  selector: 'app-carrito-admin-plist-page',
  imports: [CarritoAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CarritoAdminPlistPage {
  id_usuario = signal<number>(0);
  id_articulo = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idUsuario = this.route.snapshot.paramMap.get('id_usuario');
    if (idUsuario) {
      this.id_usuario.set(Number(idUsuario));
    }
    const idArticulo = this.route.snapshot.paramMap.get('id_articulo');
    if (idArticulo) {
      this.id_articulo.set(Number(idArticulo));
    }
  }
}
