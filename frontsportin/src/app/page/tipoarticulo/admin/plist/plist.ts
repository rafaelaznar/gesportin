import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoarticuloAdminPlist } from '../../../../component/tipoarticulo/admin/plist/plist';

@Component({
  selector: 'app-tipoarticulo-admin-plist-page',
  imports: [TipoarticuloAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class TipoarticuloAdminPlistPage {
  id_club = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id_club');
    if (id) {
      this.id_club.set(Number(id));
    }
  }
}
