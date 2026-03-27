import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidoAdminPlist } from '../../../../component/partido/admin/plist/plist';

@Component({
  selector: 'app-partido-admin-plist-page',
  imports: [PartidoAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PartidoAdminPlistPage {
  id_liga = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id_liga');
    if (id) {
      this.id_liga.set(Number(id));
    }
  }
}
