import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloAdminPlist } from '../../../../component/articulo/admin/plist/plist';

@Component({
  selector: 'app-articulo-admin-plist-page',
  imports: [ArticuloAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ArticuloAdminPlistPage {
  id_tipoarticulo = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Soportar tanto :id_tipoarticulo como :tipoarticulo (genérico)
    let id = this.route.snapshot.paramMap.get('id_tipoarticulo');
    if (!id) {
      id = this.route.snapshot.paramMap.get('tipoarticulo');
    }
    if (id) {
      this.id_tipoarticulo.set(Number(id));
    }
  }
}
