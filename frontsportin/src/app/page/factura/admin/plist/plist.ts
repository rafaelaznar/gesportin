import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturaAdminPlist } from '../../../../component/factura/admin/plist/plist';

@Component({
  selector: 'app-factura-admin-plist-page',
  imports: [FacturaAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class FacturaAdminPlistPage {
  id_usuario = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Soportar tanto :id_usuario como :usuario (genérico)
    let id = this.route.snapshot.paramMap.get('id_usuario');
    if (!id) {
      id = this.route.snapshot.paramMap.get('usuario');
    }
    if (id) {
      this.id_usuario.set(Number(id));
    }
  }
}
