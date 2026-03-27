import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LigaAdminPlist } from '../../../../component/liga/admin/plist/plist';

@Component({
  selector: 'app-liga-admin-plist-page',
  imports: [LigaAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class LigaAdminPlistPage {
  id_equipo = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id_equipo');
    if (id) {
      this.id_equipo.set(Number(id));
    }
  }
}
