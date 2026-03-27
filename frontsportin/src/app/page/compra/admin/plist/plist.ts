import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraAdminPlist } from '../../../../component/compra/admin/plist/plist';

@Component({
  selector: 'app-compra-admin-plist-page',
  imports: [CompraAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CompraAdminPlistPage {
  id_articulo = signal<number>(0);
  id_factura = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idArticulo = this.route.snapshot.paramMap.get('id_articulo');
    if (idArticulo) {
      this.id_articulo.set(Number(idArticulo));
    }
    const idFactura = this.route.snapshot.paramMap.get('id_factura');
    if (idFactura) {
      this.id_factura.set(Number(idFactura));
    }
  }
}
