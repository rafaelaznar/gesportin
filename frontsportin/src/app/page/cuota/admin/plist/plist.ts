import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuotaAdminPlist } from '../../../../component/cuota/admin/plist/plist';

@Component({
  selector: 'app-cuota-admin-plist-page',
  imports: [CuotaAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CuotaAdminPlistPage {
  id_equipo = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id_equipo');
    if (id) {
      this.id_equipo.set(Number(id));
    }
  }
}
