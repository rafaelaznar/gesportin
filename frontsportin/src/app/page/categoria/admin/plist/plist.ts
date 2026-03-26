import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaAdminPlist } from '../../../../component/categoria/admin/plist/plist';

@Component({
  selector: 'app-categoria-admin-plist-page',
  imports: [CategoriaAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CategoriaAdminPlistPage {
  id_temporada = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_temporada');
    if (idParam) {
      this.id_temporada.set(Number(idParam));
    }
  }
}
